import { pgEnum, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { baseSchema } from "./base.schema";
import DB_CONSTANT from "../../constant/db.constant";
import RoleConstant from "../../constant/role.constant";

export const roleEnum = pgEnum('user_role',[RoleConstant.USER, RoleConstant.ADMIN]);

export const userSchema = pgTable('users',{
    email : varchar("email").notNull(),
    password : varchar("password").notNull(),
    role : roleEnum().notNull(),
    name : varchar("name").notNull(),
    ...baseSchema,
},(table) => [
    uniqueIndex(DB_CONSTANT.EMAIL_INDEX_UNIQUE).on(table.email),
])