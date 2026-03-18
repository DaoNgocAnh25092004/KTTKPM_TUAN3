import { Subject, Observer } from "./interfaces";

/**
 * Concrete Subject - Cổ phiếu
 * Khi giá cổ phiếu thay đổi, tất cả nhà đầu tư đăng ký sẽ được thông báo
 */
export class Stock implements Subject {
  private observers: Observer[] = [];
  private symbol: string;
  private price: number;
  private previousPrice: number;

  constructor(symbol: string, initialPrice: number) {
    this.symbol = symbol;
    this.price = initialPrice;
    this.previousPrice = initialPrice;
  }

  /**
   * Đăng ký một observer
   */
  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log(`Stock ${this.symbol}: Observer đã được đăng ký trước đó.`);
      return;
    }

    this.observers.push(observer);
    console.log(`Stock ${this.symbol}: Đã đăng ký observer mới.`);
  }

  /**
   * Hủy đăng ký một observer
   */
  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log(`Stock ${this.symbol}: Observer không tồn tại.`);
      return;
    }

    this.observers.splice(observerIndex, 1);
    console.log(`Stock ${this.symbol}: Đã hủy đăng ký observer.`);
  }

  /**
   * Thông báo cho tất cả observers về sự thay đổi
   */
  public notify(): void {
    console.log(`Stock ${this.symbol}: Đang thông báo cho các observers...`);
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Thay đổi giá cổ phiếu và thông báo cho observers
   */
  public setPrice(price: number): void {
    this.previousPrice = this.price;
    this.price = price;
    console.log(
      `\nStock ${this.symbol}: Giá thay đổi từ $${this.previousPrice} -> $${this.price}`,
    );
    this.notify();
  }

  /**
   * Lấy giá hiện tại
   */
  public getPrice(): number {
    return this.price;
  }

  /**
   * Lấy giá trước đó
   */
  public getPreviousPrice(): number {
    return this.previousPrice;
  }

  /**
   * Lấy mã cổ phiếu
   */
  public getSymbol(): string {
    return this.symbol;
  }

  /**
   * Tính % thay đổi giá
   */
  public getPriceChange(): number {
    if (this.previousPrice === 0) return 0;
    return ((this.price - this.previousPrice) / this.previousPrice) * 100;
  }
}
