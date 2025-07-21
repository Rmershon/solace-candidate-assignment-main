import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return null;
  }

  try {
    // for query purposes
    const queryClient = postgres(process.env.DATABASE_URL);
    const db = drizzle(queryClient);
    return db;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return null;
  }
};

export default setup();
