# Mentortools MCP Server

A Model Context Protocol (MCP) server for the [Mentortools](https://mentortools.com) API. Enables AI assistants like Claude to manage courses, modules, lessons, media storage, and orders.

## Features

- **Course Management**: Create, update, delete, and query courses
- **Module Management**: Organize course content with modules and submodules
- **Lesson Management**: Create lessons with content blocks (text, HTML, video, audio, PDF, quizzes)
- **Media Storage**: Manage files and folders for course assets
- **Order Processing**: Create orders and grant course access via IPN integration

## Prerequisites

- Node.js 18 or higher
- A Mentortools account with API access
- Mentortools API key

## Installation

1. Clone this repository:
```bash
git clone https://github.com/fabienbutz/mentortools-mcp.git
cd mentortools-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file or set the environment variable:

```bash
MENTORTOOLS_API_KEY=your_api_key_here
```

### Claude Desktop Configuration

Add the server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mentortools": {
      "command": "node",
      "args": ["/path/to/mentortools-mcp/dist/index.js"],
      "env": {
        "MENTORTOOLS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### Courses

| Tool | Description |
|------|-------------|
| `mentortools_list_courses` | List all courses with pagination |
| `mentortools_count_courses` | Get total course count |
| `mentortools_get_course` | Get course basic info |
| `mentortools_get_course_info` | Get detailed course info with modules and lessons |
| `mentortools_create_course` | Create a new course |
| `mentortools_update_course` | Update course properties |
| `mentortools_delete_course` | Delete a course |

### Modules

| Tool | Description |
|------|-------------|
| `mentortools_list_modules` | List modules in a course |
| `mentortools_get_module` | Get module basic info |
| `mentortools_get_module_info` | Get detailed module info |
| `mentortools_create_module` | Create a new module |
| `mentortools_update_module` | Update module properties |
| `mentortools_delete_module` | Delete a module |

### Submodules

| Tool | Description |
|------|-------------|
| `mentortools_list_submodules` | List submodules in a module |
| `mentortools_get_submodule` | Get submodule info |
| `mentortools_create_submodule` | Create a new submodule |
| `mentortools_update_submodule` | Update submodule properties |
| `mentortools_delete_submodule` | Delete a submodule |

### Lessons

| Tool | Description |
|------|-------------|
| `mentortools_list_lessons` | List lessons in a module |
| `mentortools_get_lesson` | Get lesson basic info |
| `mentortools_get_lesson_info` | Get detailed lesson info with content blocks |
| `mentortools_get_lesson_content_blocks` | Get lesson content blocks |
| `mentortools_create_lesson` | Create a new lesson |
| `mentortools_update_lesson` | Update lesson properties |
| `mentortools_delete_lesson` | Delete a lesson |

### Media Storage - Files

| Tool | Description |
|------|-------------|
| `mentortools_list_files` | List files in a folder |
| `mentortools_list_all_files` | List all files (ignoring folders) |
| `mentortools_count_files` | Count files in a folder |
| `mentortools_count_all_files` | Count all files |
| `mentortools_get_file` | Get file metadata |
| `mentortools_update_file` | Rename or move a file |
| `mentortools_delete_file` | Delete a file |

### Media Storage - Folders

| Tool | Description |
|------|-------------|
| `mentortools_list_folders` | List folders |
| `mentortools_list_all_folders` | List all folders (ignoring hierarchy) |
| `mentortools_count_folders` | Count folders |
| `mentortools_count_all_folders` | Count all folders |
| `mentortools_get_folder` | Get folder info |
| `mentortools_create_folder` | Create a new folder |
| `mentortools_update_folder` | Rename or move a folder |
| `mentortools_delete_folder` | Delete a folder |

### Orders

| Tool | Description |
|------|-------------|
| `mentortools_create_order` | Create order and grant course access (IPN) |

## Content Block Types

When creating lessons, you can use these content block types:

- `text` - Plain text content
- `html` - HTML formatted content
- `btn` - Button element
- `video` - Video content
- `audio` - Audio content
- `pdf` - PDF document
- `quiz_text` - Text-based quiz
- `quiz_video` - Video-based quiz
- `quiz_audio` - Audio-based quiz
- `certificate` - Course certificate

## Development

Watch mode for development:
```bash
npm run dev
```

Build:
```bash
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
