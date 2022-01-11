/* eslint-disable jsx-a11y/img-redundant-alt */
import { useCallback, useState } from "react";
import { DatePicker, Heading, MediaCard } from "@shopify/polaris";

const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "mVHFdj3idfIQM8TVfEycg58TSHvoAdTBzGGJfmia";

interface Props {
  title: string;
}

export const TodaysImage = ({ title }: Props) => {
  var titleText = "intial";
  const [today, selectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  async function fetchNASAData(date?: string) {
    var url: string = "";
    if (date) {
      url = baseUrl + apiKey + "&date=" + date;
    } else {
      url = baseUrl + apiKey;
    }
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    titleText = data.title;
    // document.getElementById("title")!.textContent = data.title;
    // if (data.media_type === "video") {
    // } else {
    //   (document.getElementById("NASAAPOD") as HTMLImageElement).src =
    //     data.hdurl;
    // }
  }

  fetchNASAData(today);

  function DatePickerExample() {
    const [{ month, year }, setDate] = useState({
      month: 0,
      year: 2021,
    });
    const [selectedDates, setSelectedDates] = useState({
      start: new Date("Tue Jan 10 2021 00:00:00 GMT-0500 (EST)"),
      end: new Date("Tue Jan 10 2021 00:00:00 GMT-0500 (EST)"),
    });

    const handleMonthChange = useCallback(
      (month, year) => setDate({ month, year }),
      []
    );

    return (
      <DatePicker
        month={month}
        year={year}
        onChange={setSelectedDates}
        onMonthChange={handleMonthChange}
        selected={selectedDates}
      />
    );
  }

  return (
    <div>
      <Heading element="h1">{title}</Heading>
      <MediaCard title={titleText} description={""}>
        <img
          src=""
          id="NASAAPOD"
          alt="NASA astronomy picture of the day"
        />
      </MediaCard>
      {/* {DatePickerExample()} */}
    </div>
  );
};
