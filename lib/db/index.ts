import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

// Build-safe: if DATABASE_URL isn't set at module-load time (e.g. during
// Vercel's "Collect page data" step on a preview deploy that doesn't have
// the DB env var scoped to it), we return a proxy that throws only when
// actually accessed. Production / dev runtime always sets DATABASE_URL,
// so this is purely a build-time safety net.
function makeDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return new Proxy({} as Db, {
      get() {
        throw new Error(
          "DATABASE_URL is not set. Add it to the runtime environment."
        );
      },
    });
  }
  return drizzle(neon(url), { schema });
}

export const db = makeDb();
