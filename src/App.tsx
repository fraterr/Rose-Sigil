import { useState, useMemo } from 'react';
import { SigilCanvas } from './components/SigilCanvas';
import { transliterate } from './logic/transliteration';
import { Sparkles, Download, Info, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [desire, setDesire] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [useAiqBeker, setUseAiqBeker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const letters = useMemo(() => transliterate(desire, useAiqBeker), [desire, useAiqBeker]);

  const handleGenerate = () => {
    if (!desire) return;
    setIsGenerating(true);
    setHasGenerated(false);
  };

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
              onChange={(e) => {
                setDesire(e.target.value);
                setHasGenerated(false);
              }}
              autoComplete="off"
              disabled={isGenerating}
            />
          </div>

          <div className="options-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={useAiqBeker} 
                onChange={(e) => setUseAiqBeker(e.target.checked)}
                disabled={isGenerating}
              />
              Usa Riduzione Aiq Beker (9 Camere)
            </label>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerate} 
            disabled={!desire || isGenerating}
          >
            {isGenerating ? 'Creazione in corso...' : 'Genera Sigillo'}
          </button>

          <div className="letters-preview">
            {letters.map((l, i) => (
              <span key={i} className="hebrew-letter" title={l.isDouble ? 'Lettera Doppia' : ''}>
                {l.char}
                {l.isDouble && <span className="double-indicator">∞</span>}
              </span>
            ))}
          </div>
        </section>

        <section className="canvas-section">
          <div className="canvas-frame">
            <SigilCanvas 
              letters={hasGenerated || isGenerating ? letters : []} 
              baseImageUrl="/Rose-Sigil/res/base.png"
              isGenerating={isGenerating}
              onGenerationComplete={() => {
                setIsGenerating(false);
                setHasGenerated(true);
              }}
            />
          </div>
          
          <div className="actions">
            <button className="primary-btn" onClick={downloadSigil} disabled={!hasGenerated}>
              <Download size={18} />
              Salva Sigillo
            </button>
            <button className="secondary-btn" disabled={!hasGenerated}>
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
                Ogni lettera del tuo desiderio viene mappata sui petali della Rosa Croce.
              </p>
              <ul>
                <li><strong>Inizio:</strong> Un cerchio indica la prima lettera.</li>
                <li><strong>Fine:</strong> Un tratto perpendicolare chiude il sigillo.</li>
                <li><strong>Lettere Doppie:</strong> Un occhiello segnala la ripetizione di una lettera.</li>
              </ul>
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
