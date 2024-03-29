import ApiCalls from "./apiCalls";

const initialState = {
    isReady: false,
    authenticated: false,
    applicationTitle: "Posts List",
    showExport: false,
    posts: [],
    loginModalVisible: false,
    logoutModalVisible: false,
    deletePostModalData: { visible: false },
    confirmDialogModalData: { visible: false },
    apiCallStatus: { ongoing: false, calls: [] },
};

const getApiFunctions = () => {
    const apiCallsObject = {};

    const apiCalls = new ApiCalls();

    const apiCallsFunctionNames = Object
        .getOwnPropertyNames(Object.getPrototypeOf(apiCalls))
        .filter(functionName => functionName !== "constructor");

    apiCallsFunctionNames.forEach((functionName) => {
        apiCallsObject[functionName] = apiCalls[functionName];
    });

    return apiCallsObject;
};

const apiCalls = {
    ...(getApiFunctions()),
};

export { initialState, apiCalls };
