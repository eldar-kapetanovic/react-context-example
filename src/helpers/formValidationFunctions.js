export default class FormValidationFunctions {
    static getRequiredValidator(errorMessage) {
        // eslint-disable-next-line complexity
        return (value) => {
            if (value == null ||
                (typeof value === "string" && value.trim().length === 0) ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === "object" && Object.keys(value).length === 0)
            ) {
                return errorMessage || "Value is required.";
            }

            return "";
        };
    }

    static getMinLengthValidator(minLength, errorMessage) {
        return (value) => {
            if (
                value != null && typeof minLength === "number" &&
                Object.prototype.hasOwnProperty.call(value, "length") && value.length < minLength
            ) {
                return (errorMessage || "Min length is {{minLength}}.").replace("{{minLength}}", `${minLength}`);
            }

            return "";
        };
    }

    static getMaxLengthValidator(maxLength, errorMessage) {
        return (value) => {
            if (
                value && typeof maxLength === "number" &&
                Object.prototype.hasOwnProperty.call(value, "length") && value.length > maxLength
            ) {
                return (errorMessage || "Max length is {{maxLength}}.").replace("{{maxLength}}", `${maxLength}`);
            }

            return "";
        };
    }
}
