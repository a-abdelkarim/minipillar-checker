import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!localStorage.getItem("user")) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/map",
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    );
                }
            }}
        />
    );
};
