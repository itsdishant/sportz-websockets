import { Router } from "express";
import { desc } from "drizzle-orm";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { getMatchStatus } from "../utils/match-status.js";

export const matchRouter = Router();

const MAX_LIMIT = 100;

matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.issues);
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

  try {
    const results = await db
      .select()
      .from(matches)
      .limit(limit)
      .orderBy(desc(matches.createdAt));
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("GET /matches failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

matchRouter.post("/", async (req, res) => {
  const parse = createMatchSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json(parse.error.issues);
  }

  try {
    const match = await db
      .insert(matches)
      .values({
        ...parse.data,
        startTime: new Date(parse.data.startTime),
        endTime: new Date(parse.data.endTime),
        homeScore: parse.data.homeScore || 0,
        awayScore: parse.data.awayScore || 0,
        status: getMatchStatus(parse.data.startTime, parse.data.endTime),
      })
      .returning();

    res.status(201).json({ data: match });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
