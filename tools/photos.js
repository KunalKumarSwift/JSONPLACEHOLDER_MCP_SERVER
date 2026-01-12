const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

/**
 * PhotosTools class provides MCP (Model Context Protocol) tools for interacting
 * with JSONPlaceholder photos API endpoints. This includes CRUD operations
 * for photos with proper input validation using Zod schemas.
 */
class PhotosTools {
  /**
   * Constructor initializes all Zod schemas for input validation.
   * Each schema defines the expected structure and types for tool arguments.
   */
  constructor() {
    /**
     * Schema for getting all photos, optionally filtered by albumId
     * Sample: {} or { "albumId": 1 }
     */
    this.getPhotosSchema = z.object({
      albumId: z.number().int().positive().optional(),
    });

    /**
     * Schema for getting a single photo by ID
     * Sample: { "id": 1 }
     */
    this.getPhotoSchema = z.object({
      id: z.number().int().positive(),
    });

    /**
     * Schema for creating a new photo (requires albumId, title, url, thumbnailUrl)
     * Sample: {
     *   "albumId": 1,
     *   "title": "Beautiful Sunset",
     *   "url": "https://example.com/photo.jpg",
     *   "thumbnailUrl": "https://example.com/thumb.jpg"
     * }
     */
    this.createPhotoSchema = z.object({
      albumId: z.number().int().positive(),
      title: z.string().min(1),
      url: z.string().url(),
      thumbnailUrl: z.string().url(),
    });

    /**
     * Schema for updating an existing photo (all fields optional except id)
     * Sample: {
     *   "id": 1,
     *   "albumId": 2,
     *   "title": "Updated Photo Title",
     *   "url": "https://example.com/new-photo.jpg",
     *   "thumbnailUrl": "https://example.com/new-thumb.jpg"
     * }
     */
    this.updatePhotoSchema = z.object({
      id: z.number().int().positive(),
      albumId: z.number().int().positive().optional(),
      title: z.string().min(1).optional(),
      url: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
    });

    /**
     * Schema for deleting a photo by ID
     * Sample: { "id": 1 }
     */
    this.deletePhotoSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  /**
   * Registers all photo-related tools with the MCP server.
   * This method sets up the tool definitions and binds their handlers.
   * Each tool corresponds to a CRUD operation on photos from the JSONPlaceholder API.
   *
   * @param {Object} server - The MCP server instance to register tools with
   */
  register(server) {
    server.registerTool(
      "get_photos",
      {
        description: "Get all photos or filter by albumId",
        inputSchema: this.getPhotosSchema,
      },
      this.getPhotos.bind(this)
    );

    server.registerTool(
      "get_photo",
      {
        description: "Get a single photo by ID",
        inputSchema: this.getPhotoSchema,
      },
      this.getPhoto.bind(this)
    );

    server.registerTool(
      "create_photo",
      {
        description: "Create a new photo",
        inputSchema: this.createPhotoSchema,
      },
      this.createPhoto.bind(this)
    );

    server.registerTool(
      "update_photo",
      {
        description: "Update an existing photo",
        inputSchema: this.updatePhotoSchema,
      },
      this.updatePhoto.bind(this)
    );

    server.registerTool(
      "delete_photo",
      {
        description: "Delete a photo by ID",
        inputSchema: this.deletePhotoSchema,
      },
      this.deletePhoto.bind(this)
    );
  }

  /**
   * Retrieves all photos or filters photos by album ID.
   * Makes a GET request to the JSONPlaceholder photos endpoint.
   * Note: JSONPlaceholder is a mock API, so this returns fake data.
   *
   * @param {Object} args - The input arguments
   * @param {number} [args.albumId] - Optional album ID to filter photos
   * @returns {Object} MCP response with photos data as JSON string
   */
  async getPhotos(args) {
    const validated = this.getPhotosSchema.parse(args);
    const url = validated.albumId
      ? `https://jsonplaceholder.typicode.com/photos?albumId=${validated.albumId}`
      : "https://jsonplaceholder.typicode.com/photos";

    const res = await fetch(url);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Retrieves a single photo by its ID.
   * Makes a GET request to the JSONPlaceholder photos endpoint with the specific ID.
   * Note: JSONPlaceholder is a mock API, so this returns fake data.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.id - The photo ID to retrieve
   * @returns {Object} MCP response with photo data as JSON string
   */
  async getPhoto(args) {
    const validated = this.getPhotoSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Creates a new photo.
   * Makes a POST request to the JSONPlaceholder photos endpoint.
   * Note: JSONPlaceholder is a mock API, so the photo won't actually be created on the server.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.albumId - The album ID this photo belongs to
   * @param {string} args.title - The title of the photo
   * @param {string} args.url - The URL of the full-size photo
   * @param {string} args.thumbnailUrl - The URL of the thumbnail photo
   * @returns {Object} MCP response with created photo data as JSON string
   */
  async createPhoto(args) {
    const validated = this.createPhotoSchema.parse(args);
    const res = await fetch("https://jsonplaceholder.typicode.com/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  /**
   * Updates an existing photo.
   * Makes a PUT request to the JSONPlaceholder photos endpoint with the photo ID.
   * Note: JSONPlaceholder is a mock API, so the photo won't actually be updated on the server.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.id - The photo ID to update
   * @param {number} [args.albumId] - Optional new album ID
   * @param {string} [args.title] - Optional new title
   * @param {string} [args.url] - Optional new URL
   * @param {string} [args.thumbnailUrl] - Optional new thumbnail URL
   * @returns {Object} MCP response with updated photo data as JSON string
   */
  async updatePhoto(args) {
    const validated = this.updatePhotoSchema.parse(args);
    const { id, ...updateData } = validated;
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos/${id}`,
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
   * Deletes a photo by ID.
   * Makes a DELETE request to the JSONPlaceholder photos endpoint.
   * Note: JSONPlaceholder is a mock API, so the photo won't actually be deleted on the server.
   *
   * @param {Object} args - The input arguments
   * @param {number} args.id - The photo ID to delete
   * @returns {Object} MCP response with success/failure message
   */
  async deletePhoto(args) {
    const validated = this.deletePhotoSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos/${validated.id}`,
      {
        method: "DELETE",
      }
    );
    return {
      content: [
        {
          type: "text",
          text: res.ok
            ? "Photo deleted successfully"
            : "Failed to delete photo",
        },
      ],
    };
  }
}

module.exports = PhotosTools;
