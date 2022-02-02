import { Resolver, Mutation, Ctx, Arg, Query, ObjectType, Field } from 'type-graphql';
import { ContextType } from 'src/types';
import { PermissionLevel } from '@prisma/client';

class RoomProps {
    id: number
    name: string
    permissionLevel: PermissionLevel
}


@ObjectType()
export class ReturnRoom {
    
    @Field()
    success: boolean

    @Field({nullable:true})
    room?: RoomProps

    @Field(() => [String], { nullable: true })
    errors?: string[]
}

@ObjectType()
export class ReturnRooms {
    @Field()
    success: boolean
    
    @Field(() => [RoomProps], { nullable: true })
    rooms?: [RoomProps]

    @Field(() => [String], { nullable: true })
    errors?: string[]
}



@Resolver()
export class RoomResolver {
    @Query(() => ReturnRooms)
    async getRooms(@Arg("session") sessionToken:string, @Ctx() {prisma, sessions}:ContextType):Promise<ReturnRooms> {
        const accountId = sessions.get(sessionToken);
        if (accountId === undefined) return { 
            success: false,
            errors: ["Session no longer active"]
        }; 

        return prisma.room.findMany({select:{id:true, name:true, participant:{permissionLevel:true}}, where:{participant:{accountId}}}).then(
            (rooms:[{id:number, name:string}]|null|undefined) => {
                if (rooms === undefined || rooms === null) return { 
                    success: false,
                    errors: ["Couldn't find rooms"]
                }; 

                return {success: true, rooms}
            },
            () => {
                return { 
                    success: false,
                    errors: ["Couldn't find rooms"]
                };
            }
        )
    }

    @Mutation(() => )
    async joinRoom(@Arg("code") roomCode:string, @Ctx() {prisma, sessions}:ContextType) {
        
    }

}