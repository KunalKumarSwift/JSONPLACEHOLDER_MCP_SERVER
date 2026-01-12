const { z } = require("zod");

// Node 18+ has fetch globally
const fetch = globalThis.fetch;

if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

/**
 * AlbumsTools class provides MCP (Model Context Protocol) tools for interacting
 * with JSONPlaceholder albums API endpoints. This includes CRUD operations
 * for albums with proper input validation using Zod schemas.
 */
class AlbumsTools {
  /**
   * Constructor initializes all Zod schemas for input validation.
   * Each schema defines the expected structure and types for tool arguments.
   */
  constructor() {
    /**
     * Schema for getting all albums, optionally filtered by userId
     * Sample: {} or { "userId": 1 }
     */
    this.getAlbumsSchema = z.object({
      userId: z.number().int().positive().optional(),
    });

    /**
     * Schema for getting a single album by ID
     * Sample: { "id": 1 }
     */
    this.getAlbumSchema = z.object({
      id: z.number().int().positive(),
    });

    /**
     * Schema for creating a new album (requires title and userId)
     * Sample: {
     *   "title": "My Album",
     *   "userId": 1
     * }
     */
    this.createAlbumSchema = z.object({
      title: z.string().min(1),
      userId: z.number().int().positive(),
    });

    /**
     * Schema for updating an existing album (all fields optional except id)
     * Sample: {
     *   "id": 1,
     *   "title": "Updated Album Title",
     *   "userId": 2
     * }
     */
    this.updateAlbumSchema = z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).optional(),
      userId: z.number().int().positive().optional(),
    });

    /**
     * Schema for deleting an album by ID
     * Sample: { "id": 1 }
     */
    this.deleteAlbumSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  /**
   * Registers all album-related tools with the MCP server.
   * Each tool is registered with a name, description, input schema, and handler function.
   * @param {Object} server - The MCP server instance to register tools with
   */
  register(server) {
    // Tool to get all albums or filter by userId
    server.registerTool(
      "get_albums",
      {
        description: "Get all albums or filter by userId",
        inputSchema: this.getAlbumsSchema,
      },
      this.getAlbums.bind(this)
    );

    // Tool to get a single album by its ID
    server.registerTool(
      "get_album",
      {
        description: "Get a single album by ID",
        inputSchema: this.getAlbumSchema,
      },
      this.getAlbum.bind(this)
    );

    // Tool to create a new album
    server.registerTool(
      "create_album",
      {
        description: "Create a new album",
        inputSchema: this.createAlbumSchema,
      },
      this.createAlbum.bind(this)
    );

    // Tool to update an existing album
    server.registerTool(
      "update_album",
      {
        description: "Update an existing album",
        inputSchema: this.updateAlbumSchema,
      },
      this.updateAlbum.bind(this)
    );

    // Tool to delete an album by ID
    server.registerTool(
      "delete_album",
      {
        description: "Delete an album by ID",
        inputSchema: this.deleteAlbumSchema,
      },
      this.deleteAlbum.bind(this)
    );
  }

  /**
   * Retrieves all albums from the JSONPlaceholder API.
   * Optionally filters albums by userId if provided.
   * @param {Object} args - Arguments object, optionally containing userId
   * @returns {Object} MCP response with album data
   */
  async getAlbums(args) {
    // Validate input arguments against the schema
    const validated = this.getAlbumsSchema.parse(args);

    // Build URL with optional userId filter
    const url = validated.userId
      ? `https://jsonplaceholder.typicode.com/albums?userId=${validated.userId}`
      : "https://jsonplaceholder.typicode.com/albums";

    // Fetch data from the API
    const res = await fetch(url);
    const data = await res.json();

    // Return formatted response for MCP
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Retrieves a single album by its ID from the JSONPlaceholder API.
   * @param {Object} args - Arguments object containing the album id
   * @returns {Object} MCP response with single album data
   */
  async getAlbum(args) {
    // Validate input arguments
    const validated = this.getAlbumSchema.parse(args);

    // Fetch the specific album
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${validated.id}`
    );
    const data = await res.json();

    // Return formatted response
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Creates a new album in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the album won't actually be persisted.
   * @param {Object} args - Arguments object containing title and userId
   * @returns {Object} MCP response with created album data
   */
  async createAlbum(args) {
    // Validate input arguments
    const validated = this.createAlbumSchema.parse(args);

    // Send POST request to create album
    const res = await fetch("https://jsonplaceholder.typicode.com/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });

    // Get response data
    const data = await res.json();

    // Return formatted response
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Updates an existing album in the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so changes won't actually be persisted.
   * @param {Object} args - Arguments object containing id and optional fields to update
   * @returns {Object} MCP response with updated album data
   */
  async updateAlbum(args) {
    // Validate input arguments
    const validated = this.updateAlbumSchema.parse(args);

    // Extract id from validated args, rest goes in update data
    const { id, ...updateData } = validated;

    // Send PUT request to update album
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );

    // Get response data
    const data = await res.json();

    // Return formatted response
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Deletes an album from the JSONPlaceholder API.
   * Note: JSONPlaceholder is a mock API, so the album won't actually be deleted.
   * @param {Object} args - Arguments object containing the album id to delete
   * @returns {Object} MCP response with deletion status
   */
  async deleteAlbum(args) {
    // Validate input arguments
    const validated = this.deleteAlbumSchema.parse(args);

    // Send DELETE request
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${validated.id}`,
      { method: "DELETE" }
    );

    // Return success/failure message
    return {
      content: [
        {
          type: "text",
          text: res.ok
            ? "Album deleted successfully"
            : "Failed to delete album",
        },
      ],
    };
  }
}

module.exports = AlbumsTools;
