const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

class CommentsTools {
  constructor() {
    this.getCommentsSchema = z.object({
      postId: z.number().int().positive().optional(),
    });

    this.getCommentSchema = z.object({
      id: z.number().int().positive(),
    });

    this.createCommentSchema = z.object({
      postId: z.number().int().positive(),
      name: z.string().min(1),
      email: z.string().email(),
      body: z.string().min(1),
    });

    this.updateCommentSchema = z.object({
      id: z.number().int().positive(),
      postId: z.number().int().positive().optional(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      body: z.string().min(1).optional(),
    });

    this.deleteCommentSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  register(server) {
    server.registerTool(
      "get_comments",
      {
        description: "Get all comments or filter by postId",
        inputSchema: this.getCommentsSchema,
      },
      this.getComments.bind(this)
    );

    server.registerTool(
      "get_comment",
      {
        description: "Get a single comment by ID",
        inputSchema: this.getCommentSchema,
      },
      this.getComment.bind(this)
    );

    server.registerTool(
      "create_comment",
      {
        description: "Create a new comment",
        inputSchema: this.createCommentSchema,
      },
      this.createComment.bind(this)
    );

    server.registerTool(
      "update_comment",
      {
        description: "Update an existing comment",
        inputSchema: this.updateCommentSchema,
      },
      this.updateComment.bind(this)
    );

    server.registerTool(
      "delete_comment",
      {
        description: "Delete a comment by ID",
        inputSchema: this.deleteCommentSchema,
      },
      this.deleteComment.bind(this)
    );
  }

  async getComments(args) {
    const validated = this.getCommentsSchema.parse(args);
    const url = validated.postId
      ? `https://jsonplaceholder.typicode.com/comments?postId=${validated.postId}`
      : "https://jsonplaceholder.typicode.com/comments";

    const res = await fetch(url);
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async getComment(args) {
    const validated = this.getCommentSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${validated.id}`
    );
    const data = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

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
