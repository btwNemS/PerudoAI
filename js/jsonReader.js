const fs = require("fs/promises");

async function readJsonFile(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

module.exports = { readJsonFile };
