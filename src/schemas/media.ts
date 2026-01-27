import { z } from "zod";

// File Schemas
export const FileIdSchema = z.object({
  file_id: z.number().int().positive().describe("File ID in media storage")
}).strict();

export const ListFilesSchema = z.object({
  parent_folder_id: z.number().int().positive().optional().describe("Parent folder ID (omit for root)"),
  limit: z.number().int().min(1).max(100).default(100).describe("Maximum results to return"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination"),
  filename: z.string().optional().describe("Filter by filename (partial match)")
}).strict();

export const ListAllFilesSchema = z.object({
  limit: z.number().int().min(1).max(100).default(100).describe("Maximum results to return"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination"),
  filename: z.string().optional().describe("Filter by filename (partial match)")
}).strict();

export const FileUpdateSchema = z.object({
  name: z.string().min(1).max(255).describe("New filename with extension"),
  parent_folder_id: z.number().int().positive().optional().describe("Move to folder (null for root)")
}).strict();

// Folder Schemas
export const FolderIdSchema = z.object({
  folder_id: z.number().int().positive().describe("Folder ID")
}).strict();

export const ListFoldersSchema = z.object({
  parent_folder_id: z.number().int().positive().optional().describe("Parent folder ID (omit for root)"),
  limit: z.number().int().min(1).max(100).default(100).describe("Maximum results to return"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination")
}).strict();

export const ListAllFoldersSchema = z.object({
  limit: z.number().int().min(1).max(100).default(100).describe("Maximum results to return"),
  offset: z.number().int().min(0).default(0).describe("Offset for pagination")
}).strict();

export const FolderCreateSchema = z.object({
  name: z.string().min(1).max(255).describe("Folder name"),
  parent_folder_id: z.number().int().positive().optional().describe("Parent folder ID (omit for root)")
}).strict();

export const FolderUpdateSchema = z.object({
  name: z.string().min(1).max(255).describe("New folder name"),
  parent_folder_id: z.number().int().positive().optional().describe("Move to folder (null for root)")
}).strict();

// Type exports
export type FileIdInput = z.infer<typeof FileIdSchema>;
export type ListFilesInput = z.infer<typeof ListFilesSchema>;
export type ListAllFilesInput = z.infer<typeof ListAllFilesSchema>;
export type FileUpdateInput = z.infer<typeof FileUpdateSchema>;
export type FolderIdInput = z.infer<typeof FolderIdSchema>;
export type ListFoldersInput = z.infer<typeof ListFoldersSchema>;
export type ListAllFoldersInput = z.infer<typeof ListAllFoldersSchema>;
export type FolderCreateInput = z.infer<typeof FolderCreateSchema>;
export type FolderUpdateInput = z.infer<typeof FolderUpdateSchema>;
