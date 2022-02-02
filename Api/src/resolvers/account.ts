import { Resolver, Mutation, Ctx, Arg, Query, ObjectType, Field } from 'type-graphql';
import { ContextType } from 'src/types';
import crypto from 'crypto';

@ObjectType()
export class Session {
    @Field()
    success: boolean

    @Field({ nullable: true })
    sessionToken?: string

    @Field(() => [String], { nullable: true })
    errors?: string[]
}
const makeSessionToken = (id:number) => {
    const session = `${crypto.randomBytes(16).toString('base64')}`;
    return session;
}

@Resolver()
export class SessionResolver {
    @Query(() => Session)
    async login(@Arg("username") name:string, @Arg("password") password:string, @Ctx() {prisma}:ContextType):Promise<Session> {
        const userId = await prisma.account.findFirst({select:{id:true}, where: {name, password}});
        if (userId === null) return {success:false, errors:["couldnt find user"]}
        return {success:true, sessionToken:makeSessionToken(userId.id)} 
    }

    @Mutation(() => Session)
    async makeAccount(@Arg("username") name:string, @Arg("password") password:string, @Ctx() {prisma}:ContextType):Promise<Session> {
        return prisma.account.create({data:{name, password}}).then(
            (acc) => {
                return {success: true, sessionToken: makeSessionToken(acc.id)};
            },
            (error) => {
                return {success: false, errors:[error]}
            }
        );
    }
}