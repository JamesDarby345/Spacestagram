import { gql, useMutation } from "@apollo/client";
import { Avatar, Button, Card, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { Viewer } from "../../lib/types";
import {
  NASAImageData,
  postCommentNASAImageData,
  postCommentNASAImageVariables,
} from "../NASAImages/types";

interface Props {
  viewer: Viewer;
  fetchedData: NASAImageData | undefined;
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

export const Comments = ({
  viewer,
  fetchedData,
  setCommentsPage,
  refetch,
}: Props) => {
  const userId = viewer.id ? (viewer.id as string) : "";
  const [commentValue, setCommentValue] = useState("");

  const [postCommentNASAImage] = useMutation<
    postCommentNASAImageData,
    postCommentNASAImageVariables
  >(POSTCOMMENTNASAIMAGE);

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
      {fetchedData?.NASAImageComments.result.map((comment) => (
        <div className="flex flex-row">
          <div className="grow">
            <Card key={comment.id}>
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
            <Button>Flag</Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="post_comment">{commentEntry}</div>
      {commentSpace}
    </div>
  );
};
