import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { geminiService } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface PhysicsObject {
  id: string;
  text: string;
  type: 'user' | 'system' | 'ai';
  width?: number;
  height?: number;
}

const GravityTerminal: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [input, setInput] = useState('');
  const [objects, setObjects] = useState<PhysicsObject[]>([]);
  const objectsRef = useRef<PhysicsObject[]>([]); // Ref to access in render loop
  const domRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Initialize Physics Engine
  useEffect(() => {
    if (!sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer (invisible, we render via React/DOM)
    // We strictly use it for mouse interaction and debug if needed
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        background: 'transparent',
        wireframes: false,
        showAngleIndicator: false
      }
    });
    // We don't run render.run(render) to avoid canvas overlay, 
    // but we need it for mouse interaction context usually.
    // Actually, let's allow mouse interaction without visible canvas.

    // Walls
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;
    const wallOptions = { isStatic: true, render: { visible: false } };
    
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -500, width, 100, wallOptions); // High ceiling to drop items
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 3, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 3, wallOptions);

    Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Mouse control
    const mouse = Mouse.create(sceneRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with scrolling (though we have hidden overflow)
    // render.mouse = mouse; 

    // Runner
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    // Render Loop for DOM sync
    let animationFrameId: number;
    const update = () => {
      const bodies = Composite.allBodies(engine.world);
      
      bodies.forEach(body => {
        if (body.isStatic) return; // Don't move walls
        // Find DOM element by label (we use ID as label)
        const domEl = domRefs.current.get(body.label);
        if (domEl) {
           // Matter.js uses center of mass, we need to adjust for top-left HTML positioning
           // We assume the DOM element is centered via transform
           const x = body.position.x;
           const y = body.position.y;
           const angle = body.angle;
           domEl.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        }
      });
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current) return;
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;
      
      // Update walls
      Matter.Body.setPosition(ground, { x: w / 2, y: h + 50 });
      Matter.Body.setPosition(rightWall, { x: w + 50, y: h / 2 });
      // Matter.Body.setVertices(ground, ...) if width changes significantly, 
      // but standard walls usually suffice.
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      Engine.clear(engine);
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas) renderRef.current.canvas.remove();
      }
    };
  }, []);

  // Function to add a body to the world
  const spawnObject = useCallback((text: string, type: 'user' | 'system' | 'ai') => {
    if (!engineRef.current || !sceneRef.current) return;

    const id = uuidv4();
    const width = Math.min(text.length * 9 + 40, 400); // Approximate width based on mono font
    const height = Math.ceil(text.length * 9 / width) * 20 + 40; // Approx height
    
    // Create new object state
    const newObj: PhysicsObject = { id, text, type, width, height };
    
    setObjects(prev => {
        const next = [...prev, newObj];
        objectsRef.current = next;
        return next;
    });

    // We delay body creation slightly to let React render the DOM node so we *could* measure it,
    // but for stability we just use the approx values and force the DOM to match.
    // Spawning at random X at top
    const sceneWidth = sceneRef.current.clientWidth;
    const spawnX = Math.random() * (sceneWidth - 100) + 50;
    
    const body = Matter.Bodies.rectangle(spawnX, -100, width, 50, { // Fixed height 50 for single line, usually
        label: id,
        restitution: 0.5,
        friction: 0.1,
        chamfer: { radius: 5 },
        render: { visible: false } // We render via DOM
    });
    
    // Store size in body for reference if needed? No, just rely on sync.
    Matter.Composite.add(engineRef.current.world, body);

  }, []);

  const handleCommand = async () => {
    if (!input.trim()) return;
    const command = input;
    setInput('');

    spawnObject(`> ${command}`, 'user');

    if (command === 'clear') {
        setObjects([]);
        objectsRef.current = [];
        if (engineRef.current) {
             const bodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
             Matter.Composite.remove(engineRef.current.world, bodies);
        }
        return;
    }
    
    if (command === 'blast') {
        if (engineRef.current) {
             const bodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
             bodies.forEach(b => {
                 Matter.Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.5, y: -0.5 });
             });
        }
        spawnObject('BLAST EXECUTED', 'system');
        return;
    }

    if (command === 'gravity off') {
        if (engineRef.current) engineRef.current.gravity.y = 0;
        spawnObject('GRAVITY DISABLED', 'system');
        return;
    }
    
    if (command === 'gravity on') {
        if (engineRef.current) engineRef.current.gravity.y = 1;
        spawnObject('GRAVITY RESTORED', 'system');
        return;
    }

    // Default: Ask Gemini
    try {
        const stream = await geminiService.sendMessageStream(command);
        let fullText = "";
        for await (const chunk of stream) {
            fullText += chunk;
        }
        // Split response into chunks to make it rain
        const sentences = fullText.split(/[.!?\n]/).filter(s => s.trim().length > 0);
        
        let delay = 0;
        sentences.forEach((sentence) => {
             if (sentence.trim()) {
                 setTimeout(() => {
                     spawnObject(sentence.trim(), 'ai');
                 }, delay);
                 delay += 300; // Rain drop effect
             }
        });

    } catch (e) {
        spawnObject("Error: Link unstable.", 'system');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCommand();
  };

  return (
    <div className="flex flex-col h-full bg-htb-dark font-mono relative overflow-hidden">
      
      {/* Physics Canvas Area */}
      <div ref={sceneRef} className="flex-1 relative overflow-hidden cursor-crosshair">
         <div className="absolute top-4 left-0 right-0 text-center text-gray-700 pointer-events-none select-none z-0">
             <h1 className="text-6xl font-black opacity-10 uppercase tracking-tighter">GRAVITY</h1>
             <p className="opacity-20 text-sm">PHYSICS_TERMINAL_V1 // DRAG_OBJECTS_ENABLED</p>
         </div>

         {/* Render Objects */}
         {objects.map(obj => (
            <div
                key={obj.id}
                ref={el => {
                    if (el) domRefs.current.set(obj.id, el);
                    else domRefs.current.delete(obj.id);
                }}
                className={`absolute top-0 left-0 p-3 rounded shadow-lg border text-sm select-none break-words flex items-center justify-center text-center
                    ${obj.type === 'user' ? 'bg-blue-900/80 border-blue-500 text-blue-100' : 
                      obj.type === 'system' ? 'bg-red-900/80 border-red-500 text-red-100 font-bold' :
                      'bg-htb-panel border-gray-600 text-htb-accent'}
                `}
                style={{
                    width: obj.width ? `${obj.width}px` : 'auto',
                    maxWidth: '400px',
                    // Initial position offscreen until physics update takes over
                    transform: 'translate(-1000px, -1000px)' 
                }}
            >
                {obj.text}
            </div>
         ))}
      </div>

      {/* Input Console */}
      <div className="p-4 bg-gray-900 border-t border-gray-700 z-10">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <span className="text-htb-accent font-bold animate-pulse">&gt;</span>
              <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-600"
                 placeholder="Type 'blast', 'gravity off', or ask a question..."
                 autoFocus
              />
              <button onClick={handleCommand} className="text-xs bg-htb-accent text-black px-3 py-1 rounded font-bold hover:bg-emerald-400 transition-colors">
                  EXEC
              </button>
          </div>
      </div>
    </div>
  );
};

export default GravityTerminal;
