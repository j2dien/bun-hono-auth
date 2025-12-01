import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import app from ".";
import { Database } from "bun:sqlite";
import { dbConn } from "./db/db";
import { createTestDB } from "./test/test-db";
import { loginReq, signupReq } from "./test/test-helpers";

let db: Database;

mock.module("../src/db/db.ts", () => {
    return {
        dbConn: () => db,
    }
})

beforeEach(() => {
    db = createTestDB();
})

afterEach(() => {
    db.close();
})

describe("sign up endpoint", () => {
    it("should sign up a user", async () => {
        const req = signupReq();
        const res = await app.fetch(req);
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json).toEqual({
            message: "User registered successfully",
            user: { id: expect.any(String), email: "test@test.com" }
        });
        const cookies = res.headers.get("set-cookie");
        expect(cookies).toMatch(/authToken=/);
    });

    it("should return 409 if email already exists", async () => {
        const req = signupReq();
        const res = await app.fetch(req);
        expect(res.status).toBe(200);

        const req2 = signupReq();
        const res2 = await app.fetch(req2);
        const json = await res2.json();
        expect(res2.status).toBe(409);
        expect(json).toEqual({
            errors: ["Email already exist"]
        })

    });

    it("should return error if missing email or password", async () => {
        const req = signupReq("", "");
        const res = await app.fetch(req);
        const json = await res.json();
        expect(res.status).toBe(400);
        expect(json).toEqual({
            errors: ["Invalid email address", "Password must be at least 8 characters long."],
        })

    })
})

describe("login endpoint", () => {
    it("should login a user", async () => {
        // sign up a user
        const req = signupReq();
        const res = await app.fetch(req);

        const req2 = loginReq();
        const res2 = await app.fetch(req2);
        const json = await res2.json();
        expect(res.status).toBe(200);
        expect(json).toEqual({
            message: "Login successful",
            user: { id: expect.any(String), email: "test@test.com" }
        })

        const cookies = res.headers.get("set-cookie");
        expect(cookies).toMatch(/authToken=/)
    })

    it("should return error 400 if missing email or password", async () => {
        const req = loginReq("", "");
        const res = await app.fetch(req);
        const json = await res.json();
        expect(res.status).toBe(400);
        expect(json).toEqual({
            errors: ["Invalid email address", "Password must be at least 8 characters long."]
        });
    });

    it("should return error 401 if incorrect password provided", async () => {
        //sign up a user
        const req = signupReq();
        await app.fetch(req);
        
        // login a user
        const req2 = loginReq("test@test.com", "password1234");
        const res = await app.fetch(req2);
        const json = await res.json();
        expect(res.status).toBe(401);
        expect(json).toEqual({
            errors: ["Invalid credentials"]
        })
    })
})