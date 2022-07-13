/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import "./../../index.css";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  Link,
  MediaCard,
  TextField,
} from "@shopify/polaris";
import {
  addNASAImageData,
  addNASAImageVariables,
  NASAImageData,
  postCommentNASAImageData,
  postCommentNASAImageVariables,
  NASAImageVariables,
} from "../NASAImages/types";
import { NASAImageSkeleton } from "./NASAImageSkeleton";
import { Viewer } from "../../lib/types";
import { LikeButton } from "../LikeButton";
import { DateSelector } from "../DateSelector";

const ADDNASAIMAGE = gql`
  mutation addNASAImage($dateToGet: String) {
    addNASAImage(dateToGet: $dateToGet)
  }
`;

const NASAIMAGE = gql`
  query NASAImage(
    $date: String!
    $userId: String!
    $limit: Int!
    $page: Int!
    $filter: String!
  ) {
    NASAImage(date: $date) {
      id
      likes
      copyright
      date
      explanation
      hdurl
      title
      url
      media_type
      comments
    }
    NASAImageLikedByUser(date: $date, userId: $userId)
    NASAImageComments(
      limit: $limit
      page: $page
      date: $date
      filter: $filter
    ) {
      total
      result {
        text
      }
    }
  }
`;

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

interface Props {
  viewer: Viewer;
}

export const TodaysImage = ({ viewer }: Props) => {
  const userId = viewer.id ? (viewer.id as string) : "";
  const hoursAgo = 12;

  //default is 12 ({hoursAgo}) hours past current time to prevent
  //requesting data NASA hasnt added to the API yet
  const [selectedDate, setSelectedDate] = useState({
    start: new Date(new Date().getTime() - hoursAgo * 60 * 60 * 1000),
    end: new Date(new Date().getTime() - hoursAgo * 60 * 60 * 1000),
  });

  var dateToDisplay = selectedDate.start.toISOString().slice(0, 10);

  useEffect(() => {
    dateToDisplay = selectedDate.start.toISOString().slice(0, 10);
  }, [selectedDate]);

  const [
    addNASAImage,
    { loading: addNASAImageLoading, error: addNASAImageError },
  ] = useMutation<addNASAImageData, addNASAImageVariables>(ADDNASAIMAGE, {
    variables: { dateToGet: dateToDisplay },
  });

  const [postCommentNASAImage] = useMutation<
    postCommentNASAImageData,
    postCommentNASAImageVariables
  >(POSTCOMMENTNASAIMAGE);

  const handleAddNASAImage = async (dateToGet: string) => {
    await addNASAImage({ variables: { dateToGet } });
    refetch();
  };

  const handlePostingComment = async (
    id: string,
    userId: string,
    commentText: string
  ) => {
    await postCommentNASAImage({ variables: { id, userId, commentText } });
    setCommentValue("");
    refetch();
  };

  useEffect(() => {
    handleAddNASAImage(dateToDisplay);
  }, []);

  const {
    loading: fetchedDataLoading,
    data: fetchedData,
    refetch,
  } = useQuery<NASAImageData, NASAImageVariables>(NASAIMAGE, {
    variables: {
      date: dateToDisplay,
      userId: userId,
      limit: 10,
      page: 0,
      filter: "LATEST_COMMENTS",
    },
  });

  if (!fetchedData && !fetchedDataLoading) {
    handleAddNASAImage(dateToDisplay);
  }

  const [commentValue, setCommentValue] = useState("");

  const handleCommentEntry = useCallback(
    (newValue) => setCommentValue(newValue),
    []
  );

  const commentIds = fetchedData?.NASAImage.comments;
  const commentEntry = (
    <div>
      <div className="post_comment_text">
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
      <div className="post_comment_button">
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

  const NASAImageId = fetchedData?.NASAImage.id || "";
  var copyright = fetchedData?.NASAImage.copyright || "";
  if (copyright && copyright !== "") {
    copyright = "Copyright: " + copyright;
  }
  const likeCount = fetchedData?.NASAImage.likes || "";
  const imageTitle =
    fetchedData?.NASAImage.title + " - " + fetchedData?.NASAImage.date;
  const explanation = fetchedData?.NASAImage.explanation || "";
  var url = fetchedData?.NASAImage.url;

  const NASAImageHTMLTag =
    fetchedData?.NASAImage.media_type === "video" ? (
      <div className="video_link">
        <Link url={url}>Link to today's video.</Link>
      </div>
    ) : (
      <img
        src={url}
        alt="NASA astronomy picture of the day"
        width="100%"
        height="100%"
        className="main_image"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    );

  const NASAImageToShow =
    !addNASAImageLoading && !fetchedDataLoading ? (
      <div>
        <MediaCard title={imageTitle} description={explanation} portrait={true}>
          {NASAImageHTMLTag}
          <div className="like_button_wrapper">
            <span className="like_count">{likeCount}</span>
            <LikeButton
              viewer={viewer}
              fetchedData={fetchedData}
              fetchedDataLoading={fetchedDataLoading}
              refetch={refetch}
            />
            <span className="copyright">{copyright}</span>
          </div>
        </MediaCard>
        <div className="post_comment">{commentEntry}</div>

        {commentSpace}
      </div>
    ) : (
      <NASAImageSkeleton />
    );

  return (
    <div>
      <DateSelector
        dateToDisplay={dateToDisplay}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {NASAImageToShow}
    </div>
  );
};
