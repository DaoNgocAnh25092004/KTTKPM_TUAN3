# Bài thực hành tuần 3 - Design Patterns

## Mô tả

Triển khai hai Design Pattern phổ biến trong lập trình hướng đối tượng:

1. **Observer Pattern** - Hệ thống thông báo tự động (Stock Market & Task Management)
2. **Adapter Pattern** - Chuyển đổi dữ liệu JSON/XML

## Công nghệ sử dụng

- **Ngôn ngữ**: TypeScript
- **Runtime**: Node.js
- **Build tool**: TypeScript Compiler (tsc)
- **Package manager**: npm

## Cấu trúc thư mục

```
.
├── images/                     # Sơ đồ UML (PNG)
│   ├── observer.png           # Observer Pattern UML
│   └── adapter.png            # Adapter Pattern UML
│
├── diagrams/                   # PlantUML source files
│   ├── observer-class-diagram.puml
│   ├── observer-sequence-diagram.puml
│   ├── adapter-class-diagram.puml
│   └── adapter-sequence-diagram.puml
│
├── src/
│   ├── observer/               # Observer Pattern
│   │   ├── interfaces.ts
│   │   ├── Stock.ts
│   │   ├── Investor.ts
│   │   ├── Task.ts
│   │   ├── TeamMember.ts
│   │   ├── demo.ts
│   │   ├── stock-market-demo.ts    # Demo chi tiết Stock Market
│   │   └── STOCK-MARKET-README.md  # Tài liệu Stock Market
│   │
│   └── adapter/                # Adapter Pattern
│       ├── JSONService.ts
│       ├── XMLDataService.ts
│       ├── XMLToJSONAdapter.ts
│       └── demo.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

## Cài đặt

### 1. Clone hoặc tải project

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Build project (optional)

```bash
npm run build
```

## Chạy Demo

### Observer Pattern - Stock & Task Notification

**Demo đầy đủ (Stock Market + Task Management):**
```bash
npm run start:observer
```

**Demo chỉ Stock Market (Chi tiết 4 kịch bản):**
```bash
npm run start:stock
```

**Kết quả demo:**
- ✅ Hệ thống theo dõi giá cổ phiếu real-time
- ✅ Thông báo tự động cho nhà đầu tư khi giá thay đổi
- ✅ Quản lý trạng thái công việc
- ✅ Thông báo cho team members
- ✅ Portfolio management system
- ✅ Price alert & automated trading simulation

📖 **Tài liệu chi tiết Stock Market**: `src/observer/STOCK-MARKET-README.md`

### Adapter Pattern - JSON/XML Conversion

```bash
npm run start:adapter
```

**Kết quả demo:**

- Chuyển đổi JSON ↔ XML
- Tích hợp với hệ thống legacy
- Web service integration
- Configuration management
- Multiple data formats

## Chi tiết từng Pattern

### 1. Observer Pattern

**Vấn đề giải quyết:**

- Tạo mối quan hệ một-nhiều giữa các object
- Tự động thông báo khi object thay đổi trạng thái

**Ứng dụng:**

- Stock market monitoring
- Task/project management
- Event handling systems
- Pub/Sub messaging

**Thành phần chính:**

- `Subject` - Interface cho object được theo dõi
- `Observer` - Interface cho object theo dõi
- `Stock/Task` - Concrete subjects
- `Investor/TeamMember` - Concrete observers

**File quan trọng:**

- Sơ đồ: `images/observer.png`
- Code: `src/observer/`

### 2. Adapter Pattern

**Vấn đề giải quyết:**

- Kết nối các interface không tương thích
- Tích hợp với hệ thống legacy hoặc third-party

**Ứng dụng:**

- Chuyển đổi JSON ↔ XML
- API integration
- Database migration
- Third-party service integration

**Thành phần chính:**

- `JSONService` - Target interface
- `XMLDataService` - Adaptee (service cần adapt)
- `XMLToJSONAdapter` - Adapter (cầu nối)

**File quan trọng:**

- Sơ đồ: `images/adapter.png`
- Code: `src/adapter/`

## Sơ đồ UML

### Observer Pattern

Sơ đồ UML cho Observer Pattern minh họa mối quan hệ giữa Subject và Observer, cách các đối tượng tự động nhận thông báo khi trạng thái thay đổi.

![Observer Pattern UML](images/observer.png)

**Các thành phần chính:**

- **Subject Interface**: Quản lý danh sách observers và thông báo khi có thay đổi
- **Observer Interface**: Nhận cập nhật từ Subject
- **Stock/Task**: Concrete Subjects lưu trữ trạng thái
- **Investor/TeamMember**: Concrete Observers phản ứng với thay đổi

### Adapter Pattern

Sơ đồ UML cho Adapter Pattern cho thấy cách Adapter kết nối giữa interface không tương thích (JSON và XML).

![Adapter Pattern UML](images/adapter.png)

**Các thành phần chính:**

- **JSONService**: Target interface mà Client mong đợi
- **XMLDataService**: Adaptee - service hiện tại chỉ hỗ trợ XML
- **XMLToJSONAdapter**: Adapter chuyển đổi giữa JSON và XML
- **Client**: Sử dụng JSONService interface

## Lợi ích của các Pattern

### Observer Pattern

Loose coupling giữa Subject và Observer
Dynamic relationships
Broadcast communication

### Adapter Pattern

Single Responsibility Principle
Open/Closed Principle
Tái sử dụng code legacy
Flexibility cao

## Best Practices

1. **Observer Pattern**
   - Luôn detach observer khi không cần để tránh memory leak
   - Cân nhắc weak references trong một số trường hợp
   - Xử lý circular dependencies cẩn thận

2. **Adapter Pattern**
   - Sử dụng thư viện chuẩn cho parsing (xml2js, fast-xml-parser)
   - Cache kết quả chuyển đổi nếu cần
   - Validate dữ liệu đầu vào và đầu ra

## Scripts có sẵn

```bash
# Build TypeScript sang JavaScript
npm run build

# Chạy demo Observer Pattern (đầy đủ)
npm run start:observer

# Chạy demo Stock Market (chi tiết 4 kịch bản)
npm run start:stock

# Chạy demo Adapter Pattern
npm run start:adapter

# Chạy bất kỳ file TypeScript nào
npm run dev <file-path>
```

## Ví dụ Output

### Observer Pattern Output

```
📊 Stock AAPL: Giá thay đổi từ $150 → $160
Stock AAPL: Đang thông báo cho các observers...
  👤 Nguyễn Văn A nhận thông báo: AAPL = $160 (📈 TĂNG 6.67%)
    → Nguyễn Văn A: Cân nhắc BÁN để chốt lời!
  ...
```

### Adapter Pattern Output

```
Adapter: Nhận dữ liệu JSON
Adapter: Đã chuyển đổi JSON → XML
XMLDataService: Đã xử lý dữ liệu XML
--- XML Data ---
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <user>
    <name>Nguyễn Văn A</name>
    ...
  </user>
</root>
--- End XML ---
```
