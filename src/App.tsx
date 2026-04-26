import { useState, useMemo } from 'react';
import { SigilCanvas } from './components/SigilCanvas';
import { transliterate } from './logic/transliteration';
import { Sparkles, Download, Info, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

type AnimationPhase = 'IDLE' | 'REMOVING_VOWELS' | 'REMOVING_DUPLICATES' | 'GENERATING' | 'COMPLETE';

function App() {
  const [desire, setDesire] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [useAiqBeker, setUseAiqBeker] = useState(false);
  
  const [phase, setPhase] = useState<AnimationPhase>('IDLE');
  const [animatedText, setAnimatedText] = useState<{char: string, id: number, status: 'active' | 'removing'}[]>([]);

  const handleGenerate = async () => {
    if (!desire) return;
    
    // Preparazione testo iniziale
    const initialText = desire.toLowerCase().replace(/[^a-z]/g, '').split('').map((c, i) => ({
      char: c,
      id: i,
      status: 'active' as const
    }));
    
    setAnimatedText(initialText);
    setPhase('REMOVING_VOWELS');
    
    // 1. Animazione rimozione vocali
    await new Promise(r => setTimeout(r, 1000));
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    setAnimatedText(prev => prev.map(item => 
      vowels.includes(item.char) ? { ...item, status: 'removing' } : item
    ));
    
    await new Promise(r => setTimeout(r, 800));
    const noVowels = initialText.filter(item => !vowels.includes(item.char))
      .map((item, i) => ({ ...item, id: i, status: 'active' as const }));
    setAnimatedText(noVowels);
    
    // 2. Animazione rimozione doppie
    setPhase('REMOVING_DUPLICATES');
    await new Promise(r => setTimeout(r, 1000));
    const seen = new Set<string>();
    setAnimatedText(prev => prev.map(item => {
      if (seen.has(item.char)) return { ...item, status: 'removing' };
      seen.add(item.char);
      return item;
    }));
    
    await new Promise(r => setTimeout(r, 800));
    seen.clear();
    const unique = noVowels.filter(item => {
      if (seen.has(item.char)) return false;
      seen.add(item.char);
      return true;
    }).map((item, i) => ({ ...item, id: i, status: 'active' as const }));
    setAnimatedText(unique);
    
    // 3. Fase Sigillo
    setPhase('GENERATING');
  };

  const finalLetters = useMemo(() => transliterate(
    animatedText.filter(t => t.status === 'active').map(t => t.char).join(''), 
    useAiqBeker
  ), [animatedText, phase, useAiqBeker]);

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
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Rose Sigil Logo" className="logo-img" />
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
                setPhase('IDLE');
              }}
              autoComplete="off"
              disabled={phase !== 'IDLE' && phase !== 'COMPLETE'}
            />
          </div>

          <div className="options-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={useAiqBeker} 
                onChange={(e) => setUseAiqBeker(e.target.checked)}
                disabled={phase !== 'IDLE'}
              />
              Usa Riduzione Aiq Beker (9 Camere)
            </label>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerate} 
            disabled={!desire || (phase !== 'IDLE' && phase !== 'COMPLETE')}
          >
            {phase === 'IDLE' || phase === 'COMPLETE' ? 'Genera Sigillo' : 'Elaborazione...'}
          </button>

          <div className="visual-reduction">
            <AnimatePresence mode="popLayout">
              {animatedText.map((item) => (
                <motion.span
                  key={`${item.char}-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: item.status === 'removing' ? 0 : 1,
                    scale: item.status === 'removing' ? 1.5 : 1,
                    color: item.status === 'removing' ? '#ff4d4d' : '#d4af37'
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                  className="anim-char"
                >
                  {item.char}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {phase === 'COMPLETE' && (
            <div className="letters-preview">
              {finalLetters.map((l, i) => (
                <span key={i} className="hebrew-letter">
                  {l.char}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="canvas-section">
          <div className="canvas-frame">
            <SigilCanvas 
              letters={phase === 'GENERATING' || phase === 'COMPLETE' ? finalLetters : []} 
              baseImageUrl="/Rose-Sigil/res/base.png"
              isGenerating={phase === 'GENERATING'}
              onGenerationComplete={() => setPhase('COMPLETE')}
            />
          </div>
          
          <div className="actions">
            <button className="primary-btn" onClick={downloadSigil} disabled={phase !== 'COMPLETE'}>
              <Download size={18} />
              Salva Sigillo
            </button>
            <button className="secondary-btn" disabled={phase !== 'COMPLETE'}>
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
