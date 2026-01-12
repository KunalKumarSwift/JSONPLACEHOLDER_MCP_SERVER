const MCPTestHelper = require("./testHelper");

async function runAlbumsTests() {
  const helper = new MCPTestHelper();

  const testCases = [
    { name: "get_albums", args: {} },
    { name: "get_albums", args: { userId: 1 } },
    { name: "get_album", args: { id: 1 } },
    {
      name: "create_album",
      args: { title: "Test Album", userId: 1 },
    },
    { name: "update_album", args: { id: 1, title: "Updated Album" } },
    { name: "delete_album", args: { id: 1 } },
  ];

  try {
    console.log("Starting Albums Tests...");
    await helper.startServer();
    const results = await helper.runTests(testCases);

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\nAlbums Tests Results: ${passed} passed, ${failed} failed`);

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
  runAlbumsTests()
    .then((success) => {
      console.log(
        success ? "All albums tests passed!" : "Some albums tests failed!"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Albums tests error:", error);
      process.exit(1);
    });
}

module.exports = { runAlbumsTests };
