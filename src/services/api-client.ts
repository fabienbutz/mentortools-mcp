import axios, { AxiosError, AxiosInstance } from "axios";
import FormData from "form-data";
import { API_BASE_URL } from "../constants.js";

// API Response wrapper from Mentortools
export interface ResponseWrapper<T> {
  done: boolean;
  result?: T;
  error?: string;
}

let apiClient: AxiosInstance | null = null;

export function initializeApiClient(apiKey: string): void {
  apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${apiKey}`
    }
  });
}

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    throw new Error("API client not initialized. Please set MENTORTOOLS_API_KEY environment variable.");
  }
  return apiClient;
}

export async function makeApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  data?: unknown,
  params?: Record<string, unknown>
): Promise<T> {
  const client = getApiClient();

  try {
    const response = await client.request<ResponseWrapper<T>>({
      url: endpoint,
      method,
      data,
      params
    });

    if (!response.data.done) {
      throw new Error(response.data.error || "API request failed");
    }

    return response.data.result as T;
  } catch (error) {
    throw error;
  }
}

export async function uploadFile(
  file: Buffer,
  filename: string,
  parentFolderId?: number
): Promise<unknown> {
  const client = getApiClient();

  const formData = new FormData();
  formData.append("file", file, filename);
  if (parentFolderId) {
    formData.append("parent_folder_id", parentFolderId.toString());
  }

  try {
    const response = await client.post<ResponseWrapper<unknown>>(
      "/mediastorage/v1/files/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Authorization": client.defaults.headers["Authorization"]
        }
      }
    );

    if (!response.data.done) {
      throw new Error(response.data.error || "File upload failed");
    }

    return response.data.result;
  } catch (error) {
    throw error;
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as ResponseWrapper<unknown> | undefined;
      const errorMessage = data?.error || error.message;

      switch (status) {
        case 400:
          return `Error: Bad request - ${errorMessage}. Please check your input parameters.`;
        case 401:
          return "Error: Unauthorized. Please check your API key.";
        case 403:
          return "Error: Forbidden. You don't have permission to access this resource.";
        case 404:
          return `Error: Resource not found. Please verify the ID is correct.`;
        case 422:
          return `Error: Validation error - ${errorMessage}. Please check the required fields.`;
        case 429:
          return "Error: Rate limit exceeded. Please wait before making more requests.";
        case 500:
          return `Error: Internal server error - ${errorMessage}. Please try again later.`;
        default:
          return `Error: API request failed with status ${status} - ${errorMessage}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Please try again.";
    } else if (error.code === "ENOTFOUND") {
      return "Error: Could not connect to Mentortools API. Please check your internet connection.";
    }
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Error: Unexpected error occurred: ${String(error)}`;
}
