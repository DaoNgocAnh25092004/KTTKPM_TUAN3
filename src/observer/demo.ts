import { Stock } from "./Stock";
import { Investor } from "./Investor";
import { Task } from "./Task";
import { TeamMember } from "./TeamMember";

console.log("=".repeat(70));
console.log("OBSERVER PATTERN - STOCK MARKET EXAMPLE");
console.log("=".repeat(70));

// Tạo cổ phiếu
const appleStock = new Stock("AAPL", 150);
const teslaStock = new Stock("TSLA", 200);

// Tạo các nhà đầu tư
const investor1 = new Investor("Nguyễn Văn A");
const investor2 = new Investor("Trần Thị B");
const investor3 = new Investor("Lê Văn C");

console.log("\n1. Đăng ký nhà đầu tư theo dõi cổ phiếu:");
console.log("-".repeat(70));
appleStock.attach(investor1);
appleStock.attach(investor2);
teslaStock.attach(investor2);
teslaStock.attach(investor3);

console.log("\n2. Thay đổi giá cổ phiếu AAPL:");
console.log("-".repeat(70));
appleStock.setPrice(160); // Tăng 6.67%

console.log("\n3. Thay đổi giá cổ phiếu TSLA:");
console.log("-".repeat(70));
teslaStock.setPrice(185); // Giảm 7.5%

console.log("\n4. Nhà đầu tư B hủy theo dõi AAPL:");
console.log("-".repeat(70));
appleStock.detach(investor2);

console.log("\n5. Thay đổi giá AAPL lần nữa (chỉ investor1 nhận thông báo):");
console.log("-".repeat(70));
appleStock.setPrice(165);

console.log("\n6. Thêm nhà đầu tư mới theo dõi TSLA:");
console.log("-".repeat(70));
teslaStock.attach(investor1);
teslaStock.setPrice(195);

// ============================================
// TASK MANAGEMENT EXAMPLE
// ============================================

console.log("\n\n");
console.log("=".repeat(70));
console.log("OBSERVER PATTERN - TASK MANAGEMENT EXAMPLE");
console.log("=".repeat(70));

// Tạo task
const feature1 = new Task(
  "Implement Login Feature",
  "TODO",
  "Unassigned",
  "Create login page with authentication",
);

const bugFix1 = new Task(
  "Fix Payment Bug",
  "TODO",
  "Unassigned",
  "Payment gateway returning error 500",
);

// Tạo các thành viên nhóm
const pm = new TeamMember("Alice", "Project Manager", "alice@company.com");
const dev1 = new TeamMember("Bob", "Developer", "bob@company.com");
const dev2 = new TeamMember("Charlie", "Developer", "charlie@company.com");
const qa = new TeamMember("Diana", "QA", "diana@company.com");
const teamLead = new TeamMember("Eve", "Team Lead", "eve@company.com");

console.log("\n1. Đăng ký thành viên theo dõi tasks:");
console.log("-".repeat(70));
// PM theo dõi tất cả tasks
feature1.attach(pm);
feature1.attach(teamLead);
bugFix1.attach(pm);
bugFix1.attach(teamLead);

console.log("\n2. Gán task cho developer:");
console.log("-".repeat(70));
feature1.attach(dev1);
feature1.setAssignee("Bob");

console.log("\n3. Developer bắt đầu làm việc:");
console.log("-".repeat(70));
feature1.setStatus("IN_PROGRESS");

console.log("\n4. Developer hoàn thành và chuyển sang review:");
console.log("-".repeat(70));
feature1.attach(qa); // QA bắt đầu theo dõi
feature1.setStatus("REVIEW");

console.log("\n5. QA approve và task hoàn thành:");
console.log("-".repeat(70));
feature1.setStatus("DONE");

console.log("\n6. Bug fix task bị blocked:");
console.log("-".repeat(70));
bugFix1.attach(dev2);
bugFix1.setAssignee("Charlie");
bugFix1.setStatus("IN_PROGRESS");
bugFix1.setStatus("BLOCKED"); // Gặp vấn đề, cần hỗ trợ

console.log("\n7. Team Lead can thiệp và unblock:");
console.log("-".repeat(70));
bugFix1.attach(dev1); // Thêm Bob để hỗ trợ
bugFix1.setStatus("IN_PROGRESS");

// ============================================
// REAL-TIME NOTIFICATION DEMO
// ============================================

console.log("\n\n");
console.log("=".repeat(70));
console.log("DEMO: REAL-TIME NOTIFICATION SYSTEM");
console.log("=".repeat(70));

// Tạo một task với nhiều thành viên
const urgentTask = new Task(
  "Critical Security Patch",
  "TODO",
  "Unassigned",
  "Fix XSS vulnerability in user input",
);

// Tất cả đều theo dõi task quan trọng này
urgentTask.attach(pm);
urgentTask.attach(dev1);
urgentTask.attach(dev2);
urgentTask.attach(qa);
urgentTask.attach(teamLead);

console.log("\n8. Task khẩn cấp được tạo và gán:");
console.log("-".repeat(70));
urgentTask.setAssignee("Bob");
urgentTask.setStatus("IN_PROGRESS");

console.log("\n9. Cập nhật mô tả task:");
console.log("-".repeat(70));
urgentTask.setDescription("Added: Also fix CSRF vulnerability");

console.log("\n10. Task hoàn thành:");
console.log("-".repeat(70));
urgentTask.setStatus("DONE");

console.log("\n");
console.log("=".repeat(70));
console.log("KẾT LUẬN:");
console.log("Observer Pattern cho phép các đối tượng tự động nhận thông báo");
console.log("khi trạng thái của Subject thay đổi, hỗ trợ loose coupling và");
console.log("broadcast communication hiệu quả.");
console.log("=".repeat(70));
