import { Observer, Subject } from "./interfaces";
import { Task } from "./Task";

/**
 * Concrete Observer - Thành viên nhóm
 * Nhận thông báo khi trạng thái công việc thay đổi
 */
export class TeamMember implements Observer {
  private name: string;
  private role: string;
  private email: string;

  constructor(name: string, role: string, email: string = "") {
    this.name = name;
    this.role = role;
    this.email = email;
  }

  /**
   * Được gọi khi Task (Subject) thay đổi
   */
  public update(subject: Subject): void {
    if (subject instanceof Task) {
      const statusIcon = subject.getStatusIcon();

      console.log(`  👥 ${this.name} (${this.role}) nhận thông báo:`);
      console.log(
        `    ${statusIcon} Task: "${subject.getName()}" | ` +
          `Status: ${subject.getStatus()} | ` +
          `Assignee: ${subject.getAssignee()}`,
      );

      // Logic xử lý dựa trên role và status
      this.handleTaskUpdate(subject);
    }
  }

  /**
   * Xử lý logic dựa trên role của thành viên
   */
  private handleTaskUpdate(task: Task): void {
    const status = task.getStatus();
    const assignee = task.getAssignee();

    // Project Manager quan tâm đến tất cả thay đổi
    if (this.role === "Project Manager") {
      console.log(`    → ${this.name}: Cập nhật vào báo cáo tiến độ`);
    }

    // Developer quan tâm khi được gán task hoặc task ở trạng thái REVIEW
    if (this.role === "Developer") {
      if (assignee === this.name) {
        console.log(`    → ${this.name}: Đã nhận task mới, bắt đầu làm việc!`);
      }
      if (status === "BLOCKED") {
        console.log(`    → ${this.name}: Cần hỗ trợ để giải quyết block!`);
      }
    }

    // QA quan tâm khi task chuyển sang REVIEW
    if (this.role === "QA" && status === "REVIEW") {
      console.log(`    → ${this.name}: Bắt đầu review và test task!`);
    }

    // Team Lead quan tâm khi task DONE hoặc BLOCKED
    if (this.role === "Team Lead") {
      if (status === "DONE") {
        console.log(`    → ${this.name}: Great! Task hoàn thành.`);
      } else if (status === "BLOCKED") {
        console.log(`    → ${this.name}: Cần can thiệp để unblock task!`);
      }
    }
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getRole(): string {
    return this.role;
  }

  public getEmail(): string {
    return this.email;
  }
}
