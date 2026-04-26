
import { HEBREW_ALPHABET } from './transliteration';

export interface Point {
  x: number;
  y: number;
}

// Coordinates are based on a 1000x1000 grid
// Center is (500, 500)
export const PETAL_COORDINATES: Record<string, Point> = {
  // Inner Ring (3)
  [HEBREW_ALPHABET.ALEPH]: { x: 500, y: 340 },
  [HEBREW_ALPHABET.MEM]: { x: 380, y: 580 },
  [HEBREW_ALPHABET.SHIN]: { x: 620, y: 580 },

  // Middle Ring (7)
  [HEBREW_ALPHABET.BETH]: { x: 630, y: 310 },
  [HEBREW_ALPHABET.GIMEL]: { x: 700, y: 500 },
  [HEBREW_ALPHABET.DALETH]: { x: 630, y: 690 },
  [HEBREW_ALPHABET.KAPH]: { x: 500, y: 760 },
  [HEBREW_ALPHABET.PE]: { x: 370, y: 690 },
  [HEBREW_ALPHABET.RESH]: { x: 300, y: 500 },
  [HEBREW_ALPHABET.TAU]: { x: 370, y: 310 },

  // Outer Ring (12)
  [HEBREW_ALPHABET.HE]: { x: 500, y: 120 },
  [HEBREW_ALPHABET.VAU]: { x: 680, y: 160 },
  [HEBREW_ALPHABET.ZAIN]: { x: 820, y: 280 },
  [HEBREW_ALPHABET.CHETH]: { x: 880, y: 500 },
  [HEBREW_ALPHABET.TETH]: { x: 820, y: 720 },
  [HEBREW_ALPHABET.YOD]: { x: 680, y: 840 },
  [HEBREW_ALPHABET.LAMED]: { x: 500, y: 880 },
  [HEBREW_ALPHABET.NUN]: { x: 320, y: 840 },
  [HEBREW_ALPHABET.SAMEKH]: { x: 180, y: 720 },
  [HEBREW_ALPHABET.AYIN]: { x: 120, y: 500 },
  [HEBREW_ALPHABET.TZADDI]: { x: 180, y: 280 },
  [HEBREW_ALPHABET.QOPH]: { x: 320, y: 160 },
};
