const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

/**
 * Tools class for managing todos via the JSONPlaceholder API.
 * Provides CRUD operations for todo items including creation, retrieval,
 * updating, and deletion. All operations use Zod schemas for input validation.
 * Note: JSONPlaceholder is a mock API, so changes won't persist on the server.
 */
class TodosTools {
  /**
   * Initializes the TodosTools class with Zod schemas for input validation.
   * Sets up schemas for all CRUD operations on todos.
   */
  constructor() {
    /**
     * Schema for getting todos - optionally filter by user ID
     * Sample: {} or { "userId": 1 }
     */
    this.getTodosSchema = z.object({
      userId: z.number().int().positive().optional(),
    });

    /**
     * Schema for getting a single todo by ID
     * Sample: { "id": 1 }
     */
    this.getTodoSchema = z.object({
      id: z.number().int().positive(),
    });

    /**
     * Schema for creating a new todo
     * Sample: {
     *   "title": "Buy groceries",
     *   "completed": false,
     *   "userId": 1
     * }
     */
    this.createTodoSchema = z.object({
      title: z.string().min(1),
      completed: z.boolean(),
      userId: z.number().int().positive(),
    });

    /**
     * Schema for updating an existing todo
     * Sample: {
     *   "id": 1,
     *   "title": "Updated task",
     *   "completed": true,
     *   "userId": 2
     * }
     */
    this.updateTodoSchema = z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).optional(),
      completed: z.boolean().optional(),
      userId: z.number().int().positive().optional(),
    });

    /**
     * Schema for deleting a todo by ID
     * Sample: { "id": 1 }
     */
    this.deleteTodoSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  /**
   * Registers all todo-related tools with the MCP server.
   * This method sets up the tool definitions and binds their handlers.
   * Each tool corresponds to a CRUD operation on todos from the JSONPlaceholder API.
   *
   * @param {Object} server - The MCP server instance to register tools with
   */
  register(server) {
    server.registerTool(
      "get_todos",
      {
        description: "Get all todos or filter by userId",
        inputSchema: this.getTodosSchema,
      },
      this.getTodos.bind(this)
    );

    server.registerTool(
      "get_todo",
      {
        description: "Get a single todo by ID",
        inputSchema: this.getTodoSchema,
      },
      this.getTodo.bind(this)
    );

    server.registerTool(
      "create_todo",
      { description: "Create a new todo", inputSchema: this.createTodoSchema },
      this.createTodo.bind(this)
    );

    server.registerTool(
      "update_todo",
      {
        description: "Update an existing todo",
        inputSchema: this.updateTodoSchema,
      },
      this.updateTodo.bind(this)
    );

    server.registerTool(
      "delete_todo",
      {
        description: "Delete a todo by ID",
        inputSchema: this.deleteTodoSchema,
      },
      this.deleteTodo.bind(this)
    );
  }

  /**
   * Retrieves all todos or filters todos by user ID.
   * Makes a GET request to the JSONPlaceholder todos endpoint.
   * Note: JSONPlaceholder is a mock API, so this returns fake data.
   *
   * @param {Object} args - The input arguments
   * @param {number} [args.userId] - Optional user ID to filter todos
   * @returns {Object} MCP response with todos data as JSON string
   */
  async getTodos(args) {
    const validated = this.getTodosSchema.parse(args);
    const url = validated.userId
      ? `https://jsonplaceholder.typicode.com/todos?userId=${validated.userId}`
      : "https://jsonplaceholder.typicode.com/todos";
    const res = await fetch(url);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Retrieves a single todo by its ID.
   * Makes a GET request to the JSONPlaceholder todos endpoint with the specific ID.
   * Note: JSONPlaceholder is a mock API, so this returns fake data.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.id - The todo ID to retrieve
   * @returns {Object} MCP response with todo data as JSON string
   */
  async getTodo(args) {
    const validated = this.getTodoSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Creates a new todo.
   * Makes a POST request to the JSONPlaceholder todos endpoint.
   * Note: JSONPlaceholder is a mock API, so the todo won't actually be created on the server.
   *
   * @param {Object} args - The input arguments
   * @param {string} args.title - The title of the todo
   * @param {boolean} args.completed - Whether the todo is completed
   * @param {number} args.userId - The user ID this todo belongs to
   * @returns {Object} MCP response with created todo data as JSON string
   */
  async createTodo(args) {
    const validated = this.createTodoSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Updates an existing todo.
   * Makes a PUT request to the JSONPlaceholder todos endpoint with the todo ID.
   * Note: JSONPlaceholder is a mock API, so the todo won't actually be updated on the server.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.id - The todo ID to update
   * @param {string} [args.title] - Optional new title
   * @param {boolean} [args.completed] - Optional new completion status
   * @param {number} [args.userId] - Optional new user ID
   * @returns {Object} MCP response with updated todo data as JSON string
   */
  async updateTodo(args) {
    const validated = this.updateTodoSchema.parse(args);
    const { id, ...updateData } = validated;
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Deletes a todo by ID.
   * Makes a DELETE request to the JSONPlaceholder todos endpoint.
   * Note: JSONPlaceholder is a mock API, so the todo won't actually be deleted on the server.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.id - The todo ID to delete
   * @returns {Object} MCP response with success/failure message
   */
  async deleteTodo(args) {
    const validated = this.deleteTodoSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${validated.id}`,
      {
        method: "DELETE",
      }
    );
    return {
      content: [
        {
          type: "text",
          text: res.ok ? "Todo deleted successfully" : "Failed to delete todo",
        },
      ],
    };
  }
}

module.exports = TodosTools;
