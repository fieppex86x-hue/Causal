// Questo è il file principale del server
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// 1. Crea l'app Express
const app = express();
const server = http.createServer(app);

// 2. Configura Socket.io per le connessioni in tempo reale
const io = socketIo(server, {
  cors: {
    origin: "*",  // Permetti connessioni da ovunque (per ora)
    methods: ["GET", "POST"]
  }
});

// 3. Middleware base
app.use(cors({
  origin: [
    'https://causalquantum.netlify.app',  // Il tuo frontend
    'http://localhost:3000'               // Per sviluppo
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));  // Permetti richieste da altri domini
app.use(express.json());  // Permetti JSON nelle richieste

// 4. Database finto (per iniziare)
let fakeDatabase = {
  users: [
    { id: 1, name: "Quantum Pioneer", email: "test@causal.com" }
  ],
  nodes: [],
  resonances: []
};

// 5. API Routes Base
app.get('/', (req, res) => {
  res.json({ 
    message: 'Benvenuto in Causal API!', 
    status: 'online',
    version: '1.0.0'
  });
});

// Ottieni tutti gli utenti
app.get('/api/users', (req, res) => {
  res.json(fakeDatabase.users);
});

// Crea un nuovo nodo causale
app.post('/api/nodes', (req, res) => {
  const { intention, userId } = req.body;
  
  if (!intention) {
    return res.status(400).json({ error: 'Intenzione richiesta' });
  }
  
  const newNode = {
    id: fakeDatabase.nodes.length + 1,
    intention: intention,
    userId: userId || 1,
    createdAt: new Date().toISOString(),
    realityWeight: 0.5,
    branches: generateBranches(intention)
  };
  
  fakeDatabase.nodes.push(newNode);
  
  // Notifica tutti i client in tempo reale
  io.emit('new_node', newNode);
  
  res.status(201).json(newNode);
});

// 6. Funzione per generare rami automaticamente
function generateBranches(intention) {
  const branchTemplates = [
    {
      id: 1,
      description: `Successo inaspettato riguardo: "${intention}"`,
      probability: 0.3,
      type: 'positive',
      color: '#4CAF50'
    },
    {
      id: 2,
      description: `Sfida che porta a crescita personale`,
      probability: 0.4,
      type: 'neutral',
      color: '#FFC107'
    },
    {
      id: 3,
      description: `Lezione importante da apprendere`,
      probability: 0.2,
      type: 'negative',
      color: '#F44336'
    },
    {
      id: 4,
      description: `Svolta imprevista che cambia tutto`,
      probability: 0.1,
      type: 'unexpected',
      color: '#9C27B0'
    }
  ];
  
  return branchTemplates;
}

// 7. Gestione connessioni Socket.io in tempo reale
io.on('connection', (socket) => {
  console.log('Nuovo utente connesso:', socket.id);
  
  socket.emit('welcome', { 
    message: 'Benvenuto nel campo quantistico di Causal!',
    userId: socket.id
  });
  
  // Quando qualcuno risuona con un ramo
  socket.on('resonate', (data) => {
    console.log('Risonanza ricevuta:', data);
    
    const resonanceEvent = {
      userId: data.userId,
      branchId: data.branchId,
      strength: data.strength || 0.1,
      timestamp: new Date().toISOString()
    };
    
    fakeDatabase.resonances.push(resonanceEvent);
    
    // Invia a TUTTI i client connessi
    io.emit('resonance_update', resonanceEvent);
  });
  
  socket.on('disconnect', () => {
    console.log('Utente disconnesso:', socket.id);
  });
});

// 8. Avvia il server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server Causal attivo su http://localhost:${PORT}`);
  console.log(`📡 Socket.io in ascolto per connessioni real-time`);
});