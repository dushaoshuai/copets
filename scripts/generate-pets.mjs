import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "pets.json");
const ignoredDirectories = new Set([".git", ".idea", ".vscode", "node_modules", "scripts"]);
const requiredFields = ["id", "displayName", "description", "spritesheetPath"];

async function findPetFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const petFiles = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      petFiles.push(...await findPetFiles(path.join(directory, entry.name)));
      continue;
    }

    if (entry.isFile() && entry.name === "pet.json") {
      petFiles.push(path.join(directory, entry.name));
    }
  }

  return petFiles;
}

function toSitePath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function validatePet(pet, petFile) {
  const missingFields = requiredFields.filter((field) => !pet[field]);

  if (missingFields.length > 0) {
    throw new Error(`${toSitePath(petFile)} is missing required field(s): ${missingFields.join(", ")}`);
  }
}

async function main() {
  const petFiles = await findPetFiles(repoRoot);
  const pets = [];
  const seenIds = new Set();

  for (const petFile of petFiles.sort()) {
    const petDirectory = path.dirname(petFile);
    const pet = JSON.parse(await readFile(petFile, "utf8"));

    validatePet(pet, petFile);

    if (seenIds.has(pet.id)) {
      throw new Error(`Duplicate pet id: ${pet.id}`);
    }

    seenIds.add(pet.id);
    pets.push({
      ...pet,
      spritesheetPath: toSitePath(path.resolve(petDirectory, pet.spritesheetPath)),
      githubUrl: `https://github.com/dushaoshuai/copets/tree/main/${toSitePath(petDirectory)}`
    });
  }

  await writeFile(outputPath, `${JSON.stringify(pets, null, 2)}\n`);
  console.log(`Generated ${toSitePath(outputPath)} with ${pets.length} pets.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
