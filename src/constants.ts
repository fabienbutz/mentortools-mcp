// Mentortools API Constants
export const API_BASE_URL = "https://app.mentortools.com/public_api";
export const CHARACTER_LIMIT = 25000;
export const DEFAULT_LIMIT = 15;
export const DEFAULT_OFFSET = 0;

// Content Block Types
export const CONTENT_BLOCK_TYPES = [
  "text",
  "html",
  "btn",
  "video",
  "audio",
  "pdf",
  "quiz_text",
  "quiz_video",
  "quiz_audio",
  "certificate"
] as const;

// Course Module View Types
export const MODULE_VIEW_TYPES = ["list", "grid"] as const;

// Course Payment Types
export const PAYMENT_TYPES = ["paid", "free"] as const;

// Course Access Types
export const ACCESS_TYPES = ["subscription", "one_time", "number_of_days_access"] as const;

// Lesson Types
export const LESSON_TYPES = ["lesson", "quiz"] as const;

// Button Positions
export const BUTTON_POSITIONS = ["left", "center", "right"] as const;

// Button Sizes
export const BUTTON_SIZES = ["small", "medium", "large"] as const;

// Button Targets
export const BUTTON_TARGETS = ["_self", "_blank"] as const;
