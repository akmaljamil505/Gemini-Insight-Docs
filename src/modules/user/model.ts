import { t } from "elysia";
import RoleConstant from "../../lib/constant/role.constant";

namespace UserModel {
    
    export const createUserBody = t.Object({
        email : t.String({
            format : 'email',
            error : 'Email must be a valid email address'
        }),
        password : t.String({
            minLength : 8,
            error : 'Password must be at least 8 characters long',
        }),
        role : t.Enum({
            user : RoleConstant.USER,
            admin : RoleConstant.ADMIN
        }, {
            error : 'Role must be user or admin'
        }),
        name : t.String({
            minLength : 1
        }),
    })

    export const updateUserBody = t.Object({
        email : t.String({
            format : 'email',
            error : 'Email must be a valid email address'
        }),
        role : t.Enum({
            user : RoleConstant.USER,
            admin : RoleConstant.ADMIN
        }, {
            error : 'Role must be user or admin'
        }),
        name : t.String({
            minLength : 1
        }),
        version : t.Number({
            min : 0,
            error : 'Version must be a non-negative number'
        }),
    })

    export const resetPasswordUserBody = t.Object({
        email : t.String({
            format : 'email',
            error : 'Email must be a valid email address'
        }),
        password : t.String({
            minLength : 8,
            error : 'Password must be at least 8 characters long',
        }),
        version : t.Number({
            min : 0,
            error : 'Version must be a non-negative number'
        }),
    })

    export const deleteUserBody = t.Pick(updateUserBody, ['email', 'version']);

    export type CreateUserBody = typeof createUserBody.static;
    export type UpdateUserBody = typeof updateUserBody.static;
    export type ResetPasswordUserBody = typeof resetPasswordUserBody.static;
    export type DeleteUserBody = typeof deleteUserBody.static;
    export type Response = Omit<CreateUserBody, 'password'> & {
        version : number;
        createdAt : Date;
        updatedAt : Date | null;
    }
}

export default UserModel;