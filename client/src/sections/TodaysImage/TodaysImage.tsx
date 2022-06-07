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
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
  NASAImageData,
  postCommentNASAImageData,
  postCommentNASAImageVariables,
} from "../NASAImages/types";
import { NASAImageSkeleton } from "./NASAImageSkeleton";

const ADDNASAIMAGE = gql`
  mutation addNASAImage($dateToGet: String) {
    addNASAImage(dateToGet: $dateToGet)
  }
`;

const NASAIMAGE = gql`
  query NASAImage($date: String) {
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
  }
`;

const LIKENASAIMAGE = gql`
  mutation likeNASAImage($id: ID!) {
    like(id: $id) {
      id
      likes
    }
  }
`;

const UNLIKENASAIMAGE = gql`
  mutation unlikeNASAImage($id: ID!) {
    unlike(id: $id) {
      id
      likes
    }
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

export const TodaysImage = () => {
  const hoursAgo = 12;
  const [liked, setLiked] = useState("Like");

  //default is 12 ({hoursAgo}) hours past current time to prevent
  //requesting data NASA hasnt added to the API yet
  const [selectedDate, setSelectedDate] = useState({
    start: new Date(new Date().getTime() - hoursAgo * 60 * 60 * 1000),
    end: new Date(new Date().getTime() - hoursAgo * 60 * 60 * 1000),
  });

  var dateToDisplay = selectedDate.start.toISOString().slice(0, 10);

  useEffect(() => {
    dateToDisplay = selectedDate.start.toISOString().slice(0, 10);
    setLiked("Like");
  }, [selectedDate]);

  const [{ month, year }, setDate] = useState({
    month: (dateToDisplay.slice(5, 7) as unknown as number) - 1,
    year: dateToDisplay.slice(0, 4) as unknown as number,
  });

  const [open, setOpen] = useState(false);

  const [
    likeNASAImage,
    { loading: likeNASAImageLoading, error: likeNASAImageError },
  ] = useMutation<likeNASAImageData, likeNASAImageVariables>(LIKENASAIMAGE);

  const [
    unlikeNASAImage,
    { loading: unlikeNASAImageLoading, error: unlikeNASAImageError },
  ] = useMutation<unlikeNASAImageData, unlikeNASAImageVariables>(
    UNLIKENASAIMAGE
  );

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

  const handeLikingNASAImage = async (id: string) => {
    if (liked === "Like") {
      handeLikeNASAImage(id);
      setLiked("Unlike");
    } else {
      handleUnlikeNASAImage(id);
      setLiked("Like");
    }
  };

  const handeLikeNASAImage = async (id: string) => {
    await likeNASAImage({ variables: { id } });
    refetch();
  };

  const handleUnlikeNASAImage = async (id: string) => {
    await unlikeNASAImage({ variables: { id } });
    refetch();
  };

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

  const { data: fetchedData, refetch } = useQuery<NASAImageData>(NASAIMAGE, {
    variables: { date: dateToDisplay },
  });

  if (!fetchedData) {
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

  var NASAImageHTMLTag = (
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

  if (fetchedData?.NASAImage.media_type === "video") {
    NASAImageHTMLTag = (
      <div className="video_link">
        <Link url={url}>Link to today's video.</Link>
      </div>
    );
  }

  const NASAImageToShow = !addNASAImageLoading ? (
    <div>
      <MediaCard title={imageTitle} description={explanation} portrait={true}>
        {NASAImageHTMLTag}
        <div className="like_button_wrapper">
          <span className="like_count">{likeCount}</span>
          <Button onClick={() => handeLikingNASAImage(NASAImageId)}>
            {liked}
          </Button>
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
