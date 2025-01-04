import { BibleBook, BibleTranslation } from "../types";

const BASE_URL = "https://bible-api.com";

export async function getBibleBooks(): Promise<BibleBook[]> {
  try {
    const response = await fetch(`${BASE_URL}/data/almeida`);
    const data: BibleTranslation = await response.json();
    return data.books;
  } catch (error) {
    console.error("Error fetching Bible books:", error);
    throw error;
  }
}

export async function getVerse(reference: string): Promise<string> {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(reference)}?translation=almeida`
    );

    if (!response.ok) {
      throw new Error("Failed to load Bible text");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error fetching verse:", error);
    throw error;
  }
}
