import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import ActionButton from "../../primitives/action-button/actionButton";
import { useAppState } from "../../state/useAppState";

const ConfirmDialog = () => {
    const [{ confirmDialogModalData }, { setConfirmDialogModalData }] = useAppState();

    const handleConfirmAction = () => {
        if (typeof confirmDialogModalData.confirmAction === "function") {
            confirmDialogModalData.confirmAction();
        }
        setConfirmDialogModalData({ visible: false });
    };

    return (
        <Dialog
            open={confirmDialogModalData.visible}
            onClose={() => setConfirmDialogModalData({ visible: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {confirmDialogModalData.title || "Confirm action"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {confirmDialogModalData.description || ""}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ActionButton
                    text="Cancel"
                    color="default"
                    actionName={confirmDialogModalData.confirmActionName}
                    onClick={() => setConfirmDialogModalData({ visible: false })}
                />
                <ActionButton
                    text="Confirm"
                    color="secondary"
                    onClick={handleConfirmAction}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
