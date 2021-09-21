import * as firebase from "firebase/app";
import "firebase/auth";

import { initialState } from "../state/initialState";

class ApiCallsHelper {
    createAuthenticatedApiCall(apiCall) {
        if (firebase.auth().currentUser) {
            return new Promise((resolve, reject) => {
                firebase.auth().currentUser.getIdToken()
                    .then(apiCall)
                    .then(resolve)
                    .catch(reject)
            });
        }

        return new Promise((resolve, reject) => {
            reject(new Error("Unauthorized access!"));
        });
    }

    addApiCallToStatus(apiCallStatus, newApiCall) {
        let newApiCallStatus = JSON.parse(JSON.stringify(
            apiCallStatus || initialState.apiCallStatus
        ));

        if (!(newApiCall &&
            typeof newApiCall.callerId === "string" &&
            typeof newApiCall.isComponent === "boolean"
        )) {
            return newApiCallStatus;
        }

        newApiCallStatus = JSON.parse(JSON.stringify({
            ...initialState.apiCallStatus,
            ...newApiCallStatus,
            ongoing: true,
        }));
        newApiCallStatus.calls.push(
            { callerId: newApiCall.callerId, isComponent: newApiCall.isComponent }
        );

        return newApiCallStatus;
    }

    removeApiCallFromStatus(apiCallStatus, callerId) {
        let newApiCallStatus = JSON.parse(JSON.stringify(
            apiCallStatus || initialState.apiCallStatus
        ));

        if (typeof callerId !== "string") {
            return newApiCallStatus;
        }

        newApiCallStatus = JSON.parse(JSON.stringify({
            ...initialState.apiCallStatus,
            ...newApiCallStatus,
        }));
        const callIndex = newApiCallStatus.calls.findIndex(
            (call) => call.callerId === callerId
        );

        if (callIndex < 0) {
            return newApiCallStatus;
        }

        newApiCallStatus.calls.splice(callIndex, 1);

        if (newApiCallStatus.calls.length === 0) {
            newApiCallStatus.ongoing = false;
        }

        return newApiCallStatus;
    }
}

export default new ApiCallsHelper();
