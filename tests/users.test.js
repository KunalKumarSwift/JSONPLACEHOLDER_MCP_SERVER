const MCPTestHelper = require("./testHelper");

async function runUsersTests() {
  const helper = new MCPTestHelper();

  const testCases = [
    { name: "get_users", args: {} },
    { name: "get_user", args: { id: 1 } },
    {
      name: "create_user",
      args: {
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
      },
    },
    { name: "update_user", args: { id: 1, name: "Updated User" } },
    { name: "delete_user", args: { id: 1 } },
  ];

  try {
    console.log("Starting Users Tests...");
    await helper.startServer();
    const results = await helper.runTests(testCases);

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\nUsers Tests Results: ${passed} passed, ${failed} failed`);

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
  runUsersTests()
    .then((success) => {
      console.log(
        success ? "All users tests passed!" : "Some users tests failed!"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Users tests error:", error);
      process.exit(1);
    });
}

module.exports = { runUsersTests };
