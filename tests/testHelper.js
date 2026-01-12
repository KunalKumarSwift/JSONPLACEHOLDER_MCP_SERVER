const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");

class MCPTestHelper {
  constructor() {
    this.transport = null;
    this.client = null;
  }

  async startServer() {
    // Create MCP client transport
    this.transport = new StdioClientTransport({
      command: "node",
      args: ["build/index.js"],
      cwd: process.cwd(),
    });

    // Create MCP client
    this.client = new Client({
      name: "test-client",
      version: "1.0.0",
    });

    await this.client.connect(this.transport);
  }

  async stopServer() {
    if (this.client) {
      await this.client.close();
    }
  }

  async testTool(toolName, args = {}) {
    try {
      console.log(`Testing ${toolName} with args:`, args);
      const result = await this.client.callTool({
        name: toolName,
        arguments: args,
      });
      console.log(
        `✓ ${toolName} succeeded:`,
        result.content[0].text.substring(0, 100) + "..."
      );
      return result;
    } catch (error) {
      console.log(`✗ ${toolName} failed:`, error.message);
      throw error;
    }
  }

  async runTests(testCases) {
    const results = [];
    for (const testCase of testCases) {
      try {
        const result = await this.testTool(testCase.name, testCase.args);
        results.push({ name: testCase.name, success: true, result });
      } catch (error) {
        results.push({ name: testCase.name, success: false, error });
      }
    }
    return results;
  }
}

module.exports = MCPTestHelper;
