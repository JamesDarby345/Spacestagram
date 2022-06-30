/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import "./../../index.css";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Button,
  Card,
  Collapsible,
  DatePicker,
  Link,
  MediaCard,
  Stack,
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

const ADDNASAIMAGE = gql`
  mutation addNASAImage($dateToGet: String) {
    addNASAImage(dateToGet: $dateToGet)
  }
`;

const NASAIMAGE = gql`
  query NASAImage($date: String!, $userId: String!) {
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
  }
`;

const POSTCOMMENTNASAIMAGE = gql`
  mutation postCommentNASAImage($id: ID!, $comment: String!) {
    postComment(id: $id, comment: $comment) {
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

  const [{ month, year }, setDate] = useState({
    month: (dateToDisplay.slice(5, 7) as unknown as number) - 1,
    year: dateToDisplay.slice(0, 4) as unknown as number,
  });

  const [open, setOpen] = useState(false);

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

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const handleAddNASAImage = async (dateToGet: string) => {
    await addNASAImage({ variables: { dateToGet } });
    refetch();
  };

  const handlePostingComment = async (id: string, comment: string) => {
    await postCommentNASAImage({ variables: { id, comment } });
    setCommentValue("");
    refetch();
  };

  useEffect(() => {
    handleAddNASAImage(dateToDisplay);
  }, []);

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  const {
    loading: fetchedDataLoading,
    data: fetchedData,
    refetch,
  } = useQuery<NASAImageData, NASAImageVariables>(NASAIMAGE, {
    variables: { date: dateToDisplay, userId: userId },
  });

  if (!fetchedData && !fetchedDataLoading) {
    handleAddNASAImage(dateToDisplay);
  }

  const [commentValue, setCommentValue] = useState("");

  const handleCommentEntry = useCallback(
    (newValue) => setCommentValue(newValue),
    []
  );

  const comments = fetchedData?.NASAImage.comments;
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
          onClick={() => handlePostingComment(NASAImageId, commentValue)}
        >
          Post
        </Button>
      </div>
    </div>
  );

  var commentSpace = (
    <div>
      {comments
        ?.slice(0)
        .reverse()
        .map((comment) => (
          <Card key={comment}>
            <div className="comment">{comment}</div>
          </Card>
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

  const datePicker = (
    <div className="date_picker">
      <Stack vertical>
        <Button
          onClick={handleToggle}
          ariaExpanded={open}
          ariaControls="basic-collapsible"
        >
          Pick Date
        </Button>
        <Collapsible
          id={"basic-collapsible"}
          open={open}
          transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        >
          <DatePicker
            month={month}
            year={year}
            onChange={setSelectedDate}
            onMonthChange={handleMonthChange}
            selected={selectedDate}
            disableDatesBefore={new Date("1995-06-16")}
            disableDatesAfter={new Date()}
          />
        </Collapsible>
      </Stack>
    </div>
  );

  return (
    <div>
      {datePicker}
      {NASAImageToShow}
    </div>
  );
};
