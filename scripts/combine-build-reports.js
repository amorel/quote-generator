const fs = require("fs");
const path = require("path");

const reportsDir = path.join(__dirname, "../services/user-service/reports");
const outputFile = path.join(reportsDir, "build-report.txt");

function combineReports() {
  // Créer le répertoire reports s'il n'existe pas
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportFiles = [
    "core-build.txt",
    "api-build.txt",
    "infrastructure-build.txt",
    "shared-build.txt",
  ];

  let combinedReport = "=== BUILD REPORT ===\n\n";
  let hasErrors = false;

  reportFiles.forEach((file) => {
    const filePath = path.join(reportsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const projectName = file.replace("-build.txt", "").toUpperCase();
      combinedReport += `### ${projectName} ###\n`;
      combinedReport += content;
      combinedReport += "\n\n";

      if (content.includes("error") || content.includes("Error")) {
        hasErrors = true;
      }

      // Supprime le fichier individuel
      fs.unlinkSync(filePath);
    } else {
      combinedReport += `### ${file} ###\n`;
      combinedReport += "No build output found\n\n";
    }
  });

  combinedReport += "=== BUILD SUMMARY ===\n";
  combinedReport += hasErrors
    ? "BUILD FAILED - Errors detected. Check report for details.\n"
    : "BUILD SUCCESS\n";

  fs.writeFileSync(outputFile, combinedReport);
  console.log(`Combined build report generated at: ${outputFile}`);
}

try {
  combineReports();
} catch (error) {
  console.error("Error generating combined report:", error);
  // Ne pas quitter avec une erreur
}
