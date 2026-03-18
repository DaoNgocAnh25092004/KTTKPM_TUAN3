/**
 * Observer Interface
 * Định nghĩa phương thức update được gọi khi Subject thay đổi
 */
export interface Observer {
  update(subject: Subject): void;
}

/**
 * Subject Interface
 * Định nghĩa các phương thức để quản lý observers
 */
export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}
