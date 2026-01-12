const { runUsersTests } = require("./users.test");
const { runPostsTests } = require("./posts.test");
const { runCommentsTests } = require("./comments.test");
const { runAlbumsTests } = require("./albums.test");
const { runPhotosTests } = require("./photos.test");
const { runTodosTests } = require("./todos.test");

async function runAllTests() {
  const testSuites = [
    { name: "Users", fn: runUsersTests },
    { name: "Posts", fn: runPostsTests },
    { name: "Comments", fn: runCommentsTests },
    { name: "Albums", fn: runAlbumsTests },
    { name: "Photos", fn: runPhotosTests },
    { name: "Todos", fn: runTodosTests },
  ];

  console.log("Running all MCP tool tests...\n");

  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of testSuites) {
    try {
      console.log(`\n${"=".repeat(50)}`);
      console.log(`Running ${suite.name} Tests`);
      console.log(`${"=".repeat(50)}\n`);

      const success = await suite.fn();
      if (success) {
        totalPassed++;
        console.log(`✅ ${suite.name} tests: PASSED`);
      } else {
        totalFailed++;
        console.log(`❌ ${suite.name} tests: FAILED`);
      }
    } catch (error) {
      totalFailed++;
      console.log(`❌ ${suite.name} tests: ERROR - ${error.message}`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log("TEST SUMMARY");
  console.log(`${"=".repeat(50)}`);
  console.log(`Total test suites: ${testSuites.length}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);

  if (totalFailed === 0) {
    console.log("\n🎉 All tests passed!");
    return true;
  } else {
    console.log("\n💥 Some tests failed!");
    return false;
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test runner error:", error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
