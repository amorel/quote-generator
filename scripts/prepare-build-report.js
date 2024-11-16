const fs = require("fs");
const path = require("path");

// Crée les dossiers nécessaires
const dirs = ["services/user-service/reports"];

dirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});
