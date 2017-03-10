
export class ErrorHandlerRegistry {

    private static _handlers: Map<Function, Function>;

    public static handlers = ErrorHandlerRegistry._handlers;

}