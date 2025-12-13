export type WebResponse<T> = {
    status: Boolean;
    message: String;
    data: T;
    x_correlation_id: String;
    code: Number;
}
