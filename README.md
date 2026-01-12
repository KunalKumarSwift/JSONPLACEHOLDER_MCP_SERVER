# JSONPlaceholder MCP Server

This is a Model Context Protocol (MCP) server that provides tools to interact with the JSONPlaceholder API.

## Features

The server provides tools for all JSONPlaceholder endpoints:

- **Posts**: get_posts, get_post, create_post, update_post, delete_post
- **Comments**: get_comments, get_comment, create_comment, update_comment, delete_comment
- **Albums**: get_albums, get_album, create_album, update_album, delete_album
- **Photos**: get_photos, get_photo, create_photo, update_photo, delete_photo
- **Todos**: get_todos, get_todo, create_todo, update_todo, delete_todo
- **Users**: get_users, get_user, create_user, update_user, delete_user

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd jsonplaceholder-mcp-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the server:

   ```bash
   npm run build
   ```

   This bundles the server with `esbuild` into the `build/` folder.

4. Start the server:

   ```bash
   npm start
   ```

   You should see:

   ```
   JSONPlaceholder MCP server running on stdio
   ```

## Usage

- The server uses **stdio transport**, which means it can communicate with any MCP client that supports stdio.
- Common MCP clients include:

  - **VS Code MCP extension** (for debugging and testing tools)
  - **Claude Desktop**

### Connecting in an MCP Client

1. Open your MCP client (VS Code, Claude, etc.)
2. Configure it to use a custom MCP server with stdio transport.
3. Point the client to the server you just started (`npm start`).

All tools (posts, comments, albums, photos, todos, users) will now be available in the client.

## API Reference

- All tools follow REST-like conventions and interact with the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/).
- **Note:** JSONPlaceholder is a fake API; create/update/delete operations return mock responses but do **not** persist data.

## Issues Fixed

1. **Removed nested code fence delimiters** - The original had `````markdown` at the start which created an incorrect nesting structure
2. **Properly closed the first bash code block** - Added the missing closing backticks after the clone/cd commands
3. **Removed trailing incomplete code fence** - Removed the dangling triple backticks at the very end

The markdown should now render correctly with all code blocks properly formatt
