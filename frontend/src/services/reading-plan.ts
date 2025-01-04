import { addDays, format } from "date-fns";
import { getBibleBooks } from "./bible";
import { BibleBook, DailyReading, Reading } from "../types";

export class ReadingPlanGenerator {
  private books: BibleBook[] = [];

  async initialize(): Promise<void> {
    this.books = await getBibleBooks();
  }

  private createReading(
    book: string,
    startChapter: number,
    endChapter: number,
    type: DailyReading["type"]
  ): DailyReading {
    const reference =
      startChapter === endChapter
        ? `${book} ${startChapter}`
        : `${book} ${startChapter}-${endChapter}`;

    return {
      book,
      startChapter,
      endChapter,
      type,
      reference,
    };
  }

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
      const todaysReadings: DailyReading[] = [];
      const dayNumber = weekNumber * 7 + day;

      // Velho Testamento (2 capítulos)
      const otBook = Math.floor(dayNumber / 3) % 39; // 39 livros no VT
      if (otBook < 39) {
        const book = this.books[otBook];
        todaysReadings.push(
          this.createReading(
            book.name,
            (dayNumber % 3) * 2 + 1,
            (dayNumber % 3) * 2 + 2,
            "old-testament"
          )
        );
      }

      // Novo Testamento (1 capítulo)
      const ntBook = Math.floor(dayNumber / 2) % 27; // 27 livros no NT
      if (ntBook < 27) {
        const book = this.books[39 + ntBook];
        const chapter = (dayNumber % 2) + 1;
        todaysReadings.push(
          this.createReading(book.name, chapter, chapter, "new-testament")
        );
      }

      // Salmos (1 por dia)
      const psalmChapter = (dayNumber % 150) + 1;
      todaysReadings.push(
        this.createReading("Salmos", psalmChapter, psalmChapter, "psalms")
      );

      // Provérbios (1 a cada 12 dias)
      if (dayNumber % 12 === 0) {
        const proverbChapter = ((dayNumber / 12) % 31) + 1;
        todaysReadings.push(
          this.createReading(
            "Provérbios",
            proverbChapter,
            proverbChapter,
            "proverbs"
          )
        );
      }

      readings.push({
        id: (dayNumber + 1).toString(),
        date: format(currentDate, "yyyy-MM-dd"),
        readings: todaysReadings,
        completed: false,
      });

      currentDate = addDays(currentDate, 1);
    }

    return readings;
  }

  async getToday(startDate: Date = new Date()): Promise<Reading | null> {
    const daysSinceStart = Math.floor(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weekNumber = Math.floor(daysSinceStart / 7);
    const week = await this.generateWeek(startDate, weekNumber);
    return week[daysSinceStart % 7] || null;
  }

  getReadingText(reading: DailyReading): string {
    return reading.reference;
  }
}
