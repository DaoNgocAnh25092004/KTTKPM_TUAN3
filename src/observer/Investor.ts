import { Observer, Subject } from "./interfaces";
import { Stock } from "./Stock";

/**
 * Concrete Observer - Nhà đầu tư
 * Nhận thông báo khi giá cổ phiếu thay đổi
 */
export class Investor implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Được gọi khi Stock (Subject) thay đổi
   */
  public update(subject: Subject): void {
    if (subject instanceof Stock) {
      const priceChange = subject.getPriceChange();
      const trend =
        priceChange > 0
          ? "📈 TĂNG"
          : priceChange < 0
            ? "📉 GIẢM"
            : "➡️ KHÔNG ĐỔI";

      console.log(
        `  👤 ${this.name} nhận thông báo: ` +
          `${subject.getSymbol()} = $${subject.getPrice()} ` +
          `(${trend} ${Math.abs(priceChange).toFixed(2)}%)`,
      );

      // Logic quyết định mua/bán
      if (priceChange > 5) {
        console.log(`    → ${this.name}: Cân nhắc BÁN để chốt lời!`);
      } else if (priceChange < -5) {
        console.log(`    → ${this.name}: Cơ hội MUA khi giá giảm!`);
      }
    }
  }

  public getName(): string {
    return this.name;
  }
}
