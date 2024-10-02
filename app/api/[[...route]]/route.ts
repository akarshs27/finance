import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import accounts from './accounts'
import transactions from './transactions'

export const runtime = 'edge'

const app = new Hono().basePath('/api');

// app.get('/hello', (c) => {
//   return c.json({
//     message: 'Hello Next.js!',
//   })
// })

const routes = app
.route("/accounts", accounts )
.route("/transactions", transactions)

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes;