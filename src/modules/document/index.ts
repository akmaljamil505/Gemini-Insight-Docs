import Elysia, { t } from "elysia";
import DocumentModel from "./model";
import DocumentService from "./service";
import { WebResponse } from "../../lib/types/web-reseponse.type";
import XCorrelationIDHelper from "../../lib/helpers/x-correlation-id.helper";
import { StatusCodes } from "http-status-codes";

export const document = new Elysia({
     prefix: '/document',
})
     .post('/create', async ({ body, set, request }): Promise<WebResponse<null>> => {
          await DocumentService.create(body);
          set.status = 200;
          return {
               message: 'Document created successfully',
               status: true,
               data: null,
               x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
               code: StatusCodes.OK,
          }
     }, {
          body: DocumentModel.createDocumentBody,
     })
     .get('/get-sign-url', async ({ set, request, query }): Promise<WebResponse<string>> => {
          const { documentId } = query;
          const signedUrl = await DocumentService.getSignUrlFileDocument(documentId);
          signedUrl
          set.status = 200;
          return {
               message: 'Document signed url generated successfully',
               status: true,
               data: signedUrl,
               x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
               code: StatusCodes.OK,
          }
     }, {
          query: t.Object({
               documentId: t.String({
                    format: 'uuid',
                    error: 'DocumentId must be a uuid',
               }),
          }),
     })
     .get('/get-all', async ({ set, request, query }): Promise<WebResponse<any>> => {
          const { page, limit } = query;
          const documents = await DocumentService.getAll(page, limit);
          set.status = 200;
          return {
               message: 'Documents retrieved successfully',
               status: true,
               data: documents,
               x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
               code: StatusCodes.OK,
          }
     }, {
          query: t.Object({
               page: t.Numeric({
                    error: 'Page must be a number and Minimum 1',
                    minimum: 1,
                    default: 1,
               }),
               limit: t.Numeric({
                    error: 'Limit must be a number and Minimum 1',
                    minimum: 1,
                    default: 10,
               }),
          }),
     })