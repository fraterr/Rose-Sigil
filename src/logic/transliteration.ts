
export const HEBREW_ALPHABET = {
  ALEPH: 'א',
  BETH: 'ב',
  GIMEL: 'ג',
  DALETH: 'ד',
  HE: 'ה',
  VAU: 'ו',
  ZAIN: 'ז',
  CHETH: 'ח',
  TETH: 'ט',
  YOD: 'י',
  KAPH: 'כ',
  LAMED: 'ל',
  MEM: 'מ',
  NUN: 'נ',
  SAMEKH: 'ס',
  AYIN: 'ע',
  PE: 'פ',
  TZADDI: 'צ',
  QOPH: 'ק',
  RESH: 'ר',
  SHIN: 'ש',
  TAU: 'ת',
};

// Mapping from Latin characters/phonemes to Hebrew letters
// Based on standard occult/Golden Dawn transliteration
export const TRANSLITERATION_MAP: Record<string, string> = {
  'a': HEBREW_ALPHABET.ALEPH,
  'b': HEBREW_ALPHABET.BETH,
  'c': HEBREW_ALPHABET.KAPH, // or Gimel depending on sound, but Kaph is common for 'c'
  'd': HEBREW_ALPHABET.DALETH,
  'e': HEBREW_ALPHABET.HE,
  'f': HEBREW_ALPHABET.PE,
  'g': HEBREW_ALPHABET.GIMEL,
  'h': HEBREW_ALPHABET.HE,
  'i': HEBREW_ALPHABET.YOD,
  'j': HEBREW_ALPHABET.YOD,
  'k': HEBREW_ALPHABET.KAPH,
  'l': HEBREW_ALPHABET.LAMED,
  'm': HEBREW_ALPHABET.MEM,
  'n': HEBREW_ALPHABET.NUN,
  'o': HEBREW_ALPHABET.VAU,
  'p': HEBREW_ALPHABET.PE,
  'q': HEBREW_ALPHABET.QOPH,
  'r': HEBREW_ALPHABET.RESH,
  's': HEBREW_ALPHABET.SHIN, // Usually Shin for 's' sounds in sigils, or Samekh. Let's use Shin.
  't': HEBREW_ALPHABET.TAU,
  'u': HEBREW_ALPHABET.VAU,
  'v': HEBREW_ALPHABET.VAU,
  'w': HEBREW_ALPHABET.VAU,
  'x': HEBREW_ALPHABET.SAMEKH, // x is often KS -> Kaph Samekh, but simplified to Samekh
  'y': HEBREW_ALPHABET.YOD,
  'z': HEBREW_ALPHABET.ZAIN,
};

// Special cases for digraphs
// (Removed as per new reduction logic that processes single letters)


export interface SigilLetter {
  char: string;
  isDouble: boolean;
}

// Aiq Beker (The Kabbalah of Nine Chambers) reduction table
const AIQ_BEKER_REDUCTION: Record<string, string> = {
  // 1, 10, 100 -> Aleph
  [HEBREW_ALPHABET.YOD]: HEBREW_ALPHABET.ALEPH,
  [HEBREW_ALPHABET.QOPH]: HEBREW_ALPHABET.ALEPH,
  // 2, 20, 200 -> Beth
  [HEBREW_ALPHABET.KAPH]: HEBREW_ALPHABET.BETH,
  [HEBREW_ALPHABET.RESH]: HEBREW_ALPHABET.BETH,
  // 3, 30, 300 -> Gimel
  [HEBREW_ALPHABET.LAMED]: HEBREW_ALPHABET.GIMEL,
  [HEBREW_ALPHABET.SHIN]: HEBREW_ALPHABET.GIMEL,
  // 4, 40, 400 -> Daleth
  [HEBREW_ALPHABET.MEM]: HEBREW_ALPHABET.DALETH,
  [HEBREW_ALPHABET.TAU]: HEBREW_ALPHABET.DALETH,
  // 5, 50 -> He
  [HEBREW_ALPHABET.NUN]: HEBREW_ALPHABET.HE,
  // 6, 60 -> Vau
  [HEBREW_ALPHABET.SAMEKH]: HEBREW_ALPHABET.VAU,
  // 7, 70 -> Zain
  [HEBREW_ALPHABET.AYIN]: HEBREW_ALPHABET.ZAIN,
  // 8, 80 -> Cheth
  [HEBREW_ALPHABET.PE]: HEBREW_ALPHABET.CHETH,
  // 9, 90 -> Teth
  [HEBREW_ALPHABET.TZADDI]: HEBREW_ALPHABET.TETH,
};

export function transliterate(input: string, useAiqBeker: boolean = false): SigilLetter[] {
  const result: SigilLetter[] = [];
  // 1. Pulizia e rimozione vocali
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let text = input.toLowerCase().replace(/[^a-z]/g, '');
  text = text.split('').filter(char => !vowels.includes(char)).join('');
  
  // 2. Mantenere solo la prima ricorrenza (unicità)
  const seen = new Set<string>();
  const uniqueChars: string[] = [];
  for (const char of text) {
    if (!seen.has(char)) {
      seen.add(char);
      uniqueChars.push(char);
    }
  }

  // 3. Traslitterazione in Ebraico
  let i = 0;
  while (i < uniqueChars.length) {
    const char = uniqueChars[i];
    let hebrewChar = TRANSLITERATION_MAP[char] || '';
    
    if (hebrewChar) {
      if (useAiqBeker && AIQ_BEKER_REDUCTION[hebrewChar]) {
        hebrewChar = AIQ_BEKER_REDUCTION[hebrewChar];
      }
      
      // In questa logica l'unicità è garantita a monte, 
      // ma manteniamo la struttura SigilLetter per compatibilità.
      result.push({ char: hebrewChar, isDouble: false });
    }
    i++;
  }
  
  return result;
}
