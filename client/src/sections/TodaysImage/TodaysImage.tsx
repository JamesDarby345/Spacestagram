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
import { Comments } from "../Comments";

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

interface Props {
  viewer: Viewer;
}

export const TodaysImage = ({ viewer }: Props) => {
  const userId = viewer.id ? (viewer.id as string) : "";
  const hoursAgo = 12;

  const [commentsPage, setCommentsPage] = useState(0);

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

  const handleAddNASAImage = async (dateToGet: string) => {
    await addNASAImage({ variables: { dateToGet } });
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
      page: commentsPage,
      filter: "LATEST_COMMENTS",
    },
  });

  if (!fetchedData && !fetchedDataLoading) {
    handleAddNASAImage(dateToDisplay);
  }

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
        <Comments
          viewer={viewer}
          fetchedData={fetchedData}
          setCommentsPage={setCommentsPage}
          refetch={refetch}
        />
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
