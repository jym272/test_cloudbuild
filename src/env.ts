import path from 'path';
import fs from 'fs';
declare module 'bun' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Env extends EnvVars {}
}
interface EnvVars {
  PORT?: string;
  CORS_LIST?: string;
  AUTH_URL?: string;
  MONGO_URI?: string;
}
const envPath = '/mnt/environment';
export const getEnvOrFail = (key: keyof EnvVars): string => {
  const value = Bun.env[key];
  if (!value) {
    try {
      const filePath = path.join(envPath, key);
      const data = fs.readFileSync(filePath, 'utf8');
      if (data.trim()) return data.trim();
    } catch (err) {
      //
    }
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
