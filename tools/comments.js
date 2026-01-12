const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

/**
 * CommentsTools class provides MCP (Model Context Protocol) tools for interacting
 * with JSONPlaceholder comments API endpoints. This includes CRUD operations
 * for comments with proper input validation using Zod schemas.
 */
class CommentsTools {
  /**
   * Constructor initializes all Zod schemas for input validation.
   * Each schema defines the expected structure and types for tool arguments.
   */
  constructor() {
    /**
     * Schema for getting all comments, optionally filtered by postId
     * Sample: {} or { "postId": 1 }
     */
    this.getCommentsSchema = z.object({
      postId: z.number().int().positive().optional(),
    });

    /**
     * Schema for getting a single comment by ID
     * Sample: { "id": 1 }
     */
    this.getCommentSchema = z.object({
      id: z.number().int().positive(),
    });

    /**
     * Schema for creating a new comment (requires postId, name, email, body)
     * Sample: {
     *   "postId": 1,
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "body": "This is a great post!"
     * }
     */
    this.createCommentSchema = z.object({
      postId: z.number().int().positive(),
      name: z.string().min(1),
      email: z.string().email(),
      body: z.string().min(1),
    });

    /**
     * Schema for updating an existing comment (all fields optional except id)
     * Sample: {
     *   "id": 1,
     *   "postId": 2,
     *   "name": "Updated Name",
     *   "email": "updated@example.com",
     *   "body": "Updated comment content"
     * }
     */
    this.updateCommentSchema = z.object({
      id: z.number().int().positive(),
      postId: z.number().int().positive().optional(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      body: z.string().min(1).optional(),
    });

    /**
     * Schema for deleting a comment by ID
     * Sample: { "id": 1 }
     */
    this.deleteCommentSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  /**
   * Registers all comment-related tools with the MCP server.
   * Each tool is registered with a name, description, input schema, and handler function.
   * @param {Object} server - The MCP server instance to register tools with
   */
  register(server) {
    // Tool to get all comments or filter by postId
    server.registerTool(
      "get_comments",
      {
        description: "Get all comments or filter by postId",
        inputSchema: this.getCommentsSchema,
      },
      this.getComments.bind(this)
    );

    // Tool to get a single comment by ID
    server.registerTool(
      "get_comment",
      {
        description: "Get a single comment by ID",
        inputSchema: this.getCommentSchema,
      },
      this.getComment.bind(this)
    );

    // Tool to create a new comment
    server.registerTool(
      "create_comment",
      {
        description: "Create a new comment",
        inputSchema: this.createCommentSchema,
      },
      this.createComment.bind(this)
    );

    // Tool to update an existing comment
    server.registerTool(
      "update_comment",
      {
        description: "Update an existing comment",
        inputSchema: this.updateCommentSchema,
      },
      this.updateComment.bind(this)
    );

    // Tool to delete a comment by ID
    server.registerTool(
      "delete_comment",
      {
        description: "Delete a comment by ID",
        inputSchema: this.deleteCommentSchema,
      },
      this.deleteComment.bind(this)
    );
  }

  /**
   * Retrieves all comments from the JSONPlaceholder API.
   * Optionally filters comments by postId if provided.
   * @param {Object} args - Arguments object, optionally containing postId
   * @returns {Object} MCP response with comment data
   */
  async getComments(args) {
    const validated = this.getCommentsSchema.parse(args);
    const url = validated.postId
      ? `https://jsonplaceholder.typicode.com/comments?postId=${validated.postId}`
      : "https://jsonplaceholder.typicode.com/comments";

    const res = await fetch(url);
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Retrieves a single comment by its ID from the JSONPlaceholder API.
   * @param {Object} args - Arguments object containing the comment id
   * @returns {Object} MCP response with single comment data
   */
  async getComment(args) {
    const validated = this.getCommentSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${validated.id}`
    );
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Creates a new comment in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the comment won't actually be persisted.
   * @param {Object} args - Arguments object containing postId, name, email, and body
   * @returns {Object} MCP response with created comment data
   */
  async createComment(args) {
    const validated = this.createCommentSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Updates an existing comment in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so changes won't actually be persisted.
   * @param {Object} args - Arguments object containing id and optional fields to update
   * @returns {Object} MCP response with updated comment data
   */
  async updateComment(args) {
    const validated = this.updateCommentSchema.parse(args);
    const { id, ...updateData } = validated;
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${id}`,
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
   * Deletes a comment from the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the comment won't actually be deleted.
   * @param {Object} args - Arguments object containing the comment id to delete
   * @returns {Object} MCP response with deletion status
   */
  async deleteComment(args) {
    const validated = this.deleteCommentSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${validated.id}`,
      { method: "DELETE" }
    );

    return {
      content: [
        {
          type: "text",
          text: res.ok
            ? "Comment deleted successfully"
            : "Failed to delete comment",
        },
      ],
    };
  }
}

module.exports = CommentsTools;
