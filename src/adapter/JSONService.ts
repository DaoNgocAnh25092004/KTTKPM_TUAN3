/**
 * Target Interface - Giao diện mà client mong đợi
 * Client muốn làm việc với JSON format
 */
export interface JSONService {
  processJSON(data: object): void;
  getJSON(): object;
  getData(): string;
}
