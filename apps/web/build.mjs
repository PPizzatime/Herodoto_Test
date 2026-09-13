import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("Starting unified build process...");

// Map Next.js environment variables to Expo environment variables so Netlify uses them automatically
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.EXPO_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log("Mapped Supabase URL from Next.js config");
}
if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("Mapped Supabase Anon Key from Next.js config");
}
if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  console.log("Mapped Supabase Publishable Key from Next.js config");
}

try {
  // 1. Build mobile app
  console.log("Building mobile app...");
  execSync('npx expo export -p web', { 
    cwd: path.resolve(process.cwd(), '../mobile'),
    env: process.env, // Pass the environment variables explicitly
    stdio: 'inherit' 
  });

  // 2. Prepare public directory
  console.log("Copying mobile app to web public/app directory...");
  const sourceDir = path.resolve(process.cwd(), '../mobile/dist');
  const destDir = path.resolve(process.cwd(), 'public/app');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy all files from source to dest
  fs.cpSync(sourceDir, destDir, { recursive: true });
  console.log("Copied mobile build to public/app");

  // 3. Build web app
  console.log("Building web app...");
  execSync('npx next build', {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  console.log("Unified build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
