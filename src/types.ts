import { z } from 'zod';


export const TeamSchema = z.object({
  id: z.number()
  .int().positive(), 
  team_name: z.string()
  .min(1, "Team name cannot be empty"),
});

// Infer the Team type from the schema
export type Team = z.infer<typeof TeamSchema>;


export const PlayerSchema = z.object({
  id: z.number()
  .int().positive(),
  first_name: z.string()
  .min(1, "First name is required"),
  last_name: z.string()
  .min(1, "Last name is required"),
  team_id: z.number()
  .int().positive(),
  
  birth_year: z.number()
  .int().min(1900).max(new Date().getFullYear(), "Birth year in future"),
  birth_month: z.number()
  .int().min(1).max(12),
  birth_day: z.number()
  .int().min(1).max(31),
});

export type Player = z.infer<typeof PlayerSchema>;



export type Mode = "intake" | "analyze";