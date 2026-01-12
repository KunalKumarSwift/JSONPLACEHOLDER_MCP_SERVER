const { z } = require("zod");

// Node 18+ has global fetch
const fetch = globalThis.fetch;
if (!fetch) {
  throw new Error("Global fetch is not available. Use Node 18+.");
}

class PostsTools {
  constructor() {
    this.getPostsSchema = z.object({
      userId: z.number().int().positive().optional(),
    });

    this.getPostSchema = z.object({
      id: z.number().int().positive(),
    });

    this.createPostSchema = z.object({
      title: z.string().min(1),
      body: z.string().min(1),
      userId: z.number().int().positive(),
    });

    this.updatePostSchema = z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).optional(),
      body: z.string().min(1).optional(),
      userId: z.number().int().positive().optional(),
    });

    this.deletePostSchema = z.object({
      id: z.number().int().positive(),
    });
  }

  register(server) {
    server.registerTool(
      "get_posts",
      {
        description: "Get all posts or filter by userId",
        inputSchema: this.getPostsSchema,
      },
      this.getPosts.bind(this)
    );

    server.registerTool(
      "get_post",
      {
        description: "Get a single post by ID",
        inputSchema: this.getPostSchema,
      },
      this.getPost.bind(this)
    );

    server.registerTool(
      "create_post",
      { description: "Create a new post", inputSchema: this.createPostSchema },
      this.createPost.bind(this)
    );

    server.registerTool(
      "update_post",
      {
        description: "Update an existing post",
        inputSchema: this.updatePostSchema,
      },
      this.updatePost.bind(this)
    );

    server.registerTool(
      "delete_post",
      {
        description: "Delete a post by ID",
        inputSchema: this.deletePostSchema,
      },
      this.deletePost.bind(this)
    );
  }

  async getPosts(args) {
    const validated = this.getPostsSchema.parse(args);
    const url = validated.userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${validated.userId}`
      : "https://jsonplaceholder.typicode.com/posts";
    const res = await fetch(url);
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

  async getPost(args) {
    const validated = this.getPostSchema.parse(args);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${validated.id}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }

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
