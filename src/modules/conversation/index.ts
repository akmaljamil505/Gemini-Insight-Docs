import Elysia from "elysia";
import ConversationModel from "./model";
import ConversationService from "./service";
import { CustomContext } from "../../lib/types/custom-context.type";
import { WebResponse } from "../../lib/types/web-reseponse.type";
import { StatusCodes } from "http-status-codes";
import XCorrelationIDHelper from "../../lib/helpers/x-correlation-id.helper";

const conversationRoute = new Elysia({prefix: '/conversation'})
    .post('/create', async (ctx) : Promise<WebResponse<any>> => {
        const {body, user, request} = ctx as unknown as CustomContext & {body: ConversationModel.CreateConversation};
        console.log(user);
        const conversation = await ConversationService.createConversation(body, user.id);
        return {
               message: 'Document created successfully',
               status: true,
               data: conversation,
               x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
               code: StatusCodes.OK,
        } 
    },{
        body: ConversationModel.createConversation,
    })
    .post('/update', async (ctx) : Promise<WebResponse<any>> => {
        const {body, user,request} = ctx as unknown as CustomContext & {body: ConversationModel.UpdateConversation};
        const conversation = await ConversationService.updateConversation(body, user.id);
        return {
               message: 'Document updated successfully',
               status: true,
               data: conversation,
               x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
               code: StatusCodes.OK,
        }
    },{
        body: ConversationModel.updateConversation,
    })
    .post('/delete', async (ctx) : Promise<WebResponse<any>> => {
        const {body, user,request} = ctx as unknown as CustomContext & {body: ConversationModel.DeleteConversation};
        await ConversationService.deleteConversation(body, user.id);
        return {
               message: 'Document deleted successfully',
               status: true,
               data: null,
               x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
               code: StatusCodes.OK,
        }
    },{
        body: ConversationModel.deleteConversation,
    })
    .get('/list', async (ctx) : Promise<WebResponse<any>> => {
        const {user, request} = ctx as unknown as CustomContext;
        return {
            data: await ConversationService.listByUserID(user.id),
            code: StatusCodes.OK,
            message: 'Successfully fetched conversation list',
            status: true,
            x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
        }
    })

export default conversationRoute;