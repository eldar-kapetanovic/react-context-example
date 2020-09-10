import axios from "axios";
import * as firebase from "firebase/app";
import "firebase/auth";

const apiRoot = "https://test-423cd.firebaseio.com/posts";

const defaultTimeout = 8000;

export default class ApiCalls {
    apiPosts() {
        return axios({
            url: `${apiRoot}.json`,
            method: "GET",
            timeout: defaultTimeout,
        });
    }

    apiPost(postIndex) {
        return axios({
            url: `${apiRoot}/${postIndex}.json`,
            method: "GET",
            timeout: defaultTimeout,
        });
    }

    updatePosts(posts) {
        if (firebase.auth().currentUser) {
            return new Promise((resolve, reject) => {
                firebase.auth().currentUser.getIdToken()
                    .then(authToken => axios({
                        url: `${apiRoot}.json`,
                        method: "PUT",
                        timeout: defaultTimeout,
                        data: posts,
                        params: {
                            auth: authToken,
                        },
                    }))
                    .then(resolve)
                    .catch(reject)
            });
        }
        return new Promise((resolve, reject) => {
            reject(new Error("unauthorized access!"));
        });
    }
}
