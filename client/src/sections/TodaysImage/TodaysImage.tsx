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
  }, [selectedDate]);

  console.log(new Date(dateToDisplay));
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
    const res = await addNASAImage({ variables: { dateToGet } });
    console.log(res);
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

  const NASAImageId = fetchedData?.NASAImage.id || "";
  const copyright = fetchedData?.NASAImage.copyright || "";
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

  const NASAImageToShow = (
    <MediaCard title={imageTitle} description={explanation} portrait={true}>
      {NASAImageHTMLTag}
      <div className="like_button_wrapper">
        <span className="like_count">{likeCount}</span>
        <Button onClick={() => handeLikingNASAImage(NASAImageId)}>
          {liked}
        </Button>
        <span className="copyright">Copyright: {copyright}</span>
      </div>
    </MediaCard>
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
    <div className="main_wrapper">
      <h1 className="main_title">{title}</h1>
      <h5 className="sub_title">{subTitle} </h5>
      {datePicker}
      {NASAImageToShow}
    </div>
  );
};
