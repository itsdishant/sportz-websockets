import { z } from 'zod';

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished'
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional()
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const createMatchSchema = z.object({
  sport: z.string().min(1, "sport must not be empty"),
  homeTeam: z.string().min(1, "homeTeam must not be empty"),
  awayTeam: z.string().min(1, "awayTeam must not be empty"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string"
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string"
  }),
  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.startTime).getTime();
  const end = new Date(data.endTime).getTime();
  
  if (end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "endTime must be chronologically after startTime",
      path: ["endTime"]
    });
  }
});

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
