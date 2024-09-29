import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!)


    // "db:generate": "drizzle-kit generate:pg --schema database/db/schema.ts --out ./drizzle",
