import Elysia from "elysia";
import LoggerHelper from "../helpers/logger.helper";
import XCorrelationIDHelper from "../helpers/x-correlation-id.helper";

const loggerPlugin = (app : Elysia) => app
    .onStart(() => {
        LoggerHelper.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`, XCorrelationIDHelper.generateCorrelationID());
    })
    .onRequest(({ request }) => {
        LoggerHelper.info(`Incoming Request ${request.method} ${request.url}`, XCorrelationIDHelper.getXCorrelationIDFromRequest(request));
    })
    .onAfterResponse(({ request, set }) => {
        LoggerHelper.info(`End of Response ${request.method} ${request.url} ${set.status}`, XCorrelationIDHelper.getXCorrelationIDFromRequest(request));
    })
    .onError(({ request, set, error }) => {
        LoggerHelper.stackTrace(XCorrelationIDHelper.getXCorrelationIDFromRequest(request), error);
        LoggerHelper.error(`Error Response ${request.method} ${request.url} ${set.status}`, XCorrelationIDHelper.getXCorrelationIDFromRequest(request), error);
    })
    .onStop(() => {
        LoggerHelper.info(`Successfully stopped Elysia`, XCorrelationIDHelper.generateCorrelationID());
    })

export default loggerPlugin;
