import { useState, useMemo } from 'react';
import { SigilCanvas } from './components/SigilCanvas';
import { transliterate } from './logic/transliteration';
import { Sparkles, Download, Info, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [desire, setDesire] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const letters = useMemo(() => transliterate(desire), [desire]);

  const downloadSigil = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `sigil-${desire.replace(/\s+/g, '-') || 'creation'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="logo">
          <Sparkles size={24} className="logo-icon" />
          <h1>Rose Sigil</h1>
        </div>
        <button className="icon-btn" onClick={() => setShowInfo(!showInfo)}>
          <Info size={20} />
        </button>
      </header>

      <main className="content">
        <section className="input-section">
          <div className="input-group">
            <label htmlFor="desire">Il tuo desiderio</label>
            <input
              id="desire"
              type="text"
              placeholder="Scrivi qui..."
              value={desire}
              onChange={(e) => setDesire(e.target.value)}
              autoComplete="off"
            />
            <div className="letters-preview">
              {letters.map((l, i) => (
                <span key={i} className="hebrew-letter">{l}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="canvas-section">
          <div className="canvas-frame">
            <SigilCanvas 
              letters={letters} 
              baseImageUrl="/Rose-Sigil/res/base.png" // Path for GitHub Pages
            />
          </div>
          
          <div className="actions">
            <button className="primary-btn" onClick={downloadSigil} disabled={!desire}>
              <Download size={18} />
              Salva Sigillo
            </button>
            <button className="secondary-btn">
              <Share2 size={18} />
              Condividi
            </button>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="info-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="info-card">
              <h2>Tecnica della Rose Cross</h2>
              <p>
                Questa applicazione utilizza il metodo della Golden Dawn per la creazione di sigilli. 
                Ogni lettera del tuo desiderio viene mappata sui petali della Rosa Croce e collegata 
                per formare un simbolo unico e personale.
              </p>
              <button className="close-btn" onClick={() => setShowInfo(false)}>Chiudi</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="main-footer">
        <p>&copy; 2026 Rose Sigil • Creato con intenzione</p>
      </footer>
    </div>
  );
}

export default App;
