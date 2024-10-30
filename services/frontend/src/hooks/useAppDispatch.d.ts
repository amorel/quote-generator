export declare const useAppDispatch: () => import("redux-thunk").ThunkDispatch<{
    quote: {
        current: import("../types/quote").Quote | null;
        history: import("../types/quote").Quote[];
        loading: boolean;
        error: string | null;
    };
}, undefined, import("redux").UnknownAction> & import("redux").Dispatch<import("redux").UnknownAction>;
