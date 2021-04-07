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

    addApiCallToStatus(newApiCall) {
        if (!(
            newApiCall &&
            typeof newApiCall.callerId === "string" &&
            typeof newApiCall.isComponent === "boolean"
        )) {
            this.apiCallStatus = this.apiCallStatus || initialState.apiCallStatus;
            return this.apiCallStatus;
        }

        this.apiCallStatus = JSON.parse(JSON.stringify({
            ...initialState.apiCallStatus,
            ...this.apiCallStatus,
            ongoing: true,
        }));
        this.apiCallStatus.calls.push({ callerId: newApiCall.callerId, isComponent: newApiCall.isComponent });

        return this.apiCallStatus;
    }

    removeApiCallFromStatus(callerId) {
        if (typeof callerId !== "string") {
            this.apiCallStatus = this.apiCallStatus || initialState.apiCallStatus;
            return this.apiCallStatus;
        }

        this.apiCallStatus = JSON.parse(JSON.stringify({
            ...initialState.apiCallStatus,
            ...this.apiCallStatus,
        }));
        const callIndex = this.apiCallStatus.calls.findIndex(
            (call) => call.callerId === callerId
        );

        if (callIndex < 0) {
            return this.apiCallStatus;
        }

        this.apiCallStatus.calls.splice(callIndex, 1);

        if (this.apiCallStatus.calls.length === 0) {
            this.apiCallStatus.ongoing = false;
        }

        return this.apiCallStatus;
    }
}

export default new ApiCallsHelper();
