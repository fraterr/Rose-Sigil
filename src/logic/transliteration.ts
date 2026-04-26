
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

export function transliterate(input: string): SigilLetter[] {
  const result: SigilLetter[] = [];
  // 1. Cleaning and vowel removal
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let text = input.toLowerCase().replace(/[^a-z]/g, '');
  text = text.split('').filter(char => !vowels.includes(char)).join('');
  
  // 2. Keep only first occurrence (uniqueness)
  const seen = new Set<string>();
  const uniqueChars: string[] = [];
  for (const char of text) {
    if (!seen.has(char)) {
      seen.add(char);
      uniqueChars.push(char);
    }
  }

  // 3. Transliteration to Hebrew
  let i = 0;
  while (i < uniqueChars.length) {
    const char = uniqueChars[i];
    const hebrewChar = TRANSLITERATION_MAP[char] || '';
    
    if (hebrewChar) {
      // Uniqueness is guaranteed upstream, 
      // but we keep the SigilLetter structure for compatibility.
      result.push({ char: hebrewChar, isDouble: false });
    }
    i++;
  }
  
  return result;
}
