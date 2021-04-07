import React, { useEffect } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";

const TextFieldFormWrapper = ({
    label,
    multiline,
    initialData,
    disabled,
    elementName,
    validatorFunctions,
    formHelper,
    onChange,
}) => {
    const initialValue = (initialData || {})[elementName] || "";

    useEffect(() => {
        if (formHelper) {
            formHelper.setElementValidatorFunctions(elementName, validatorFunctions);
            if (formHelper && elementName) {
                formHelper.onChange(elementName, initialValue, initialValue);
            }
        }
    }, []);

    useEffect(() => {
        if (formHelper) {
            formHelper.setElementValidatorFunctions(elementName, validatorFunctions);
        }
    }, [validatorFunctions]);

    const onValueChange = (formElementName, value) => {
        formHelper.onChange(formElementName, value, initialValue);

        if (typeof onChange === "function") {
            onChange(value);
        }
    };


    return formHelper.formData.data[elementName] != null ? (
        <TextField
            label={label}
            multiline={multiline}
            value={formHelper.formData.data[elementName]}
            disabled={disabled}
            helperText={formHelper.formData.errors[elementName]}
            error={Boolean(formHelper.formData.errors[elementName])}
            onChange={(event) => onValueChange(elementName, event.target.value)}
        />
    ) : null;
};

TextFieldFormWrapper.propTypes = {
    label: PropTypes.string,
    multiline: PropTypes.bool,
    initialData: PropTypes.object,
    disabled: PropTypes.bool,
    elementName: PropTypes.string.isRequired,
    validatorFunctions: PropTypes.array,
    formHelper: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

TextFieldFormWrapper.defaultProps = {
    label: "",
    multiline: false,
    initialData: null,
    disabled: false,
    validatorFunctions: null,
    onChange: null,
};

export default TextFieldFormWrapper;
