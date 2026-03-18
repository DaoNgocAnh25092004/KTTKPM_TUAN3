import { BookType } from "../interfaces";
import { User } from "../models";
import { Library } from "../patterns/singleton/Library";
import { BookFactoryCreator } from "../patterns/factory/BookFactory";
import {
  BookSearchContext,
  SearchStrategyFactory,
  AdvancedSearchBuilder,
} from "../patterns/strategy/SearchStrategy";
import {
  LibraryStaff,
  MemberNotificationService,
  SystemAdministrator,
  InventoryManager,
} from "../patterns/observer/LibraryObserver";
import {
  BorrowServiceBuilder,
  BorrowServicePackages,
} from "../patterns/decorator/BorrowDecorator";

/**
 * Comprehensive Demo for Library Management System
 * Demonstrates all 5 Design Patterns:
 * 1. Singleton Pattern (Library)
 * 2. Factory Method Pattern (BookFactory)
 * 3. Strategy Pattern (SearchStrategy)
 * 4. Observer Pattern (LibraryObserver)
 * 5. Decorator Pattern (BorrowDecorator)
 */

export class LibraryManagementDemo {
  private library: Library;
  private searchContext: BookSearchContext;

  constructor() {
    console.log("===== LIBRARY MANAGEMENT SYSTEM DEMO =====\\n");

    // 1. Singleton Pattern - Get Library instance
    this.library = Library.getInstance();

    // 2. Strategy Pattern - Initialize search context
    this.searchContext = new BookSearchContext(
      SearchStrategyFactory.getStrategy("title"),
    );
  }

  public async runFullDemo(): Promise<void> {
    console.log("Starting comprehensive library system demo...\\n");

    await this.demoSetup();
    await this.demoSingletonPattern();
    await this.demoFactoryPattern();
    await this.demoObserverPattern();
    await this.demoStrategyPattern();
    await this.demoDecoratorPattern();
    await this.demoAdvancedFeatures();

    console.log("\\nDemo completed successfully!\\n");
    console.log("===== END OF DEMO =====");
  }

  private async demoSetup(): Promise<void> {
    console.log("=== SYSTEM SETUP ===");

    // Create users
    const users = [
      new User("U1", "Nguyễn Văn An", "an.nguyen@email.com"),
      new User("U2", "Trần Thị Bình", "binh.tran@email.com"),
      new User("U3", "Lê Văn Cường", "cuong.le@email.com"),
      new User("U4", "Phạm Thị Dung", "dung.pham@email.com"),
    ];

    users.forEach((user) => this.library.addUser(user));

    console.log("\\n");
  }

  private async demoSingletonPattern(): Promise<void> {
    console.log("=== SINGLETON PATTERN DEMO ===");
    console.log("Demonstrating that Library maintains single instance\\n");

    // Try to get multiple instances
    const library1 = Library.getInstance();
    const library2 = Library.getInstance();
    const library3 = Library.getInstance();

    console.log(
      `Library instance 1 === Library instance 2: ${library1 === library2}`,
    );
    console.log(
      `Library instance 2 === Library instance 3: ${library2 === library3}`,
    );
    console.log(
      `All instances point to the same object: ${library1 === library2 && library2 === library3}`,
    );

    console.log(
      "\\nSingleton Pattern verified - Only one Library instance exists\\n",
    );
  }

  private async demoFactoryPattern(): Promise<void> {
    console.log("=== FACTORY METHOD PATTERN DEMO ===");
    console.log("Creating different types of books using factories\\n");

    // Create different types of books using factories
    const physicalFactory = BookFactoryCreator.createFactory(BookType.PHYSICAL);
    const digitalFactory = BookFactoryCreator.createFactory(BookType.DIGITAL);
    const audioFactory = BookFactoryCreator.createFactory(BookType.AUDIO);

    // Physical books
    const physicalBooks = [
      physicalFactory.createBookWithId(
        this.library.generateBookId(),
        "The Great Gatsby",
        "F. Scott Fitzgerald",
        "Fiction",
        1925,
      ),
      physicalFactory.createBookWithId(
        this.library.generateBookId(),
        "To Kill a Mockingbird",
        "Harper Lee",
        "Fiction",
        1960,
      ),
      physicalFactory.createBookWithId(
        this.library.generateBookId(),
        "Clean Code",
        "Robert C. Martin",
        "Technology",
        2008,
      ),
    ];

    // Digital books
    const digitalBooks = [
      digitalFactory.createBookWithId(
        this.library.generateBookId(),
        "JavaScript: The Good Parts",
        "Douglas Crockford",
        "Technology",
        2008,
      ),
      digitalFactory.createBookWithId(
        this.library.generateBookId(),
        "Design Patterns",
        "Gang of Four",
        "Technology",
        1994,
      ),
      digitalFactory.createBookWithId(
        this.library.generateBookId(),
        "1984",
        "George Orwell",
        "Fiction",
        1949,
      ),
    ];

    // Audio books
    const audioBooks = [
      audioFactory.createBookWithId(
        this.library.generateBookId(),
        "Atomic Habits",
        "James Clear",
        "Self-Help",
        2018,
      ),
      audioFactory.createBookWithId(
        this.library.generateBookId(),
        "Sapiens",
        "Yuval Noah Harari",
        "History",
        2011,
      ),
      audioFactory.createBookWithId(
        this.library.generateBookId(),
        "The Lean Startup",
        "Eric Ries",
        "Business",
        2011,
      ),
    ];

    // Add all books to library
    [...physicalBooks, ...digitalBooks, ...audioBooks].forEach((book) => {
      this.library.addBook(book);
    });

    // Display book details
    console.log("Created books with different factories:");
    this.library
      .getAllBooks()
      .slice(-3)
      .forEach((book) => {
        if (
          "getBookDetails" in book &&
          typeof book.getBookDetails === "function"
        ) {
          console.log((book as any).getBookDetails());
          console.log("");
        }
      });

    console.log(
      "Factory Method Pattern demonstrated - Different book types created\\n",
    );
  }

  private async demoObserverPattern(): Promise<void> {
    console.log("=== OBSERVER PATTERN DEMO ===");
    console.log("Setting up observers for library events\\n");

    // Create observers
    const libraryStaff = new LibraryStaff(
      "S1",
      "Nguyễn Thị Linh",
      "Circulation",
    );
    const notificationService = new MemberNotificationService();
    const systemAdmin = new SystemAdministrator();
    const inventoryManager = new InventoryManager();

    // Subscribe observers to library
    this.library.subscribe(libraryStaff);
    this.library.subscribe(notificationService);
    this.library.subscribe(systemAdmin);
    this.library.subscribe(inventoryManager);

    // Setup member notifications
    notificationService.enableNewBookNotification("U1", "an.nguyen@email.com");
    notificationService.subscribeForGenre(
      "U2",
      "Fiction",
      "binh.tran@email.com",
    );
    notificationService.subscribeForGenre(
      "U3",
      "Technology",
      "cuong.le@email.com",
    );

    console.log("\\nAdding a new book to trigger observer notifications:\\n");

    // Add a new book (will trigger notifications)
    const newBookFactory = BookFactoryCreator.createFactory(BookType.DIGITAL);
    const newBook = newBookFactory.createBookWithId(
      this.library.generateBookId(),
      "React Patterns",
      "Michael Chan",
      "Technology",
      2023,
    );

    this.library.addBook(newBook);

    console.log("\\nObserver Pattern demonstrated - All observers notified\\n");
  }

  private async demoStrategyPattern(): Promise<void> {
    console.log("=== STRATEGY PATTERN DEMO ===");
    console.log("Demonstrating different search strategies\\n");

    const allBooks = this.library.getAllBooks();

    // Search by Title
    console.log("1. Search by Title Strategy:");
    this.searchContext.setStrategy(SearchStrategyFactory.getStrategy("title"));
    let results = this.searchContext.search(allBooks, "Gatsby");
    this.displaySearchResults(results);

    // Search by Author
    console.log("\\n2. Search by Author Strategy:");
    this.searchContext.setStrategy(SearchStrategyFactory.getStrategy("author"));
    results = this.searchContext.search(allBooks, "Martin");
    this.displaySearchResults(results);

    // Search by Genre
    console.log("\\n3. Search by Genre Strategy:");
    this.searchContext.setStrategy(SearchStrategyFactory.getStrategy("genre"));
    results = this.searchContext.search(allBooks, "Technology");
    this.displaySearchResults(results);

    // Fuzzy Search
    console.log("\\n4. Fuzzy Search Strategy:");
    this.searchContext.setStrategy(SearchStrategyFactory.getStrategy("fuzzy"));
    results = this.searchContext.search(allBooks, "pattrn"); // Intentional typo
    this.displaySearchResults(results);

    // Advanced Search Builder
    console.log("\\n5. Advanced Search Builder:");
    const advancedResults = new AdvancedSearchBuilder()
      .byGenre("Technology")
      .byYearRange(2000, 2025)
      .onlyAvailable()
      .search(allBooks);

    console.log(
      `Advanced search results: ${advancedResults.length} books found`,
    );
    this.displaySearchResults(advancedResults);

    console.log(
      "\\nStrategy Pattern demonstrated - Multiple search strategies\\n",
    );
  }

  private displaySearchResults(books: any[]): void {
    if (books.length === 0) {
      console.log("   No books found");
      return;
    }

    books.forEach((book) => {
      console.log(
        `   "${book.title}" by ${book.author} (${book.genre}, ${book.publishYear})`,
      );
    });
  }

  private async demoDecoratorPattern(): Promise<void> {
    console.log("=== DECORATOR PATTERN DEMO ===");
    console.log("Demonstrating enhanced borrowing services\\n");

    // Basic borrowing service
    console.log("1. Basic Borrowing Service:");
    const basicService = new BorrowServiceBuilder().build();
    console.log(`   Description: ${basicService.getDescription()}`);
    console.log(`   Cost: ${basicService.getCost().toLocaleString()} VND\\n`);

    // Enhanced borrowing with multiple decorators
    console.log("2. Premium Borrowing Service (Multiple Decorators):");
    const premiumService = new BorrowServiceBuilder()
      .withExtendedPeriod(30, 10000)
      .withPriority("high")
      .withDigitalAccess("premium")
      .withInsurance("comprehensive")
      .withHomeDelivery("123 Main St, Ho Chi Minh City", "express")
      .build();

    const preview = new BorrowServiceBuilder()
      .withExtendedPeriod(30, 10000)
      .withPriority("high")
      .withDigitalAccess("premium")
      .withInsurance("comprehensive")
      .withHomeDelivery("123 Main St, Ho Chi Minh City", "express")
      .getPreview();

    console.log(`   Description: ${preview.description}`);
    console.log(`   Total Cost: ${preview.totalCost.toLocaleString()} VND\\n`);

    // Predefined packages
    console.log("3. Predefined Service Packages:");

    const studentPackage = BorrowServicePackages.createStudentPackage();
    console.log(`   Student Package: ${studentPackage.getDescription()}`);
    console.log(`   Cost: ${studentPackage.getCost().toLocaleString()} VND`);

    const accessibilityPackage =
      BorrowServicePackages.createAccessibilityPackage();
    console.log(
      `   Accessibility Package: ${accessibilityPackage.getDescription()}`,
    );
    console.log(
      `   Cost: ${accessibilityPackage.getCost().toLocaleString()} VND\\n`,
    );

    // Demonstrate actual borrowing with decorators
    console.log("4. Actual Borrowing Transaction:");
    const availableBook = this.library.getAvailableBooks()[0];
    if (availableBook) {
      console.log(
        `\\nBorrowing "${availableBook.title}" with premium service:\\n`,
      );
      const transaction = premiumService.borrowBook(availableBook.id, "U1");
      console.log(`\\nTransaction ID: ${transaction.id}`);
      console.log(
        `Total Service Cost: ${premiumService.getCost().toLocaleString()} VND`,
      );
    }

    console.log(
      "\\nDecorator Pattern demonstrated - Enhanced borrowing services\\n",
    );
  }

  private async demoAdvancedFeatures(): Promise<void> {
    console.log("=== ADVANCED FEATURES DEMO ===");
    console.log("Demonstrating system integration and statistics\\n");

    // Borrow some books to create activity
    const users = this.library.getAllUsers();
    const availableBooks = this.library.getAvailableBooks();

    if (users.length > 0 && availableBooks.length > 0) {
      console.log("Creating borrowing activity:\\n");

      // Borrow a few books
      try {
        this.library.borrowBook(availableBooks[0].id, users[0].id, 14);
        if (availableBooks.length > 1) {
          this.library.borrowBook(availableBooks[1].id, users[1].id, 7);
        }
      } catch (error) {
        console.log(`Error borrowing books: ${error}`);
      }
    }

    // Display library statistics
    console.log("\\nLibrary Statistics:");
    const stats = this.library.getLibraryStats();
    console.log(`   Total Books: ${stats.totalBooks}`);
    console.log(`   Available Books: ${stats.availableBooks}`);
    console.log(`   Borrowed Books: ${stats.borrowedBooks}`);
    console.log(`   Total Users: ${stats.totalUsers}`);

    // Multiple search strategies comparison
    console.log("\\nSearch Strategy Comparison:");
    const searchTerm = "JavaScript";
    const strategies = ["title", "author", "advanced", "fuzzy"];
    const allBooks = this.library.getAllBooks();

    strategies.forEach((strategyType) => {
      const strategy = SearchStrategyFactory.getStrategy(strategyType);
      const results = strategy.search(allBooks, searchTerm);
      console.log(`   ${strategy.getSearchType()}: ${results.length} results`);
    });

    console.log("\\nAdvanced features demonstrated\\n");
  }
}

// Main execution function
export async function runLibraryDemo(): Promise<void> {
  const demo = new LibraryManagementDemo();
  await demo.runFullDemo();
}

// Execute demo if this file is run directly
if (require.main === module) {
  runLibraryDemo().catch(console.error);
}
