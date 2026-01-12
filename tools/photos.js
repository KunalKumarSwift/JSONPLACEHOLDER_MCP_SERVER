const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

class PhotosTools {
  constructor() {
    this.getPhotosSchema = z.object({
      albumId: z.number().int().positive().optional(),
    });

    this.getPhotoSchema = z.object({
      id: z.number().int().positive(),
    });

    this.createPhotoSchema = z.object({
      albumId: z.number().int().positive(),
      title: z.string().min(1),
      url: z.string().url(),
      thumbnailUrl: z.string().url(),
    });

    this.updatePhotoSchema = z.object({
      id: z.number().int().positive(),
      albumId: z.number().int().positive().optional(),
      title: z.string().min(1).optional(),
      url: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
    });

    this.deletePhotoSchema = z.object({
      id: z.number().int().positive(),
    });
  }

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

  async getPhotos(args) {
    const validated = this.getPhotosSchema.parse(args);
    const url = validated.albumId
      ? `https://jsonplaceholder.typicode.com/photos?albumId=${validated.albumId}`
      : "https://jsonplaceholder.typicode.com/photos";

    const res = await fetch(url);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async getPhoto(args) {
    const validated = this.getPhotoSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

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
