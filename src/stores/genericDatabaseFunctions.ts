import { supabase } from "../lib/supabase-client";


type Table = 'players' | 'tests' | 'teams' | 'test_type'
type Result<T> = { data: T; error: null } | { data: null; error: Error }

async function fetchAll<T>(table: Table, column?: string, value?: string | number): Promise<Result<T[]>> {
  let query = supabase.from(table).select('*')
  if (column && value !== undefined) {
    query = query.eq(column, value)
  }
  const { data, error } = await query
  if (error) return { data: null, error }
  return { data: data as T[], error: null }
}

async function fetchOne<T>(table: Table, id: number): Promise<Result<T>> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { data: null, error }
  return { data: data as T, error: null }
}

async function insertOne<T>(table: Table, row: Partial<T>): Promise<Result<T>> {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .single()
  if (error) return { data: null, error }
  return { data: data as T, error: null }
}

async function updateOne<T>(table: Table, id: number, updates: Partial<T>): Promise<Result<T>> {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) return { data: null, error }
  return { data: data as T, error: null }
}

async function deleteOne(table: Table, id: number): Promise<Result<{ id: number }>> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  if (error) return { data: null, error }
  return { data: { id }, error: null }
}

export { fetchAll, fetchOne, insertOne, updateOne, deleteOne }
export type { Result }