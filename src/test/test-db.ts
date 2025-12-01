import { Database } from "bun:sqlite";
import { applySchema } from "../db/db";

export function createTestDB(): Database {
    const db = new Database(":memory:");
    db.run("PRAGMA journal_mode = WAL;");
    applySchema(db);
    return db;
}