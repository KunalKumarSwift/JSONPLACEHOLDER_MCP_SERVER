const MCPTestHelper = require("./testHelper");

async function runPostsTests() {
  const helper = new MCPTestHelper();

  const testCases = [
    { name: "get_posts", args: {} },
    { name: "get_posts", args: { userId: 1 } },
    { name: "get_post", args: { id: 1 } },
    {
      name: "create_post",
      args: { title: "Test Post", body: "Test body", userId: 1 },
    },
    { name: "update_post", args: { id: 1, title: "Updated Post" } },
    { name: "delete_post", args: { id: 1 } },
  ];

  try {
    console.log("Starting Posts Tests...");
    await helper.startServer();
    const results = await helper.runTests(testCases);

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\nPosts Tests Results: ${passed} passed, ${failed} failed`);

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
  runPostsTests()
    .then((success) => {
      console.log(
        success ? "All posts tests passed!" : "Some posts tests failed!"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Posts tests error:", error);
      process.exit(1);
    });
}

module.exports = { runPostsTests };
