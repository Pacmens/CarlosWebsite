import { Resolver, Mutation, Ctx, Arg, Query, ObjectType, Field, Authorized } from 'type-graphql';
import { ContextType } from 'src/types';
import { PermissionLevel } from '@prisma/client';

@ObjectType()
export class Room {
    @Field()
    id: number
    
    @Field()
    name: string

    @Field()
    permissionLevel: PermissionLevel
}

@ObjectType()
export class Rooms {
    @Field(() => [Room], { nullable: true })
    rooms?: Room[]
}



@Resolver()
export class RoomResolver {
    @Authorized()
    @Query(() => Rooms)
    async getRooms(@Arg("session") sessionToken:string, @Ctx() {prisma, sessions}:ContextType):Promise<Rooms> {
        const accountId = sessions.get(sessionToken);
        if (accountId === undefined) throw 'Session no longer active';
        return prisma.account.findUnique({select:{participations:{select:{room:{select:{id:true, name:true}}, permissionLevel:true}}}, where:{id:accountId}}).then(
            (account):Rooms => {
                if (!account) throw "Couldn't find rooms";
                return {rooms:account.participations.map<Room>(({room:{id, name}, permissionLevel}) => ({id, name, permissionLevel}))}
            },
            () => {throw 'Couldn\'t find rooms'}
        )
    }

    @Authorized()
    @Mutation(() => Room)
    async joinRoom(@Arg("session") sessionToken:string, @Arg("code") code:string, @Arg("displayName") handle:string, @Ctx() {prisma, sessions}:ContextType):Promise<Room> {
        const accountId = sessions.get(sessionToken);
        if (accountId === undefined) throw "Session no longer active";
        return prisma.roomInvite.findUnique({select:{roomId:true, room:{select:{name:true}}, level:true}, where:{code}})
        .then((roomInvite) =>  {
            if (!roomInvite) throw 'Code doesn\'t exist'
            const participantToCreate = {roomId:roomInvite.roomId, permissionLevel:roomInvite.level, accountId, handle}
            return prisma.participant
                .create({select:{roomId:true, permissionLevel:true}, data:participantToCreate})
                .then(({roomId, permissionLevel}) => {
                        return { 
                            id:roomId, 
                            name:roomInvite.room.name, 
                            permissionLevel
                        }
                    },
                    () => {throw "couldn't join room"}
                );
        })
    }

}