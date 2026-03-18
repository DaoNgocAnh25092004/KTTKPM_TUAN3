import { ILibraryObserver, LibraryEvent, IBook, IUser } from "../../interfaces";

/**
 * Observer Pattern Implementation
 * Các observer khác nhau sẽ nhận thông báo từ Library
 */

// Library Staff Observer - Nhân viên thư viện
export class LibraryStaff implements ILibraryObserver {
  private name: string;
  private id: string;
  private department: string;
  private notifications: LibraryEvent[] = [];

  constructor(id: string, name: string, department: string) {
    this.id = id;
    this.name = name;
    this.department = department;
  }

  public update(event: LibraryEvent): void {
    this.notifications.push(event);

    switch (event.type) {
      case "BOOK_ADDED":
        this.handleNewBook(event);
        break;
      case "BOOK_BORROWED":
        this.handleBookBorrowed(event);
        break;
      case "BOOK_RETURNED":
        this.handleBookReturned(event);
        break;
      case "BOOK_OVERDUE":
        this.handleOverdueBook(event);
        break;
    }
  }

  public getName(): string {
    return `Staff: ${this.name} (${this.department})`;
  }

  private handleNewBook(event: LibraryEvent): void {
    const book = event.data.book;
    console.log(
      `${this.name}: Sách mới "${book.title}" đã được thêm vào hệ thống`,
    );
    console.log(`   Cần cập nhật catalog và kiểm tra vị trí lưu trữ`);
  }

  private handleBookBorrowed(event: LibraryEvent): void {
    const { book, user } = event.data;
    console.log(`${this.name}: ${user.name} đã mượn "${book.title}"`);
    console.log(`   Cập nhật thống kê mượn sách`);
  }

  private handleBookReturned(event: LibraryEvent): void {
    const { book, user, transaction } = event.data;
    console.log(`${this.name}: ${user.name} đã trả "${book.title}"`);

    if (transaction.isOverdue) {
      console.log(`   [WARNING] Sách này đã quá hạn! Cần xử lý phí phạt`);
    } else {
      console.log(`   Trả sách đúng hạn`);
    }
  }

  private handleOverdueBook(event: LibraryEvent): void {
    const { book, user } = event.data;
    console.log(
      `${this.name}: CẢNH BÁO - Sách "${book.title}" của ${user.name} đã quá hạn`,
    );
    console.log(`   Cần liên hệ với người mượn`);
  }

  public getNotificationCount(): number {
    return this.notifications.length;
  }

  public getRecentNotifications(count: number = 5): LibraryEvent[] {
    return this.notifications.slice(-count);
  }
}

// Member Notification Observer - Người dùng đăng ký thông báo
export class MemberNotificationService implements ILibraryObserver {
  private memberPreferences: Map<string, NotificationPreference> = new Map();
  private notifications: Map<string, LibraryEvent[]> = new Map();

  public update(event: LibraryEvent): void {
    // Gửi thông báo cho các member quan tâm
    this.notifyInterestedMembers(event);
  }

  public getName(): string {
    return "Member Notification Service";
  }

  public subscribeForGenre(userId: string, genre: string, email: string): void {
    const preference = this.memberPreferences.get(userId) || {
      userId,
      email,
      interestedGenres: [],
      notifyNewBooks: false,
      notifyAvailable: false,
    };

    if (!preference.interestedGenres.includes(genre)) {
      preference.interestedGenres.push(genre);
    }
    this.memberPreferences.set(userId, preference);
    console.log(`${email} đã đăng ký nhận thông báo cho thể loại: ${genre}`);
  }

  public enableNewBookNotification(userId: string, email: string): void {
    const preference = this.memberPreferences.get(userId) || {
      userId,
      email,
      interestedGenres: [],
      notifyNewBooks: true,
      notifyAvailable: false,
    };

    preference.notifyNewBooks = true;
    this.memberPreferences.set(userId, preference);
    console.log(`${email} đã bật thông báo sách mới`);
  }

  private notifyInterestedMembers(event: LibraryEvent): void {
    switch (event.type) {
      case "BOOK_ADDED":
        this.notifyForNewBook(event);
        break;
      case "BOOK_RETURNED":
        this.notifyForAvailableBook(event);
        break;
    }
  }

  private notifyForNewBook(event: LibraryEvent): void {
    const book = event.data.book;

    this.memberPreferences.forEach((preference, userId) => {
      let shouldNotify = false;

      // Check if user wants all new book notifications
      if (preference.notifyNewBooks) {
        shouldNotify = true;
      }

      // Check if user is interested in this genre
      if (preference.interestedGenres.includes(book.genre)) {
        shouldNotify = true;
      }

      if (shouldNotify) {
        this.sendNotification(
          userId,
          preference.email,
          `Sách mới: "${book.title}" by ${book.author} (${book.genre})`,
        );

        // Store notification
        if (!this.notifications.has(userId)) {
          this.notifications.set(userId, []);
        }
        this.notifications.get(userId)!.push(event);
      }
    });
  }

  private notifyForAvailableBook(event: LibraryEvent): void {
    const book = event.data.book;

    this.memberPreferences.forEach((preference, userId) => {
      if (
        preference.interestedGenres.includes(book.genre) ||
        preference.notifyAvailable
      ) {
        this.sendNotification(
          userId,
          preference.email,
          `Sách có sẵn: "${book.title}" đã được trả và sẵn sàng mượn`,
        );
      }
    });
  }

  private sendNotification(
    userId: string,
    email: string,
    message: string,
  ): void {
    console.log(`Gửi email đến ${email}: ${message}`);
    // Simulation of email sending
  }

  public getMemberNotifications(userId: string): LibraryEvent[] {
    return this.notifications.get(userId) || [];
  }
}

// System Admin Observer - Quản trị hệ thống
export class SystemAdministrator implements ILibraryObserver {
  private systemLogs: LibraryEvent[] = [];
  private stats = {
    booksAdded: 0,
    booksBorrowed: 0,
    booksReturned: 0,
    overdueBooks: 0,
  };

  public update(event: LibraryEvent): void {
    this.systemLogs.push(event);
    this.updateStatistics(event);
    this.generateSystemReport(event);
  }

  public getName(): string {
    return "System Administrator";
  }

  private updateStatistics(event: LibraryEvent): void {
    switch (event.type) {
      case "BOOK_ADDED":
        this.stats.booksAdded++;
        break;
      case "BOOK_BORROWED":
        this.stats.booksBorrowed++;
        break;
      case "BOOK_RETURNED":
        this.stats.booksReturned++;
        break;
      case "BOOK_OVERDUE":
        this.stats.overdueBooks++;
        break;
    }
  }

  private generateSystemReport(event: LibraryEvent): void {
    console.log(
      `[SYSTEM] ${event.type} event logged at ${event.timestamp.toLocaleString()}`,
    );

    // Critical events require immediate attention
    if (event.type === "BOOK_OVERDUE") {
      console.log(`[ADMIN ALERT] Overdue book requires attention!`);
      this.alertForOverdueBook(event);
    }

    // Log system performance
    if (this.systemLogs.length % 10 === 0) {
      console.log(
        `[SYSTEM STATS] Total events logged: ${this.systemLogs.length}`,
      );
      this.printStatistics();
    }
  }

  private alertForOverdueBook(event: LibraryEvent): void {
    const { book, user } = event.data;
    console.log(
      `ADMIN ALERT: User ${user.name} (${user.email}) has overdue book "${book.title}"`,
    );
    console.log(`   Due date: ${book.dueDate?.toLocaleDateString()}`);
    console.log(`   Days overdue: ${this.calculateDaysOverdue(book.dueDate!)}`);
  }

  private calculateDaysOverdue(dueDate: Date): number {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public printStatistics(): void {
    console.log(`\n=== LIBRARY SYSTEM STATISTICS ===`);
    console.log(`Books Added: ${this.stats.booksAdded}`);
    console.log(`Books Borrowed: ${this.stats.booksBorrowed}`);
    console.log(`Books Returned: ${this.stats.booksReturned}`);
    console.log(`[WARNING] Overdue Books: ${this.stats.overdueBooks}`);
    console.log(`Total Events: ${this.systemLogs.length}`);
    console.log(`=================================\\n`);
  }

  public getSystemLogs(): LibraryEvent[] {
    return [...this.systemLogs];
  }

  public exportLogs(): string {
    return JSON.stringify(this.systemLogs, null, 2);
  }
}

// Inventory Manager Observer - Quản lý kho
export class InventoryManager implements ILibraryObserver {
  private inventory: Map<string, InventoryItem> = new Map();
  private lowStockAlerts: string[] = [];

  public update(event: LibraryEvent): void {
    switch (event.type) {
      case "BOOK_ADDED":
        this.addToInventory(event.data.book);
        break;
      case "BOOK_BORROWED":
        this.updateAvailability(event.data.book, false);
        break;
      case "BOOK_RETURNED":
        this.updateAvailability(event.data.book, true);
        break;
    }
  }

  public getName(): string {
    return "Inventory Manager";
  }

  private addToInventory(book: IBook): void {
    const genreKey = book.genre;
    const existing = this.inventory.get(genreKey) || {
      genre: genreKey,
      totalBooks: 0,
      availableBooks: 0,
      borrowedBooks: 0,
    };

    existing.totalBooks++;
    existing.availableBooks++;
    this.inventory.set(genreKey, existing);

    console.log(`[INVENTORY] Added "${book.title}" to ${genreKey} collection`);
    console.log(
      `   ${genreKey}: ${existing.availableBooks}/${existing.totalBooks} available`,
    );
  }

  private updateAvailability(book: IBook, returned: boolean): void {
    const genreKey = book.genre;
    const item = this.inventory.get(genreKey);

    if (item) {
      if (returned) {
        item.availableBooks++;
        item.borrowedBooks--;
      } else {
        item.availableBooks--;
        item.borrowedBooks++;
      }

      console.log(
        `[INVENTORY] ${genreKey}: ${item.availableBooks}/${item.totalBooks} available`,
      );

      // Check for low stock
      if (item.availableBooks <= 1 && !this.lowStockAlerts.includes(genreKey)) {
        this.alertLowStock(genreKey, item);
        this.lowStockAlerts.push(genreKey);
      }

      // Remove from low stock alert if restocked
      if (item.availableBooks > 3 && this.lowStockAlerts.includes(genreKey)) {
        this.lowStockAlerts = this.lowStockAlerts.filter((g) => g !== genreKey);
      }
    }
  }

  private alertLowStock(genre: string, item: InventoryItem): void {
    console.log(`[INVENTORY ALERT] Low stock in ${genre}!`);
    console.log(
      `   Only ${item.availableBooks} books available out of ${item.totalBooks}`,
    );
    console.log(`   Consider acquiring more books in this genre`);
  }

  public getInventoryReport(): Map<string, InventoryItem> {
    return new Map(this.inventory);
  }

  public getLowStockAlerts(): string[] {
    return [...this.lowStockAlerts];
  }
}

// Interfaces for supporting classes
interface NotificationPreference {
  userId: string;
  email: string;
  interestedGenres: string[];
  notifyNewBooks: boolean;
  notifyAvailable: boolean;
}

interface InventoryItem {
  genre: string;
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
}
