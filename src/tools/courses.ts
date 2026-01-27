import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { makeApiRequest, handleApiError } from "../services/api-client.js";
import {
  ListCoursesSchema,
  CourseIdSchema,
  CourseCreateSchema,
  CoursePatchSchema,
  ListModulesSchema,
  ModuleIdSchema,
  ModuleCreateSchema,
  ModulePatchSchema,
  ListLessonsSchema,
  LessonIdSchema,
  LessonCreateSchema,
  LessonPatchSchema,
  ListSubmodulesSchema,
  SubmoduleIdSchema,
  SubmoduleCreateSchema,
  SubmodulePatchSchema,
  type ListCoursesInput,
  type CourseIdInput,
  type CourseCreateInput,
  type CoursePatchInput,
  type ListModulesInput,
  type ModuleIdInput,
  type ModuleCreateInput,
  type ModulePatchInput,
  type ListLessonsInput,
  type LessonIdInput,
  type LessonCreateInput,
  type LessonPatchInput,
  type ListSubmodulesInput,
  type SubmoduleIdInput,
  type SubmoduleCreateInput,
  type SubmodulePatchInput
} from "../schemas/courses.js";

export function registerCourseTools(server: McpServer): void {
  // ==================== COURSES ====================

  server.registerTool(
    "mentortools_list_courses",
    {
      title: "List Courses",
      description: `List all courses in Mentortools with pagination support.

Returns a list of courses with basic information. Use mentortools_get_course_info for detailed course data.

Args:
  - limit (number): Maximum results (1-100, default: 15)
  - offset (number): Skip results for pagination (default: 0)
  - archived (boolean): Include archived courses (default: false)

Returns: Array of courses with id, title, description, is_active, is_secret, etc.`,
      inputSchema: ListCoursesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListCoursesInput) => {
      try {
        const result = await makeApiRequest<unknown[]>("/courses/v1/", "GET", undefined, {
          limit: params.limit,
          offset: params.offset,
          archived: params.archived
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
    "mentortools_count_courses",
    {
      title: "Count Courses",
      description: `Get the total count of courses.

Args:
  - archived (boolean): Count archived courses (default: false)

Returns: Total number of courses`,
      inputSchema: ListCoursesSchema.pick({ archived: true }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: { archived?: boolean }) => {
      try {
        const result = await makeApiRequest<number>("/courses/v1/count", "GET", undefined, {
          archived: params.archived ?? false
        });
        return {
          content: [{ type: "text", text: `Total courses: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_course",
    {
      title: "Get Course",
      description: `Get simplified course information by ID.

Args:
  - course_id (number): Course ID

Returns: Course basic information`,
      inputSchema: CourseIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: CourseIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/${params.course_id}`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_course_info",
    {
      title: "Get Course Info (Detailed)",
      description: `Get detailed course information including modules, lessons, and content blocks.

Args:
  - course_id (number): Course ID

Returns: Full course data with nested modules, submodules, lessons, and content blocks`,
      inputSchema: CourseIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: CourseIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/${params.course_id}/info`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_create_course",
    {
      title: "Create Course",
      description: `Create a new course in Mentortools.

Args:
  - title (string, required): Course title
  - is_active (boolean, required): Whether active
  - is_secret (boolean, required): Whether hidden
  - is_archived (boolean, required): Whether archived
  - is_displayed_in_app (boolean, required): Show in mobile app
  - is_offline_downloadable (boolean, required): Allow offline download
  - description (string, optional): Course description
  - image_id (string, optional): Image ID from media storage
  - payment_type (string, optional): 'paid' or 'free'
  - module_view_type (string, optional): 'list' or 'grid'
  - course_access_type (string, optional): 'subscription', 'one_time', or 'number_of_days_access'

Returns: ID of the newly created course`,
      inputSchema: CourseCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: CourseCreateInput) => {
      try {
        const result = await makeApiRequest<number>("/courses/v1/", "POST", params);
        return {
          content: [{ type: "text", text: `Course created successfully. ID: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_update_course",
    {
      title: "Update Course (Patch)",
      description: `Update course information. Only provided fields will be updated.

Args:
  - course_id (number, required): Course ID to update
  - title, description, is_active, etc. (optional): Fields to update

Returns: Success status`,
      inputSchema: CourseIdSchema.merge(CoursePatchSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: CourseIdInput & CoursePatchInput) => {
      try {
        const { course_id, ...updateData } = params;
        const result = await makeApiRequest<boolean>(`/courses/v1/${course_id}`, "PATCH", updateData);
        return {
          content: [{ type: "text", text: result ? "Course updated successfully" : "Course update failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_delete_course",
    {
      title: "Delete Course",
      description: `Delete a course by ID. This action cannot be undone.

Args:
  - course_id (number): Course ID to delete

Returns: Success status`,
      inputSchema: CourseIdSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: CourseIdInput) => {
      try {
        const result = await makeApiRequest<boolean>(`/courses/v1/${params.course_id}`, "DELETE");
        return {
          content: [{ type: "text", text: result ? "Course deleted successfully" : "Course deletion failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  // ==================== MODULES ====================

  server.registerTool(
    "mentortools_list_modules",
    {
      title: "List Course Modules",
      description: `List all modules in a course with pagination.

Args:
  - course_id (number, required): Course ID
  - limit (number, optional): Max results (default: 15)
  - offset (number, optional): Pagination offset

Returns: Array of modules with id, title, order, is_active, etc.`,
      inputSchema: ListModulesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListModulesInput) => {
      try {
        const result = await makeApiRequest<unknown[]>(`/courses/v1/${params.course_id}/modules`, "GET", undefined, {
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
    "mentortools_get_module",
    {
      title: "Get Module",
      description: `Get module information by ID.

Args:
  - module_id (number): Module ID

Returns: Module information`,
      inputSchema: ModuleIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ModuleIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/modules/${params.module_id}`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_module_info",
    {
      title: "Get Module Info (Detailed)",
      description: `Get detailed module information including submodules and lessons.

Args:
  - module_id (number): Module ID

Returns: Full module data with nested content`,
      inputSchema: ModuleIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ModuleIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/modules/${params.module_id}/info`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_create_module",
    {
      title: "Create Module",
      description: `Create a new module in a course.

Args:
  - course_id (number, required): Course ID
  - title (string, required): Module title
  - is_active, is_published, mandatory (optional): Status flags
  - public_description, short_description (optional): Descriptions
  - image_id (optional): Image from media storage
  - order (optional): Position in course

Returns: ID of the newly created module`,
      inputSchema: CourseIdSchema.merge(ModuleCreateSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: CourseIdInput & ModuleCreateInput) => {
      try {
        const { course_id, ...moduleData } = params;
        const result = await makeApiRequest<number>(`/courses/v1/${course_id}/modules`, "POST", moduleData);
        return {
          content: [{ type: "text", text: `Module created successfully. ID: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_update_module",
    {
      title: "Update Module (Patch)",
      description: `Update module information. Only provided fields will be updated.

Args:
  - module_id (number, required): Module ID
  - title, is_active, order, etc. (optional): Fields to update

Returns: Success status`,
      inputSchema: ModuleIdSchema.merge(ModulePatchSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ModuleIdInput & ModulePatchInput) => {
      try {
        const { module_id, ...updateData } = params;
        const result = await makeApiRequest<boolean>(`/courses/v1/modules/${module_id}`, "PATCH", updateData);
        return {
          content: [{ type: "text", text: result ? "Module updated successfully" : "Module update failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_delete_module",
    {
      title: "Delete Module",
      description: `Delete a module by ID. This will also delete all lessons in the module.

Args:
  - module_id (number): Module ID

Returns: Success status`,
      inputSchema: ModuleIdSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: ModuleIdInput) => {
      try {
        const result = await makeApiRequest<boolean>(`/courses/v1/modules/${params.module_id}`, "DELETE");
        return {
          content: [{ type: "text", text: result ? "Module deleted successfully" : "Module deletion failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  // ==================== LESSONS ====================

  server.registerTool(
    "mentortools_list_lessons",
    {
      title: "List Module Lessons",
      description: `List all lessons in a module.

Args:
  - module_id (number, required): Module ID
  - limit, offset (optional): Pagination

Returns: Array of lessons`,
      inputSchema: ListLessonsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListLessonsInput) => {
      try {
        const result = await makeApiRequest<unknown[]>(`/courses/v1/modules/${params.module_id}/lessons`, "GET", undefined, {
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
    "mentortools_get_lesson",
    {
      title: "Get Lesson",
      description: `Get lesson information by ID.

Args:
  - lesson_id (number): Lesson ID

Returns: Lesson information`,
      inputSchema: LessonIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: LessonIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/lessons/${params.lesson_id}`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_lesson_info",
    {
      title: "Get Lesson Info (Detailed)",
      description: `Get detailed lesson information with content blocks and attached files.

Args:
  - lesson_id (number): Lesson ID

Returns: Full lesson data`,
      inputSchema: LessonIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: LessonIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/lessons/${params.lesson_id}/info`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_get_lesson_content_blocks",
    {
      title: "Get Lesson Content Blocks",
      description: `Get all content blocks for a lesson.

Args:
  - lesson_id (number): Lesson ID

Returns: Array of content blocks`,
      inputSchema: LessonIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: LessonIdInput) => {
      try {
        const result = await makeApiRequest<unknown[]>(`/courses/v1/lessons/${params.lesson_id}/content_blocks`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_create_lesson",
    {
      title: "Create Lesson",
      description: `Create a new lesson in a module.

Args:
  - module_id (number, required): Module ID
  - title (string, required): Lesson title
  - lesson_type (string, required): 'lesson' or 'quiz'
  - is_active, is_published, mandatory (required): Status flags
  - content_blocks (optional): Array of content blocks
  - attached_files (optional): Array of file attachments

Returns: ID of the newly created lesson`,
      inputSchema: ModuleIdSchema.merge(LessonCreateSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: ModuleIdInput & LessonCreateInput) => {
      try {
        const { module_id, ...lessonData } = params;
        const result = await makeApiRequest<number>(`/courses/v1/modules/${module_id}/lessons`, "POST", lessonData);
        return {
          content: [{ type: "text", text: `Lesson created successfully. ID: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_update_lesson",
    {
      title: "Update Lesson (Patch)",
      description: `Update lesson information. Only provided fields will be updated.

Args:
  - lesson_id (number, required): Lesson ID
  - title, is_active, order, etc. (optional): Fields to update

Returns: Success status`,
      inputSchema: LessonIdSchema.merge(LessonPatchSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: LessonIdInput & LessonPatchInput) => {
      try {
        const { lesson_id, ...updateData } = params;
        const result = await makeApiRequest<boolean>(`/courses/v1/lessons/${lesson_id}`, "PATCH", updateData);
        return {
          content: [{ type: "text", text: result ? "Lesson updated successfully" : "Lesson update failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_delete_lesson",
    {
      title: "Delete Lesson",
      description: `Delete a lesson by ID.

Args:
  - lesson_id (number): Lesson ID

Returns: Success status`,
      inputSchema: LessonIdSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: LessonIdInput) => {
      try {
        const result = await makeApiRequest<boolean>(`/courses/v1/lessons/${params.lesson_id}`, "DELETE");
        return {
          content: [{ type: "text", text: result ? "Lesson deleted successfully" : "Lesson deletion failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  // ==================== SUBMODULES ====================

  server.registerTool(
    "mentortools_list_submodules",
    {
      title: "List Submodules",
      description: `List all submodules in a module.

Args:
  - module_id (number, required): Module ID
  - limit, offset (optional): Pagination

Returns: Array of submodules`,
      inputSchema: ListSubmodulesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListSubmodulesInput) => {
      try {
        const result = await makeApiRequest<unknown[]>(`/courses/v1/modules/${params.module_id}/submodules`, "GET", undefined, {
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
    "mentortools_get_submodule",
    {
      title: "Get Submodule",
      description: `Get submodule by ID.

Args:
  - submodule_id (number): Submodule ID

Returns: Submodule information`,
      inputSchema: SubmoduleIdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: SubmoduleIdInput) => {
      try {
        const result = await makeApiRequest<unknown>(`/courses/v1/submodules/${params.submodule_id}`, "GET");
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_create_submodule",
    {
      title: "Create Submodule",
      description: `Create a new submodule in a module.

Args:
  - module_id (number, required): Module ID
  - title (string, required): Submodule title
  - order (number, required): Position
  - is_published (boolean, optional): Published status

Returns: ID of the newly created submodule`,
      inputSchema: ModuleIdSchema.merge(SubmoduleCreateSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: ModuleIdInput & SubmoduleCreateInput) => {
      try {
        const { module_id, ...submoduleData } = params;
        const result = await makeApiRequest<number>(`/courses/v1/modules/${module_id}/submodules`, "POST", submoduleData);
        return {
          content: [{ type: "text", text: `Submodule created successfully. ID: ${result}` }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_update_submodule",
    {
      title: "Update Submodule (Patch)",
      description: `Update submodule. Only provided fields will be updated.

Args:
  - submodule_id (number, required): Submodule ID
  - title, order, is_published (optional): Fields to update

Returns: Success status`,
      inputSchema: SubmoduleIdSchema.merge(SubmodulePatchSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: SubmoduleIdInput & SubmodulePatchInput) => {
      try {
        const { submodule_id, ...updateData } = params;
        const result = await makeApiRequest<boolean>(`/courses/v1/submodules/${submodule_id}`, "PATCH", updateData);
        return {
          content: [{ type: "text", text: result ? "Submodule updated successfully" : "Submodule update failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "mentortools_delete_submodule",
    {
      title: "Delete Submodule",
      description: `Delete a submodule by ID.

Args:
  - submodule_id (number): Submodule ID

Returns: Success status`,
      inputSchema: SubmoduleIdSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: SubmoduleIdInput) => {
      try {
        const result = await makeApiRequest<boolean>(`/courses/v1/submodules/${params.submodule_id}`, "DELETE");
        return {
          content: [{ type: "text", text: result ? "Submodule deleted successfully" : "Submodule deletion failed" }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
