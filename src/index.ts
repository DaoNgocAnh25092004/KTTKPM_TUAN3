/**
 * Design Patterns Library
 * Export all patterns for easy import
 */

// ============================================
// OBSERVER PATTERN
// ============================================
export { Subject, Observer } from "./observer/interfaces";
export { Stock } from "./observer/Stock";
export { Investor } from "./observer/Investor";
export { Task } from "./observer/Task";
export { TeamMember } from "./observer/TeamMember";

// ============================================
// ADAPTER PATTERN
// ============================================
export { JSONService } from "./adapter/JSONService";
export { XMLDataService } from "./adapter/XMLDataService";
export { XMLToJSONAdapter } from "./adapter/XMLToJSONAdapter";
