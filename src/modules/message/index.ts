import Elysia, { t } from "elysia";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import XCorrelationIDHelper from "../../lib/helpers/x-correlation-id.helper";
import { CustomContext } from "../../lib/types/custom-context.type";
import { WebResponse } from "../../lib/types/web-reseponse.type";
import { MessageService } from "./service";

export const message = new Elysia({
    prefix: '/message',
})
    .get('/:conversation_id', async (ctx) : Promise<WebResponse<any>> => {
        const {params, request, user} = ctx as unknown as CustomContext & {params : {conversation_id : string}};
        const historis = await MessageService.historyChatByConversationID(params.conversation_id, user?.id);
        return {
            data: historis,
            code : StatusCodes.OK,
            message : 'Successfully fetched chat history',
            status : true,
            x_correlation_id : XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
        }
    },{
        params : t.Object({
            conversation_id : t.String(),
        })
    })