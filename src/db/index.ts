import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pool = postgres(process.env.DATABASE_URL!, { max: 5 });
export const db = drizzle(pool, { schema });
