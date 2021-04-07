import { useState } from "react";

const useFormHelper = () => {
    const validatorFunctions = {};
    const [formData, setFormData] = useState({ data: {}, errors: {}, changes: {} });

    const setElementValidatorFunctions = (elementName, elementValidatorFunctions) => {
        if (Array.isArray(elementValidatorFunctions)) {
            validatorFunctions[elementName] = elementValidatorFunctions;
        }
    };

    const onChange = (elementName, value, initialValue) => {
        setFormData((oldData) => ({
            data: { ...oldData.data, [elementName]: value },
            errors: { ...oldData.errors, [elementName]: "" },
            changes: { ...oldData.changes, [elementName]: value !== initialValue },
        }));
    };

    const hasChanges = () => Object.values(formData.changes)
        .some((value) => value);

    const getFormData = () => ({
        ...formData.data,
    });

    const getElementValue = (elementName) => formData.data[elementName];

    const validateFormData = () => {
        let formValid = true;

        Object.keys(formData.data).forEach((elementName) => {
            if (Array.isArray(validatorFunctions[elementName])) {
                let errorMessage;
                for (const validationFunction of validatorFunctions[elementName]) {
                    if (typeof validationFunction === "function") {
                        const validationMessage = validationFunction(formData.data[elementName]);

                        if (validationMessage && typeof validationMessage === "string") {
                            errorMessage = validationMessage;
                            break;
                        }
                    }
                }

                if (errorMessage) {
                    formValid = false;
                    setFormData((oldData) => ({
                        data: { ...oldData.data },
                        errors: { ...oldData.errors, [elementName]: errorMessage },
                        changes: { ...oldData.changes },
                    }));
                } else if (formData.errors[elementName] !== "") {
                    setFormData((oldData) => ({
                        data: { ...oldData.data },
                        errors: { ...oldData.errors, [elementName]: "" },
                        changes: { ...oldData.changes },
                    }));
                }
            }
        });

        return formValid;
    };

    return {
        formData,
        setElementValidatorFunctions,
        onChange,
        hasChanges,
        getFormData,
        getElementValue,
        validateFormData,
    };
};

export default useFormHelper;
