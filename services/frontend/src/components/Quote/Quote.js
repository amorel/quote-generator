import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { fetchRandomQuote } from "../../store/quoteSlice";
import styles from "./Quote.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
export const Quote = () => {
    const dispatch = useAppDispatch();
    const { current: quote, loading, error, } = useAppSelector((state) => state.quote);
    useEffect(() => {
        dispatch(fetchRandomQuote());
    }, [dispatch]);
    if (loading)
        return _jsx("div", { children: "Loading..." });
    if (error)
        return _jsxs("div", { children: ["Error: ", error] });
    if (!quote)
        return null;
    return (_jsxs("div", { className: styles.container, children: [_jsxs("blockquote", { className: styles.quote, children: [_jsx("p", { children: quote.content }), _jsxs("footer", { children: ["\u2014 ", quote.author] })] }), _jsx("button", { onClick: () => dispatch(fetchRandomQuote()), children: "Next Quote" })] }));
};
