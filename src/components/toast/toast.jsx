import React from "react";
import PropTypes from "prop-types";

import "./toast.css";

const Toast = ({
    message,
    type,
}) => (
    <div className={`toast ${type}`}>
        {message}
    </div>
);

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

Toast.defaultProps = {
    type: "success",
};

export default Toast;