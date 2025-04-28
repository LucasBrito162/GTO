import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configurar CORS
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000',
  'https://gtodelucasbrito.netlify.app',
  'https://gtopoker.com.br'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Rotas da API
app.post('/create-preference', async (req, res) => {
  try {
    const { duration, amount, description } = req.body;

    if (!duration || !amount || !description) {
      return res.status(400).json({
        error: 'Dados inválidos ou incompletos',
        received: { duration, amount, description }
      });
    }

    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN 
    });

    const preference = new Preference(client);
    
    // Usando URLs absolutas para garantir que sejam válidas
    const successUrl = 'https://gtopoker.com.br/app?status=approved&duration=' + duration;
    const failureUrl = 'https://gtopoker.com.br?status=failure';
    const pendingUrl = 'https://gtopoker.com.br?status=pending';
    
    const preferenceData = {
      items: [
        {
          id: `plan-${duration}`,
          title: description,
          description: `Acesso por ${duration} ${duration === 1 ? 'mês' : 'meses'} ao GTO Poker Study Tool`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(amount)
        }
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl
      },
      notification_url: 'https://gtopoker.com.br/.netlify/functions/api/webhook',
      statement_descriptor: "GTO POKER TOOL",
      external_reference: `plan_${duration}_months`
    };

    const result = await preference.create({ body: preferenceData });
    
    if (!result || !result.init_point) {
      throw new Error('Falha ao gerar link de pagamento');
    }

    res.json({
      id: result.id,
      init_point: result.init_point
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message
    });
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      console.log(`Pagamento recebido: ${paymentId}`);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro no processamento do webhook',
      details: error.message 
    });
  }
});

// Exportar o handler para Netlify Functions
export const handler = serverless(app);