import { z } from "zod";
import {
  MODULE_VIEW_TYPES,
  PAYMENT_TYPES,
  ACCESS_TYPES,
  LESSON_TYPES,
  CONTENT_BLOCK_TYPES,
  BUTTON_POSITIONS,
  BUTTON_SIZES,
  BUTTON_TARGETS
} from "../constants.js";

// Pagination Schema (reusable)
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(15).describe("Maximum results to return"),
  offset: z.number().int().min(0).default(0).describe("Number of results to skip for pagination")
}).strict();

// Course List Schema
export const ListCoursesSchema = PaginationSchema.extend({
  archived: z.boolean().default(false).describe("Include archived courses")
}).strict();

// Course ID Schema
export const CourseIdSchema = z.object({
  course_id: z.number().int().positive().describe("Course ID")
}).strict();

// Course Create Schema
export const CourseCreateSchema = z.object({
  title: z.string().min(1).max(255).describe("Title of the course"),
  description: z.string().optional().describe("Description of the course"),
  image_id: z.string().optional().describe("ID of the course image from media storage"),
  url: z.string().optional().describe("URL of the sales page"),
  payload: z.string().optional().describe("Additional content (text or HTML)"),
  module_view_type: z.enum(MODULE_VIEW_TYPES).optional().describe("How modules are displayed: 'list' or 'grid'"),
  payment_type: z.enum(PAYMENT_TYPES).optional().describe("Payment type: 'paid' or 'free'"),
  course_access_type: z.enum(ACCESS_TYPES).optional().describe("Access type: 'subscription', 'one_time', or 'number_of_days_access'"),
  number_days_access: z.number().int().min(0).optional().describe("Number of days access (if access type is 'number_of_days_access')"),
  is_active: z.boolean().describe("Whether the course is active"),
  is_secret: z.boolean().describe("Whether the course is hidden from public listing"),
  is_archived: z.boolean().describe("Whether the course is archived"),
  is_displayed_in_app: z.boolean().describe("Whether shown in mobile app"),
  is_offline_downloadable: z.boolean().describe("Whether downloadable for offline access"),
  available_at: z.number().int().optional().describe("Availability timestamp in milliseconds"),
  launch_date_enabled: z.boolean().optional().describe("Enable launch date"),
  launch_date: z.number().int().optional().describe("Launch date timestamp in milliseconds"),
  order: z.number().int().optional().describe("Order position in the list")
}).strict();

// Course Update Schema (same as create but with order required)
export const CourseUpdateSchema = CourseCreateSchema.extend({
  order: z.number().int().describe("Order position in the list (required for update)")
}).strict();

// Course Patch Schema (all fields optional)
export const CoursePatchSchema = z.object({
  title: z.string().min(1).max(255).optional().describe("Title of the course"),
  description: z.string().optional().describe("Description of the course"),
  image_id: z.string().optional().describe("ID of the course image"),
  url: z.string().optional().describe("URL of the sales page"),
  payload: z.string().optional().describe("Additional content"),
  module_view_type: z.enum(MODULE_VIEW_TYPES).optional().describe("Module view type"),
  payment_type: z.enum(PAYMENT_TYPES).optional().describe("Payment type"),
  course_access_type: z.enum(ACCESS_TYPES).optional().describe("Access type"),
  number_days_access: z.number().int().min(0).optional().describe("Days access"),
  is_active: z.boolean().optional().describe("Is active"),
  is_secret: z.boolean().optional().describe("Is secret"),
  is_archived: z.boolean().optional().describe("Is archived"),
  is_displayed_in_app: z.boolean().optional().describe("Displayed in app"),
  is_offline_downloadable: z.boolean().optional().describe("Offline downloadable"),
  available_at: z.number().int().optional().describe("Availability timestamp"),
  launch_date_enabled: z.boolean().optional().describe("Launch date enabled"),
  launch_date: z.number().int().optional().describe("Launch date timestamp"),
  order: z.number().int().optional().describe("Order position")
}).strict();

// Module Schemas
export const ModuleIdSchema = z.object({
  module_id: z.number().int().positive().describe("Module ID")
}).strict();

export const ListModulesSchema = z.object({
  course_id: z.number().int().positive().describe("Course ID"),
  limit: z.number().int().min(1).max(100).default(15).describe("Maximum results"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination")
}).strict();

export const ModuleCreateSchema = z.object({
  title: z.string().min(1).max(255).describe("Module title"),
  mandatory: z.boolean().optional().default(false).describe("Is mandatory"),
  is_published: z.boolean().optional().default(false).describe("Is published"),
  is_active: z.boolean().optional().default(false).describe("Is active"),
  public_description: z.string().optional().describe("Public description"),
  short_description: z.string().optional().describe("Short description"),
  image_id: z.string().optional().describe("Image ID from media storage"),
  available_at: z.number().int().optional().describe("Availability timestamp in ms"),
  order: z.number().int().optional().describe("Order position")
}).strict();

export const ModuleUpdateSchema = ModuleCreateSchema.extend({
  order: z.number().int().describe("Order position (required for update)")
}).strict();

export const ModulePatchSchema = z.object({
  title: z.string().min(1).max(255).optional().describe("Module title"),
  mandatory: z.boolean().optional().describe("Is mandatory"),
  is_published: z.boolean().optional().describe("Is published"),
  is_active: z.boolean().optional().describe("Is active"),
  public_description: z.string().optional().describe("Public description"),
  short_description: z.string().optional().describe("Short description"),
  image_id: z.string().optional().describe("Image ID"),
  available_at: z.number().int().optional().describe("Availability timestamp"),
  order: z.number().int().optional().describe("Order position")
}).strict();

// Lesson Schemas
export const LessonIdSchema = z.object({
  lesson_id: z.number().int().positive().describe("Lesson ID")
}).strict();

export const ListLessonsSchema = z.object({
  module_id: z.number().int().positive().describe("Module ID"),
  limit: z.number().int().min(1).max(100).default(15).describe("Maximum results"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination")
}).strict();

// Content Block Schema
export const ContentSchema = z.object({
  link: z.string().optional().describe("Link (e.g. YouTube URL)"),
  file_id: z.string().optional().describe("File ID from media storage"),
  payload: z.string().optional().describe("Raw content (HTML or text)"),
  btn_url: z.string().optional().describe("Button URL"),
  btn_font: z.string().optional().describe("Button font"),
  btn_size: z.enum(BUTTON_SIZES).optional().describe("Button size"),
  btn_text: z.string().optional().describe("Button text"),
  btn_color: z.string().optional().describe("Button color (hex)"),
  btn_target: z.enum(BUTTON_TARGETS).optional().describe("Button target"),
  btn_position: z.enum(BUTTON_POSITIONS).optional().describe("Button position"),
  btn_text_color: z.string().optional().describe("Button text color (hex)"),
  pdf_id: z.string().optional().describe("PDF file ID")
}).strict();

export const ContentBlockCreateSchema = z.object({
  block_type: z.enum(CONTENT_BLOCK_TYPES).describe("Type of content block"),
  order: z.number().int().describe("Order in the lesson"),
  is_expanded: z.boolean().optional().default(true).describe("Expanded by default"),
  content: ContentSchema.optional().describe("Content of the block")
}).strict();

export const LessonCreateSchema = z.object({
  title: z.string().min(1).max(255).describe("Lesson title"),
  lesson_type: z.enum(LESSON_TYPES).describe("Type: 'lesson' or 'quiz'"),
  is_active: z.boolean().describe("Is active"),
  is_published: z.boolean().describe("Is published"),
  mandatory: z.boolean().describe("Is mandatory"),
  submodule_id: z.number().int().optional().describe("Submodule ID if part of submodule"),
  thread_id: z.number().int().optional().describe("Community thread ID"),
  image_id: z.string().optional().describe("Image ID"),
  payload: z.string().optional().describe("Description or summary"),
  order: z.number().int().optional().describe("Order in module"),
  content_blocks: z.array(ContentBlockCreateSchema).optional().describe("Content blocks"),
  attached_files: z.array(z.object({
    order: z.number().int().describe("File order"),
    file_id: z.number().int().describe("File ID from media storage")
  })).optional().describe("Attached files")
}).strict();

export const LessonPatchSchema = z.object({
  title: z.string().min(1).max(255).optional().describe("Lesson title"),
  submodule_id: z.number().int().optional().describe("Submodule ID"),
  thread_id: z.number().int().optional().describe("Thread ID"),
  image_id: z.string().optional().describe("Image ID"),
  order: z.number().int().optional().describe("Order"),
  payload: z.string().optional().describe("Description"),
  is_active: z.boolean().optional().describe("Is active"),
  is_published: z.boolean().optional().describe("Is published"),
  mandatory: z.boolean().optional().describe("Is mandatory")
}).strict();

// Submodule Schemas
export const SubmoduleIdSchema = z.object({
  submodule_id: z.number().int().positive().describe("Submodule ID")
}).strict();

export const ListSubmodulesSchema = z.object({
  module_id: z.number().int().positive().describe("Module ID"),
  limit: z.number().int().min(1).max(100).default(15).describe("Maximum results"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination")
}).strict();

export const SubmoduleCreateSchema = z.object({
  title: z.string().min(1).max(255).describe("Submodule title"),
  order: z.number().int().describe("Order position"),
  is_published: z.boolean().optional().default(false).describe("Is published")
}).strict();

export const SubmodulePatchSchema = z.object({
  title: z.string().min(1).max(255).optional().describe("Submodule title"),
  order: z.number().int().optional().describe("Order position"),
  is_published: z.boolean().optional().describe("Is published")
}).strict();

// Type exports
export type ListCoursesInput = z.infer<typeof ListCoursesSchema>;
export type CourseIdInput = z.infer<typeof CourseIdSchema>;
export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>;
export type CoursePatchInput = z.infer<typeof CoursePatchSchema>;
export type ModuleIdInput = z.infer<typeof ModuleIdSchema>;
export type ListModulesInput = z.infer<typeof ListModulesSchema>;
export type ModuleCreateInput = z.infer<typeof ModuleCreateSchema>;
export type ModuleUpdateInput = z.infer<typeof ModuleUpdateSchema>;
export type ModulePatchInput = z.infer<typeof ModulePatchSchema>;
export type LessonIdInput = z.infer<typeof LessonIdSchema>;
export type ListLessonsInput = z.infer<typeof ListLessonsSchema>;
export type LessonCreateInput = z.infer<typeof LessonCreateSchema>;
export type LessonPatchInput = z.infer<typeof LessonPatchSchema>;
export type SubmoduleIdInput = z.infer<typeof SubmoduleIdSchema>;
export type ListSubmodulesInput = z.infer<typeof ListSubmodulesSchema>;
export type SubmoduleCreateInput = z.infer<typeof SubmoduleCreateSchema>;
export type SubmodulePatchInput = z.infer<typeof SubmodulePatchSchema>;
