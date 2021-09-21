import React, {
    createContext,
    useContext,
    useReducer,
} from "react";
import PropTypes from "prop-types";
import { initialState, apiCalls } from "./initialState";

const setStateReducer = (prevState, value) => {
    if (typeof value === "function") {
        return value(prevState);
    }

    return {
        ...prevState,
        ...value,
    };
};

const AppContext = createContext([]);

const AppStateConsumer = AppContext.Consumer;

const useAppState = () => useContext(AppContext);

const capitalizeFirstLetter = str => str[0].toUpperCase() + str.substr(1);

const AppStateProvider = ({ children }) => {
    const apiCallsState = {};
    Object.keys(apiCalls).forEach((item) => {
        apiCallsState[item] = undefined;
    });

    const [state, setState] = useReducer(setStateReducer, { ...initialState, ...apiCallsState});
    const actions = {};
    Object.keys(initialState).forEach((item) => {
        actions[`set${capitalizeFirstLetter(item)}`] = (value) => (
            setState(typeof value === "function" ? value : { [item]: value })
        );
    });
    Object.entries(apiCalls).forEach(([key, apiFunction]) => {
        if (typeof apiFunction === "function") {
            actions[`call${capitalizeFirstLetter(key)}`] = (...parameters) => {
                setState({ [key]: null });
                apiFunction(...parameters)
                    .then((result) => {
                        setState({ [key]: result });
                    })
                    .catch((error) => {
                        setState({ [key]: error });
                    });
            }
        }
    });
    return (
        <AppContext.Provider value={[state, { setState, ...actions }]}>{children}</AppContext.Provider>
    );
};
AppStateProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

AppStateProvider.defaultProps = {
    children: null,
};

export {
    useAppState,
    AppStateProvider,
    AppStateConsumer,
};
