import { JSONService } from "./JSONService";
import { XMLDataService } from "./XMLDataService";
import { XMLToJSONAdapter } from "./XMLToJSONAdapter";

console.log("=".repeat(70));
console.log("ADAPTER PATTERN - JSON/XML CONVERSION EXAMPLE");
console.log("=".repeat(70));

/**
 * Client function - Chỉ làm việc với JSON interface
 */
function processUserData(service: JSONService, userData: object): void {
  console.log("\nClient: Gửi dữ liệu JSON đến service...");
  service.processJSON(userData);

  console.log("\nClient: Lấy dữ liệu JSON từ service...");
  const data = service.getJSON();
  console.log("Client: Đã nhận dữ liệu:");
  console.log(JSON.stringify(data, null, 2));
}

// ============================================
// SCENARIO 1: Sử dụng Adapter với XML Service
// ============================================

console.log("\n1. SCENARIO: Tích hợp với hệ thống XML legacy");
console.log("-".repeat(70));

// Tạo XML service (hệ thống cũ chỉ hỗ trợ XML)
const xmlService = new XMLDataService();

// Tạo adapter để client có thể làm việc với XML service qua JSON interface
const adapter = new XMLToJSONAdapter(xmlService);

// Dữ liệu người dùng dạng JSON
const user1 = {
  user: {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    age: 30,
    address: {
      street: "123 Đường ABC",
      city: "Hà Nội",
      country: "Việt Nam",
    },
  },
};

// Client sử dụng adapter như một JSON service
processUserData(adapter, user1);

console.log("\n2. Kiểm tra dữ liệu XML bên trong:");
console.log("-".repeat(70));
adapter.getXMLService().printXML();

// ============================================
// SCENARIO 2: Web Service Integration
// ============================================

console.log("\n");
console.log("=".repeat(70));
console.log("SCENARIO 2: Web Service Integration");
console.log("=".repeat(70));

// Dịch vụ web yêu cầu JSON, nhưng backend chỉ hỗ trợ XML
const backendXMLService = new XMLDataService();
const webServiceAdapter = new XMLToJSONAdapter(backendXMLService);

// Dữ liệu sản phẩm
const product = {
  product: {
    id: "PROD-001",
    name: "Laptop Dell XPS 15",
    price: 1500,
    currency: "USD",
    specifications: {
      cpu: "Intel Core i7",
      ram: "16GB",
      storage: "512GB SSD",
      screen: "15.6 inch 4K",
    },
    inStock: true,
    categories: ["Electronics", "Computers", "Laptops"],
  },
};

console.log("\nWeb API: Gửi request với JSON payload...");
webServiceAdapter.processJSON(product);

console.log("\nBackend: Dữ liệu được lưu dưới dạng XML:");
backendXMLService.printXML();

console.log("\nWeb API: Lấy response dưới dạng JSON...");
const response = webServiceAdapter.getJSON();
console.log("Response:");
console.log(JSON.stringify(response, null, 2));

// ============================================
// SCENARIO 3: Multiple Data Formats
// ============================================

console.log("\n");
console.log("=".repeat(70));
console.log("SCENARIO 3: Xử lý nhiều định dạng dữ liệu");
console.log("=".repeat(70));

// Order data
const order = {
  order: {
    orderId: "ORD-2024-001",
    customer: "Trần Thị B",
    items: [
      {
        itemId: "ITEM-1",
        name: "Bàn phím cơ",
        quantity: 2,
        price: 50,
      },
      {
        itemId: "ITEM-2",
        name: "Chuột gaming",
        quantity: 1,
        price: 30,
      },
    ],
    totalAmount: 130,
    status: "processing",
  },
};

const orderService = new XMLToJSONAdapter(new XMLDataService());

console.log("\n3. Xử lý đơn hàng với cấu trúc phức tạp:");
console.log("-".repeat(70));
orderService.processJSON(order);

console.log("\nXML representation:");
orderService.getXMLService().printXML();

console.log("\nJSON representation:");
console.log(orderService.getData());

// ============================================
// SCENARIO 4: Configuration Management
// ============================================

console.log("\n");
console.log("=".repeat(70));
console.log("SCENARIO 4: Quản lý cấu hình hệ thống");
console.log("=".repeat(70));

const config = {
  application: {
    name: "E-Commerce Platform",
    version: "2.0.0",
    database: {
      host: "localhost",
      port: 5432,
      name: "ecommerce_db",
      username: "admin",
    },
    features: {
      enableCache: true,
      enableLogging: true,
      maxConnections: 100,
    },
  },
};

const configService = new XMLToJSONAdapter(new XMLDataService());

console.log("\n4. Lưu cấu hình (JSON → XML):");
console.log("-".repeat(70));
configService.processJSON(config);
configService.getXMLService().printXML();

console.log("\n5. Đọc cấu hình (XML → JSON):");
console.log("-".repeat(70));
const loadedConfig = configService.getJSON();
console.log(JSON.stringify(loadedConfig, null, 2));

// ============================================
// DEMO: Adapter Benefits
// ============================================

console.log("\n");
console.log("=".repeat(70));
console.log("LỢI ÍCH CỦA ADAPTER PATTERN");
console.log("=".repeat(70));

console.log(`
 Single Responsibility Principle:
   - Logic chuyển đổi tách biệt khỏi business logic

 Open/Closed Principle:
   - Có thể thêm adapter mới mà không thay đổi code hiện tại

 Flexibility:
   - Client code không phụ thuộc vào implementation cụ thể
   - Dễ dàng thay thế hoặc mở rộng adapter

 Reusability:
   - Có thể tái sử dụng code legacy mà không cần viết lại
   - Tích hợp với third-party services dễ dàng

 Maintainability:
   - Tập trung logic chuyển đổi ở một nơi
   - Dễ debug và test
`);

console.log("=".repeat(70));
console.log("USE CASES THỰC TẾ:");
console.log("=".repeat(70));

console.log(`
- API Integration:
   - Chuyển đổi giữa REST API (JSON) và SOAP API (XML)
   - Tích hợp với payment gateways có format khác nhau

- Legacy System Integration:
   - Kết nối hệ thống mới với hệ thống cũ
   - Migrate dần từ XML sang JSON

- Data Migration:
   - Chuyển đổi dữ liệu giữa các database khác nhau
   - Export/Import dữ liệu với nhiều format

- Third-party Services:
   - Tích hợp với các dịch vụ bên ngoài
   - Standardize data format trong microservices
`);

console.log("\n");
console.log("=".repeat(70));
