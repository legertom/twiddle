import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const packageJsonPath = path.join(process.cwd(), 'package.json');

// Function to get file structure
function getFilesAndDirs(dir, prefix = '') {
  const filesAndDirs = fs.readdirSync(dir);
  let result = [];

  for (const item of filesAndDirs) {
    if (item === 'node_modules' || item === '.git') continue; // Skip node_modules and .git

    const fullPath = path.join(dir, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();
    result.push(`${prefix}${isDirectory ? '├─ ' : '└─ '}${item}${isDirectory ? '/' : ''}`);

    if (isDirectory) {
      result = result.concat(getFilesAndDirs(fullPath, `${prefix}│  `));
    }
  }

  return result;
}

// Function to print file structure and save to structure.txt
async function printAndSaveFileStructure(packageJson, description) {
  console.log('File Structure:');
  const fileStructure = getFilesAndDirs(process.cwd());
  const fileStructureText = `project-root/\n${fileStructure.join('\n')}`;
  console.log(fileStructureText);

  const structureText = `Project Description:\n${description}\n\nPackage.json:\n${JSON.stringify(packageJson, null, 2)}\n\nFile Structure:\n${fileStructureText}`;
  fs.writeFileSync('structure.txt', structureText);
}

// Function to get package.json
async function getPackageJson() {
  return JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf-8'));
}

// Main function
async function main() {
  const packageJson = await getPackageJson();

  rl.question('Please provide a brief project description: ', async (description) => {
    console.log(`\nProject Description: ${description}`);

    console.log('\nPackage.json:');
    console.log(JSON.stringify(packageJson, null, 2));

    await printAndSaveFileStructure(packageJson, description);

    rl.close();
  });
}

main();
