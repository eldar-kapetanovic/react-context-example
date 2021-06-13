import axios from "axios";
import ApiCallsHelper from "../helpers/apiCallsHelper";

const apiRoot = "https://posts-249e3.firebaseio.com/posts";

const defaultTimeout = 8000;

export default class ApiCalls {
    apiPosts() {
        return axios({
            url: `${apiRoot}.json`,
            method: "GET",
            timeout: defaultTimeout,
        });
    }

    apiPost(postId) {
        return axios({
            url: `${apiRoot}/${postId}.json`,
            method: "GET",
            timeout: defaultTimeout,
        });
    }

    apiAddPost(postData) {
        return ApiCallsHelper.createAuthenticatedApiCall(
            (authToken) => axios({
                url: `${apiRoot}.json`,
                method: "POST",
                timeout: defaultTimeout,
                data: postData,
                params: {
                    auth: authToken,
                },
            })
        );
    }

    apiPatchPost(postId, postData) {
        return ApiCallsHelper.createAuthenticatedApiCall(
            (authToken) => axios({
                url: `${apiRoot}/${postId}.json`,
                method: "PATCH",
                timeout: defaultTimeout,
                data: postData,
                params: {
                    auth: authToken,
                },
            })
        );
    }

    apiDeletePost(postId) {
        return ApiCallsHelper.createAuthenticatedApiCall(
            (authToken) => axios({
                url: `${apiRoot}/${postId}.json`,
                method: "DELETE",
                timeout: defaultTimeout,
                params: {
                    auth: authToken,
                },
            })
        );
    }

    apiAddComment(postId, commentData) {
        return ApiCallsHelper.createAuthenticatedApiCall(
            (authToken) => axios({
                url: `${apiRoot}/${postId}/comments.json`,
                method: "POST",
                timeout: defaultTimeout,
                data: commentData,
                params: {
                    auth: authToken,
                },
            })
        );
    }

    apiPatchComment(postId, commentId, commentData) {
        return ApiCallsHelper.createAuthenticatedApiCall(
            (authToken) => axios({
                url: `${apiRoot}/${postId}/comments/${commentId}.json`,
                method: "PATCH",
                timeout: defaultTimeout,
                data: commentData,
                params: {
                    auth: authToken,
                },
            })
        );
    }

    apiDeleteComment(postId, commentId) {
        return ApiCallsHelper.createAuthenticatedApiCall(
            (authToken) => axios({
                url: `${apiRoot}/${postId}/comments/${commentId}.json`,
                method: "DELETE",
                timeout: defaultTimeout,
                params: {
                    auth: authToken,
                },
            })
        );
    }
}
