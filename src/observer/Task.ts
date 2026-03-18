import { Subject, Observer } from "./interfaces";

/**
 * Concrete Subject - Task (Công việc)
 * Khi trạng thái công việc thay đổi, các thành viên nhóm sẽ được thông báo
 */
export class Task implements Subject {
  private observers: Observer[] = [];
  private name: string;
  private status: string;
  private assignee: string;
  private description: string;

  constructor(
    name: string,
    status: string = "TODO",
    assignee: string = "Unassigned",
    description: string = "",
  ) {
    this.name = name;
    this.status = status;
    this.assignee = assignee;
    this.description = description;
  }

  /**
   * Đăng ký một observer
   */
  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log(`Task "${this.name}": Observer đã được đăng ký trước đó.`);
      return;
    }

    this.observers.push(observer);
    console.log(`Task "${this.name}": Đã đăng ký observer mới.`);
  }

  /**
   * Hủy đăng ký một observer
   */
  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log(`Task "${this.name}": Observer không tồn tại.`);
      return;
    }

    this.observers.splice(observerIndex, 1);
    console.log(`Task "${this.name}": Đã hủy đăng ký observer.`);
  }

  /**
   * Thông báo cho tất cả observers về sự thay đổi
   */
  public notify(): void {
    console.log(`Task "${this.name}": Đang thông báo cho các thành viên...`);
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Thay đổi trạng thái công việc
   */
  public setStatus(status: string): void {
    const oldStatus = this.status;
    this.status = status;
    console.log(`\nTask "${this.name}": ${oldStatus} → ${status}`);
    this.notify();
  }

  /**
   * Gán công việc cho người thực hiện
   */
  public setAssignee(assignee: string): void {
    const oldAssignee = this.assignee;
    this.assignee = assignee;
    console.log(
      `\n👷 Task "${this.name}": Gán từ "${oldAssignee}" → "${assignee}"`,
    );
    this.notify();
  }

  /**
   * Cập nhật mô tả công việc
   */
  public setDescription(description: string): void {
    this.description = description;
    console.log(`\nTask "${this.name}": Đã cập nhật mô tả`);
    this.notify();
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getStatus(): string {
    return this.status;
  }

  public getAssignee(): string {
    return this.assignee;
  }

  public getDescription(): string {
    return this.description;
  }

  /**
   * Lấy icon theo trạng thái
   */
  public getStatusIcon(): string {
    const icons: { [key: string]: string } = {
      TODO: "⏳",
      IN_PROGRESS: "🔄",
      REVIEW: "👀",
      DONE: "✅",
      BLOCKED: "🚫",
    };
    return icons[this.status] || "❓";
  }
}
