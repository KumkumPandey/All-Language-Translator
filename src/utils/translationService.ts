// Enhanced translation service with multiple APIs and fallbacks

interface TranslationResult {
  translatedText: string;
  confidence: number;
  service: string;
}

// Common phrases dictionary for better accuracy
const commonPhrases: Record<string, Record<string, string>> = {
  'en-hi': {
    'hello': 'नमस्ते',
    'hi': 'हाय',
    'hii': 'हाय',
    'how are you': 'आप कैसे हैं',
    'how are you?': 'आप कैसे हैं?',
    'good morning': 'सुप्रभात',
    'good night': 'शुभ रात्रि',
    'thank you': 'धन्यवाद',
    'please': 'कृपया',
    'yes': 'हाँ',
    'no': 'नहीं',
    'sorry': 'माफ करें',
    'excuse me': 'माफ करें',
    'i love you': 'मैं आपसे प्यार करता हूँ',
    'what is your name': 'आपका नाम क्या है',
    'my name is': 'मेरा नाम है',
    'where are you from': 'आप कहाँ से हैं',
    'nice to meet you': 'आपसे मिलकर खुशी हुई'
  },
  'hi-en': {
    'नमस्ते': 'hello',
    'हाय': 'hi',
    'आप कैसे हैं': 'how are you',
    'आप कैसे हैं?': 'how are you?',
    'सुप्रभात': 'good morning',
    'शुभ रात्रि': 'good night',
    'धन्यवाद': 'thank you',
    'कृपया': 'please',
    'हाँ': 'yes',
    'नहीं': 'no',
    'माफ करें': 'sorry',
    'मैं आपसे प्यार करता हूँ': 'i love you',
    'आपका नाम क्या है': 'what is your name',
    'मेरा नाम है': 'my name is',
    'आप कहाँ से हैं': 'where are you from',
    'आपसे मिलकर खुशी हुई': 'nice to meet you'
  }
};

// Check if text is a common phrase
const getCommonPhraseTranslation = (text: string, fromLang: string, toLang: string): string | null => {
  const normalizedText = text.toLowerCase().trim();
  const languagePair = `${fromLang}-${toLang}`;
  
  if (commonPhrases[languagePair] && commonPhrases[languagePair][normalizedText]) {
    return commonPhrases[languagePair][normalizedText];
  }
  
  return null;
};

// LibreTranslate API (Free and more accurate)
const translateWithLibreTranslate = async (text: string, fromLang: string, toLang: string): Promise<TranslationResult | null> => {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: fromLang === 'auto' ? 'auto' : fromLang,
        target: toLang,
        format: 'text'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        translatedText: data.translatedText,
        confidence: 0.9,
        service: 'LibreTranslate'
      };
    }
  } catch (error) {
    console.log('LibreTranslate failed:', error);
  }
  return null;
};

// Improved MyMemory API with better filtering
const translateWithMyMemory = async (text: string, fromLang: string, toLang: string): Promise<TranslationResult | null> => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}&de=developer@example.com`
    );
    
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      const translation = data.responseData.translatedText;
      const match = data.responseData.match || 0;
      
      // Filter out bad translations
      const originalLower = text.toLowerCase();
      const translatedLower = translation.toLowerCase();
      
      // Skip if translation contains religious content for simple phrases
      if (originalLower.includes('how are you') && 
          (translatedLower.includes('allah') || translatedLower.includes('अल्लाह'))) {
        return null;
      }
      
      // Skip if translation is identical to original (except for different scripts)
      if (translation === text && fromLang !== toLang) {
        return null;
      }
      
      return {
        translatedText: translation,
        confidence: match,
        service: 'MyMemory'
      };
    }
  } catch (error) {
    console.log('MyMemory failed:', error);
  }
  return null;
};

// Main translation function with fallbacks
export const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
  if (!text.trim()) {
    throw new Error('Empty text provided');
  }

  // First, check for common phrases
  const commonPhrase = getCommonPhraseTranslation(text, fromLang, toLang);
  if (commonPhrase) {
    return commonPhrase;
  }

  // Convert language codes if needed
  const normalizedFromLang = fromLang.split('-')[0];
  const normalizedToLang = toLang.split('-')[0];

  // Try LibreTranslate first (more accurate)
  const libreResult = await translateWithLibreTranslate(text, normalizedFromLang, normalizedToLang);
  if (libreResult && libreResult.confidence > 0.7) {
    return libreResult.translatedText;
  }

  // Fallback to MyMemory with filtering
  const myMemoryResult = await translateWithMyMemory(text, normalizedFromLang, normalizedToLang);
  if (myMemoryResult && myMemoryResult.confidence > 0.8) {
    return myMemoryResult.translatedText;
  }

  // If both fail, try a simple word-by-word translation for common words
  const words = text.split(' ');
  if (words.length <= 3) {
    const translatedWords = words.map(word => {
      const wordTranslation = getCommonPhraseTranslation(word, fromLang, toLang);
      return wordTranslation || word;
    });
    
    if (translatedWords.some(word => word !== words[words.indexOf(word)])) {
      return translatedWords.join(' ');
    }
  }

  // Last resort - return best available translation or throw error
  if (libreResult) return libreResult.translatedText;
  if (myMemoryResult) return myMemoryResult.translatedText;
  
  throw new Error('Translation failed - please try again');
};