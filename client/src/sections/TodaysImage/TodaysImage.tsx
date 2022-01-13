/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import "./../../index.css";
import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Button,
  DatePicker,
  Heading,
  MediaCard,
} from "@shopify/polaris";
import {
  addNASAImageData,
  addNASAImageVariables,
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
  NASAImageData,
} from "../NASAImages/types";

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

interface Props {
  title: string;
  subTitle: string;
}

export const TodaysImage = ({ title, subTitle }: Props) => {
  const [today] = useState(new Date().toISOString().slice(0, 10));
  var liked = true;

  const [
    likeNASAImage,
    { loading: likeNASAImageLoading, error: likeNASAImageError },
  ] = useMutation<likeNASAImageData, likeNASAImageVariables>(
    LIKENASAIMAGE
  );

  const [
    unlikeNASAImage,
    { loading: unlikeNASAImageLoading, error: unlikeNASAImageError },
  ] = useMutation<unlikeNASAImageData, unlikeNASAImageVariables>(
    UNLIKENASAIMAGE
  );

  const [
    addNASAImage,
    { loading: addNASAImageLoading, error: addNASAImageError },
  ] = useMutation<addNASAImageData, addNASAImageVariables>(
    ADDNASAIMAGE,
    {
      variables: { dateToGet: today },
    }
  );

  const handeLikeNASAImage = async (id: string) => {
    await likeNASAImage({ variables: { id } });
    liked = true;
    refetch();
  };

  const handleUnlikeNASAImage = async (id: string) => {
    await unlikeNASAImage({ variables: { id } });
    liked = false;
    refetch();
  };

  const handleAddNASAImage = async (dateToGet: string) => {
    await addNASAImage({ variables: { dateToGet } });
    refetch();
  };

  useEffect(() => {
    handleAddNASAImage(today);
  }, []);

  const { data: todaysData, refetch } = useQuery<NASAImageData>(
    NASAIMAGE,
    {
      variables: { date: today },
    }
  );

  if (!todaysData) {
    console.log("NO DATA");
    handleAddNASAImage(today);
  }

  const NASAImageId = todaysData?.NASAImage.id || "";
  const likeCount = todaysData?.NASAImage.likes || "";
  const imageTitle =
    todaysData?.NASAImage.title + " - " + todaysData?.NASAImage.date;
  const explanation = todaysData?.NASAImage.explanation || "";
  var url = "";
  if (todaysData?.NASAImage.media_type === "image") {
    url = todaysData?.NASAImage.url;
  }

  // if (loading) {
  //   return <h2>Loading...</h2>;
  // }

  // if (error) {
  //   return <h2>Error, please try again later</h2>;
  // }

  // const likeNASAImageErrorMessage = likeNASAImageError ? (
  //   <h4>Error liking NASA Image</h4>
  // ) : null;

  // const likeNASAImageLoadingMessage = likeNASAImageLoading ? (
  //   <h4>like in progress...</h4>
  // ) : null;

  // const unlikeNASAImageErrorMessage = unlikeNASAImageError ? (
  //   <h4>Error unliking NASA Image</h4>
  // ) : null;

  // const unlikeNASAImageLoadingMessage = unlikeNASAImageLoading ? (
  //   <h4>unliking in progress...</h4>
  // ) : null;

  const likeButton = liked ? (
    <Button onClick={() => handleUnlikeNASAImage(NASAImageId)}>
      Unlike
    </Button>
  ) : (
    <Button onClick={() => handeLikeNASAImage(NASAImageId)}>
      Like
    </Button>
  );

  return (
    <div className="todays_image_wrapper">
      <h1 className="main_title">{title}</h1>
      <h5 className="sub_title">{subTitle} </h5>
      <MediaCard
        title={imageTitle}
        description={explanation}
        portrait={true}
      >
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
        <div className="like_button_wrapper">
          <span className="like_count">{likeCount}</span>
          {likeButton}
        </div>
      </MediaCard>
    </div>
  );
};
