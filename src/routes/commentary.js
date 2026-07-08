import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";

const MAX_LIMIT = 100;

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", async (req, res) => {
  const paramParse = matchIdParamSchema.safeParse(req.params);
  if (!paramParse.success) {
    return res.status(400).json(paramParse.error.issues);
  }

  const queryParse = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryParse.success) {
    return res.status(400).json(queryParse.error.issues);
  }

  const limit = Math.min(queryParse.data.limit ?? 100, MAX_LIMIT);

  try {
    const results = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, paramParse.data.id))
      .limit(limit)
      .orderBy(desc(commentary.createdAt));

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("GET /matches/:id/commentary failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

commentaryRouter.post("/", async (req, res) => {
  const paramParse = matchIdParamSchema.safeParse(req.params);

  if (!paramParse.success) {
    return res.status(400).json(paramParse.error.issues);
  }

  const bodyParse = createCommentarySchema.safeParse(req.body);

  if (!bodyParse.success) {
    return res.status(400).json(bodyParse.error.issues);
  }

  try {
    const [result] = await db
      .insert(commentary)
      .values({
        matchId: paramParse.data.id,
        ...bodyParse.data,
      })
      .returning();

    if (res.app.locals.broadcastCommentary) {
      res.app.locals.broadcastCommentary(result.matchId, result);
    }

    res.status(201).json({ data: result });
  } catch (error) {
    console.error("POST /matches/:id/commentary failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
