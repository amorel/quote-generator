const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function runBuild() {
  const projectName = process.argv[2];
  if (!projectName) {
    console.error("Project name is required");
    process.exit(1);
  }

  // Chemins absolus
  const rootDir = process.cwd();
  const userServiceDir = path.join(rootDir, "services", "user-service");
  const projectPath = path.join(
    userServiceDir,
    "src",
    `UserService.${projectName}`,
    `UserService.${projectName}.csproj`
  );
  const reportsDir = path.join(userServiceDir, "reports");
  const outputFile = path.join(
    reportsDir,
    `${projectName.toLowerCase()}-build.txt`
  );

  console.log(`Building project: ${projectName}`);
  console.log(`Project path: ${projectPath}`);
  console.log(`Output file: ${outputFile}`);

  if (!fs.existsSync(projectPath)) {
    const error = `Project file not found: ${projectPath}`;
    fs.writeFileSync(outputFile, error);
    console.error(error);
    return; // Ne pas quitter avec erreur
  }

  try {
    const result = execSync(
      `dotnet build "${projectPath}" -c Release /p:GenerateFullPaths=true /clp:NoSummary`,
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }
    );
    fs.writeFileSync(outputFile, result);
    console.log(`Build rapport generated for ${projectName}`);
  } catch (error) {
    // Capture la sortie d'erreur et écrit dans le fichier de rapport
    const errorOutput = error.stdout || error.stderr || error.message;
    fs.writeFileSync(outputFile, errorOutput);
    console.log(`Build errors captured for ${projectName}`);
  }
}

runBuild();
