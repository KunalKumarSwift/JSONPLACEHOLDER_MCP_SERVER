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

1. Clone this repository
2. Run `npm install`
3. Run `npm start` to start the server

## Usage

This server uses stdio transport and can be connected to MCP clients like Claude Desktop.

The `.vscode/mcp.json` file is configured for debugging in VS Code.

## API Reference

All tools follow RESTful conventions and interact with https://jsonplaceholder.typicode.com/

Note: JSONPlaceholder is a fake API, so create/update/delete operations return mock responses but don't persist data.