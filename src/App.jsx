import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
import "firebase/auth";

import { useAppState, AppStateProvider } from "./state/useAppState";
import Routes from "./router/routes";
import "./App.css";

const App = () => {
    const [{ isReady }, { setIsReady, setAuthenticated, callApiPosts }] = useAppState();

    useEffect(() => {
        initializeApp({
            apiKey: "AIzaSyCA40Gmnu_Uv2bFVPE7XE2RVtggfWsfokY",
            authDomain: "test-423cd.firebaseapp.com",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isReady) {
            callApiPosts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady]);

    return isReady === true ? (
        <Routes />
    ) : null;
}

export default () => (
    <AppStateProvider>
        <App />
    </AppStateProvider>
);
