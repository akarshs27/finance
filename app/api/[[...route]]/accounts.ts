import { db } from "@/database/db/drizzle";
import { accounts, inserAccountSchema } from "@/database/db/schema";
import { Hono } from "hono";
import { zValidator} from "@hono/zod-validator"
import {createId} from '@paralleldrive/cuid2';


const app = new Hono()
.get("/", 
async (c) => {
    const data = await db
    .select({
        id: accounts.id,
        name: accounts.name
    })
    .from(accounts);

    return c.json({data})
})
.post("/", zValidator("json", inserAccountSchema) ,async (c) => {
    const values = c.req.valid("json");

    const [data] = await db.insert(accounts).values({
        ...values,
    }).returning();

    return c.json({data});
})

export default app;