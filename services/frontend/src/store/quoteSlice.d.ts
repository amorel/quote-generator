import { Quote } from "../types/quote";
export declare const fetchRandomQuote: import("@reduxjs/toolkit").AsyncThunk<Quote, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<{
    current: Quote | null;
    history: Quote[];
    loading: boolean;
    error: string | null;
}>;
export default _default;
