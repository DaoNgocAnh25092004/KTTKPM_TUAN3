/**
 * Library Management System - Main Export File
 * Exports all main components for easy importing
 */

// Interfaces
export * from "./interfaces";

// Models
export * from "./models";

// Design Patterns
export * from "./patterns/singleton/Library";
export * from "./patterns/factory/BookFactory";
export * from "./patterns/strategy/SearchStrategy";
export * from "./patterns/observer/LibraryObserver";
export * from "./patterns/decorator/BorrowDecorator";

// Demo
export * from "./demo/LibraryDemo";
