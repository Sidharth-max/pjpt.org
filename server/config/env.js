import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

if (!globalThis.__PJPT_ENV_LOADED__) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const envFiles = [
    { file: path.join(__dirname, '../../.env'), override: false },
    { file: path.join(__dirname, '../.env'), override: true }
  ];

  envFiles.forEach(({ file, override }) => {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file, override });
    }
  });

  globalThis.__PJPT_ENV_LOADED__ = true;
}

export default process.env;
