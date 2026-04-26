
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
const DIGRAPHS: Record<string, string> = {
  'ch': HEBREW_ALPHABET.CHETH,
  'sh': HEBREW_ALPHABET.SHIN,
  'th': HEBREW_ALPHABET.TAU,
  'ph': HEBREW_ALPHABET.PE,
  'tz': HEBREW_ALPHABET.TZADDI,
};

export function transliterate(input: string): string[] {
  const result: string[] = [];
  const text = input.toLowerCase().replace(/[^a-z]/g, '');
  
  let i = 0;
  while (i < text.length) {
    // Check for digraphs first
    const twoChars = text.substring(i, i + 2);
    if (DIGRAPHS[twoChars]) {
      result.push(DIGRAPHS[twoChars]);
      i += 2;
      continue;
    }
    
    // Check single chars
    const char = text[i];
    if (TRANSLITERATION_MAP[char]) {
      result.push(TRANSLITERATION_MAP[char]);
    }
    i++;
  }
  
  // Sigil rule: often duplicates are removed to avoid loops on the same spot, 
  // but in the Rose Cross method, if a letter repeats, we usually just go back to it.
  // However, it's common to remove consecutive duplicates.
  return result.filter((val, index, self) => index === 0 || val !== self[index - 1]);
}
