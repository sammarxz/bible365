import { translations } from "./translations";

const BASE_URL = "https://bible-api.com";

interface BibleApiResponse {
  reference: string;
  text: string;
  translation_id: string;
  translation_name: string;
}

export async function getVerse(
  reference: string,
  language: "pt-BR" | "en" = "pt-BR"
): Promise<string> {
  try {
    const version = translations.versions[language];
    const translatedRef = language === "pt-BR" ? reference : reference;

    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(translatedRef)}?translation=${version}`
    );

    console.log('fez request')

    if (!response.ok) {
      throw new Error("Falha ao carregar o texto bíblico");
    }

    const data: BibleApiResponse = await response.json();
    return data.text;
  } catch (error) {
    console.error("Erro ao buscar versículo:", error);
    return "Não foi possível carregar o texto bíblico. Por favor, tente novamente.";
  }
}
