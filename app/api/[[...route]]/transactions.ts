import { db } from "@/database/db/drizzle";
import { transactions, insertTransactionSchema, accounts } from "@/database/db/schema";
import { parse, subDays } from "date-fns";
import { Hono } from "hono";
import { zValidator} from "@hono/zod-validator"
import {createId} from '@paralleldrive/cuid2';
import { z } from "zod";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";


const app = new Hono()
.get("/", 
zValidator("query", z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    accountId: z.string().optional()
})),
async (c) => {
    const { from, to , accountId } = c.req.valid("query");
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo
    const data = await db
    .select({
        id: transactions.id,
        date: transactions.date,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        account: accounts.name,
        accountId: transactions.accountId
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
        and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
        )
    )
    .orderBy(desc(transactions.date))

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
        id: transactions.id,
        date: transactions.date,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        accountId: transactions.accountId
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
            and(
                eq(transactions.id, id)
            )
        );

        if(!data) {
            return c.json({error: 'Not found'}, 404);
        }

        return c.json({data});
    }
)
.post("/bulk-create", 
zValidator(
    "json",
    z.array(
        insertTransactionSchema.omit({
            id: true
        }),
    )
),
async (c) => {
    const values = c.req.valid("json");
    const data  = await db
    .insert(transactions)
    .values(
        values.map((value) => ({
            id: createId(),
            ...value
        }))
    )
    .returning();

    return c.json({data});
}
)
.post("/", zValidator("json", insertTransactionSchema.omit({
    id: true
})) ,async (c) => {
    const values = c.req.valid("json");

    const [data] = await db.insert(transactions).values({
        id: createId(),
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