const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

/**
 * PostsTools class provides MCP (Model Context Protocol) tools for interacting
 * with JSONPlaceholder posts API endpoints. This includes CRUD operations
 * for posts with proper input validation using Zod schemas.
 */
class PostsTools {
  /**
   * Constructor initializes all Zod schemas for input validation.
   * Each schema defines the expected structure and types for tool arguments.
   */
  constructor() {
    /**
     * Schema for getting all posts, optionally filtered by userId
     * Sample: {} or { "userId": 1 }
     */
    this.getPostsSchema = z.object({
      userId: z.number().int().positive().optional(),
    });

    /**
     * Schema for getting a single post by ID
     * Sample: { "id": 1 }
     */
    this.getPostSchema = z.object({
      id: z.number().int().positive(),
    });

    /**
     * Schema for creating a new post (requires title, body, and userId)
     * Sample: {
     *   "title": "My Post Title",
     *   "body": "This is the content of my post",
     *   "userId": 1
     * }
     */
    this.createPostSchema = z.object({
      title: z.string().min(1),
      body: z.string().min(1),
      userId: z.number().int().positive(),
    });

    /**
     * Schema for updating an existing post (all fields optional except id)
     * Sample: {
     *   "id": 1,
     *   "title": "Updated Title",
     *   "body": "Updated content"
     * }
     */
    this.updatePostSchema = z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).optional(),
      body: z.string().min(1).optional(),
      userId: z.number().int().positive().optional(),
    });

    /**
     * Schema for deleting a post by ID
     * Sample: { "id": 1 }
     */
    this.deletePostSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  /**
   * Registers all post-related tools with the MCP server.
   * Each tool is registered with a name, description, input schema, and handler function.
   * @param {Object} server - The MCP server instance to register tools with
   */
  register(server) {
    // Tool to get all posts or filter by userId
    server.registerTool(
      "get_posts",
      {
        description: "Get all posts or filter by userId",
        inputSchema: this.getPostsSchema,
      },
      this.getPosts.bind(this)
    );

    // Tool to get a single post by ID
    server.registerTool(
      "get_post",
      {
        description: "Get a single post by ID",
        inputSchema: this.getPostSchema,
      },
      this.getPost.bind(this)
    );

    // Tool to create a new post
    server.registerTool(
      "create_post",
      { description: "Create a new post", inputSchema: this.createPostSchema },
      this.createPost.bind(this)
    );

    // Tool to update an existing post
    server.registerTool(
      "update_post",
      {
        description: "Update an existing post",
        inputSchema: this.updatePostSchema,
      },
      this.updatePost.bind(this)
    );

    // Tool to delete a post by ID
    server.registerTool(
      "delete_post",
      {
        description: "Delete a post by ID",
        inputSchema: this.deletePostSchema,
      },
      this.deletePost.bind(this)
    );
  }

  /**
   * Retrieves all posts from the JSONPlaceholder API.
   * Optionally filters posts by userId if provided.
   * @param {Object} args - Arguments object, optionally containing userId
   * @returns {Object} MCP response with post data
   */
  async getPosts(args) {
    const validated = this.getPostsSchema.parse(args);
    const url = validated.userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${validated.userId}`
      : "https://jsonplaceholder.typicode.com/posts";
    const res = await fetch(url);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Retrieves a single post by its ID from the JSONPlaceholder API.
   * @param {Object} args - Arguments object containing the post id
   * @returns {Object} MCP response with single post data
   */
  async getPost(args) {
    const validated = this.getPostSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Creates a new post in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the post won't actually be persisted.
   * @param {Object} args - Arguments object containing title, body, and userId
   * @returns {Object} MCP response with created post data
   */
  async createPost(args) {
    const validated = this.createPostSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Updates an existing post in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so changes won't actually be persisted.
   * @param {Object} args - Arguments object containing id and optional fields to update
   * @returns {Object} MCP response with updated post data
   */
  async updatePost(args) {
    const validated = this.updatePostSchema.parse(args);
    const { id, ...updateData } = validated;
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
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
   * Deletes a post from the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the post won't actually be deleted.
   * @param {Object} args - Arguments object containing the post id to delete
   * @returns {Object} MCP response with deletion status
   */
  async deletePost(args) {
    const validated = this.deletePostSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${validated.id}`,
      {
        method: "DELETE",
      }
    );
    return {
      content: [
        {
          type: "text",
          text: res.ok ? "Post deleted successfully" : "Failed to delete post",
        },
      ],
    };
  }
}

module.exports = PostsTools;
