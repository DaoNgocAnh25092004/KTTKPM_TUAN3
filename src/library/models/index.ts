import {
  IBook,
  IUser,
  IBorrowTransaction,
  BookType,
  BookStatus,
} from "../interfaces";

// Book model cơ bản
export class Book implements IBook {
  public id: string;
  public title: string;
  public author: string;
  public genre: string;
  public type: BookType;
  public status: BookStatus;
  public publishYear: number;
  public borrowedDate?: Date;
  public dueDate?: Date;
  public borrowerId?: string;

  constructor(
    id: string,
    title: string,
    author: string,
    genre: string,
    type: BookType,
    publishYear: number,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.type = type;
    this.publishYear = publishYear;
    this.status = BookStatus.AVAILABLE;
  }

  public borrow(userId: string, dueDate: Date): void {
    if (this.status !== BookStatus.AVAILABLE) {
      throw new Error(`Book ${this.title} is not available for borrowing`);
    }
    this.borrowerId = userId;
    this.borrowedDate = new Date();
    this.dueDate = dueDate;
    this.status = BookStatus.BORROWED;
  }

  public return(): void {
    this.borrowerId = undefined;
    this.borrowedDate = undefined;
    this.dueDate = undefined;
    this.status = BookStatus.AVAILABLE;
  }

  public isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate;
  }
}

// User model
export class User implements IUser {
  public id: string;
  public name: string;
  public email: string;
  public membershipDate: Date;
  public borrowedBooks: string[] = [];

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.membershipDate = new Date();
  }

  public borrowBook(bookId: string): void {
    if (!this.borrowedBooks.includes(bookId)) {
      this.borrowedBooks.push(bookId);
    }
  }

  public returnBook(bookId: string): void {
    this.borrowedBooks = this.borrowedBooks.filter((id) => id !== bookId);
  }
}

// BorrowTransaction model
export class BorrowTransaction implements IBorrowTransaction {
  public id: string;
  public bookId: string;
  public userId: string;
  public borrowDate: Date;
  public dueDate: Date;
  public returnDate?: Date;

  constructor(id: string, bookId: string, userId: string, dueDate: Date) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.borrowDate = new Date();
    this.dueDate = dueDate;
  }

  public get isOverdue(): boolean {
    if (this.returnDate) return false;
    return new Date() > this.dueDate;
  }

  public complete(): void {
    this.returnDate = new Date();
  }
}
