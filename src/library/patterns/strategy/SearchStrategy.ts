import { IBook, ISearchStrategy } from "../../interfaces";

/**
 * Strategy Pattern for Book Search
 * Các chiến lược tìm kiếm sách khác nhau
 */

// Search by Title Strategy
export class TitleSearchStrategy implements ISearchStrategy {
  search(books: IBook[], query: string): IBook[] {
    const lowerQuery = query.toLowerCase();
    return books.filter((book) =>
      book.title.toLowerCase().includes(lowerQuery),
    );
  }

  getSearchType(): string {
    return "Title Search";
  }
}

// Search by Author Strategy
export class AuthorSearchStrategy implements ISearchStrategy {
  search(books: IBook[], query: string): IBook[] {
    const lowerQuery = query.toLowerCase();
    return books.filter((book) =>
      book.author.toLowerCase().includes(lowerQuery),
    );
  }

  getSearchType(): string {
    return "Author Search";
  }
}

// Search by Genre Strategy
export class GenreSearchStrategy implements ISearchStrategy {
  search(books: IBook[], query: string): IBook[] {
    const lowerQuery = query.toLowerCase();
    return books.filter((book) =>
      book.genre.toLowerCase().includes(lowerQuery),
    );
  }

  getSearchType(): string {
    return "Genre Search";
  }
}

// Search by Publication Year Strategy
export class YearSearchStrategy implements ISearchStrategy {
  search(books: IBook[], query: string): IBook[] {
    const year = parseInt(query);
    if (isNaN(year)) return [];

    return books.filter((book) => book.publishYear === year);
  }

  getSearchType(): string {
    return "Publication Year Search";
  }
}

// Advanced Search Strategy (Tìm kiếm nâng cao)
export class AdvancedSearchStrategy implements ISearchStrategy {
  search(books: IBook[], query: string): IBook[] {
    const lowerQuery = query.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.genre.toLowerCase().includes(lowerQuery) ||
        book.publishYear.toString().includes(query),
    );
  }

  getSearchType(): string {
    return "Advanced Search (All Fields)";
  }
}

// Fuzzy Search Strategy (Tìm kiếm mờ)
export class FuzzySearchStrategy implements ISearchStrategy {
  search(books: IBook[], query: string): IBook[] {
    const lowerQuery = query.toLowerCase();
    const results: { book: IBook; score: number }[] = [];

    books.forEach((book) => {
      let score = 0;

      // Check title similarity
      score +=
        this.calculateSimilarity(book.title.toLowerCase(), lowerQuery) * 3;
      // Check author similarity
      score +=
        this.calculateSimilarity(book.author.toLowerCase(), lowerQuery) * 2;
      // Check genre similarity
      score +=
        this.calculateSimilarity(book.genre.toLowerCase(), lowerQuery) * 1;

      if (score > 0.3) {
        // Threshold cho fuzzy search
        results.push({ book, score });
      }
    });

    // Sort by relevance score (descending)
    return results
      .sort((a, b) => b.score - a.score)
      .map((result) => result.book);
  }

  getSearchType(): string {
    return "Fuzzy Search (Smart)";
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.includes(str2) || str2.includes(str1)) return 0.8;

    // Simple Levenshtein distance calculation
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + substitutionCost, // substitution
        );
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  }
}

/**
 * Context class cho Strategy Pattern
 * Quản lý và thực thi các chiến lược tìm kiếm
 */
export class BookSearchContext {
  private strategy: ISearchStrategy;

  constructor(strategy: ISearchStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: ISearchStrategy): void {
    this.strategy = strategy;
    console.log(`Đã chuyển sang chiến lược: ${strategy.getSearchType()}`);
  }

  public getStrategy(): ISearchStrategy {
    return this.strategy;
  }

  public search(books: IBook[], query: string): IBook[] {
    console.log(`Tìm kiếm "${query}" bằng ${this.strategy.getSearchType()}`);
    const results = this.strategy.search(books, query);
    console.log(`Tìm thấy ${results.length} kết quả`);
    return results;
  }

  public searchWithMultipleStrategies(
    books: IBook[],
    query: string,
    strategies: ISearchStrategy[],
  ): Map<string, IBook[]> {
    const allResults = new Map<string, IBook[]>();

    strategies.forEach((strategy) => {
      const results = strategy.search(books, query);
      allResults.set(strategy.getSearchType(), results);
    });

    return allResults;
  }
}

/**
 * Search Factory - Tạo ra các chiến lược tìm kiếm
 */
export class SearchStrategyFactory {
  private static strategies: Map<string, ISearchStrategy> = new Map([
    ["title", new TitleSearchStrategy()],
    ["author", new AuthorSearchStrategy()],
    ["genre", new GenreSearchStrategy()],
    ["year", new YearSearchStrategy()],
    ["advanced", new AdvancedSearchStrategy()],
    ["fuzzy", new FuzzySearchStrategy()],
  ]);

  public static getStrategy(type: string): ISearchStrategy {
    const strategy = this.strategies.get(type.toLowerCase());
    if (!strategy) {
      throw new Error(`Unknown search strategy: ${type}`);
    }
    return strategy;
  }

  public static getAllStrategies(): Map<string, ISearchStrategy> {
    return new Map(this.strategies);
  }

  public static getAvailableTypes(): string[] {
    return Array.from(this.strategies.keys());
  }
}

/**
 * Advanced Search Builder - Xây dựng tìm kiếm phức tạp
 */
export interface SearchFilters {
  titleQuery?: string;
  authorQuery?: string;
  genreQuery?: string;
  yearFrom?: number;
  yearTo?: number;
  bookType?: string;
  availability?: boolean;
}

export class AdvancedSearchBuilder {
  private filters: SearchFilters = {};

  public byTitle(title: string): AdvancedSearchBuilder {
    this.filters.titleQuery = title;
    return this;
  }

  public byAuthor(author: string): AdvancedSearchBuilder {
    this.filters.authorQuery = author;
    return this;
  }

  public byGenre(genre: string): AdvancedSearchBuilder {
    this.filters.genreQuery = genre;
    return this;
  }

  public byYearRange(from: number, to: number): AdvancedSearchBuilder {
    this.filters.yearFrom = from;
    this.filters.yearTo = to;
    return this;
  }

  public byBookType(type: string): AdvancedSearchBuilder {
    this.filters.bookType = type;
    return this;
  }

  public onlyAvailable(): AdvancedSearchBuilder {
    this.filters.availability = true;
    return this;
  }

  public search(books: IBook[]): IBook[] {
    return books.filter((book) => {
      // Title filter
      if (
        this.filters.titleQuery &&
        !book.title
          .toLowerCase()
          .includes(this.filters.titleQuery.toLowerCase())
      ) {
        return false;
      }

      // Author filter
      if (
        this.filters.authorQuery &&
        !book.author
          .toLowerCase()
          .includes(this.filters.authorQuery.toLowerCase())
      ) {
        return false;
      }

      // Genre filter
      if (
        this.filters.genreQuery &&
        !book.genre
          .toLowerCase()
          .includes(this.filters.genreQuery.toLowerCase())
      ) {
        return false;
      }

      // Year range filter
      if (this.filters.yearFrom && book.publishYear < this.filters.yearFrom) {
        return false;
      }
      if (this.filters.yearTo && book.publishYear > this.filters.yearTo) {
        return false;
      }

      // Book type filter
      if (this.filters.bookType && book.type !== this.filters.bookType) {
        return false;
      }

      // Availability filter
      if (this.filters.availability && book.status !== "available") {
        return false;
      }

      return true;
    });
  }

  public getFilters(): SearchFilters {
    return { ...this.filters };
  }

  public clear(): AdvancedSearchBuilder {
    this.filters = {};
    return this;
  }
}
