import React, { useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { useAppState, AppStateProvider } from "./state/useAppState";
import Routes from "./router/routes";
import ResponseDataParser from "./helpers/responseDataParser";
import "./App.css";

const App = () => {
    const [{ isReady }, { setIsReady, setAuthenticated, setPosts }] = useAppState();

    useEffect(() => {
        if (firebase.apps.length === 0) {
            firebase.initializeApp({
                apiKey: "AIzaSyCA40Gmnu_Uv2bFVPE7XE2RVtggfWsfokY",
                authDomain: "test-423cd.firebaseapp.com",
                databaseURL: "https://test-423cd.firebaseio.com",
                storageBucket: "bucket.appspot.com",
            });
            firebase.auth().onAuthStateChanged(
                (user) => {
                    setIsReady(true);
                    if (user) {
                        user.getIdToken()
                            .then(token => setAuthenticated((token || "") !== ""))
                            .catch(() => setAuthenticated(false));
                    } else {
                        setAuthenticated(false);
                    }
                }
            );

            const postsDataReference = firebase.database().ref("test");
            let postsData = postsDataReference.orderByChild("timestamp").limitToFirst(100);
            postsData.on("value", (snapshot) => {
                setPosts(ResponseDataParser.getPostsFromData(snapshot.val()));
            });
        }
    }, []);

    return isReady === true ? (
        <Routes />
    ) : null;
}

const Application = () => (
    <AppStateProvider>
        <App />
    </AppStateProvider>
);

export default Application;
