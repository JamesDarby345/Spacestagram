/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import "./../../index.css";
import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { DatePicker, Heading, MediaCard } from "@shopify/polaris";
import {
  addNASAImageData,
  addNASAImageVariables,
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

interface Props {
  title: string;
  subTitle: string;
}

export const TodaysImage = ({ title, subTitle }: Props) => {
  const [today] = useState(new Date().toISOString().slice(0, 10));

  const [
    addNASAImage,
    { loading: addNASAImageLoading, error: addNASAImageError },
  ] = useMutation<addNASAImageData, addNASAImageVariables>(
    ADDNASAIMAGE,
    {
      variables: { dateToGet: today },
    }
  );

  const handleAddNASAImage = async (dateToGet: string) => {
    console.log(
      "BEFORE await handle add nasa image" +
        addNASAImageLoading +
        addNASAImageError +
        dateToGet
    );
    await addNASAImage({ variables: { dateToGet } });
    console.log(
      "AFTER await handle add nasa image" +
        addNASAImageLoading +
        addNASAImageError
    );
    refetch();
  };

  useEffect(() => {
    handleAddNASAImage(today);
  }, [today]);

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
  console.log(todaysData);
  console.log(todaysData?.NASAImage);
  console.log(todaysData?.NASAImage.title);

  const imageTitle = todaysData?.NASAImage.title;
  const explanation = todaysData?.NASAImage.explanation || "";
  var url = "";
  if (todaysData?.NASAImage.media_type === "image") {
    url = todaysData?.NASAImage.url;
  }

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
      </MediaCard>
    </div>
  );
};
