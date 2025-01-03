export const translations = {
  versions: {
    'pt-BR': 'almeida',
    'en': 'kjv'
  },
  books: {
    'Genesis': 'Gênesis',
    'Matthew': 'Mateus',
    'Psalms': 'Salmos',
    'Proverbs': 'Provérbios'
  }
} as const;

export function translateReference(reference: string): string {
  let translatedRef = reference;
  
  Object.entries(translations.books).forEach(([en, pt]) => {
    translatedRef = translatedRef.replace(new RegExp(en, 'i'), pt);
  });
  
  return translatedRef;
}