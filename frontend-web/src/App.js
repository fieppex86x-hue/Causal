import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [intention, setIntention] = useState('');
  const [nodes, setNodes] = useState([]);
  const [socket, setSocket] = useState(null);
  const [resonanceCount, setResonanceCount] = useState(0);

  // Connessione al server quando l'app si carica
  useEffect(() => {
  const BACKEND_URL = 'https://causal-backend-tj1c.onrender.com';
  const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    // Ascolta eventi dal server
    newSocket.on('welcome', (data) => {
      console.log('Messaggio dal server:', data);
    });

    newSocket.on('new_node', (node) => {
      setNodes(prev => [node, ...prev]);
    });

    newSocket.on('resonance_update', (data) => {
      setResonanceCount(prev => prev + 1);
      console.log('Nuova risonanza nel sistema!', data);
    });

    // Carica nodi esistenti
    fetch(`${BACKEND_URL}/api/nodes`)
      .then(res => res.json())
      .then(data => setNodes(data))
      .catch(err => console.log('Nessun nodo esistente, è normale'));

    return () => newSocket.close();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!intention.trim()) return;

  console.log('🔍 Tentativo di creare nodo:', intention);

  try {
    // URL FISSO - NIENTE localhost!
    const BACKEND_URL = 'https://causal-backend-tj1c.onrender.com';
    console.log('🔗 Connessione a:', BACKEND_URL);

    const response = await fetch(`${BACKEND_URL}/api/nodes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        intention: intention,
        userId: 'user_' + Date.now()
      })
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Errore API:', errorText);
      alert(`Errore ${response.status}: ${errorText}`);
      return;
    }

    const result = await response.json();
    console.log('✅ Successo!', result);

    // Crea nodo per la visualizzazione
    const newNode = {
      id: result.id || Date.now(),
      intention: result.intention || intention,
      userId: result.userId || 'user_1',
      createdAt: result.createdAt || new Date().toISOString(),
      realityWeight: result.realityWeight || 0.5,
      branches: result.branches || [
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
      ]
    };

    setNodes(prev => [newNode, ...prev]);
    setIntention('');
    
    alert(`⚛️ Nodo quantistico creato!`);

  } catch (error) {
    console.error('💥 Errore:', error);
    alert('Errore: ' + error.message);
  }
};

      const result = await response.json();
      setIntention('');
      alert('Nodo quantistico creato! Osserva i futuri possibili...');
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  const handleResonate = (branchId) => {
    if (socket) {
      socket.emit('resonate', {
        userId: 'user_' + Date.now(),
        branchId: branchId,
        strength: 0.15
      });
      alert(`⚛️ Hai risonato con questo futuro! +15% di energia quantistica`);
    }
  };

  // Funzione per disegnare i rami
  const renderBranch = (branch, index, total) => {
    const angle = (index / total) * Math.PI * 2;
    const length = branch.probability * 150;
    const x = 200 + Math.cos(angle) * length;
    const y = 200 + Math.sin(angle) * length;

    return (
      <g key={branch.id}>
        <line
          x1="200" y1="200"
          x2={x} y2={y}
          stroke={branch.color}
          strokeWidth="3"
        />
        <circle
          cx={x} cy={y} r="15"
          fill={branch.color}
          onClick={() => handleResonate(branch.id)}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={x} y={y - 25}
          textAnchor="middle"
          fill={branch.color}
          fontWeight="bold"
        >
          {(branch.probability * 100).toFixed(0)}%
        </text>
      </g>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌌 CAUSAL</h1>
        <p className="tagline">Mappa il tuo futuro quantistico</p>
      </header>

      <main>
        {/* Form per creare nuovo nodo */}
        <div className="create-section">
          <h2>📝 Crea un Nodo Causale</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Quale decisione vuoi mappare? Es: 'Cambio lavoro', 'Inizio a meditare', 'Investo in crypto'..."
              rows="3"
            />
            <button type="submit">Genera Futurogram ⚛️</button>
          </form>
        </div>

        {/* Contatori */}
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{nodes.length}</span>
            <span className="stat-label">Nodi Creati</span>
          </div>
          <div className="stat">
            <span className="stat-number">{resonanceCount}</span>
            <span className="stat-label">Risonanze Totali</span>
          </div>
        </div>

        {/* Visualizzazione Futurogram */}
        {nodes.length > 0 && (
          <div className="futurogram-section">
            <h2>🌀 Futurogram Attivi</h2>
            {nodes.map((node, idx) => (
              <div key={node.id || idx} className="node-card">
                <div className="node-header">
                  <h3>"{node.intention}"</h3>
                  <span className="reality-weight">
                    Peso Realtà: {(node.realityWeight * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="futurogram-container">
                  <svg width="400" height="400" viewBox="0 0 400 400">
                    {/* Cerchio centrale */}
                    <circle cx="200" cy="200" r="30" fill="#2196F3" />
                    
                    {/* Ramo centrale */}
                    <line x1="200" y1="170" x2="200" y2="100" stroke="#666" strokeWidth="2" />
                    <circle cx="200" cy="100" r="20" fill="#666" />
                    <text x="200" y="95" textAnchor="middle" fill="white">
                      DECISIONE
                    </text>
                    
                    {/* Rami */}
                    {node.branches && node.branches.map((branch, i) => 
                      renderBranch(branch, i, node.branches.length)
                    )}
                  </svg>
                </div>
                
                <div className="branches-list">
                  {node.branches && node.branches.map(branch => (
                    <div 
                      key={branch.id} 
                      className="branch-item"
                      style={{ borderLeftColor: branch.color }}
                      onClick={() => handleResonate(branch.id)}
                    >
                      <div className="branch-type">{branch.type.toUpperCase()}</div>
                      <div className="branch-desc">{branch.description}</div>
                      <div className="branch-prob">
                        {(branch.probability * 100).toFixed(1)}% probabilità
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Istruzioni */}
      <div className="instructions">
        <h3>📖 Come Funziona:</h3>
        <ol>
          <li>1. Scrivi una decisione che vuoi prendere</li>
          <li>2. L'AI genera 4 futuri possibili con probabilità</li>
          <li>3. Clicca su un ramo per "risonare" (+15% probabilità)</li>
          <li>4. Osserva come le risonanze degli altri influenzano i tuoi futuri</li>
        </ol>
        <p className="quantum-note">
          ⚛️ <strong>Effetto Quantistico:</strong> Più persone risonano con un futuro,
          più la sua probabilità aumenta nella realtà collettiva!
        </p>
      </div>
    </div>
  );
}

export default App;