const config = {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.SOLACE_DATABASE_URL,
  },
  verbose: true,
  strict: true,
};

export default config;
