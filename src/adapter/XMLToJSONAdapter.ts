import { JSONService } from "./JSONService";
import { XMLDataService } from "./XMLDataService";

/**
 * Adapter - Chuyển đổi giữa JSON và XML
 * Cho phép XMLDataService làm việc với interface JSONService
 */
export class XMLToJSONAdapter implements JSONService {
  private xmlService: XMLDataService;
  private currentData: object = {};

  constructor(xmlService: XMLDataService) {
    this.xmlService = xmlService;
  }

  /**
   * Xử lý JSON bằng cách chuyển sang XML và gọi XMLDataService
   */
  public processJSON(data: object): void {
    console.log("Adapter: Nhận dữ liệu JSON");
    this.currentData = data;

    // Chuyển đổi JSON sang XML
    const xmlData = this.convertJSONToXML(data);
    console.log("Adapter: Đã chuyển đổi JSON → XML");

    // Gọi service XML
    this.xmlService.processXML(xmlData);
  }

  /**
   * Lấy dữ liệu JSON bằng cách chuyển đổi từ XML
   */
  public getJSON(): object {
    const xmlData = this.xmlService.getXML();

    if (!xmlData) {
      return this.currentData;
    }

    console.log("Adapter: Đang chuyển đổi XML → JSON");
    const jsonData = this.convertXMLToJSON(xmlData);

    return jsonData;
  }

  /**
   * Lấy dữ liệu dưới dạng string
   */
  public getData(): string {
    return JSON.stringify(this.getJSON(), null, 2);
  }

  /**
   * Chuyển đổi JSON sang XML
   * Đây là implementation đơn giản, có thể sử dụng thư viện như xml2js cho production
   */
  private convertJSONToXML(json: object, rootName: string = "root"): string {
    const buildXML = (obj: any, name: string): string => {
      if (obj === null || obj === undefined) {
        return `<${name}/>`;
      }

      if (typeof obj !== "object") {
        // Primitive value
        return `<${name}>${this.escapeXML(String(obj))}</${name}>`;
      }

      if (Array.isArray(obj)) {
        // Array
        return obj
          .map((item) => buildXML(item, name.replace(/s$/, "")))
          .join("\n");
      }

      // Object
      const entries = Object.entries(obj);
      if (entries.length === 0) {
        return `<${name}/>`;
      }

      const children = entries
        .map(([key, value]) => buildXML(value, key))
        .join("\n");

      return `<${name}>\n${children}\n</${name}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n${buildXML(json, rootName)}`;
  }

  /**
   * Chuyển đổi XML sang JSON
   * Đây là implementation đơn giản, có thể sử dụng thư viện như xml2js cho production
   */
  private convertXMLToJSON(xml: string): object {
    // Remove XML declaration
    xml = xml.replace(/<\?xml.*\?>\s*/g, "");

    const parseElement = (element: string): any => {
      // Remove leading/trailing whitespace
      element = element.trim();

      // Check for self-closing tag
      if (element.match(/<([^>]+)\/>/)) {
        return null;
      }

      // Extract tag name
      const tagMatch = element.match(/<([^\s>]+)/);
      if (!tagMatch) return element;

      const tagName = tagMatch[1];

      // Extract content
      const contentMatch = element.match(
        new RegExp(`<${tagName}[^>]*>([\\s\\S]*)</${tagName}>`),
      );
      if (!contentMatch) return element;

      const content = contentMatch[1].trim();

      // Check if content contains child elements
      if (content.includes("<")) {
        // Has child elements
        const result: any = {};
        const childRegex = /<([^\s>]+)(?:[^>]*)>[\s\S]*?<\/\1>|<([^\s>]+)\/>/g;
        let match;

        while ((match = childRegex.exec(content)) !== null) {
          const childTag = match[1] || match[2];
          const childElement = match[0];
          const childValue = parseElement(childElement);

          if (result[childTag]) {
            // Multiple elements with same tag - convert to array
            if (!Array.isArray(result[childTag])) {
              result[childTag] = [result[childTag]];
            }
            result[childTag].push(childValue);
          } else {
            result[childTag] = childValue;
          }
        }

        return result;
      } else {
        // Text content or empty
        return content || null;
      }
    };

    try {
      return parseElement(xml);
    } catch (error) {
      console.error("XML parsing error:", error);
      return {};
    }
  }

  /**
   * Escape special XML characters
   */
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * Lấy XMLService để truy cập trực tiếp nếu cần
   */
  public getXMLService(): XMLDataService {
    return this.xmlService;
  }
}
