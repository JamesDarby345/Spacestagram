/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import "./../../index.css";
import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button, DatePicker, Heading, MediaCard } from "@shopify/polaris";
import {
  addNASAImageData,
  addNASAImageVariables,
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
  NASAImageData,
} from "../NASAImages/types";
import { buildExecutionContext } from "graphql/execution/execute";

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
  const [liked, setLiked] = useState("Like");
  //Because I dont want to request an image that NASA hasnt
  //added to the API yet, this code sets the latest date to get to
  //be the date that is {hoursAgo} hours ago so the first image doesnt
  //end up errored out as there is no data yet.
  const hoursAgo = 12;
  var today = new Date(new Date().getTime() - hoursAgo * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

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
    variables: { dateToGet: today },
  });

  const handeLikingNASAImage = async (id: string) => {
    if (liked === "Like") {
      handeLikeNASAImage(id);
      setLiked("Unlike");
    } else {
      handleUnlikeNASAImage(id);
      setLiked("Like");
    }
  };

  useEffect(() => {
    console.log(liked);
  }, [liked]);

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

  useEffect(() => {
    handleAddNASAImage(today);
  }, []);

  const { data: todaysData, refetch } = useQuery<NASAImageData>(NASAIMAGE, {
    variables: { date: today },
  });

  if (!todaysData) {
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

  return (
    <div className="todays_image_wrapper">
      <h1 className="main_title">{title}</h1>
      <h5 className="sub_title">{subTitle} </h5>
      <MediaCard title={imageTitle} description={explanation} portrait={true}>
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
          <Button onClick={() => handeLikingNASAImage(NASAImageId)}>
            {liked}
          </Button>
        </div>
      </MediaCard>
    </div>
  );
};
