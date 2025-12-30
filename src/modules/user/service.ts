import { eq } from "drizzle-orm";
import db from "../../lib/db";
import { userSchema } from "../../lib/db/schema/user.schema";
import ConflictException from "../../lib/exception/conflict.exception";
import NotFoundException from "../../lib/exception/not-found.exception";
import UserModel from "./model";
import RoleConstant from "../../lib/constant/role.constant";
import BadRequestException from "../../lib/exception/bad-request.exception";

export default class UserService {
    
    static async create(body : UserModel.CreateUserBody) : Promise<UserModel.Response> {
        const { email, password, role, name } = body;

        if(role != RoleConstant.ADMIN && role != RoleConstant.USER) {
            throw new BadRequestException('Invalid role');
        }

        const version = new Date().getTime();
        const hashedPassword = await Bun.password.hash(password, {
            algorithm : 'bcrypt',
            cost : 10,
        });
        const [ user ] = await db.insert(userSchema).values({
            email : email,
            password: hashedPassword,
            role : role,
            version : version,
            name : name.toUpperCase(),
        }).returning();
        return {
            email : user.email,
            role : user.role,
            version : user.version,
            name : user.name,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt,
        }
    }
    
    static async update(body : UserModel.UpdateUserBody) : Promise<UserModel.Response> {
        return await db.transaction(async (tx) => {
            const { email, role, version, name } = body;
            const [ user ] = await tx.select().from(userSchema).where(eq(userSchema.email, email)).for('update');
            if(!user) {
                throw new NotFoundException('User not found');
            }
            if(user.version !== version) {
                throw new ConflictException('Version mismatch');
            }
            const newVersion = new Date().getTime();
            const [ result ] = await tx.update(userSchema).set({
                role : role,
                version : newVersion,
                name : name.toUpperCase(),
                updatedAt : new Date(),
            }).where(eq(userSchema.email, email)).returning();
            return {
                id : result.id,
                email : result.email,
                role : result.role,
                version : result.version,
                name : result.name,
                createdAt : result.createdAt,
                updatedAt : result.updatedAt,
            }
        }, {
            accessMode : 'read write',
            isolationLevel : 'serializable',
        })
    }

    static async delete(body : UserModel.DeleteUserBody) : Promise<void> {
        return await db.transaction(async (tx) => {
            const { email, version } = body;
            const [ user ] = await tx.select().from(userSchema).where(eq(userSchema.email, email)).for('update');
            if(!user) {
                throw new NotFoundException('User not found');
            }
            if(user.version !== version) {
                throw new ConflictException('Version mismatch');
            }
            await tx.delete(userSchema).where(eq(userSchema.email, email));
        }, {
            accessMode : 'read write',
            isolationLevel : 'serializable',
        })
    }

    static async getByEmail(email : string) {
        const [ user ] = await db.select().from(userSchema).where(eq(userSchema.email, email));
        type NewType = Omit<typeof user, 'password'>;
        return user as NewType;
    }

    static async getAll(page : number, limit : number) : Promise<UserModel.Response[]> {
        const users = await db.select().from(userSchema).limit(limit).offset((page - 1) * limit);
        return users.map((user) => ({
            email : user.email,
            role : user.role,
            version : user.version,
            name : user.name,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt,
        }));
    }

    static async resetPassword(body : UserModel.ResetPasswordUserBody) : Promise<UserModel.Response> {
        return await db.transaction(async (tx) => {
            const { email, version, password } = body;
            const [ user ] = await tx.select().from(userSchema).where(eq(userSchema.email, email)).for('update');
            if(!user) {
                throw new NotFoundException('User not found');
            }
            if(user.version !== version) {
                throw new ConflictException('Version mismatch');
            }
            const newVersion = new Date().getTime();
            const [ result ] = await tx.update(userSchema).set({
                password : await Bun.password.hash(password, {
                    algorithm : 'bcrypt',
                    cost : 10,
                }),
                version : newVersion,
                updatedAt : new Date(),
            }).where(eq(userSchema.email, email)).returning();
            return {
                id : result.id,
                email : result.email,
                role : result.role,
                version : result.version,
                name : result.name,
                createdAt : result.createdAt,
                updatedAt : result.updatedAt,
            }
        }, {
            accessMode : 'read write',
            isolationLevel : 'serializable',
        })
    }

}