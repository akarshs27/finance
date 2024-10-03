import { db } from "@/database/db/drizzle";
import { accounts, transactions } from "@/database/db/schema";
import { calculatePecentageChange, fillMissingDays } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, eq, gte, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
.get(
    "/",
    zValidator(
        "query",
        z.object({
         from: z.string().optional(),
         to: z.string().optional(),
         accountId: z.string().optional()
        })
    ),
    async (c) => {
        const { from, to , accountId} = c.req.valid("query");

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate  = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
        const endDate  = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

        const periodLength = differenceInDays(endDate, startDate) + 1;
        const lastPeriodStart = subDays(startDate, periodLength);
        const lastPeriodEnd = subDays(endDate, periodLength);

        async function fetchFinancialData(startDate: Date, endDate: Date) {
            return await db
            .select({
                income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                expenses: sql`SUM(CASE WHEN ${transactions.amount} < ) THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                remaining: sum(transactions.amount).mapWith(Number)
            })
            .from(transactions)
            .innerJoin(
                accounts,
                eq(
                    transactions.accountId,
                    accounts.id
                )
            )
            .where(
                and(
                    accountId ? eq(transactions.accountId, accountId) : undefined,
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate)
                )
            );
        }

        const [currentPeriod] = await fetchFinancialData(
            startDate, endDate
        );
        const [lastPeriod] = await fetchFinancialData( startDate, endDate);

        const incomeChange = calculatePecentageChange(currentPeriod.income, lastPeriod.income);
        const expensesChange = calculatePecentageChange(currentPeriod.expenses, lastPeriod.expenses);
        const remainingChange = calculatePecentageChange(currentPeriod.remaining, lastPeriod.remaining);

        const activeDays = await db
        .select({
            date: transactions.date,
            income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number)
        })
        .from(transactions)
        .innerJoin(
            accounts,
            eq(
                transactions.accountId,
                accounts.id
            )
        )
        .where(
            and(
                accountId ? eq(transactions.accountId, accountId) : undefined,
                gte(transactions.date, startDate),
                lte(transactions.date, endDate)
            )
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date)

        const days = fillMissingDays(activeDays, startDate, endDate);

        return c.json(
            { currentPeriod, 
              lastPeriod, incomeChange, expensesChange, remainingChange, activeDays
            }
            );
    },
);

export default app;

