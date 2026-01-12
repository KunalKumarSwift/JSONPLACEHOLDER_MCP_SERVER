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

## Testing

The project includes a comprehensive test suite to verify all MCP tools are working correctly. Tests use JSON RPC communication to interact with the server.

### Running Tests

#### Run All Tests

```bash
npm test
```

#### Run Individual Test Suites

```bash
# Test specific tool categories
npm run test:users      # Test user-related tools
npm run test:posts      # Test post-related tools
npm run test:comments   # Test comment-related tools
npm run test:albums     # Test album-related tools
npm run test:photos     # Test photo-related tools
npm run test:todos      # Test todo-related tools
```

#### Run Tests Directly

```bash
# Run individual test files
node tests/users.test.js
node tests/posts.test.js
node tests/comments.test.js
node tests/albums.test.js
node tests/photos.test.js
node tests/todos.test.js

# Run the main test runner
node tests/tests.js
```

### Test Structure

The test suite is organized into separate files for each tool category:

```
tests/
├── testHelper.js          # Shared MCP testing utilities
├── tests.js              # Main test runner (runs all tests)
├── users.test.js         # Users tool tests (5 tests)
├── posts.test.js         # Posts tool tests (6 tests)
├── comments.test.js      # Comments tool tests (6 tests)
├── albums.test.js        # Albums tool tests (6 tests)
├── photos.test.js        # Photos tool tests (6 tests)
└── todos.test.js         # Todos tool tests (6 tests)
```

### Test Coverage

Each tool category includes tests for:

- **GET all items** (e.g., `get_users`, `get_posts`)
- **GET filtered items** (e.g., `get_posts?userId=1`, `get_comments?postId=1`)
- **GET single item** (e.g., `get_user`, `get_post`)
- **CREATE new item** (e.g., `create_user`, `create_post`)
- **UPDATE existing item** (e.g., `update_user`, `update_post`)
- **DELETE item** (e.g., `delete_user`, `delete_post`)

**Total: 35 individual tests across 6 test suites**

### Test Output

When tests pass, you'll see:

```
==================================================
Running Users Tests
==================================================

Starting Users Tests...
JSONPlaceholder MCP server running on stdio
Testing get_users with args: {}
✓ get_users succeeded: [...]

Users Tests Results: 5 passed, 0 failed
✅ Users tests: PASSED
```

### Debugging Tests

If tests fail, the output will show:

- Which specific test failed
- Error messages from the MCP server
- Individual test results for each suite

You can run individual test suites to isolate issues:

```bash
npm run test:users  # Only run user tests
```

## API Reference

- All tools follow REST-like conventions and interact with the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/).
- **Note:** JSONPlaceholder is a fake API; create/update/delete operations return mock responses but do **not** persist data.

## Development

### Project Structure

```
├── index.js              # Main server entry point
├── build/index.js        # Bundled server (generated)
├── tools/                # Individual tool implementations
│   ├── users.js
│   ├── posts.js
│   ├── comments.js
│   ├── albums.js
│   ├── photos.js
│   └── todos.js
├── tests/                # Test suite
│   ├── testHelper.js     # Shared testing utilities
│   ├── tests.js         # Main test runner
│   └── *.test.js        # Individual test files
├── package.json
└── README.md
```

### Available Scripts

- `npm run build` - Bundle the server with esbuild
- `npm start` - Start the MCP server
- `npm test` - Run all tests
- `npm run test:*` - Run specific test suites

### VS Code Development

This project includes VS Code configurations for easy development and debugging:

#### Launch Configurations

The `.vscode/launch.json` file provides several run/debug configurations:

- **Run MCP Server (Development)**: Runs the server from source code (`index.js`)
- **Run MCP Server (Production)**: Runs the built server (`build/index.js`)
- **Debug MCP Server**: Debug the server with breakpoints and inspection
- **Run Tests**: Run the test suite with debugging capabilities

#### Tasks

The `.vscode/tasks.json` file provides build tasks:

- **Build MCP Server**: Builds the project using `npm run build`
- **Run Tests**: Runs all tests using `npm test`
- **Install Dependencies**: Installs npm dependencies
- **Clean Build**: Removes the build directory

#### How to Use

1. **Running the Server:**

   - Open the Run and Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
   - Select "Run MCP Server (Development)" from the dropdown
   - Click the green play button or press F5

2. **Debugging:**

   - Set breakpoints in your code
   - Select "Debug MCP Server" configuration
   - Run with F5 - the server will start and you can debug with breakpoints

3. **Running Tests:**

   - Select "Run Tests" from the launch configurations
   - Or use Ctrl+Shift+P → "Tasks: Run Task" → "Run Tests"

4. **Building:**
   - Use Ctrl+Shift+P → "Tasks: Run Build Task" → "Build MCP Server"
   - Or use the terminal: `npm run build`

#### MCP Configuration

The `.vscode/mcp.json` file configures the MCP server for VS Code's MCP extension:

```json
{
  "servers": {
    "jsonplaceholder-server": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"]
    }
  }
}
```

### MCP SDK

This project uses the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk) for Node.js.
