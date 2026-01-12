const { z } = require("zod");

// Node 18+ has fetch globally
const fetch = globalThis.fetch;

if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

class AlbumsTools {
  constructor() {
    this.getAlbumsSchema = z.object({
      userId: z.number().int().positive().optional(),
    });

    this.getAlbumSchema = z.object({
      id: z.number().int().positive(),
    });

    this.createAlbumSchema = z.object({
      title: z.string().min(1),
      userId: z.number().int().positive(),
    });

    this.updateAlbumSchema = z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).optional(),
      userId: z.number().int().positive().optional(),
    });

    this.deleteAlbumSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  register(server) {
    server.registerTool(
      "get_albums",
      {
        description: "Get all albums or filter by userId",
        inputSchema: this.getAlbumsSchema,
      },
      this.getAlbums.bind(this)
    );

    server.registerTool(
      "get_album",
      {
        description: "Get a single album by ID",
        inputSchema: this.getAlbumSchema,
      },
      this.getAlbum.bind(this)
    );

    server.registerTool(
      "create_album",
      {
        description: "Create a new album",
        inputSchema: this.createAlbumSchema,
      },
      this.createAlbum.bind(this)
    );

    server.registerTool(
      "update_album",
      {
        description: "Update an existing album",
        inputSchema: this.updateAlbumSchema,
      },
      this.updateAlbum.bind(this)
    );

    server.registerTool(
      "delete_album",
      {
        description: "Delete an album by ID",
        inputSchema: this.deleteAlbumSchema,
      },
      this.deleteAlbum.bind(this)
    );
  }

  async getAlbums(args) {
    const validated = this.getAlbumsSchema.parse(args);

    const url = validated.userId
      ? `https://jsonplaceholder.typicode.com/albums?userId=${validated.userId}`
      : "https://jsonplaceholder.typicode.com/albums";

    const res = await fetch(url);
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async getAlbum(args) {
    const validated = this.getAlbumSchema.parse(args);

    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${validated.id}`
    );
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async createAlbum(args) {
    const validated = this.createAlbumSchema.parse(args);

    const res = await fetch("https://jsonplaceholder.typicode.com/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });

    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async updateAlbum(args) {
    const validated = this.updateAlbumSchema.parse(args);
    const { id, ...updateData } = validated;

    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );

    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async deleteAlbum(args) {
    const validated = this.deleteAlbumSchema.parse(args);

    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${validated.id}`,
      { method: "DELETE" }
    );

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
