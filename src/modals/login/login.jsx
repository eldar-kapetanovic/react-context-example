import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as firebase from "firebase/app";

import ApiCallsHelper from "../../helpers/apiCallsHelper";
import ActionButton from "../../primitives/action-button/actionButton";
import { useAppState } from "../../state/useAppState";
import "./login.css";

const Login = () => {
    const [
        { loginModalVisible, apiCallStatus },
        { setLoginModalVisible, setApiCallStatus },
    ] = useAppState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(" ");
    const [passwordError, setPasswordError] = useState(" ");
    const [errorMessage, setErrorMessage] = useState(" ");

    useEffect(() => {
        if (loginModalVisible === false) {
            setUsername("");
            setPassword("");
            setUsernameError(" ");
            setPasswordError(" ");
            setErrorMessage("");
        }
    }, [loginModalVisible]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameError(" ");
        setErrorMessage("");
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(" ");
        setErrorMessage("");
    };

    const handleLogin = () => {
        let error = false;

        if (!username.trim()) {
            setUsernameError("Please enter your username.");
            error = true;
        }

        if (!password.trim()) {
            setPasswordError("Please enter your password.");
            error = true;
        }

        if (error) {
            return;
        }

        setApiCallStatus((state) => ({
            ...state,
            apiCallStatus: ApiCallsHelper.addApiCallToStatus(
                state.apiCallStatus,
                { callerId: "Login", isComponent: false }
            ),
        }));
        firebase.auth().signInWithEmailAndPassword(username, password)
            .then(() => {
                setLoginModalVisible(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setApiCallStatus((state) => ({
                    ...state,
                    apiCallStatus: ApiCallsHelper.removeApiCallFromStatus(
                        state.apiCallStatus,
                        "Login"
                    ),
                }));
            });
    };

    return (
        <Dialog
            open={loginModalVisible}
            onClose={() => setLoginModalVisible(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Login
            </DialogTitle>
            <DialogContent className="loginDialogContent">
                <div className="formLine">
                    <TextField
                        autoFocus
                        required
                        id="username"
                        label="Email"
                        type="email"
                        fullWidth
                        error={Boolean(usernameError.trim())}
                        helperText={usernameError}
                        value={username}
                        onChange={handleUsernameChange}
                        disabled={apiCallStatus.ongoing}
                    />
                </div>
                <div className="formLine">
                    <TextField
                        required
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        error={Boolean(passwordError.trim())}
                        helperText={passwordError}
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={apiCallStatus.ongoing}
                    />
                </div>
                <DialogContentText className="errorMessage">
                    {errorMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ActionButton text="Cancel" color="default" onClick={() => setLoginModalVisible(false)} />
                <ActionButton actionName="Login" text="Login" onClick={handleLogin} />
            </DialogActions>
        </Dialog>
    );
};

export default Login;
