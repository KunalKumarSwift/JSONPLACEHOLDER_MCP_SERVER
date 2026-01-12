const MCPTestHelper = require("./testHelper");

async function runTodosTests() {
  const helper = new MCPTestHelper();

  const testCases = [
    { name: "get_todos", args: {} },
    { name: "get_todos", args: { userId: 1 } },
    { name: "get_todo", args: { id: 1 } },
    {
      name: "create_todo",
      args: { title: "Test Todo", completed: false, userId: 1 },
    },
    { name: "update_todo", args: { id: 1, title: "Updated Todo" } },
    { name: "delete_todo", args: { id: 1 } },
  ];

  try {
    console.log("Starting Todos Tests...");
    await helper.startServer();
    const results = await helper.runTests(testCases);

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\nTodos Tests Results: ${passed} passed, ${failed} failed`);

    if (failed > 0) {
      console.log("Failed tests:");
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`- ${r.name}: ${r.error.message}`);
        });
    }

    return failed === 0;
  } finally {
    await helper.stopServer();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTodosTests()
    .then((success) => {
      console.log(
        success ? "All todos tests passed!" : "Some todos tests failed!"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Todos tests error:", error);
      process.exit(1);
    });
}

module.exports = { runTodosTests };
