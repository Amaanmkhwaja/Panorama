import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// why are we doing this? Because of Next.js hot reload. In development mode, we need this.
// Whenever we save a file, Next.js will run a hot reload, and what that will do will initialize a new
// prisma client everytime and then you will get some warnings in your terminal that you have to many prisma clients
export const db = globalThis.prisma || new PrismaClient();

// so what we do is we add an if statement, if we are not in production, in that case, we are going to
// store the db variable insiside globalThis.prisma
// and then when hot reload fires, it will check if we have already have prisma initialized
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
// the reason why we store it in globalThis is because global is not effected by hot reload

// this is what happens in production mode
// export const db = new PrismaClient();
