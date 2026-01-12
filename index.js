const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");

const PostsTools = require("./tools/posts.js");
const CommentsTools = require("./tools/comments.js");
const AlbumsTools = require("./tools/albums.js");
const PhotosTools = require("./tools/photos.js");
const TodosTools = require("./tools/todos.js");
const UsersTools = require("./tools/users.js");

class JSONPlaceholderServer {
  constructor() {
    this.server = new McpServer({
      name: "jsonplaceholder-mcp-server",
      version: "1.0.0",
    });

    this.registerTools();
  }

  registerTools() {
    // Initialize tool classes
    const postsTools = new PostsTools();
    const commentsTools = new CommentsTools();
    const albumsTools = new AlbumsTools();
    const photosTools = new PhotosTools();
    const todosTools = new TodosTools();
    const usersTools = new UsersTools();

    // Register all tools
    postsTools.register(this.server);
    commentsTools.register(this.server);
    albumsTools.register(this.server);
    photosTools.register(this.server);
    todosTools.register(this.server);
    usersTools.register(this.server);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("JSONPlaceholder MCP server running on stdio");
  }
}

const server = new JSONPlaceholderServer();
server.run().catch(console.error);
