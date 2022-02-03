"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SessionResolver = exports.Session = void 0;
const type_graphql_1 = require("type-graphql");
const crypto_1 = __importDefault(require("crypto"));
const makeSessionToken = (id, sessions) => {
    const sessionToken = `${crypto_1.default.randomBytes(16).toString('base64')}`;
    sessions.set(sessionToken, id);
    return sessionToken;
};
let Session = class Session {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Session.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "sessionToken", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Session.prototype, "errors", void 0);
Session = __decorate([
    (0, type_graphql_1.ObjectType)()
], Session);
exports.Session = Session;
let SessionResolver = class SessionResolver {
    login(name, password, { prisma, sessions }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield prisma.account.findFirst({ select: { id: true }, where: { name, password } });
            if (userId === null)
                return { success: false, errors: ["couldnt find user"] };
            return { success: true, sessionToken: makeSessionToken(userId.id, sessions) };
        });
    }
    makeAccount(name, password, { prisma, sessions }) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.account.create({ data: { name, password } }).then((acc) => {
                return { success: true, sessionToken: makeSessionToken(acc.id, sessions) };
            }, (error) => {
                return { success: false, errors: [error] };
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Session),
    __param(0, (0, type_graphql_1.Arg)("username")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Session),
    __param(0, (0, type_graphql_1.Arg)("username")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "makeAccount", null);
SessionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SessionResolver);
exports.SessionResolver = SessionResolver;
//# sourceMappingURL=account.js.map