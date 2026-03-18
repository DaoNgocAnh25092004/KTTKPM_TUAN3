/**
 * Adaptee - Hệ thống hiện tại chỉ hỗ trợ XML
 * Đây là service cần được adapt để làm việc với JSON
 */
export class XMLDataService {
  private xmlData: string;

  constructor(xmlData: string = "") {
    this.xmlData = xmlData;
  }

  /**
   * Xử lý dữ liệu XML
   */
  public processXML(xml: string): void {
    this.xmlData = xml;
    console.log("XMLDataService: Đã xử lý dữ liệu XML");
  }

  /**
   * Lấy dữ liệu XML
   */
  public getXML(): string {
    return this.xmlData;
  }

  /**
   * Validate XML format
   */
  public validateXML(): boolean {
    // Kiểm tra cơ bản xem có phải XML không
    return (
      this.xmlData.trim().startsWith("<") && this.xmlData.trim().endsWith(">")
    );
  }

  /**
   * In thông tin XML
   */
  public printXML(): void {
    console.log("--- XML Data ---");
    console.log(this.xmlData);
    console.log("--- End XML ---");
  }
}
