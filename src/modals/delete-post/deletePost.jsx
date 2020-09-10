import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { useAppState } from "../../state/useAppState";
import RouterHelper from "../../router/routerHelper";

const DeletePost = () => {
    const [{ deletePostModalData, posts, authenticated }, { setDeletePostModalData, callUpdatePosts }] = useAppState();

    const handleDeletePost = () => {
        if (authenticated === true && posts && posts.length > deletePostModalData.postIndex) {
            const postsCopy = JSON.parse(JSON.stringify(posts));
            postsCopy.splice(deletePostModalData.postIndex, 1);
            callUpdatePosts(postsCopy);
        }
        setDeletePostModalData({ visible: false });
        RouterHelper.navigateTo("/posts");
    };

    return (
        <Dialog
            open={deletePostModalData.visible}
            onClose={() => setDeletePostModalData({ visible: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Confirm Post delete
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete: <b>"{deletePostModalData.postTitle}"</b> post?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeletePostModalData({ visible: false })}  variant="outlined" color="default">
                    Cancel
                </Button>
                <Button onClick={handleDeletePost}  variant="outlined" color="secondary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePost;
