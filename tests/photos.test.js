const MCPTestHelper = require("./testHelper");

async function runPhotosTests() {
  const helper = new MCPTestHelper();

  const testCases = [
    { name: "get_photos", args: {} },
    { name: "get_photos", args: { albumId: 1 } },
    { name: "get_photo", args: { id: 1 } },
    {
      name: "create_photo",
      args: {
        title: "Test Photo",
        url: "https://example.com/photo.jpg",
        thumbnailUrl: "https://example.com/thumb.jpg",
        albumId: 1,
      },
    },
    { name: "update_photo", args: { id: 1, title: "Updated Photo" } },
    { name: "delete_photo", args: { id: 1 } },
  ];

  try {
    console.log("Starting Photos Tests...");
    await helper.startServer();
    const results = await helper.runTests(testCases);

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\nPhotos Tests Results: ${passed} passed, ${failed} failed`);

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
  runPhotosTests()
    .then((success) => {
      console.log(
        success ? "All photos tests passed!" : "Some photos tests failed!"
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Photos tests error:", error);
      process.exit(1);
    });
}

module.exports = { runPhotosTests };
