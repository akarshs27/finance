import { db } from "@/database/db/drizzle";
import { accounts, inserAccountSchema } from "@/database/db/schema";
import { Hono } from "hono";
import { zValidator} from "@hono/zod-validator"
import {createId} from '@paralleldrive/cuid2';
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";


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
.get(
    "/:id",
    zValidator("param", z.object({
        id: z.string().optional(),
    })),
    async (c) => {
        const { id } = c.req.valid("param");

        if(!id) {
            return c.json({error: "Missing id"}, 400);
        }
        const [data] = await db
        .select({
            id: accounts.id,
            name: accounts.name
        })
        .from(accounts)
        .where(
            and(
                eq(accounts.id, id)
            )
        );

        if(!data) {
            return c.json({error: 'Not found'}, 404);
        }

        return c.json({data});
    }
)
.post("/", zValidator("json", inserAccountSchema) ,async (c) => {
    const values = c.req.valid("json");

    const [data] = await db.insert(accounts).values({
        ...values,
    }).returning();

    return c.json({data});
})
.post(
    "/bulk-delete",
    zValidator(
        "json",
        z.object({
            ids: z.array(z.string()),
        })
    ),
    async (c) => {
        const values = c.req.valid("json");

        const data = await db
        .delete(accounts)
        .where(
            and(
                inArray(accounts.id, values.ids)
            )
        ).returning({
            id: accounts.id
        });

        return c.json({data});
    }
)


export default app;