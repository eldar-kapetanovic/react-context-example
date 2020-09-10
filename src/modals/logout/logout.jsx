import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as firebase from "firebase/app";

import { useAppState } from "../../state/useAppState";
import RouterHelper from "../../router/routerHelper";

const Logout = () => {
    const [{ logoutModalVisible }, { setLogoutModalVisible }] = useAppState();

    const handleLogout = () => {
        firebase.auth().signOut();
        setLogoutModalVisible(false);
        RouterHelper.navigateTo("/posts");
    };

    return (
        <Dialog
            open={logoutModalVisible}
            onClose={() => setLogoutModalVisible(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Confirm Logout
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to <b>"Logout"</b>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setLogoutModalVisible(false)}  variant="outlined" color="default">
                    Cancel
                </Button>
                <Button onClick={handleLogout}  variant="outlined" color="secondary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Logout;
