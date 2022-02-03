import { Resolver, Mutation, Ctx, Arg, Query, ObjectType, Field, Authorized } from 'type-graphql';
import { ContextType } from 'src/types';
import crypto from 'crypto';

const makeSessionToken = (id:number, sessions:Map<string, number>) => {
    const sessionToken = `${crypto.randomBytes(16).toString('base64')}`
    sessions.set(sessionToken, id);
    return sessionToken;
}

@ObjectType()
export class Session {
    @Field()
    success: boolean

    @Field({ nullable: true })
    sessionToken?: string

    @Field(() => [String], { nullable: true })
    errors?: string[]
}

@Resolver()
export class SessionResolver {
    @Query(() => Session)
    async login(@Arg("username") name:string, @Arg("password") password:string, @Ctx() {prisma, sessions}:ContextType):Promise<Session> {
        const userId = await prisma.account.findFirst({select:{id:true}, where: {name, password}});
        if (userId === null) return {success:false, errors:["couldnt find user"]}
        return {success:true, sessionToken:makeSessionToken(userId.id, sessions)} 
    }

    @Mutation(() => Session)
    async makeAccount(@Arg("username") name:string, @Arg("password") password:string, @Ctx() {prisma, sessions}:ContextType):Promise<Session> {
        return prisma.account.create({data:{name, password}}).then(
            (acc) => {
                return {success: true, sessionToken: makeSessionToken(acc.id, sessions)};
            },
            (error) => {
                return {success: false, errors:[error]}
            }
        );
    }
}

