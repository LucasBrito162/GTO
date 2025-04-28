import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000',
  'https://gtodelucasbrito.netlify.app', // URL antiga do Netlify (se ainda usada)
  'https://gtopoker.com.br' // URL de produção adicionada
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
app.post('/api/create-preference', async (req, res) => {
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
    
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://gtodelucasbrito.netlify.app'
      : 'http://localhost:5173';
    
    // Criando URLs absolutas para garantir que sejam válidas
    const successUrl = 'https://example.com/success';
    const failureUrl = 'https://example.com/failure';
    const pendingUrl = 'https://example.com/pending';
    
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
      // Removendo back_urls temporariamente para teste
      // back_urls: {
      //   success: successUrl,
      //   failure: failureUrl,
      //   pending: pendingUrl
      // },
      // Usando uma URL pública para notificações durante testes
      notification_url: 'https://webhook.site/3f7f1e1c-5f1a-4d1c-9f1a-5f1a4d1c9f1a',
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

app.post('/api/webhook', async (req, res) => {
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

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  const distPath = resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(resolve(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Servidor backend rodando em http://localhost:${port}`);
});