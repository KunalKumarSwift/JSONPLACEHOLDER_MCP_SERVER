const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

class UsersTools {
  constructor() {
    this.getUsersSchema = z.object({});
    this.getUserSchema = z.object({
      id: z.number().int().positive(),
    });
    this.createUserSchema = z.object({
      name: z.string().min(1),
      username: z.string().min(1),
      email: z.string().email(),
      address: z
        .object({
          street: z.string().optional(),
          suite: z.string().optional(),
          city: z.string().optional(),
          zipcode: z.string().optional(),
          geo: z
            .object({
              lat: z.string().optional(),
              lng: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
      company: z
        .object({
          name: z.string().optional(),
          catchPhrase: z.string().optional(),
          bs: z.string().optional(),
        })
        .optional(),
    });
    this.updateUserSchema = this.createUserSchema.extend({
      id: z.number().int().positive(),
    });
    this.deleteUserSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  register(server) {
    server.registerTool(
      "get_users",
      { description: "Get all users", inputSchema: this.getUsersSchema },
      this.getUsers.bind(this)
    );

    server.registerTool(
      "get_user",
      {
        description: "Get a single user by ID",
        inputSchema: this.getUserSchema,
      },
      this.getUser.bind(this)
    );

    server.registerTool(
      "create_user",
      { description: "Create a new user", inputSchema: this.createUserSchema },
      this.createUser.bind(this)
    );

    server.registerTool(
      "update_user",
      {
        description: "Update an existing user",
        inputSchema: this.updateUserSchema,
      },
      this.updateUser.bind(this)
    );

    server.registerTool(
      "delete_user",
      {
        description: "Delete a user by ID",
        inputSchema: this.deleteUserSchema,
      },
      this.deleteUser.bind(this)
    );
  }

  async getUsers(args) {
    this.getUsersSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async getUser(args) {
    const validated = this.getUserSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async createUser(args) {
    const validated = this.createUserSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async updateUser(args) {
    const validated = this.updateUserSchema.parse(args);
    const { id, ...updateData } = validated;
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async deleteUser(args) {
    const validated = this.deleteUserSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${validated.id}`,
      {
        method: "DELETE",
      }
    );
    return {
      content: [
        {
          type: "text",
          text: res.ok ? "User deleted successfully" : "Failed to delete user",
        },
      ],
    };
  }
}

module.exports = UsersTools;
