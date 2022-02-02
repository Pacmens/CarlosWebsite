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
exports.RoomResolver = exports.ReturnRooms = exports.ReturnRoom = void 0;
const type_graphql_1 = require("type-graphql");
class RoomProps {
}
let ReturnRoom = class ReturnRoom {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ReturnRoom.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", RoomProps)
], ReturnRoom.prototype, "room", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ReturnRoom.prototype, "errors", void 0);
ReturnRoom = __decorate([
    (0, type_graphql_1.ObjectType)()
], ReturnRoom);
exports.ReturnRoom = ReturnRoom;
let ReturnRooms = class ReturnRooms {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ReturnRooms.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [RoomProps], { nullable: true }),
    __metadata("design:type", Array)
], ReturnRooms.prototype, "rooms", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ReturnRooms.prototype, "errors", void 0);
ReturnRooms = __decorate([
    (0, type_graphql_1.ObjectType)()
], ReturnRooms);
exports.ReturnRooms = ReturnRooms;
let RoomResolver = class RoomResolver {
    getRooms(sessionToken, { prisma, sessions }) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = sessions.get(sessionToken);
            if (accountId === undefined)
                return {
                    success: false,
                    errors: ["Session no longer active"]
                };
            return prisma.room.findMany({ select: { id: true, name: true, participant: { permissionLevel: true } }, where: { participant: { accountId } } }).then((rooms) => {
                if (rooms === undefined || rooms === null)
                    return {
                        success: false,
                        errors: ["Couldn't find rooms"]
                    };
                return { success: true, rooms };
            }, () => {
                return {
                    success: false,
                    errors: ["Couldn't find rooms"]
                };
            });
        });
    }
    joinRoom(roomCode, { prisma, sessions }) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => ReturnRooms),
    __param(0, (0, type_graphql_1.Arg)("session")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "getRooms", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ),
    __param(0, (0, type_graphql_1.Arg)("code")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "joinRoom", null);
RoomResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RoomResolver);
exports.RoomResolver = RoomResolver;
//# sourceMappingURL=rooms.js.map