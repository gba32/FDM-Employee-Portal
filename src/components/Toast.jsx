import React, { useContext, useEffect, useRef, useState } from "react";

export const ToastContext = React.createContext(null);

export function showText(message, duration, context) {
    let duplicate = [...context.getToasts()];
    let toast = { id: context.getCounter(), msg: message, startTime: Date.now(), duration: duration };
    duplicate.push(toast);
    context.setToasts(duplicate);
    context.setCounter(context.getCounter() + 1);
    console.log("FOUND", context.getToasts());
    setTimeout(() => {
        context.setRemovalFlag(true);
        context.removalRef.current.push(toast);
    }, duration);
}

function ToastBar({ containerClass, toastClass, toasts, limit = 1 }) {
    return <div className={containerClass}>{toasts.slice(0, limit).map((({ id, msg }) => <span key={ "toast-" + id } className={toastClass}>{msg}</span>))}</div>
}

export function ToastContainer({ children, containerClass, toastClass, limit }) {
    const [toasts, setToasts] = useState([]);
    const [counter, setCounter] = useState(0);
    const [removalFlag, setRemovalFlag] = useState(false);
    const removalRef = useRef([]);
    const getToasts = () => toasts;
    const getCounter = () => counter;

    useEffect(() => {
        if (removalFlag) {
            setToasts(toasts.filter((t) => !removalRef.current.includes(t)));
            setRemovalFlag(false);
            removalRef.current = [];
        }
    }, [toasts, removalRef, removalFlag]);

    return <ToastContext.Provider value={
        {
            getToasts: getToasts,
            setToasts: setToasts,
            getCounter: getCounter,
            setCounter: setCounter,
            removalRef: removalRef,
            setRemovalFlag: setRemovalFlag
        }
    }>
        {children}
        {
            toasts.length === 0 ?
                <></> : <ToastBar containerClass={containerClass} toastClass={toastClass} toasts={toasts} limit={limit} />
        }
    </ToastContext.Provider>
}