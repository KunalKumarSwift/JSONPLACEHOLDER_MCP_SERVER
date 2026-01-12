const MCPTestHelper = require("./testHelper");

async function runCommentsTests() {
  const helper = new MCPTestHelper();

  const testCases = [
    { name: "get_comments", args: {} },
    { name: "get_comments", args: { postId: 1 } },
    { name: "get_comment", args: { id: 1 } },
    {
      name: "create_comment",
      args: {
        name: "Test Comment",
        email: "test@example.com",
        body: "Test body",
        postId: 1,
      },
    },
    { name: "update_comment", args: { id: 1, name: "Updated Comment" } },
    { name: "delete_comment", args: { id: 1 } },
  ];

  try {
    console.log("Starting Comments Tests...");
    await helper.startServer();
    const results = await helper.runTests(testCases);

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\nComments Tests Results: ${passed} passed, ${failed} failed`);

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
  runCommentsTests()
    .then((success) => {
      console.log(
        success ? "All comments tests passed!" : "Some comments tests failed!"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Comments tests error:", error);
      process.exit(1);
    });
}

module.exports = { runCommentsTests };
