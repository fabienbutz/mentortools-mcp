import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { makeApiRequest, handleApiError } from "../services/api-client.js";
import {
  FileIdSchema,
  ListFilesSchema,
  ListAllFilesSchema,
  FileUpdateSchema,
  FolderIdSchema,
  ListFoldersSchema,
  ListAllFoldersSchema,
  FolderCreateSchema,
  FolderUpdateSchema,
  type FileIdInput,
  type ListFilesInput,
  type ListAllFilesInput,
  type FileUpdateInput,
  type FolderIdInput,
  type ListFoldersInput,
  type ListAllFoldersInput,
  type FolderCreateInput,
  type FolderUpdateInput
} from "../schemas/media.js";

export function registerMediaTools(server: McpServer): void {
  // ==================== FILES ====================

  server.registerTool(
    "mentortools_list_files",
    {
      title: "List Files",
      description: `List files in media storage, organized by folder.

Args:
  - parent_folder_id (number, optional): Folder ID (omit for root)
  - limit (number, optional): Max results (default: 100)
  - offset (number, optional): Pagination offset
  - filename (string, optional): Filter by filename (partial match)

Returns: Array of files with id, name, file_id, extension, size, etc.`,
      inputSchema: ListFilesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListFilesInput) => {
      try {
        const queryParams: Record<string, unknown> = {
          limit: params.limit,
          offset: params.offset
        };
        if (params.parent_folder_id) {
          queryParams.parent_folder_id = params.parent_folder_id;
        }
        if (params.filename) {
          queryParams.filename = params.filename;
        }

        const result = await makeApiRequest<unknown[]>("/mediastorage/v1/files", "GET", undefined, queryParams);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_list_all_files",
    {
      title: "List All Files",
      description: `List all files in media storage, ignoring folder structure.

Args:
  - limit (number, optional): Max results (default: 100)
  - offset (number, optional): Pagination offset
  - filename (string, optional): Filter by filename (partial match)

Returns: Array of all files`,
      inputSchema: ListAllFilesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListAllFilesInput) => {
      try {
        const queryParams: Record<string, unknown> = {
          limit: params.limit,
          offset: params.offset
        };
        if (params.filename) {
          queryParams.filename = params.filename;
        }

        const result = await makeApiRequest<unknown[]>("/mediastorage/v1/files/all", "GET", undefined, queryParams);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_count_files",
    {
      title: "Count Files",
      description: `Get file count in a folder.

Args:
  - parent_folder_id (number, optional): Folder ID (omit for root)

Returns: Number of files`,
      inputSchema: ListFilesSchema.pick({ parent_folder_id: true }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: { parent_folder_id?: number }) => {
      try {
        const queryParams: Record<string, unknown> = {};
        if (params.parent_folder_id) {
          queryParams.parent_folder_id = params.parent_folder_id;
        }

        const result = await makeApiRequest<number>("/mediastorage/v1/files/count", "GET", undefined, queryParams);
        return {
          content: [{ type: "text", text: `File count: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_count_all_files",
    {
      title: "Count All Files",
      description: `Get total file count in media storage (ignoring folders).

Returns: Total number of files`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async () => {
      try {
        const result = await makeApiRequest<number>("/mediastorage/v1/files/all/count", "GET");
        return {
          content: [{ type: "text", text: `Total files: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_file",
    {
      title: "Get File",
      description: `Get file metadata by ID.

Args:
  - file_id (number): File ID in media storage

Returns: File metadata including name, extension, size, file_id hash`,
      inputSchema: FileIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: FileIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/mediastorage/v1/files/${params.file_id}`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_update_file",
    {
      title: "Update File",
      description: `Update file metadata (rename or move to folder).

Args:
  - file_id (number, required): File ID
  - name (string, required): New filename with extension
  - parent_folder_id (number, optional): Move to folder (omit for root)

Returns: Success status`,
      inputSchema: FileIdSchema.merge(FileUpdateSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: FileIdInput & FileUpdateInput) => {
      try {
        const { file_id, ...updateData } = params;
        const result = await makeApiRequest<boolean>(`/mediastorage/v1/files/${file_id}`, "PUT", updateData);
        return {
          content: [{ type: "text", text: result ? "File updated successfully" : "File update failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_delete_file",
    {
      title: "Delete File",
      description: `Delete a file from media storage.

Args:
  - file_id (number): File ID

Returns: Success status`,
      inputSchema: FileIdSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: FileIdInput) => {
      try {
        const result = await makeApiRequest<boolean>(`/mediastorage/v1/files/${params.file_id}`, "DELETE");
        return {
          content: [{ type: "text", text: result ? "File deleted successfully" : "File deletion failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  // ==================== FOLDERS ====================

  server.registerTool(
    "mentortools_list_folders",
    {
      title: "List Folders",
      description: `List folders in media storage.

Args:
  - parent_folder_id (number, optional): Parent folder ID (omit for root)
  - limit (number, optional): Max results (default: 100)
  - offset (number, optional): Pagination offset

Returns: Array of folders`,
      inputSchema: ListFoldersSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListFoldersInput) => {
      try {
        const queryParams: Record<string, unknown> = {
          limit: params.limit,
          offset: params.offset
        };
        if (params.parent_folder_id) {
          queryParams.parent_folder_id = params.parent_folder_id;
        }

        const result = await makeApiRequest<unknown[]>("/mediastorage/v1/folders", "GET", undefined, queryParams);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_list_all_folders",
    {
      title: "List All Folders",
      description: `List all folders in media storage (ignoring hierarchy).

Args:
  - limit (number, optional): Max results (default: 100)
  - offset (number, optional): Pagination offset

Returns: Array of all folders`,
      inputSchema: ListAllFoldersSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListAllFoldersInput) => {
      try {
        const result = await makeApiRequest<unknown[]>("/mediastorage/v1/folders/all", "GET", undefined, {
          limit: params.limit,
          offset: params.offset
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_count_folders",
    {
      title: "Count Folders",
      description: `Get folder count.

Args:
  - parent_folder_id (number, optional): Parent folder ID (omit for root)

Returns: Number of folders`,
      inputSchema: ListFoldersSchema.pick({ parent_folder_id: true }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: { parent_folder_id?: number }) => {
      try {
        const queryParams: Record<string, unknown> = {};
        if (params.parent_folder_id) {
          queryParams.parent_folder_id = params.parent_folder_id;
        }

        const result = await makeApiRequest<number>("/mediastorage/v1/folders/count", "GET", undefined, queryParams);
        return {
          content: [{ type: "text", text: `Folder count: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_count_all_folders",
    {
      title: "Count All Folders",
      description: `Get total folder count (ignoring hierarchy).

Returns: Total number of folders`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async () => {
      try {
        const result = await makeApiRequest<number>("/mediastorage/v1/folders/all/count", "GET");
        return {
          content: [{ type: "text", text: `Total folders: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_folder",
    {
      title: "Get Folder",
      description: `Get folder information by ID.

Args:
  - folder_id (number): Folder ID

Returns: Folder metadata`,
      inputSchema: FolderIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: FolderIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/mediastorage/v1/folders/${params.folder_id}`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_create_folder",
    {
      title: "Create Folder",
      description: `Create a new folder in media storage.

Args:
  - name (string, required): Folder name
  - parent_folder_id (number, optional): Parent folder (omit for root)

Returns: ID of the newly created folder`,
      inputSchema: FolderCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: FolderCreateInput) => {
      try {
        const result = await makeApiRequest<number>("/mediastorage/v1/folders", "POST", params);
        return {
          content: [{ type: "text", text: `Folder created successfully. ID: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_update_folder",
    {
      title: "Update Folder",
      description: `Update folder (rename or move).

Args:
  - folder_id (number, required): Folder ID
  - name (string, required): New folder name
  - parent_folder_id (number, optional): Move to parent folder

Returns: Success status`,
      inputSchema: FolderIdSchema.merge(FolderUpdateSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: FolderIdInput & FolderUpdateInput) => {
      try {
        const { folder_id, ...updateData } = params;
        const result = await makeApiRequest<boolean>(`/mediastorage/v1/folders/${folder_id}`, "PUT", updateData);
        return {
          content: [{ type: "text", text: result ? "Folder updated successfully" : "Folder update failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_delete_folder",
    {
      title: "Delete Folder",
      description: `Delete a folder from media storage.

Args:
  - folder_id (number): Folder ID

Returns: Success status`,
      inputSchema: FolderIdSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: FolderIdInput) => {
      try {
        const result = await makeApiRequest<boolean>(`/mediastorage/v1/folders/${params.folder_id}`, "DELETE");
        return {
          content: [{ type: "text", text: result ? "Folder deleted successfully" : "Folder deletion failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
