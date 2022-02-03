import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import { HelloResolver } from './resolvers/hello';
import { SessionResolver } from "./resolvers/account";
import crypto from 'crypto';

const sessions = new Map<string, number>();
const prisma = new PrismaClient()

export const makeSessionToken = (id:number) => {
    const sessionToken = `${crypto.randomBytes(16).toString('base64')}`
    sessions.set(sessionToken, id);
    return sessionToken;
}

const main = async () => {
    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, SessionResolver],
            validate: false
        }),
        context: () => ({prisma, sessions})
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ 
        app
    });



    app.listen(4000, () => {
        console.log(`server started on localhost:4000`);
    })
}

main()
    .catch(error => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })