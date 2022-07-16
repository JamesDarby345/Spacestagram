import { gql, useMutation } from "@apollo/client";
import { Avatar, Button, Card, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { Viewer } from "../../lib/types";
import {
  flagCommentVariables,
  NASAImageData,
  postCommentNASAImageData,
  postCommentNASAImageVariables,
} from "../NASAImages/types";

interface Props {
  viewer: Viewer;
  fetchedData: NASAImageData | undefined;
  commentsPage: number;
  setCommentsPage: (commentsPage: number) => void;
  refetch: () => void;
}

const POSTCOMMENTNASAIMAGE = gql`
  mutation postCommentNASAImage(
    $id: ID!
    $userId: String!
    $commentText: String!
  ) {
    postCommentNASAImage(id: $id, userId: $userId, commentText: $commentText) {
      id
      comments
    }
  }
`;

const FLAGCOMMENT = gql`
  mutation flagComment($commentId: ID!, $userId: String!) {
    flagComment(commentId: $commentId, userId: $userId)
  }
`;

export const Comments = ({
  viewer,
  fetchedData,
  commentsPage,
  setCommentsPage,
  refetch,
}: Props) => {
  const userId = viewer.id ? (viewer.id as string) : "";
  const [commentValue, setCommentValue] = useState("");

  const [postCommentNASAImage] = useMutation<
    postCommentNASAImageData,
    postCommentNASAImageVariables
  >(POSTCOMMENTNASAIMAGE);

  const [flagComment] = useMutation<boolean, flagCommentVariables>(FLAGCOMMENT);

  const handlePostingComment = async (
    id: string,
    userId: string,
    commentText: string
  ) => {
    await postCommentNASAImage({ variables: { id, userId, commentText } });
    setCommentValue("");
    refetch();
  };

  const handleCommentEntry = useCallback(
    (newValue) => setCommentValue(newValue),
    []
  );

  const handleLoadNextComments = async (commentsPage: number) =>
    setCommentsPage(commentsPage + 1);

  const handleLoadPrevComments = async (commentsPage: number) => {
    if (commentsPage > 0) {
      setCommentsPage(commentsPage - 1);
    }
  };

  const handleFlag = async (commentId: string, userId: string) => {
    await flagComment({ variables: { commentId, userId } });
    refetch();
  };

  const NASAImageId = fetchedData?.NASAImage.id || "";

  const commentEntry = (
    <div className="flex flex-row">
      <div className="grow">
        <TextField
          label="Comment Entry"
          labelHidden={true}
          value={commentValue}
          placeholder="Add a comment"
          onChange={handleCommentEntry}
          multiline={1}
          autoComplete="off"
          spellCheck={true}
        />
      </div>
      <div className="shrink-0">
        <Button
          disabled={commentValue.length <= 0}
          onClick={() =>
            handlePostingComment(NASAImageId, userId, commentValue)
          }
        >
          Post
        </Button>
      </div>
    </div>
  );

  var commentSpace = (
    <div>
      {fetchedData?.NASAImageComments.result.map((comment, i) => (
        <div className="flex flex-row">
          <div className="grow">
            <Card key={i}>
              <div className="ml-4 pt-1 pb-1 mb-[15px] flex flex-row">
                <div className="scale-75">
                  <Avatar customer source={comment.userAvatar} />
                  <p>{comment.userName}</p>
                </div>
                <div className="place-self-center ml-4 grow pt-4 pb-4">
                  {comment.text}
                </div>
              </div>
            </Card>
          </div>
          <div className="justify-self-end shrink-0">
            <Button>Like</Button>
            <Button onClick={() => handleFlag(comment.id.toString(), userId)}>
              Flag
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  if (fetchedData) {
    var loadPrevComments =
      commentsPage > 0 ? (
        <Button onClick={() => handleLoadPrevComments(commentsPage)}>
          Previous Comments
        </Button>
      ) : null;

    var loadNextComments =
      (commentsPage + 1) * 10 < fetchedData?.NASAImageComments.total ? (
        <Button onClick={() => handleLoadNextComments(commentsPage)}>
          Next Comments
        </Button>
      ) : null;

    return (
      <div>
        <div className="post_comment">{commentEntry}</div>
        {commentSpace}
        {loadPrevComments}
        {loadNextComments}
      </div>
    );
  }

  return (
    <div>
      <div className="post_comment">{commentEntry}</div>
      {commentSpace}
    </div>
  );
};
