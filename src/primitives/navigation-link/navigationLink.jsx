import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useAppState } from "../../state/useAppState";

const NavigationLink = ({ className, to, disabled, children}) => {
    const [{ apiCallStatus }] = useAppState();

    return (
        <Link
            className={`${className}${disabled || apiCallStatus.ongoing ? " app-disabled-link" : ""}`}
            to={disabled || apiCallStatus.ongoing ? "#" : to}
        >
            {children}
        </Link>
    );
};

NavigationLink.propTypes = {
    className: PropTypes.string,
    to: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.object.isRequired,
};

NavigationLink.defaultProps = {
    className: "",
    disabled : false,
};

export default NavigationLink;
