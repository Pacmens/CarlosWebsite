"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSessionToken = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const client_1 = require("@prisma/client");
const hello_1 = require("./resolvers/hello");
const account_1 = require("./resolvers/account");
const crypto_1 = __importDefault(require("crypto"));
const sessions = new Map();
const prisma = new client_1.PrismaClient();
const makeSessionToken = (id) => {
    const sessionToken = `${crypto_1.default.randomBytes(16).toString('base64')}`;
    sessions.set(sessionToken, id);
    return sessionToken;
};
exports.makeSessionToken = makeSessionToken;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, account_1.SessionResolver],
            validate: false
        }),
        context: () => ({ prisma, sessions })
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app
    });
    app.listen(4000, () => {
        console.log(`server started on localhost:4000`);
    });
});
main()
    .catch(error => {
    console.error(error);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=index.js.map