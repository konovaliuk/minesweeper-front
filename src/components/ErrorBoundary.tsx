import React, { ErrorInfo } from "react";

type Props = any;
type State = {
    error?: Error
    hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { error, hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.log({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (<>
                <h1>Something went wrong.</h1>
                <p>{JSON.stringify(this.state.error)}</p>
            </>);
        }

        return this.props.children;
    }
}