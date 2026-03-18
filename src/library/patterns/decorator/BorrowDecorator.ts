import { IBorrowService, IBorrowTransaction } from "../../interfaces";
import { BorrowTransaction } from "../../models";

/**
 * Decorator Pattern for Borrow Service
 * Cho phép mở rộng chức năng mượn sách mà không thay đổi code cơ bản
 */

// Base Borrow Service Implementation
export class BasicBorrowService implements IBorrowService {
  private baseCost: number = 0; // Free basic borrowing

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transactionId = `T${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days default

    const transaction = new BorrowTransaction(
      transactionId,
      bookId,
      userId,
      dueDate,
    );

    console.log(`Basic borrowing: Book ${bookId} for User ${userId}`);
    console.log(`   Due date: ${dueDate.toLocaleDateString()}`);

    return transaction;
  }

  public getDescription(): string {
    return "Basic book borrowing (14 days)";
  }

  public getCost(): number {
    return this.baseCost;
  }
}

// Abstract Decorator
export abstract class BorrowDecorator implements IBorrowService {
  protected borrowService: IBorrowService;

  constructor(borrowService: IBorrowService) {
    this.borrowService = borrowService;
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    return this.borrowService.borrowBook(bookId, userId);
  }

  public getDescription(): string {
    return this.borrowService.getDescription();
  }

  public getCost(): number {
    return this.borrowService.getCost();
  }
}

// Extended Period Decorator - Gia hạn thời gian mượn
export class ExtendedPeriodDecorator extends BorrowDecorator {
  private extraDays: number;
  private extraCost: number;

  constructor(
    borrowService: IBorrowService,
    extraDays: number = 14,
    extraCost: number = 5000,
  ) {
    super(borrowService);
    this.extraDays = extraDays;
    this.extraCost = extraCost;
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transaction = super.borrowBook(bookId, userId);

    // Extend due date
    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + this.extraDays);
    transaction.dueDate = newDueDate;

    console.log(
      `Extended period: +${this.extraDays} days (New due: ${newDueDate.toLocaleDateString()})`,
    );
    console.log(`Extra fee: ${this.extraCost.toLocaleString()} VND`);

    return transaction;
  }

  public getDescription(): string {
    return `${super.getDescription()} + Extended period (+${this.extraDays} days)`;
  }

  public getCost(): number {
    return super.getCost() + this.extraCost;
  }
}

// Priority Borrowing Decorator - Ưu tiên mượn sách
export class PriorityBorrowingDecorator extends BorrowDecorator {
  private priorityLevel: "standard" | "high" | "urgent";
  private priorityCost: number;

  constructor(
    borrowService: IBorrowService,
    priorityLevel: "standard" | "high" | "urgent" = "high",
  ) {
    super(borrowService);
    this.priorityLevel = priorityLevel;
    this.priorityCost = this.calculatePriorityCost();
  }

  private calculatePriorityCost(): number {
    switch (this.priorityLevel) {
      case "standard":
        return 0;
      case "high":
        return 10000;
      case "urgent":
        return 25000;
      default:
        return 0;
    }
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transaction = super.borrowBook(bookId, userId);

    console.log(
      `Priority borrowing: ${this.priorityLevel.toUpperCase()} level`,
    );
    if (this.priorityLevel !== "standard") {
      console.log(`   Skip waiting queue`);
      console.log(`   Notification when available`);
      console.log(`Priority fee: ${this.priorityCost.toLocaleString()} VND`);
    }

    return transaction;
  }

  public getDescription(): string {
    return `${super.getDescription()} + Priority borrowing (${this.priorityLevel})`;
  }

  public getCost(): number {
    return super.getCost() + this.priorityCost;
  }
}

// Special Edition Decorator - Phiên bản đặc biệt
export class SpecialEditionDecorator extends BorrowDecorator {
  private editionType:
    | "braille"
    | "large-print"
    | "translated"
    | "audio-enhanced";
  private specialCost: number;

  constructor(
    borrowService: IBorrowService,
    editionType: "braille" | "large-print" | "translated" | "audio-enhanced",
  ) {
    super(borrowService);
    this.editionType = editionType;
    this.specialCost = this.calculateSpecialCost();
  }

  private calculateSpecialCost(): number {
    switch (this.editionType) {
      case "braille":
        return 15000;
      case "large-print":
        return 8000;
      case "translated":
        return 12000;
      case "audio-enhanced":
        return 20000;
      default:
        return 0;
    }
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transaction = super.borrowBook(bookId, userId);

    console.log(`Special edition: ${this.getEditionDescription()}`);
    console.log(`   Special handling required`);
    console.log(`   Special checkout process`);
    console.log(
      `Special edition fee: ${this.specialCost.toLocaleString()} VND`,
    );

    return transaction;
  }

  private getEditionDescription(): string {
    switch (this.editionType) {
      case "braille":
        return "Braille version (visually impaired support)";
      case "large-print":
        return "Large print version (easy reading)";
      case "translated":
        return "Translated version (multiple languages)";
      case "audio-enhanced":
        return "Audio-enhanced version (with narration)";
      default:
        return this.editionType;
    }
  }

  public getDescription(): string {
    return `${super.getDescription()} + Special edition (${this.editionType})`;
  }

  public getCost(): number {
    return super.getCost() + this.specialCost;
  }
}

// Digital Access Decorator - Truy cập số
export class DigitalAccessDecorator extends BorrowDecorator {
  private accessLevel: "basic" | "premium" | "unlimited";
  private digitalCost: number;

  constructor(
    borrowService: IBorrowService,
    accessLevel: "basic" | "premium" | "unlimited" = "basic",
  ) {
    super(borrowService);
    this.accessLevel = accessLevel;
    this.digitalCost = this.calculateDigitalCost();
  }

  private calculateDigitalCost(): number {
    switch (this.accessLevel) {
      case "basic":
        return 5000;
      case "premium":
        return 15000;
      case "unlimited":
        return 30000;
      default:
        return 0;
    }
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transaction = super.borrowBook(bookId, userId);

    console.log(`Digital access: ${this.accessLevel.toUpperCase()} level`);
    this.printDigitalFeatures();
    console.log(`Digital access fee: ${this.digitalCost.toLocaleString()} VND`);

    return transaction;
  }

  private printDigitalFeatures(): void {
    console.log(`   Mobile app access`);

    switch (this.accessLevel) {
      case "basic":
        console.log(`   PDF download (3 days)`);
        break;
      case "premium":
        console.log(`   Multiple format downloads`);
        console.log(`   Audio version included`);
        console.log(`   Note-taking features`);
        break;
      case "unlimited":
        console.log(`   All formats + offline sync`);
        console.log(`   Professional narration`);
        console.log(`   Advanced annotation tools`);
        console.log(`   Enhanced search & highlights`);
        break;
    }
  }

  public getDescription(): string {
    return `${super.getDescription()} + Digital access (${this.accessLevel})`;
  }

  public getCost(): number {
    return super.getCost() + this.digitalCost;
  }
}

// Insurance Decorator - Bảo hiểm
export class InsuranceDecorator extends BorrowDecorator {
  private insuranceType: "basic" | "comprehensive" | "premium";
  private insuranceCost: number;

  constructor(
    borrowService: IBorrowService,
    insuranceType: "basic" | "comprehensive" | "premium" = "basic",
  ) {
    super(borrowService);
    this.insuranceType = insuranceType;
    this.insuranceCost = this.calculateInsuranceCost();
  }

  private calculateInsuranceCost(): number {
    switch (this.insuranceType) {
      case "basic":
        return 3000;
      case "comprehensive":
        return 8000;
      case "premium":
        return 15000;
      default:
        return 0;
    }
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transaction = super.borrowBook(bookId, userId);

    console.log(`Insurance: ${this.insuranceType.toUpperCase()} coverage`);
    this.printInsuranceCoverage();
    console.log(`Insurance fee: ${this.insuranceCost.toLocaleString()} VND`);

    return transaction;
  }

  private printInsuranceCoverage(): void {
    console.log(`   Damage protection`);

    switch (this.insuranceType) {
      case "basic":
        console.log(`   Basic water damage coverage`);
        break;
      case "comprehensive":
        console.log(`   Water & fire damage coverage`);
        console.log(`   Lost book replacement`);
        break;
      case "premium":
        console.log(`   Full damage coverage`);
        console.log(`   Lost/stolen book replacement`);
        console.log(`   Home delivery protection`);
        console.log(`   Late fee forgiveness (1 time)`);
        break;
    }
  }

  public getDescription(): string {
    return `${super.getDescription()} + Insurance (${this.insuranceType})`;
  }

  public getCost(): number {
    return super.getCost() + this.insuranceCost;
  }
}

// Home Delivery Decorator - Giao hàng tận nhà
export class HomeDeliveryDecorator extends BorrowDecorator {
  private deliveryType: "standard" | "express" | "same-day";
  private deliveryCost: number;
  private address: string;

  constructor(
    borrowService: IBorrowService,
    address: string,
    deliveryType: "standard" | "express" | "same-day" = "standard",
  ) {
    super(borrowService);
    this.address = address;
    this.deliveryType = deliveryType;
    this.deliveryCost = this.calculateDeliveryCost();
  }

  private calculateDeliveryCost(): number {
    switch (this.deliveryType) {
      case "standard":
        return 20000;
      case "express":
        return 40000;
      case "same-day":
        return 80000;
      default:
        return 0;
    }
  }

  public borrowBook(bookId: string, userId: string): IBorrowTransaction {
    const transaction = super.borrowBook(bookId, userId);

    console.log(`Home delivery: ${this.deliveryType.toUpperCase()}`);
    console.log(`   Address: ${this.address}`);
    console.log(`   ${this.getDeliveryInfo()}`);
    console.log(`Delivery fee: ${this.deliveryCost.toLocaleString()} VND`);

    return transaction;
  }

  private getDeliveryInfo(): string {
    switch (this.deliveryType) {
      case "standard":
        return "Delivery in 2-3 business days";
      case "express":
        return "Next business day delivery";
      case "same-day":
        return "Same day delivery (order before 2 PM)";
      default:
        return this.deliveryType;
    }
  }

  public getDescription(): string {
    return `${super.getDescription()} + Home delivery (${this.deliveryType})`;
  }

  public getCost(): number {
    return super.getCost() + this.deliveryCost;
  }
}

/**
 * Borrow Service Builder - Xây dựng service với nhiều decorator
 */
export class BorrowServiceBuilder {
  private service: IBorrowService;

  constructor() {
    this.service = new BasicBorrowService();
  }

  public withExtendedPeriod(
    extraDays: number = 14,
    extraCost: number = 5000,
  ): BorrowServiceBuilder {
    this.service = new ExtendedPeriodDecorator(
      this.service,
      extraDays,
      extraCost,
    );
    return this;
  }

  public withPriority(
    level: "standard" | "high" | "urgent" = "high",
  ): BorrowServiceBuilder {
    this.service = new PriorityBorrowingDecorator(this.service, level);
    return this;
  }

  public withSpecialEdition(
    type: "braille" | "large-print" | "translated" | "audio-enhanced",
  ): BorrowServiceBuilder {
    this.service = new SpecialEditionDecorator(this.service, type);
    return this;
  }

  public withDigitalAccess(
    level: "basic" | "premium" | "unlimited" = "basic",
  ): BorrowServiceBuilder {
    this.service = new DigitalAccessDecorator(this.service, level);
    return this;
  }

  public withInsurance(
    type: "basic" | "comprehensive" | "premium" = "basic",
  ): BorrowServiceBuilder {
    this.service = new InsuranceDecorator(this.service, type);
    return this;
  }

  public withHomeDelivery(
    address: string,
    type: "standard" | "express" | "same-day" = "standard",
  ): BorrowServiceBuilder {
    this.service = new HomeDeliveryDecorator(this.service, address, type);
    return this;
  }

  public build(): IBorrowService {
    return this.service;
  }

  public getPreview(): { description: string; totalCost: number } {
    return {
      description: this.service.getDescription(),
      totalCost: this.service.getCost(),
    };
  }
}

/**
 * Predefined Service Packages - Các gói dịch vụ định sẵn
 */
export class BorrowServicePackages {
  public static createStudentPackage(): IBorrowService {
    return new BorrowServiceBuilder()
      .withExtendedPeriod(21, 0) // Free extended period for students
      .withDigitalAccess("basic")
      .build();
  }

  public static createPremiumPackage(): IBorrowService {
    return new BorrowServiceBuilder()
      .withExtendedPeriod(30, 3000)
      .withPriority("high")
      .withDigitalAccess("premium")
      .withInsurance("comprehensive")
      .build();
  }

  public static createAccessibilityPackage(): IBorrowService {
    return new BorrowServiceBuilder()
      .withExtendedPeriod(28, 0) // Free extended for accessibility needs
      .withSpecialEdition("braille")
      .withHomeDelivery("User Address", "express")
      .withInsurance("premium")
      .build();
  }

  public static createConveniencePackage(address: string): IBorrowService {
    return new BorrowServiceBuilder()
      .withPriority("standard")
      .withDigitalAccess("basic")
      .withHomeDelivery(address, "standard")
      .withInsurance("basic")
      .build();
  }
}
