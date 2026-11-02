import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Stripe from 'stripe';
import { stimService } from './services/stimService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Token mesh endpoints
  app.post('/api/tokens', async (req, res) => {
    try {
      const token = await stimService.mintToken(req.body);
      res.status(201).json(token);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/tokens/:id', async (req, res) => {
    const token = await stimService.readToken(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found' });
    res.json(token);
  });

  app.patch('/api/tokens/:id', async (req, res) => {
    const token = await stimService.updateToken(req.params.id, req.body);
    if (!token) return res.status(404).json({ error: 'Token not found' });
    res.json(token);
  });

  app.post('/api/tokens/:id/transfer', async (req, res) => {
    const { from_agent, to_agent, metadata } = req.body;
    const result = await stimService.transferToken(req.params.id, from_agent, to_agent, metadata);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  });

  app.post('/api/tokens/:id/revalue', async (req, res) => {
    const value = await stimService.revalueToken(req.params.id);
    if (value === undefined) return res.status(404).json({ error: 'Token not found' });
    res.json({ id: req.params.id, value });
  });

  app.post('/api/tokens/:id/route', async (req, res) => {
    const decision = await stimService.routeToken(req.params.id);
    if (!decision) return res.status(404).json({ error: 'Token not found' });
    res.json({ id: req.params.id, ...decision });
  });

  app.get('/api/economy', (req, res) => {
    res.json(stimService.getEconomyState());
  });

  app.post('/api/tokens/distill', (req, res) => {
    stimService.distillTokens();
    res.json({ success: true });
  });

  app.get('/api/tokens-live', (req, res) => {
    res.json(stimService.getLiveTokens());
  });

  let stripeClient: Stripe | null = null;
  const getStripe = () => {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not defined');
      }
      stripeClient = new Stripe(key);
    }
    return stripeClient;
  };

  // API Routes
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { planId, planName, price, email } = req.body;
      const stripe = getStripe();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email || undefined,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: planName,
                description: `Sentinel Pro Subscription - ${planName} Plan`,
              },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?view=checkout&status=success&plan=${planId}`,
        cancel_url: `${req.headers.origin}/?view=pricing`,
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error('Stripe Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
