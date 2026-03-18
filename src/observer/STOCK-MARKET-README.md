# Observer Pattern - Stock Market Monitoring System

## Mô tả bài toán

> **"Khi giá của một cổ phiếu thay đổi, các nhà đầu tư đã đăng ký để theo dõi cổ phiếu đó sẽ nhận thông báo ngay lập tức về sự thay đổi."**

Đây là một ứng dụng điển hình của **Observer Design Pattern** trong hệ thống tài chính.

## Sơ đồ UML

![Observer Pattern - Stock Market](../../images/observer.png)

### Class Diagram

```
┌─────────────────┐         ┌──────────────────┐
│   <<interface>> │         │   <<interface>>  │
│     Subject     │         │     Observer     │
├─────────────────┤         ├──────────────────┤
│ +attach()       │         │ +update()        │
│ +detach()       │         │                  │
│ +notify()       │         │                  │
└────────▲────────┘         └────────▲─────────┘
         │                           │
         │                           │
    ┌────┴─────┐              ┌─────┴──────┐
    │  Stock   │              │  Investor  │
    ├──────────┤              ├────────────┤
    │ -symbol  │              │ -name      │
    │ -price   │              │            │
    │ -observers[]            │            │
    ├──────────┤              ├────────────┤
    │ +setPrice()             │ +update()  │
    │ +getPrice()             │            │
    └──────────┘              └────────────┘
         │                           │
         └─────── notifies ──────────┘
                  (1:*)
```

## Thành phần chính

### 1. Subject Interface
- **Trách nhiệm**: Quản lý danh sách observers
- **Methods**:
  - `attach(observer)`: Đăng ký observer mới
  - `detach(observer)`: Hủy đăng ký observer
  - `notify()`: Thông báo cho tất cả observers

### 2. Observer Interface
- **Trách nhiệm**: Nhận thông báo từ Subject
- **Methods**:
  - `update(subject)`: Được gọi khi Subject thay đổi

### 3. Stock (Concrete Subject)
- **Trách nhiệm**: Lưu trữ thông tin cổ phiếu và thông báo khi giá thay đổi
- **Attributes**:
  - `symbol`: Mã cổ phiếu (AAPL, TSLA, etc.)
  - `price`: Giá hiện tại
  - `previousPrice`: Giá trước đó
  - `observers[]`: Danh sách nhà đầu tư đang theo dõi
- **Methods**:
  - `setPrice(newPrice)`: Cập nhật giá và thông báo observers
  - `getPrice()`: Lấy giá hiện tại
  - `getPriceChange()`: Tính % thay đổi giá

### 4. Investor (Concrete Observer)
- **Trách nhiệm**: Nhận thông báo và phản ứng với thay đổi giá
- **Attributes**:
  - `name`: Tên nhà đầu tư
- **Methods**:
  - `update(stock)`: Xử lý thông báo thay đổi giá

## Kịch bản sử dụng

### Scenario 1: Theo dõi một cổ phiếu

```typescript
// 1. Tạo cổ phiếu
const appleStock = new Stock('AAPL', 150);

// 2. Tạo nhà đầu tư
const investor1 = new Investor('Nguyễn Văn A');
const investor2 = new Investor('Trần Thị B');

// 3. Đăng ký theo dõi
appleStock.attach(investor1);
appleStock.attach(investor2);

// 4. Giá thay đổi → Tất cả nhà đầu tư nhận thông báo
appleStock.setPrice(160); // Tăng 6.67%

// Output:
// 📊 Stock AAPL: Giá thay đổi từ $150 → $160
// Stock AAPL: Đang thông báo cho các observers...
//   👤 Nguyễn Văn A nhận thông báo: AAPL = $160 (📈 TĂNG 6.67%)
//     → Nguyễn Văn A: Cân nhắc BÁN để chốt lời!
//   👤 Trần Thị B nhận thông báo: AAPL = $160 (📈 TĂNG 6.67%)
//     → Trần Thị B: Cân nhắc BÁN để chốt lời!
```

### Scenario 2: Hủy đăng ký theo dõi

```typescript
// Nhà đầu tư B hủy theo dõi
appleStock.detach(investor2);

// Giá thay đổi → Chỉ investor1 nhận thông báo
appleStock.setPrice(165);

// Output:
// 📊 Stock AAPL: Giá thay đổi từ $160 → $165
//   👤 Nguyễn Văn A nhận thông báo: AAPL = $165 (📈 TĂNG 3.13%)
```

### Scenario 3: Theo dõi nhiều cổ phiếu

```typescript
const investor = new Investor('Chuyên gia đầu tư');

const aapl = new Stock('AAPL', 150);
const tsla = new Stock('TSLA', 200);
const msft = new Stock('MSFT', 300);

// Đăng ký theo dõi tất cả
aapl.attach(investor);
tsla.attach(investor);
msft.attach(investor);

// Nhận thông báo từ tất cả các cổ phiếu
aapl.setPrice(155);
tsla.setPrice(210);
msft.setPrice(295);
```

### Scenario 4: Portfolio Manager

```typescript
class PortfolioManager implements Observer {
  private portfolio: Map<string, number> = new Map();

  update(subject: Subject): void {
    if (subject instanceof Stock) {
      // Cập nhật giá trong portfolio
      this.portfolio.set(subject.getSymbol(), subject.getPrice());

      // Tính tổng giá trị
      const totalValue = Array.from(this.portfolio.values())
        .reduce((sum, price) => sum + price, 0);

      console.log(`Tổng giá trị portfolio: $${totalValue}`);

      // Cảnh báo biến động lớn
      if (Math.abs(subject.getPriceChange()) > 10) {
        console.log('⚠️ CẢNH BÁO: Biến động lớn!');
      }
    }
  }
}
```

## Luồng hoạt động

```
1. Investor đăng ký theo dõi Stock
   ↓
2. Stock lưu Investor vào danh sách observers
   ↓
3. Giá cổ phiếu thay đổi
   ↓
4. Stock.setPrice() được gọi
   ↓
5. Stock tự động gọi notify()
   ↓
6. notify() duyệt qua tất cả observers
   ↓
7. Gọi update() cho mỗi investor
   ↓
8. Investor nhận thông báo và xử lý
   (log, email, SMS, auto-trading, etc.)
```

## Chạy Demo

### Demo đầy đủ (Stock + Task)
```bash
npm run start:observer
```

### Demo chỉ Stock Market
```bash
npm run start:stock
```

## Lợi ích của Observer Pattern

### 1. Real-time Notification
- ✅ Nhà đầu tư nhận thông báo **ngay lập tức** khi giá thay đổi
- ✅ Không cần polling liên tục (tốn tài nguyên)

### 2. Loose Coupling
- ✅ Stock không cần biết chi tiết về Investor
- ✅ Investor không cần biết Stock implement như thế nào
- ✅ Dễ dàng thêm/thay đổi logic của từng bên

### 3. Scalability
- ✅ Một Stock có thể có **nhiều** Investors
- ✅ Một Investor có thể theo dõi **nhiều** Stocks
- ✅ Dễ dàng thêm/xóa observers lúc runtime

### 4. Extensibility
- ✅ Dễ dàng thêm loại observer mới (Email Alert, SMS Alert, Auto Trading Bot)
- ✅ Không cần sửa code Stock khi thêm observer mới

## Ứng dụng thực tế

### 1. Trading Platforms
- **Bloomberg Terminal**: Hiển thị giá real-time
- **Robinhood, E*TRADE**: Push notifications khi giá thay đổi
- **TradingView**: Charts cập nhật real-time

### 2. Price Alert Systems
- Email alert khi giá đạt mức mong muốn
- SMS notification cho biến động lớn
- Mobile push notifications

### 3. Automated Trading Bots
- Bot tự động mua/bán khi giá đạt điều kiện
- High-frequency trading systems
- Algorithmic trading strategies

### 4. Portfolio Management
- Dashboard cập nhật real-time
- Risk management alerts
- Performance tracking

### 5. Market Analysis Tools
- Technical analysis indicators
- Volume tracking
- Market sentiment analysis

## Code Implementation

### Stock.ts (Subject)
```typescript
export class Stock implements Subject {
  private observers: Observer[] = [];
  private symbol: string;
  private price: number;

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  setPrice(price: number): void {
    this.previousPrice = this.price;
    this.price = price;
    this.notify(); // Tự động thông báo
  }
}
```

### Investor.ts (Observer)
```typescript
export class Investor implements Observer {
  private name: string;

  update(subject: Subject): void {
    if (subject instanceof Stock) {
      const price = subject.getPrice();
      const change = subject.getPriceChange();

      console.log(
        `${this.name}: ${subject.getSymbol()} = $${price} (${change}%)`
      );

      // Business logic
      if (change > 5) console.log('→ Cân nhắc BÁN');
      if (change < -5) console.log('→ Cơ hội MUA');
    }
  }
}
```

## Best Practices

### 1. Memory Management
```typescript
// ❌ BAD: Memory leak
investor = null; // Observer vẫn còn trong danh sách

// ✅ GOOD: Detach trước khi hủy
stock.detach(investor);
investor = null;
```

### 2. Error Handling
```typescript
notify(): void {
  for (const observer of this.observers) {
    try {
      observer.update(this);
    } catch (error) {
      console.error('Observer error:', error);
      // Không làm ảnh hưởng observers khác
    }
  }
}
```

### 3. Prevent Circular Notifications
```typescript
setPrice(price: number): void {
  if (this.price === price) return; // Tránh notify không cần thiết
  this.price = price;
  this.notify();
}
```

## Kết luận

Observer Pattern là giải pháp hoàn hảo cho bài toán Stock Market vì:

✅ **Phù hợp với yêu cầu**: "Nhà đầu tư nhận thông báo **ngay lập tức** khi giá thay đổi"

✅ **Mở rộng dễ dàng**: Thêm nhà đầu tư mới không ảnh hưởng code hiện tại

✅ **Real-time**: Không delay, không cần polling

✅ **Decoupling**: Stock và Investor độc lập với nhau

✅ **Production-ready**: Được sử dụng rộng rãi trong các hệ thống tài chính thực tế

## Tài liệu tham khảo

- [Observer Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/observer)
- [Design Patterns - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)
- [Observer Pattern in TypeScript](https://www.patterns.dev/posts/observer-pattern)
