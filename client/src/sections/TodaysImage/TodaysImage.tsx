/* eslint-disable jsx-a11y/img-redundant-alt */
import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { DatePicker, Heading, MediaCard } from "@shopify/polaris";
import {
  addNASAImageData,
  addNASAImageVariables,
  NASAImage,
  NASAImageData,
} from "../NASAImages/types";

const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "mVHFdj3idfIQM8TVfEycg58TSHvoAdTBzGGJfmia";

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
}

export const TodaysImage = ({ title }: Props) => {
  const [today, selectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const test = "2001-08-16";

  const [
    addNASAImage,
    { loading: addNASAImageLoading, error: addNASAImageError },
  ] = useMutation<addNASAImageData, addNASAImageVariables>(
    ADDNASAIMAGE,
    {
      variables: { dateToGet: test },
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    //refetch();
  };

  useEffect(() => {
    handleAddNASAImage(test);
    console.log(
      "AFTER handle in useEffect" +
        addNASAImageLoading +
        addNASAImageError
    );
  }, [addNASAImageError, addNASAImageLoading, handleAddNASAImage]);

  const { data: todaysData, refetch } = useQuery<NASAImageData>(
    NASAIMAGE,
    {
      variables: { date: test },
    }
  );

  if (!todaysData) {
    console.log("NO DATA");
    handleAddNASAImage(test);
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
    <div>
      <Heading element="h1">{title}</Heading>
      <MediaCard title={imageTitle} description={explanation}>
        <img
          src={url}
          id="NASAAPOD"
          alt="NASA astronomy picture of the day"
        />
        <button onClick={() => handleAddNASAImage(test)}>
          add NASA Image
        </button>
      </MediaCard>
      {/* {DatePickerExample()} */}
    </div>
  );
};
