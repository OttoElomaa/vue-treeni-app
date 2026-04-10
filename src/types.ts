import { z } from "zod";

// ######################################################
// TEAMS
export const TeamSchema = z.object({
  id: z.number().int().positive(),
  team_name: z.string().min(1, "Anna tiimin nimi"),
});

// Infer the Team type from the schema
export type Team = z.infer<typeof TeamSchema>;

// ######################################################
// PLAYERS
export const PlayerSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string("Anna etunimi").min(1),
  last_name: z.string("Anna sukunimi").min(1),
  team_id: z.number().int().positive(),

  birth_year: z
    .number("Anna syntymävuosi")
    .int()
    .min(1900, "Liian pieni luku")
    .max(new Date().getFullYear(), "Syntymävuosi tulevaisuudessa"),
  birth_month: z
    .number("Anna syntymäkuukausi")
    .int()
    .min(1, "Liian pieni luku")
    .max(12, "Liian suuri luku"),
  birth_day: z
    .number("Anna syntymäpäivä")
    .int()
    .min(1, "Liian pieni luku")
    .max(31, "Liian suuri luku"),
});

export type Player = z.infer<typeof PlayerSchema>;

// Create a version for the form that ignores the ID
export const CreatePlayerSchema = PlayerSchema.omit({ id: true });

export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;

// ######################################################
// SPORTS TESTS
export const SportsTestSchema = z.object({
  id: z.int(),
  seconds: z.float32().positive(),
  taken_at: z.iso.datetime(),
  test_category: z.int(),
  test_type: z.string(),
  player_id: z.int(),
});

// Infer the type from the schema
export type SportsTest = z.infer<typeof SportsTestSchema>;

// Create a version for the insert form that ignores the ID
export const CreateSportsTestSchema = SportsTestSchema.omit({ id: true });

export type CreateSportsTest = z.infer<typeof CreateSportsTestSchema>;

// ######################################################
// OTHER STUFF

export type TestType = {
  id:number,
  test_name:string,
  category:TestCategory
}

export type TestCategory = 1 | 2



export type Mode = "intake" | "analyze";
