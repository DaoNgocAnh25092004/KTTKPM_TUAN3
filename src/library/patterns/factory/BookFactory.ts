import { IBook, IBookFactory, BookType, BookStatus } from "../../interfaces";
import { Book } from "../../models";

/**
 * Extended Book classes cho các loại sách khác nhau
 */

// Physical Book (Sách giấy)
export class PhysicalBook extends Book {
  public isbn: string;
  public location: string; // Vị trí trên kệ
  public condition: "new" | "good" | "fair" | "poor";

  constructor(
    id: string,
    title: string,
    author: string,
    genre: string,
    publishYear: number,
    isbn: string,
    location: string,
    condition: "new" | "good" | "fair" | "poor" = "good",
  ) {
    super(id, title, author, genre, BookType.PHYSICAL, publishYear);
    this.isbn = isbn;
    this.location = location;
    this.condition = condition;
  }

  public getBookDetails(): string {
    return (
      `Sách giấy: ${this.title} by ${this.author}\\n` +
      `   Vị trí: ${this.location}\\n` +
      `   ISBN: ${this.isbn}\\n` +
      `   Tình trạng: ${this.condition}`
    );
  }
}

// Digital Book (Sách điện tử)
export class DigitalBook extends Book {
  public fileFormat: string;
  public fileSize: number; // MB
  public downloadUrl: string;
  public drm: boolean; // Digital Rights Management

  constructor(
    id: string,
    title: string,
    author: string,
    genre: string,
    publishYear: number,
    fileFormat: string,
    fileSize: number,
    downloadUrl: string,
    drm: boolean = true,
  ) {
    super(id, title, author, genre, BookType.DIGITAL, publishYear);
    this.fileFormat = fileFormat;
    this.fileSize = fileSize;
    this.downloadUrl = downloadUrl;
    this.drm = drm;
  }

  public getBookDetails(): string {
    return (
      `Sách điện tử: ${this.title} by ${this.author}\\n` +
      `   Format: ${this.fileFormat}\\n` +
      `   Size: ${this.fileSize} MB\\n` +
      `   DRM: ${this.drm ? "Yes" : "No"}`
    );
  }

  public getDownloadLink(): string {
    if (this.status !== BookStatus.BORROWED) {
      throw new Error("Sách chưa được mượn, không thể tạo link download");
    }
    return `${this.downloadUrl}?bookId=${this.id}&timestamp=${Date.now()}`;
  }
}

// Audio Book (Sách nói)
export class AudioBook extends Book {
  public narrator: string;
  public duration: number; // minutes
  public audioFormat: string;
  public chapters: string[];

  constructor(
    id: string,
    title: string,
    author: string,
    genre: string,
    publishYear: number,
    narrator: string,
    duration: number,
    audioFormat: string = "MP3",
    chapters: string[] = [],
  ) {
    super(id, title, author, genre, BookType.AUDIO, publishYear);
    this.narrator = narrator;
    this.duration = duration;
    this.audioFormat = audioFormat;
    this.chapters = chapters;
  }

  public getBookDetails(): string {
    return (
      `Sách nói: ${this.title} by ${this.author}\\n` +
      `   Người đọc: ${this.narrator}\\n` +
      `   Thời lượng: ${this.duration} phút\\n` +
      `   Format: ${this.audioFormat}\\n` +
      `   Số chương: ${this.chapters.length}`
    );
  }

  public getFormattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Factory Method Pattern Implementation
 */

// Abstract Factory
export abstract class BookFactory implements IBookFactory {
  public abstract createBook(
    title: string,
    author: string,
    genre: string,
    publishYear: number,
  ): IBook;
  public abstract getBookType(): BookType;

  // Template method
  public createBookWithId(
    id: string,
    title: string,
    author: string,
    genre: string,
    publishYear: number,
  ): IBook {
    const book = this.createBook(title, author, genre, publishYear);
    book.id = id;
    return book;
  }
}

// Physical Book Factory
export class PhysicalBookFactory extends BookFactory {
  public createBook(
    title: string,
    author: string,
    genre: string,
    publishYear: number,
  ): IBook {
    // Generate default values
    const isbn = this.generateISBN();
    const location = this.generateLocation(genre);

    return new PhysicalBook(
      "", // ID sẽ được set sau
      title,
      author,
      genre,
      publishYear,
      isbn,
      location,
      "good",
    );
  }

  public getBookType(): BookType {
    return BookType.PHYSICAL;
  }

  private generateISBN(): string {
    return `978-${Math.floor(Math.random() * 1000000000)}`;
  }

  private generateLocation(genre: string): string {
    const sections: { [key: string]: string } = {
      Fiction: "A",
      "Non-Fiction": "B",
      Science: "C",
      History: "D",
      Biography: "E",
    };
    const section = sections[genre] || "Z";
    const shelf = Math.floor(Math.random() * 20) + 1;
    return `${section}${shelf}`;
  }
}

// Digital Book Factory
export class DigitalBookFactory extends BookFactory {
  public createBook(
    title: string,
    author: string,
    genre: string,
    publishYear: number,
  ): IBook {
    const fileFormat = this.getRandomFormat();
    const fileSize = Math.floor(Math.random() * 50) + 1; // 1-50 MB
    const downloadUrl = this.generateDownloadUrl(title);

    return new DigitalBook(
      "", // ID sẽ được set sau
      title,
      author,
      genre,
      publishYear,
      fileFormat,
      fileSize,
      downloadUrl,
      true,
    );
  }

  public getBookType(): BookType {
    return BookType.DIGITAL;
  }

  private getRandomFormat(): string {
    const formats = ["PDF", "EPUB", "MOBI", "AZW"];
    return formats[Math.floor(Math.random() * formats.length)];
  }

  private generateDownloadUrl(title: string): string {
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `https://library.download/ebooks/${slug}`;
  }
}

// Audio Book Factory
export class AudioBookFactory extends BookFactory {
  public createBook(
    title: string,
    author: string,
    genre: string,
    publishYear: number,
  ): IBook {
    const narrator = this.generateNarrator();
    const duration = Math.floor(Math.random() * 600) + 180; // 3-13 hours
    const chapters = this.generateChapters();

    return new AudioBook(
      "", // ID sẽ được set sau
      title,
      author,
      genre,
      publishYear,
      narrator,
      duration,
      "MP3",
      chapters,
    );
  }

  public getBookType(): BookType {
    return BookType.AUDIO;
  }

  private generateNarrator(): string {
    const narrators = [
      "John Smith",
      "Emma Watson",
      "Michael Johnson",
      "Sarah Wilson",
      "David Brown",
      "Lisa Davis",
      "Robert Miller",
      "Anna Taylor",
    ];
    return narrators[Math.floor(Math.random() * narrators.length)];
  }

  private generateChapters(): string[] {
    const chapterCount = Math.floor(Math.random() * 15) + 5; // 5-20 chapters
    const chapters = [];
    for (let i = 1; i <= chapterCount; i++) {
      chapters.push(`Chapter ${i}`);
    }
    return chapters;
  }
}

/**
 * Factory Creator - Tạo factory dựa trên loại sách
 */
export class BookFactoryCreator {
  public static createFactory(bookType: BookType): BookFactory {
    switch (bookType) {
      case BookType.PHYSICAL:
        return new PhysicalBookFactory();
      case BookType.DIGITAL:
        return new DigitalBookFactory();
      case BookType.AUDIO:
        return new AudioBookFactory();
      default:
        throw new Error(`Unsupported book type: ${bookType}`);
    }
  }

  public static getAllFactories(): BookFactory[] {
    return [
      new PhysicalBookFactory(),
      new DigitalBookFactory(),
      new AudioBookFactory(),
    ];
  }
}
