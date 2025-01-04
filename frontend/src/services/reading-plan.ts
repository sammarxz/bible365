// reading-plan.ts
import { addDays, format } from "date-fns";
import { getBibleBooks } from "./bible";
import { BibleBook, DailyReading, Reading } from "../types";

const OLD_TESTAMENT_BOOKS = 39;
const NEW_TESTAMENT_BOOKS = 27;
const PSALMS_BOOKS = 150;
const PROVERBS_BOOKS = 31;

export class ReadingPlanGenerator {
  private books: BibleBook[] = [];

  async initialize(): Promise<void> {
    this.books = await getBibleBooks();
  }

  private generateReference(
    book: string,
    startChapter: number,
    endChapter: number
  ): string {
    return startChapter === endChapter
      ? `${book} ${startChapter}`
      : `${book} ${startChapter}-${endChapter}`;
  }

  private generateReadingsForDay(dayNumber: number): DailyReading[] {
    const todaysReadings: DailyReading[] = [];

    // Velho Testamento (2 capítulos)
    const otBookIndex = Math.floor(dayNumber / 3) % OLD_TESTAMENT_BOOKS;
    const otBook = this.books[otBookIndex];
    const startChapter = (dayNumber % 3) * 2 + 1;
    const endChapter = (dayNumber % 3) * 2 + 2;
    todaysReadings.push({
      book: otBook.name,
      startChapter,
      endChapter,
      type: "old-testament",
      reference: this.generateReference(otBook.name, startChapter, endChapter),
    });

    // Novo Testamento (1 capítulo)
    const ntBookIndex = Math.floor(dayNumber / 2) % NEW_TESTAMENT_BOOKS;
    const ntBook = this.books[OLD_TESTAMENT_BOOKS + ntBookIndex];
    const ntChapter = (dayNumber % 2) + 1;
    todaysReadings.push({
      book: ntBook.name,
      startChapter: ntChapter,
      endChapter: ntChapter,
      type: "new-testament",
      reference: this.generateReference(ntBook.name, ntChapter, ntChapter),
    });

    // Salmos (1 por dia)
    const psalmChapter = (dayNumber % PSALMS_BOOKS) + 1;
    todaysReadings.push({
      book: "Salmos",
      startChapter: psalmChapter,
      endChapter: psalmChapter,
      type: "psalms",
      reference: this.generateReference("Salmos", psalmChapter, psalmChapter),
    });

    // Provérbios (1 a cada 12 dias)
    if (dayNumber % 12 === 0) {
      const proverbChapter = ((dayNumber / 12) % PROVERBS_BOOKS) + 1;
      todaysReadings.push({
        book: "Provérbios",
        startChapter: proverbChapter,
        endChapter: proverbChapter,
        type: "proverbs",
        reference: this.generateReference(
          "Provérbios",
          proverbChapter,
          proverbChapter
        ),
      });
    }

    return todaysReadings;
  }

  // Gera apenas uma semana de leituras por vez
  async generateWeek(
    startDate: Date,
    weekNumber: number = 0
  ): Promise<Reading[]> {
    if (this.books.length === 0) {
      await this.initialize();
    }

    const readings: Reading[] = [];
    let currentDate = addDays(startDate, weekNumber * 7);

    // Gera 7 dias de leitura
    for (let day = 0; day < 7; day++) {
      const dayNumber = weekNumber * 7 + day;
      const todaysReadings = this.generateReadingsForDay(dayNumber);

      readings.push({
        id: (dayNumber + 1).toString(),
        date: format(currentDate, "yyyy-MM-dd"),
        readings: todaysReadings,
        oldTestament: this.generateReadingSummary(
          todaysReadings,
          "old-testament"
        ),
        newTestament: this.generateReadingSummary(
          todaysReadings,
          "new-testament"
        ),
        psalms: this.generateReadingSummary(todaysReadings, "psalms"),
        proverbs: this.generateReadingSummary(todaysReadings, "proverbs"),
        completed: false,
      });

      currentDate = addDays(currentDate, 1);
    }

    return readings;
  }

  // Retorna um resumo das leituras de um tipo específico
  private generateReadingSummary(
    readings: DailyReading[],
    type: string
  ): string {
    return readings
      .filter((r) => r.type === type)
      .map((r) => r.reference)
      .join(", ");
  }

  // Retorna somente as leituras para hoje
  async getToday(startDate: Date = new Date()): Promise<Reading | null> {
    const daysSinceStart = Math.floor(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weekNumber = Math.floor(daysSinceStart / 7);
    const week = await this.generateWeek(startDate, weekNumber);
    return week[daysSinceStart % 7] || null;
  }

  getReadingText(reading: DailyReading): string {
    return this.generateReference(
      reading.book,
      reading.startChapter,
      reading.endChapter
    );
  }
}
