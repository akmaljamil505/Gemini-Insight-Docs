import Elysia from "elysia";
import XCorrelationIDHelper from "../helpers/x-correlation-id.helper";

const xCorrelationIDPlugin = (app : Elysia) => app
    .onRequest(({ request, set }) => {
        const correlationID = XCorrelationIDHelper.getXCorrelationIDFromRequest(request);
        XCorrelationIDHelper.setXCorrelationIDToRequest(request, correlationID);
        set.headers["x-correlation-id"] = correlationID;
    })

export default xCorrelationIDPlugin;