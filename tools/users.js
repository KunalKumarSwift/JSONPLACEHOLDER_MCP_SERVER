const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

/**
 * UsersTools class provides MCP (Model Context Protocol) tools for interacting
 * with JSONPlaceholder users API endpoints. This includes CRUD operations
 * for users with proper input validation using Zod schemas.
 */
class UsersTools {
  /**
   * Constructor initializes all Zod schemas for input validation.
   * Each schema defines the expected structure and types for tool arguments.
   */
  constructor() {
    /**
     * Schema for getting all users (no parameters needed)
     * Sample: {}
     */
    this.getUsersSchema = z.object({});

    /**
     * Schema for getting a single user by ID
     * Sample: { "id": 1 }
     */
    this.getUserSchema = z.object({
      id: z.number().int().positive(),
    });

    /**
     * Schema for creating a new user (name, username, email required, others optional)
     * Sample: {
     *   "name": "John Doe",
     *   "username": "johndoe",
     *   "email": "john@example.com",
     *   "phone": "1-770-736-8031",
     *   "website": "example.com"
     * }
     */
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

    /**
     * Schema for updating an existing user (all fields optional except id)
     * Sample: {
     *   "id": 1,
     *   "name": "Updated Name",
     *   "username": "updateduser",
     *   "email": "updated@example.com",
     *   "address": {
     *     "street": "Updated Street",
     *     "suite": "Apt. 123",
     *     "city": "Updated City",
     *     "zipcode": "12345",
     *     "geo": {
     *       "lat": "40.7128",
     *       "lng": "-74.0060"
     *     }
     *   },
     *   "phone": "555-1234",
     *   "website": "updatedsite.com",
     *   "company": {
     *     "name": "Updated Company",
     *     "catchPhrase": "Updated catch phrase",
     *     "bs": "Updated business"
     *   }
     * }
     */
    this.updateUserSchema = z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).optional(),
      username: z.string().min(1).optional(),
      email: z.string().email().optional(),
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

    /**
     * Schema for deleting a user by ID
     * Sample: { "id": 1 }
     */
    this.deleteUserSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  /**
   * Registers all user-related tools with the MCP server.
   * Each tool is registered with a name, description, input schema, and handler function.
   * @param {Object} server - The MCP server instance to register tools with
   */
  register(server) {
    // Tool to get all users
    server.registerTool(
      "get_users",
      { description: "Get all users", inputSchema: this.getUsersSchema },
      this.getUsers.bind(this)
    );

    // Tool to get a single user by ID
    server.registerTool(
      "get_user",
      {
        description: "Get a single user by ID",
        inputSchema: this.getUserSchema,
      },
      this.getUser.bind(this)
    );

    // Tool to create a new user
    server.registerTool(
      "create_user",
      { description: "Create a new user", inputSchema: this.createUserSchema },
      this.createUser.bind(this)
    );

    // Tool to update an existing user
    server.registerTool(
      "update_user",
      {
        description: "Update an existing user",
        inputSchema: this.updateUserSchema,
      },
      this.updateUser.bind(this)
    );

    // Tool to delete a user by ID
    server.registerTool(
      "delete_user",
      {
        description: "Delete a user by ID",
        inputSchema: this.deleteUserSchema,
      },
      this.deleteUser.bind(this)
    );
  }

  /**
   * Retrieves all users from the JSONPlaceholder API.
   * @param {Object} args - Arguments object (empty for this endpoint)
   * @returns {Object} MCP response with user data
   */
  async getUsers(args) {
    this.getUsersSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Retrieves a single user by ID from the JSONPlaceholder API.
   * @param {Object} args - Arguments object containing the user id
   * @returns {Object} MCP response with single user data
   */
  async getUser(args) {
    const validated = this.getUserSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Creates a new user in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the user won't actually be persisted.
   * @param {Object} args - Arguments object containing user data
   * @returns {Object} MCP response with created user data
   */
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

  /**
   * Updates an existing user in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so changes won't actually be persisted.
   * @param {Object} args - Arguments object containing id and optional fields to update
   * @returns {Object} MCP response with updated user data
   */
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

  /**
   * Deletes a user from the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the user won't actually be deleted.
   * @param {Object} args - Arguments object containing the user id to delete
   * @returns {Object} MCP response with deletion status
   */
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
