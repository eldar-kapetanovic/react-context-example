import React, {
    Fragment,
    useEffect,
    useState,
} from "react";
import PropTypes from "prop-types";
import toaster from "toasted-notes";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";

import Toast from "../toast/toast";
import { useAppState } from "../../state/useAppState";
import "./edit-post.css";
import RouterHelper from "../../router/routerHelper";

// eslint-disable-next-line complexity
const EditPost = ({ match: { params: { postIndex } } }) => {
    const [
        { apiPost, authenticated, posts, updatePosts },
        { callApiPost, setTitle, setPosts, setDeletePostModalData, callUpdatePosts, setConfirmDialogModalData },
    ] = useAppState();
    const [post, setPost] = useState();
    const [postErrors, setPostErrors] = useState();
    const [isFormDisabled, setFormDisabled] = useState(false);
    const [isSaveError, setSaveError] = useState(false);

    useEffect(() => {
        if (postIndex) {
            setTitle("Edit Post");
            callApiPost(postIndex);
        } else {
            setTitle("Add Post");
            setPost({
                title: "",
                body: "",
                comments: [],
            });
            setPostErrors({
                title: false,
                body: false,
                comments: [],
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postIndex]);

    useEffect(() => {
        if (!postIndex) {
            return;
        }

        if (apiPost && apiPost.status === 200 && apiPost.data) {
            setPost(JSON.parse(JSON.stringify(apiPost.data)));
            setPostErrors({
                title: false,
                body: false,
                comments: (apiPost.data.comments || []).map(() => ({ name: false, body: false })),
            });
        } else {
            setPost(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiPost]);

    useEffect(() => {
        if (updatePosts && updatePosts.status === 200 && updatePosts.data) {
            setFormDisabled(false);
            setPosts(updatePosts.data);
            if (!postIndex && post && post.title && post.body) {
                RouterHelper.navigateTo(`/edit-post/${updatePosts.data.length - 1}`);
            } else {
                callApiPost(postIndex);
            }
        } else {
            setSaveError(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePosts]);

    const addPost = (postData) => {
        const postsCopy = JSON.parse(JSON.stringify(posts));
        postsCopy.push(postData);
        setFormDisabled(true);
        callUpdatePosts(postsCopy);
    };

    const updatePost = (postData) => {
        const postsCopy = JSON.parse(JSON.stringify(posts));
        postsCopy[postIndex] = postData;
        setFormDisabled(true);
        callUpdatePosts(postsCopy);
    };

    const validateCommentsData = () => {
        const postErrorsCopy = JSON.parse(JSON.stringify(postErrors));
        post.comments.forEach((comment, index) => (
            postErrorsCopy.comments[index] = { name: !comment.name.trim(), body: !comment.body.trim() }
        ));
        setPostErrors(postErrorsCopy);
        return !(
            postErrorsCopy.comments.some(commentError => commentError.name || commentError.body)
        );
    };

    const validatePostData = () => {
        const postErrorsCopy = JSON.parse(JSON.stringify(postErrors));
        postErrorsCopy.title = !post.title.trim();
        postErrorsCopy.body = !post.body.trim();
        post.comments.forEach((comment, index) => (
            postErrorsCopy.comments[index] = { name: !comment.name.trim(), body: !comment.body.trim() }
        ));
        setPostErrors(postErrorsCopy);
        return !(
            postErrorsCopy.title ||
            postErrorsCopy.body ||
            postErrorsCopy.comments.some(commentError => commentError.name || commentError.body)
        );
    };

    const handleChange = (event, element, arrayIndex, arrayElement) => {
        const postCopy = JSON.parse(JSON.stringify(post));
        const postErrorsCopy = JSON.parse(JSON.stringify(postErrors));

        if (arrayIndex == null) {
            postCopy[element] = event.target.value;
            postErrorsCopy[element] = false;
        } else {
            postCopy[element][arrayIndex][arrayElement] = event.target.value;
            postErrorsCopy[element][arrayIndex][arrayElement] = false;
        }
        setPost(postCopy);
        setPostErrors(postErrorsCopy);
    };

    const handleAddNewComment = () => {
        const postCopy = JSON.parse(JSON.stringify(post));
        if (postCopy.comments) {
            postCopy.comments.push({ name: "", body: "" });
        } else {
            postCopy.comments = [{ name: "", body: "" }];
        }
        const postErrorsCopy = JSON.parse(JSON.stringify(postErrors));
        postErrorsCopy.comments.push({ name: false, body: false });
        setPost(postCopy);
        setPostErrors(postErrorsCopy);
    };

    const handleDeletePost = () => {
        setDeletePostModalData({
            visible: true,
            postTitle: post.title,
            postIndex,
        });
    };

    const handleCancelPost = () => {
        const postCopy = JSON.parse(JSON.stringify(post));
        const postErrorsCopy = JSON.parse(JSON.stringify(postErrors));

        postCopy.title = apiPost.data.title;
        postCopy.body = apiPost.data.body;

        postErrorsCopy.title = false;
        postErrorsCopy.body = false;

        setPost(postCopy);
        setPostErrors(postErrorsCopy);
    };

    const handleSavePost = () => {
        if (!validatePostData()) {
            toaster.notify(
                <Toast message="Please fix errors." type="error" />,
                { position: "top-right", duration: 1500 }
            );
            return;
        }
        if (postIndex == null) {
            addPost(post);
        } else {
            updatePost(post);
        }
    };

    const handleDeleteComment = (commentIndex) => {
        const postCopy = JSON.parse(JSON.stringify(post));
        setConfirmDialogModalData({
            visible: true,
            title: "Confirm comment delete.",
            description: `Are you really want to delete ${postCopy.comments[commentIndex].name} comment?`,
            confirmAction: () => {
                postCopy.comments.splice(commentIndex, 1);
                updatePost(postCopy);
                setPost(postCopy);
            },
        });
    };

    const handleCancelComment = (commentIndex) => {
        if ((apiPost.data.comments || []).length <= commentIndex) {
            return;
        }
        const postCopy = JSON.parse(JSON.stringify(post));
        const postErrorsCopy = JSON.parse(JSON.stringify(postErrors));
        postCopy.comments[commentIndex] = {
            name: apiPost.data.comments[commentIndex].name,
            body: apiPost.data.comments[commentIndex].body,
        };
        postErrorsCopy.comments[commentIndex] = {
            name: false,
            body: false,
        };
        setPost(postCopy);
        setPostErrors(postErrorsCopy);
    };

    const handleSaveComments = () => {
        if (!validateCommentsData()) {
            toaster.notify(
                <Toast message="Please fix errors." type="error" />,
                { position: "top-right", duration: 1500 }
            );
            return;
        }

        const postCopy = JSON.parse(JSON.stringify(apiPost.data));
        postCopy.comments = JSON.parse(JSON.stringify(post.comments));
        updatePost(postCopy);
        setPost(postCopy);
    };

    return (post && authenticated && (isSaveError ? (
        <Fragment>
            <Card className="edit-post-card">
                <CardHeader className="width-100" title="Post" />
                <CardContent className="edit-post-content">
                    <div className="edit-post-form-line">
                        <TextField
                            label="Title"
                            value={post.title}
                            disabled={isFormDisabled}
                            helperText={postErrors.title === true ? "Data is required." : ""}
                            error={postErrors.title === true}
                            onChange={(event) => handleChange(event, "title")}
                        />
                    </div>
                    <div className="edit-post-form-line">
                        <TextField
                            label="Post"
                            value={post.body}
                            multiline
                            disabled={isFormDisabled}
                            helperText={postErrors.body === true ? "Data is required." : ""}
                            error={postErrors.body === true}
                            onChange={(event) => handleChange(event, "body")}
                        />
                    </div>
                </CardContent>
                <CardActions className="post-commands">
                    <Button
                        variant="outlined"
                        color="secondary"
                        disabled={isFormDisabled || postIndex == null}
                        onClick={handleDeletePost}
                    >
                        DELETE
                    </Button>
                    <Button
                        variant="outlined"
                        color="default"
                        disabled={isFormDisabled}
                        onClick={handleCancelPost}
                    >
                        CANCEL
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={isFormDisabled}
                        onClick={handleSavePost}
                    >
                        SAVE
                    </Button>
                </CardActions>
            </Card>
            <Card className="edit-post-card">
                <CardHeader
                    title="Comments" 
                    action={(
                        <IconButton
                            aria-label="add"
                            disabled={isFormDisabled || postIndex == null}
                            onClick={handleAddNewComment}
                        >
                            <Icon color={(isFormDisabled || postIndex == null) ? "disabled" : "primary"}>add_circle</Icon>
                        </IconButton>
                    )}
                />
                <CardContent>
                    {post.comments && post.comments.map((comment, index) => (
                        <Card key={`comment-${index}`} className="edit-post-card edit-post-comments">
                            <CardContent>
                                <div className="edit-post-form-line">
                                    <TextField
                                        label="Title"
                                        value={comment.name}
                                        disabled={isFormDisabled}
                                        helperText={postErrors.comments[index].name === true ? "Data is required." : ""}
                                        error={postErrors.comments[index].name === true}
                                        onChange={event => handleChange(event, "comments", index, "name")}
                                    />
                                </div>
                                <div className="edit-post-form-line">
                                    <TextField
                                        label="Comment"
                                        value={comment.body}
                                        multiline
                                        disabled={isFormDisabled}
                                        helperText={postErrors.comments[index].body === true ? "Data is required." : ""}
                                        error={postErrors.comments[index].body === true}
                                        onChange={event => handleChange(event, "comments", index, "body")}
                                    />
                                </div>
                            </CardContent>
                            <CardActions className="post-commands">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    disabled={isFormDisabled}
                                    onClick={() => handleDeleteComment(index)}
                                >
                                    DELETE
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="default"
                                    disabled={isFormDisabled}
                                    onClick={() => handleCancelComment(index)}
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    disabled={isFormDisabled}
                                    onClick={handleSaveComments}
                                >
                                    SAVE
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </Fragment>
    ) : (
        <Fragment>
            <h1>Error occurred while saving post data.</h1>
        </Fragment>
    ))) || null;
}

EditPost.propTypes = {
    match: PropTypes.object.isRequired,
};

export default EditPost;
