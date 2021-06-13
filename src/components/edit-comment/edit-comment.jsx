import React, {
    useEffect,
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import PropTypes from "prop-types";
import toaster from "toasted-notes";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import ApiCallsHelper from "../../helpers/apiCallsHelper";
import useFormHelper from "../../helpers/formHelper";
import FormValidationFunctions from "../../helpers/formValidationFunctions";
import ActionButton from "../../primitives/action-button/actionButton.jsx";
import TextFieldFormWrapper from "../../primitives/textFieldFormWrapper/textFieldFormWrapper.jsx";
import Toast from "../toast/toast.jsx";
import { useAppState } from "../../state/useAppState";
import "./edit-comment.css";

const EditComment = forwardRef(({ postId, commentIndex, commentData, onDeleteComment }, ref) => {
    const formHelper = useFormHelper();
    const [comment, setComment] = useState(commentData);
    const [
        {
            apiCallStatus,
            apiAddComment,
            apiPatchComment,
            apiDeleteComment,
        },
        {
            setApiCallStatus,
            setConfirmDialogModalData,
            callApiAddComment,
            callApiPatchComment,
            callApiDeleteComment,
        },
    ] = useAppState();

    const setFormData = (formData) => {
        formHelper.onChange("name", formData.name || "", formData.name || "");
        formHelper.onChange("body", formData.body || "", formData.body || "");
    };

    const resetFormData = () => {
        setFormData(comment);
    };

    const handleDeleteComment = () => {
        setConfirmDialogModalData({
            visible: true,
            title: "Confirm comment delete.",
            description: `Are you really want to delete ${comment.name} comment?`,
            confirmActionName: `DeleteComment${comment.id || commentIndex}`,
            confirmAction: () => {
                if (comment.id) {
                    setApiCallStatus(ApiCallsHelper.addApiCallToStatus(
                        { callerId: `DeleteComment${comment.id || commentIndex}`, isComponent: false }
                    ));
                    callApiDeleteComment(postId, comment.id);
                } else {
                    onDeleteComment();
                }
            },
        });
    };

    const validateCommentData = () => formHelper.validateFormData();

    const handleSaveComment = () => {
        if (!formHelper.hasChanges()) {
            return;
        }

        if (!validateCommentData()) {
            toaster.notify(
                <Toast message="Please fix errors." type="error" />,
                { position: "top-right", duration: 2000 }
            );
            return;
        }

        const newCommentData = JSON.parse(JSON.stringify(formHelper.getFormData()));
        setApiCallStatus(ApiCallsHelper.addApiCallToStatus(
            { callerId: `SaveComment${comment.id || commentIndex}`, isComponent: false }
        ));

        if (!comment.id) {
            newCommentData.timestamp = {
                ".sv":"timestamp",
            };
            callApiAddComment(postId, newCommentData);
        } else {
            callApiPatchComment(postId, comment.id, newCommentData);
        }
    };

    useImperativeHandle(ref, () => ({
        validateComment: validateCommentData,
        saveComment: handleSaveComment,
    }));

    useEffect(() => {
        if (
            apiDeleteComment &&
            apiCallStatus.ongoing &&
            apiCallStatus.calls.some((call) => call.callerId === `DeleteComment${comment.id || commentIndex}`)
        ) {
            setApiCallStatus(ApiCallsHelper.removeApiCallFromStatus(
                `DeleteComment${comment.id || commentIndex}`
            ));
            onDeleteComment(apiDeleteComment);
        }
    }, [apiDeleteComment]);

    useEffect(() => {
        if (
            (apiAddComment || apiPatchComment) &&
            apiCallStatus.ongoing &&
            apiCallStatus.calls.some((call) => call.callerId === `SaveComment${comment.id || commentIndex}`)
        ) {
            const newCommentData = { ...comment, ...formHelper.getFormData() };
            if (apiAddComment?.data?.name) {
                newCommentData.id = apiAddComment.data.name;
            }
            setFormData(newCommentData);
            setComment(newCommentData);
            setApiCallStatus(ApiCallsHelper.removeApiCallFromStatus(
                `SaveComment${comment.id || commentIndex}`
            ));
        }
    }, [apiAddComment, apiPatchComment]);

    return (postId &&
        <Card className="edit-post-card edit-post-comments">
            <CardContent>
                <div className="edit-post-form-line">
                    <TextFieldFormWrapper
                        label="Title"
                        initialData={comment}
                        disabled={apiCallStatus.ongoing}
                        elementName="name"
                        validatorFunctions={[FormValidationFunctions.getRequiredValidator()]}
                        formHelper={formHelper}
                    />
                </div>
                <div className="edit-post-form-line">
                    <TextFieldFormWrapper
                        label="Comment"
                        initialData={comment}
                        multiline
                        disabled={apiCallStatus.ongoing}
                        elementName="body"
                        validatorFunctions={[FormValidationFunctions.getRequiredValidator()]}
                        formHelper={formHelper}
                    />
                </div>
            </CardContent>
            <CardActions className="post-commands">
                <ActionButton
                    actionName={`DeleteComment${comment.id || commentIndex}`}
                    text="DELETE"
                    color="secondary"
                    onClick={handleDeleteComment}
                />
                <ActionButton
                    text="CANCEL"
                    color="default"
                    disabled={!formHelper.hasChanges()}
                    onClick={resetFormData}
                />
                <ActionButton
                    actionName={`SaveComment${comment.id || commentIndex}`}
                    text="SAVE"
                    disabled={!formHelper.hasChanges()}
                    onClick={handleSaveComment}
                />
            </CardActions>
        </Card>
    );
});

EditComment.propTypes = {
    postId: PropTypes.string.isRequired,
    commentIndex: PropTypes.number.isRequired,
    commentData: PropTypes.object.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
};

export default EditComment;
