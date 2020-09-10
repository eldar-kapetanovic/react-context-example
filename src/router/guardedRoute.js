import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import { useAppState } from "../state/useAppState";


const GuardedRoute = ({ path, ...props }) => {
    const [{ authenticated }] = useAppState();

    return (authenticated ?
        <Route path={path} {...props} /> :
        <Redirect exact from={path} to={"/posts"} />
    );
};

GuardedRoute.propTypes = {
    path: PropTypes.string.isRequired,
};

export default GuardedRoute;
