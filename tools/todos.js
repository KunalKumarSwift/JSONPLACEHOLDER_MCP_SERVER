const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

class TodosTools {
  constructor() {
    this.getTodosSchema = z.object({
      userId: z.number().int().positive().optional(),
    });

    this.getTodoSchema = z.object({
      id: z.number().int().positive(),
    });

    this.createTodoSchema = z.object({
      title: z.string().min(1),
      completed: z.boolean(),
      userId: z.number().int().positive(),
    });

    this.updateTodoSchema = z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).optional(),
      completed: z.boolean().optional(),
      userId: z.number().int().positive().optional(),
    });

    this.deleteTodoSchema = z.object({
      id: z.number().int().positive(),
    });
  }

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

  async getTodos(args) {
    const validated = this.getTodosSchema.parse(args);
    const url = validated.userId
      ? `https://jsonplaceholder.typicode.com/todos?userId=${validated.userId}`
      : "https://jsonplaceholder.typicode.com/todos";
    const res = await fetch(url);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async getTodo(args) {
    const validated = this.getTodoSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

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
