import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import * as firebase from "firebase/app";

import { useAppState } from "../../state/useAppState";
import "./login.css";

const Login = () => {
    const [{ loginModalVisible }, { setLoginModalVisible }] = useAppState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(" ");
    const [passwordError, setPasswordError] = useState(" ");
    const [errorMessage, setErrorMessage] = useState("test");

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

        firebase.auth().signInWithEmailAndPassword(username, password)
            .then(() => setLoginModalVisible(false))
            .catch((error) => setErrorMessage(error.message));
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
                    />
                </div>
                <DialogContentText className="errorMessage">
                    {errorMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setLoginModalVisible(false)}  variant="outlined" color="default">
                    Cancel
                </Button>
                <Button onClick={handleLogin}  variant="outlined" color="primary">
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Login;
