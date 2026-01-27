#!/usr/bin/env node
/**
 * Mentortools MCP Server
 *
 * A Model Context Protocol server for the Mentortools API.
 * Provides tools to manage courses, modules, lessons, media storage, and orders.
 *
 * Environment Variables:
 *   MENTORTOOLS_API_KEY - Your Mentortools API key (required)
 *   TRANSPORT - Transport type: 'stdio' (default) or 'http'
 *   PORT - HTTP port (default: 3000, only for http transport)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initializeApiClient } from "./services/api-client.js";
import { registerCourseTools } from "./tools/courses.js";
import { registerMediaTools } from "./tools/media.js";
import { registerOrderTools } from "./tools/orders.js";

// Create MCP server instance
const server = new McpServer({
  name: "mentortools-mcp-server",
  version: "1.0.0"
});

// Register all tools
registerCourseTools(server);
registerMediaTools(server);
registerOrderTools(server);

// Main function for stdio transport
async function runStdio(): Promise<void> {
  const apiKey = process.env.MENTORTOOLS_API_KEY;

  if (!apiKey) {
    console.error("ERROR: MENTORTOOLS_API_KEY environment variable is required");
    console.error("");
    console.error("Usage:");
    console.error("  export MENTORTOOLS_API_KEY=your_api_key");
    console.error("  npx mentortools-mcp-server");
    console.error("");
    console.error("Or configure in your MCP client settings.");
    process.exit(1);
  }

  // Initialize API client with the key
  initializeApiClient(apiKey);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mentortools MCP server running via stdio");
}

// Run the server
runStdio().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
