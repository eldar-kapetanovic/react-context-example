import React, { useEffect } from "react";
import toaster from "toasted-notes";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import ApiCallsHelper from "../../helpers/apiCallsHelper";
import Toast from "../../components/toast/toast.jsx"
import { useAppState } from "../../state/useAppState";
import RouterHelper from "../../router/routerHelper";
import ActionButton from "../../primitives/action-button/actionButton.jsx";

const DeletePost = () => {
    const [
        { deletePostModalData, authenticated, posts, apiCallStatus, apiDeletePost },
        { setDeletePostModalData, setPosts, callApiDeletePost, setApiCallStatus },
    ] = useAppState();

    useEffect(() => {
        if (apiDeletePost && apiCallStatus.ongoing) {
            const postId = deletePostModalData.postId;
            setDeletePostModalData({ visible: false });
            setApiCallStatus(ApiCallsHelper.removeApiCallFromStatus(
                `DeletePost${deletePostModalData.postId}`
            ));

            if (apiDeletePost.status === 200) {
                const postsCopy = JSON.parse(JSON.stringify(posts));
                const deletedPostIndex = postsCopy.findIndex((post) => post.id === postId);

                if (deletedPostIndex >= 0) {
                    postsCopy.splice(deletedPostIndex, 1);
                    setPosts(postsCopy);
                }

                toaster.notify(
                    <Toast message="Post deleted successfully." />,
                    { position: "top-right", duration: 1500 }
                );
                RouterHelper.navigateTo("/posts");
            } else {
                toaster.notify(
                    <Toast message="Error occurred when deleting Post data." type="error" />,
                    { position: "top-right", duration: 1500 }
                );
            }
        }
    }, [apiDeletePost]);

    const handleDeletePost = () => {
        if (authenticated === true && deletePostModalData.postId) {
            setApiCallStatus(ApiCallsHelper.addApiCallToStatus(
                { callerId: `DeletePost${deletePostModalData.postId}`, isComponent: false }
            ));
            callApiDeletePost(deletePostModalData.postId);
        }
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
                <ActionButton
                    text="Cancel"
                    color="default"
                    onClick={() => setDeletePostModalData({ visible: false })}
                />
                <ActionButton
                    actionName={`deletePost${deletePostModalData.postId}`}
                    text="Confirm"
                    color="secondary"
                    onClick={handleDeletePost}
                />
            </DialogActions>
        </Dialog>
    );
};

export default DeletePost;
