export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    quote: {
        current: import("../types/quote").Quote | null;
        history: import("../types/quote").Quote[];
        loading: boolean;
        error: string | null;
    };
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        quote: {
            current: import("../types/quote").Quote | null;
            history: import("../types/quote").Quote[];
            loading: boolean;
            error: string | null;
        };
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
