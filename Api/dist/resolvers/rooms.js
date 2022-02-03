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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomResolver = exports.Rooms = exports.Room = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = require("@prisma/client");
let Room = class Room {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Room.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Room.prototype, "permissionLevel", void 0);
Room = __decorate([
    (0, type_graphql_1.ObjectType)()
], Room);
exports.Room = Room;
let Rooms = class Rooms {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Room], { nullable: true }),
    __metadata("design:type", Array)
], Rooms.prototype, "rooms", void 0);
Rooms = __decorate([
    (0, type_graphql_1.ObjectType)()
], Rooms);
exports.Rooms = Rooms;
let RoomResolver = class RoomResolver {
    getRooms(sessionToken, { prisma, sessions }) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = sessions.get(sessionToken);
            if (accountId === undefined)
                throw 'Session no longer active';
            return prisma.account.findUnique({ select: { participations: { select: { room: { select: { id: true, name: true } }, permissionLevel: true } } }, where: { id: accountId } }).then((account) => {
                if (!account)
                    throw "Couldn't find rooms";
                return { rooms: account.participations.map(({ room: { id, name }, permissionLevel }) => ({ id, name, permissionLevel })) };
            }, () => { throw 'Couldn\'t find rooms'; });
        });
    }
    joinRoom(sessionToken, code, handle, { prisma, sessions }) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = sessions.get(sessionToken);
            if (accountId === undefined)
                throw "Session no longer active";
            return prisma.roomInvite.findUnique({ select: { roomId: true, room: { select: { name: true } }, level: true }, where: { code } })
                .then((roomInvite) => {
                if (!roomInvite)
                    throw 'Code doesn\'t exist';
                const participantToCreate = { roomId: roomInvite.roomId, permissionLevel: roomInvite.level, accountId, handle };
                return prisma.participant
                    .create({ select: { roomId: true, permissionLevel: true }, data: participantToCreate })
                    .then(({ roomId, permissionLevel }) => {
                    return {
                        id: roomId,
                        name: roomInvite.room.name,
                        permissionLevel
                    };
                }, () => { throw "couldn't join room"; });
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => Rooms),
    __param(0, (0, type_graphql_1.Arg)("session")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "getRooms", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => Room),
    __param(0, (0, type_graphql_1.Arg)("session")),
    __param(1, (0, type_graphql_1.Arg)("code")),
    __param(2, (0, type_graphql_1.Arg)("displayName")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "joinRoom", null);
RoomResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RoomResolver);
exports.RoomResolver = RoomResolver;
//# sourceMappingURL=rooms.js.map