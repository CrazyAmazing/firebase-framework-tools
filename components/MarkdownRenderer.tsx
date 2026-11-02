import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// Register languages
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('json', json);

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="relative group rounded-md overflow-hidden my-4 border border-gray-700">
              <div className="flex justify-between items-center px-4 py-1.5 bg-gray-800 border-b border-gray-700 text-xs text-gray-400 font-mono">
                <span>{match[1]}</span>
                <button
                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                    className="hover:text-htb-accent transition-colors"
                    title="Copy Code"
                >
                    Copy
                </button>
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 0, padding: '1rem', fontSize: '0.9em' }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={`${className} bg-gray-800 text-htb-accent px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
              {children}
            </code>
          );
        },
        // Styling other markdown elements
        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4 border-b border-gray-700 pb-2" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
        p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300" {...props} />,
        a: ({node, ...props}) => <a className="text-htb-accent hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-htb-accent pl-4 italic text-gray-400 my-4 bg-gray-800/50 py-2 rounded-r" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
