import { Client, DataType, Result, SSLMode, Value } from "ts-postgres";
import { db, host, password, port, username } from "./config";
import fs from "fs";
import path from "path";

export const pgClient: Client = new Client({
  host: host,
  user: username,
  database: db,
  password: password,
  ssl: SSLMode.Disable,
  port: port
})

export async function execute(query: string, values?: Value[], types?: DataType[]): Promise<Result | undefined> {
  try {
    return await pgClient.query(query, values, types);
  } catch (error: unknown) {
    console.error(error);
  }
}

export async function initdb(): Promise<void> {
  await pgClient.connect();
  const tables = fs.readFileSync(path.join(__dirname, '../../src/db/init_tables.sql')).toString().replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').split(';')
  for (const createStatement of tables) {
    await execute(createStatement);
  }
  const tuples = fs.readFileSync(path.join(__dirname, '../../src/db/init_tuples.sql')).toString().replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').split(';')
  for (const insertStatement of tuples) {
    await execute(insertStatement);
  }
}
