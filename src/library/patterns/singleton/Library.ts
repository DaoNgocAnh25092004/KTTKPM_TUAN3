import {
  IBook,
  IUser,
  IBorrowTransaction,
  ILibraryObserver,
  ILibrarySubject,
  LibraryEvent,
  BookStatus,
} from "../../interfaces";
import { Book, User, BorrowTransaction } from "../../models";

/**
 * Singleton Pattern for Library Management System
 * Đảm bảo chỉ có một instance duy nhất của Library trong hệ thống
 */
export class Library implements ILibrarySubject {
  private static instance: Library;
  private books: Map<string, IBook> = new Map();
  private users: Map<string, IUser> = new Map();
  private transactions: Map<string, IBorrowTransaction> = new Map();
  private observers: ILibraryObserver[] = [];
  private nextBookId = 1;
  private nextUserId = 1;
  private nextTransactionId = 1;

  // Private constructor để ngăn việc tạo instance từ bên ngoài
  private constructor() {
    console.log("Khởi tạo Library System (Singleton Pattern)");
  }

  /**
   * Phương thức static để lấy instance duy nhất của Library
   */
  public static getInstance(): Library {
    if (!Library.instance) {
      Library.instance = new Library();
    }
    return Library.instance;
  }

  // Observer Pattern methods
  public subscribe(observer: ILibraryObserver): void {
    this.observers.push(observer);
    console.log(`${observer.getName()} đã đăng ký nhận thông báo từ thư viện`);
  }

  public unsubscribe(observer: ILibraryObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`${observer.getName()} đã hủy đăng ký thông báo từ thư viện`);
    }
  }

  public notify(event: LibraryEvent): void {
    console.log(`Thư viện đang thông báo sự kiện: ${event.type}`);
    this.observers.forEach((observer) => observer.update(event));
  }

  // Book management methods
  public addBook(book: IBook): void {
    this.books.set(book.id, book);

    // Notify observers about new book
    this.notify({
      type: "BOOK_ADDED",
      data: { book },
      timestamp: new Date(),
    });

    console.log(`Đã thêm sách: "${book.title}" by ${book.author}`);
  }

  public getBook(bookId: string): IBook | undefined {
    return this.books.get(bookId);
  }

  public getAllBooks(): IBook[] {
    return Array.from(this.books.values());
  }

  public getAvailableBooks(): IBook[] {
    return this.getAllBooks().filter(
      (book) => book.status === BookStatus.AVAILABLE,
    );
  }

  // User management methods
  public addUser(user: IUser): void {
    this.users.set(user.id, user);
    console.log(`Đã thêm người dùng: ${user.name} (${user.email})`);
  }

  public getUser(userId: string): IUser | undefined {
    return this.users.get(userId);
  }

  public getAllUsers(): IUser[] {
    return Array.from(this.users.values());
  }

  // Transaction methods
  public borrowBook(
    bookId: string,
    userId: string,
    daysToReturn: number = 14,
  ): IBorrowTransaction {
    const book = this.getBook(bookId);
    const user = this.getUser(userId);

    if (!book) throw new Error(`Không tìm thấy sách với ID: ${bookId}`);
    if (!user) throw new Error(`Không tìm thấy người dùng với ID: ${userId}`);
    if (book.status !== BookStatus.AVAILABLE) {
      throw new Error(`Sách "${book.title}" hiện không có sẵn để mượn`);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToReturn);

    const transactionId = `T${this.nextTransactionId++}`;
    const transaction = new BorrowTransaction(
      transactionId,
      bookId,
      userId,
      dueDate,
    );

    // Update book and user
    book.borrow(userId, dueDate);
    user.borrowBook(bookId);

    // Store transaction
    this.transactions.set(transactionId, transaction);

    // Notify observers
    this.notify({
      type: "BOOK_BORROWED",
      data: { book, user, transaction },
      timestamp: new Date(),
    });

    console.log(
      `${user.name} đã mượn sách "${book.title}" (Hạn trả: ${dueDate.toLocaleDateString()})`,
    );
    return transaction;
  }

  public returnBook(transactionId: string): void {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error(`Không tìm thấy giao dịch với ID: ${transactionId}`);
    }

    const book = this.getBook(transaction.bookId);
    const user = this.getUser(transaction.userId);

    if (!book || !user) throw new Error("Dữ liệu không hợp lệ");

    // Complete transaction
    transaction.complete();
    book.return();
    user.returnBook(transaction.bookId);

    // Notify observers
    this.notify({
      type: "BOOK_RETURNED",
      data: { book, user, transaction },
      timestamp: new Date(),
    });

    console.log(`${user.name} đã trả sách "${book.title}"`);
  }

  // Utility methods
  public generateBookId(): string {
    return `B${this.nextBookId++}`;
  }

  public generateUserId(): string {
    return `U${this.nextUserId++}`;
  }

  public getOverdueBooks(): IBook[] {
    return this.getAllBooks().filter(
      (book) => book.status === BookStatus.BORROWED && book.isOverdue(),
    );
  }

  public getTotalBooks(): number {
    return this.books.size;
  }

  public getTotalUsers(): number {
    return this.users.size;
  }

  public getLibraryStats(): {
    totalBooks: number;
    availableBooks: number;
    borrowedBooks: number;
    totalUsers: number;
  } {
    const totalBooks = this.getTotalBooks();
    const availableBooks = this.getAvailableBooks().length;
    const borrowedBooks = totalBooks - availableBooks;
    const totalUsers = this.getTotalUsers();

    return { totalBooks, availableBooks, borrowedBooks, totalUsers };
  }
}
