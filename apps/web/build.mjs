import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("Starting unified build process...");

try {
  // 1. Build mobile app
  console.log("Building mobile app...");
  // Netlify already ran pnpm install at the root, so mobile dependencies exist.
  execSync('npx expo export -p web', { 
    cwd: path.resolve(process.cwd(), '../mobile'),
    stdio: 'inherit' 
  });

  // 2. Prepare public directory
  console.log("Copying mobile app to web public directory...");
  const sourceDir = path.resolve(process.cwd(), '../mobile/dist');
  const destDir = path.resolve(process.cwd(), 'public');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy all files from source to dest
  fs.cpSync(sourceDir, destDir, { recursive: true });

  // Rename index.html to mobile.html
  const indexPath = path.join(destDir, 'index.html');
  const mobilePath = path.join(destDir, 'mobile.html');
  
  if (fs.existsSync(indexPath)) {
    fs.renameSync(indexPath, mobilePath);
    console.log("Renamed index.html to mobile.html");
  } else {
    console.log("WARNING: index.html not found in mobile build output!");
  }

  // 3. Build web app
  console.log("Building web app...");
  execSync('npx next build', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  console.log("Unified build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
