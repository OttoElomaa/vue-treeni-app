export interface Team {
    id: number,
    team_name: string
}

export interface Player {
    id: number,
    first_name: string,
    last_name: string,
    team_id: number,
    birth_year: number,
    birth_month: number,
    birth_day: number,
}

export type Mode = "intake" | "analyze";