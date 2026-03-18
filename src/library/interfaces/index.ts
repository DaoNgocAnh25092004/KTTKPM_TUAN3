// Base interfaces cho Library Management System

// Enum cho các loại sách
export enum BookType {
  PHYSICAL = "physical",
  DIGITAL = "digital",
  AUDIO = "audio",
}

// Enum cho trạng thái sách
export enum BookStatus {
  AVAILABLE = "available",
  BORROWED = "borrowed",
  RESERVED = "reserved",
}

// Interface chính cho Book
export interface IBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  type: BookType;
  status: BookStatus;
  publishYear: number;
  borrowedDate?: Date;
  dueDate?: Date;
  borrowerId?: string;

  // Methods
  borrow(userId: string, dueDate: Date): void;
  return(): void;
  isOverdue(): boolean;
}

// Interface cho User/Member
export interface IUser {
  id: string;
  name: string;
  email: string;
  membershipDate: Date;
  borrowedBooks: string[]; // Book IDs

  // Methods
  borrowBook(bookId: string): void;
  returnBook(bookId: string): void;
}

// Interface cho Borrowing Transaction
export interface IBorrowTransaction {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  isOverdue: boolean;

  // Methods
  complete(): void;
}

// Observer Pattern interfaces
export interface ILibraryObserver {
  update(event: LibraryEvent): void;
  getName(): string;
}

export interface ILibrarySubject {
  subscribe(observer: ILibraryObserver): void;
  unsubscribe(observer: ILibraryObserver): void;
  notify(event: LibraryEvent): void;
}

export interface LibraryEvent {
  type: "BOOK_ADDED" | "BOOK_BORROWED" | "BOOK_RETURNED" | "BOOK_OVERDUE";
  data: any;
  timestamp: Date;
}

// Strategy Pattern interfaces
export interface ISearchStrategy {
  search(books: IBook[], query: string): IBook[];
  getSearchType(): string;
}

// Factory Pattern interfaces
export interface IBookFactory {
  createBook(
    title: string,
    author: string,
    genre: string,
    publishYear: number,
  ): IBook;
  getBookType(): BookType;
}

// Decorator Pattern interfaces
export interface IBorrowService {
  borrowBook(bookId: string, userId: string): IBorrowTransaction;
  getDescription(): string;
  getCost(): number;
}
