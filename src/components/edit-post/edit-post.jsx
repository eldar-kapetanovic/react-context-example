import React, {
    useEffect,
    useRef,
    useState,
} from "react";
import PropTypes from "prop-types";
import toaster from "toasted-notes";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

import ApiCallsHelper from "../../helpers/apiCallsHelper";
import useFormHelper from "../../helpers/formHelper";
import FormValidationFunctions from "../../helpers/formValidationFunctions";
import ResponseDataParser from "../../helpers/responseDataParser";
import TextFieldFormWrapper from "../../primitives/textFieldFormWrapper/textFieldFormWrapper.jsx";
import ActionButton from "../../primitives/action-button/actionButton.jsx";
import RouterHelper from "../../router/routerHelper";
import Toast from "../toast/toast.jsx";
import EditComment from "../edit-comment/edit-comment";
import { useAppState } from "../../state/useAppState";
import "./edit-post.css";

const EditPost = ({ match: { params: { postId } } }) => {
    const formHelper = useFormHelper();

    const [post, setPost] = useState();
    const [
        {
            authenticated,
            apiCallStatus,
            apiPost,
            apiAddPost,
            apiPatchPost,
        },
        {
            setApplicationTitle,
            setApiCallStatus,
            setDeletePostModalData,
            callApiPost,
            callApiAddPost,
            callApiPatchPost,
        },
    ] = useAppState();
    const commentsRef = useRef([]);

    const setFormData = (postData) => {
        if (postData) {
            formHelper.onChange("title", postData.title || "", postData.title || "");
            formHelper.onChange("body", postData.body || "", postData.body || "");
        }
    };

    const resetFormData = () => {
        setFormData(post);
    };

    useEffect(() => {
        if (postId) {
            setApplicationTitle("Edit Post");
            setApiCallStatus((state) => ({
                ...state,
                apiCallStatus: ApiCallsHelper.addApiCallToStatus(
                    state.apiCallStatus,
                    { callerId: "EditPost", isComponent: true }
                ),
            }));
            callApiPost(postId);
        } else {
            setApplicationTitle("Add Post");
            setPost({
                title: "",
                body: "",
                comments: [],
            });
            commentsRef.current = [];
        }
    }, [postId]);

    useEffect(() => {
        if (!postId || !apiCallStatus.ongoing) {
            return;
        }

        if (apiPost && apiCallStatus.ongoing) {
            setApiCallStatus((state) => ({
                ...state,
                apiCallStatus: ApiCallsHelper.removeApiCallFromStatus(
                    state.apiCallStatus,
                    "EditPost"
                ),
            }));
            setPost(ResponseDataParser.getPostFromResponse(apiPost, postId));
        }
    }, [apiPost]);

    useEffect(() => {
        resetFormData();
    }, [post]);

    useEffect(() => {
        if (apiAddPost && apiCallStatus.ongoing) {
            setApiCallStatus((state) => ({
                ...state,
                apiCallStatus: ApiCallsHelper.removeApiCallFromStatus(
                    state.apiCallStatus,
                    "SavePost"
                ),
            }));

            if (apiAddPost.status === 200 && apiAddPost.data) {
                toaster.notify(
                    <Toast message="New Post created successfully." />,
                    { position: "top-right", duration: 2000 }
                );
                RouterHelper.navigateTo(`edit-post/${apiAddPost.data.name}`);
            } else {
                toaster.notify(
                    <Toast message="Error occurred when saving Post data." type="error" />,
                    { position: "top-right", duration: 2000 }
                );
            }
        }
    }, [apiAddPost]);

    useEffect(() => {
        if (apiPatchPost && apiCallStatus.ongoing) {
            setApiCallStatus((state) => ({
                ...state,
                apiCallStatus: ApiCallsHelper.removeApiCallFromStatus(
                    state.apiCallStatus,
                    "SavePost"
                ),
            }));

            if (apiPatchPost.status === 200 && apiPatchPost.data) {
                setFormData(formHelper.getFormData());
                toaster.notify(
                    <Toast message="New Post created successfully." />,
                    { position: "top-right", duration: 2000 }
                );
            } else {
                toaster.notify(
                    <Toast message="Error occurred when saving Post data." type="error" />,
                    { position: "top-right", duration: 2000 }
                );
            }
        }
    }, [apiPatchPost]);

    const handleAddNewComment = () => {
        const postCopy = JSON.parse(JSON.stringify(post));

        if (postCopy.comments) {
            postCopy.comments.push({ name: "", body: "" });
        } else {
            postCopy.comments = [{ name: "", body: "" }];
        }

        setPost(postCopy);
    };

    const handleDeletePost = () => {
        setDeletePostModalData({
            visible: true,
            postTitle: post.title,
            postId,
        });
    };

    const handleSavePost = () => {
        const postValid = formHelper.validateFormData();
        const commentsValid = commentsRef.current.every((commentReference) => (
            commentReference.validateComment()
        ));

        if (!postValid || !commentsValid) {
            toaster.notify(
                <Toast message="Please fix errors." type="error" />,
                { position: "top-right", duration: 1500 }
            );
            return;
        }

        const newPostData = JSON.parse(JSON.stringify(formHelper.getFormData()));

        setApiCallStatus((state) => ({
            ...state,
            apiCallStatus: ApiCallsHelper.addApiCallToStatus(
                state.apiCallStatus,
                { callerId: "SavePost", isComponent: false }
            ),
        }));

        if (postId == null) {
            newPostData.timestamp = {
                ".sv":"timestamp",
            };
            callApiAddPost(newPostData);
        } else {
            commentsRef.current.forEach((commentReference) => {
                commentReference.saveComment();
            });
            callApiPatchPost(postId, newPostData);
        }
    };

    const deleteComment = (commentIndex) => {
        const postCopy = JSON.parse(JSON.stringify(post));
        postCopy.comments.splice(commentIndex, 1);
        commentsRef.current.splice(commentIndex, 1);
        setPost(postCopy);

        toaster.notify(
            <Toast message="Comment deleted successfully." />,
            { position: "top-right", duration: 2000 }
        );
    };

    const handleDeleteComment = (commentIndex, apiCall) => {
        if (!apiCall && !post.comments[commentIndex].id) {
            deleteComment(commentIndex);
        }
        else if (apiCall && apiCall.status === 200) {
            deleteComment(commentIndex);
        } else {
            toaster.notify(
                <Toast message="Error occurred when deleting comment." type="error" />,
                { position: "top-right", duration: 2000 }
            );
        }
    };

    return (post && authenticated && (
        <>
            <Card className="edit-post-card">
                <CardHeader className="width-100" title="Post" />
                <CardContent className="edit-post-content">
                    <div className="edit-post-form-line">
                        <TextFieldFormWrapper
                            label="Title"
                            initialData={post}
                            disabled={apiCallStatus.ongoing}
                            elementName="title"
                            validatorFunctions={[FormValidationFunctions.getRequiredValidator()]}
                            formHelper={formHelper}
                        />
                    </div>
                    <div className="edit-post-form-line">
                        <TextFieldFormWrapper
                            label="Post"
                            multiline
                            initialData={post}
                            disabled={apiCallStatus.ongoing}
                            elementName="body"
                            validatorFunctions={[FormValidationFunctions.getRequiredValidator()]}
                            formHelper={formHelper}
                        />
                    </div>
                </CardContent>
                <CardActions className="post-commands">
                    <ActionButton
                        actionName={`deletePost${postId}`}
                        text="DELETE"
                        color="secondary"
                        disabled={postId == null}
                        onClick={handleDeletePost}
                    />
                    <ActionButton
                        text="CANCEL"
                        color="default"
                        disabled={!formHelper.hasChanges()}
                        onClick={resetFormData}
                    />
                    <ActionButton
                        actionName="SavePost"
                        text="SAVE"
                        disabled={!formHelper.hasChanges()}
                        onClick={handleSavePost}
                    />
                </CardActions>
            </Card>
            {<Card className="edit-post-card">
                <CardHeader
                    title="Comments" 
                    action={(
                        <IconButton
                            aria-label="add"
                            disabled={postId == null}
                            onClick={handleAddNewComment}
                        >
                            <Icon color={(postId == null) ? "disabled" : "primary"}>add_circle</Icon>
                        </IconButton>
                    )}
                />
                <CardContent>
                    {postId && post.comments && post.comments.map((comment, index) => (
                        <EditComment
                            ref={el => { commentsRef.current[index] = el; }}
                            key={comment.id || `editComment${index}`}
                            postId={postId}
                            commentIndex={index}
                            commentData={comment}
                            onDeleteComment={handleDeleteComment.bind(this, index)}
                        />
                    ))}
                </CardContent>
            </Card>}
        </>)
    ) || null;
}

EditPost.propTypes = {
    match: PropTypes.object.isRequired,
};

export default EditPost;
