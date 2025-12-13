import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;
import winston from "winston";

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        debug: "cyan",
    },
};
winston.addColors(customLevels.colors);

const logger = createLogger({
    levels: customLevels.levels,
    level: "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        colorize({ all: true }),
        printf(({ level, message, timestamp, xCorrelationID }) => {
            return `[${timestamp}] - ${xCorrelationID} - ${level} - ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
    ],
});

export default class LoggerHelper {

    public static info(message: string, xCorrelationID: string) {
        logger.child({ xCorrelationID }).info(message);
    }

    public static error(message: string, xCorrelationID: string, error : any) {
        logger.child({ xCorrelationID }).error(message, error);
    }

    public static stackTrace(xCorrelationID: string, error : any) {
        logger.child({ xCorrelationID }).error(error.stack);
    }

    public static warn(message: string, xCorrelationID: string) {
        logger.child({ xCorrelationID }).warn(message);
    }

    public static debug(message: string, xCorrelationID: string) {
        logger.child({ xCorrelationID }).debug(message);
    }

}