import Elysia from "elysia";
import AuthenticationException from "../exception/authentication.exception";
import JwtHelper from "../helpers/jwt.helper";
import { CommonJWTPayload } from "../types/jwt.type";
import RoleConstant from "../constant/role.constant";
import ForbiddenException from "../exception/forbidden.exception";
import UserService from "../../modules/user/service";

export const jwtAdminAuthPlugin = (app : Elysia) => app
    .derive(async ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            throw new AuthenticationException('Authorization header is missing');
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AuthenticationException('Token is missing');
        }

        const verify = JwtHelper.verifyToken(token) as CommonJWTPayload;
        if (!verify) {
            throw new AuthenticationException('Invalid token');
        }

        const user = await UserService.getByEmail(verify.email);
        if (!user) {
            throw new AuthenticationException('User not found');
        }

        if (user.role !== RoleConstant.ADMIN) {
            throw new ForbiddenException('You are not authorized to access this resource');
        }
        return { token };
    })


export const jwtPublicAuthPlugin = (app : Elysia) => app
    .derive(async ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            throw new AuthenticationException('Authorization header is missing');
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AuthenticationException('Token is missing');
        }

        const verify = JwtHelper.verifyToken(token) as CommonJWTPayload;
        if (!verify) {
            throw new AuthenticationException('Invalid token');
        }

        const user = await UserService.getByEmail(verify.email);
        if (!user) {
            throw new AuthenticationException('User not found');
        }

        if (user.role !== RoleConstant.USER && user.role !== RoleConstant.ADMIN) {
            throw new ForbiddenException('You are not authorized to access this resource');
        }
        return { token };
    })