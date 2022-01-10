import { useQuery, useMutation, gql } from "@apollo/client";
import { ftruncateSync } from "fs";
import { visitFunctionBody } from "typescript";
import {
  NASAImagesData,
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
} from "./types";

const NASAIMAGES = gql`
  query NASAImages {
    NASAImages {
      id
      likes
      copyright
      date
      explanation
      hdurl
      title
      url
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

const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "mVHFdj3idfIQM8TVfEycg58TSHvoAdTBzGGJfmia";

interface Props {
  title: string;
}

export const NASAImages = ({ title }: Props) => {
  const { data, loading, error, refetch } =
    useQuery<NASAImagesData>(NASAIMAGES);

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

  const NASAImages = data ? data.NASAImages : null;

  const handeLikeNASAImage = async (id: string) => {
    await likeNASAImage({ variables: { id } });
    refetch();
  };

  const handleUnlikeNASAImage = async (id: string) => {
    await unlikeNASAImage({ variables: { id } });
    refetch();
  };

  // function a(): Promise<string> {
  //   let response = fetch(baseUrl + apiKey)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log("before json");
  //       console.log(json);
  //       displaydata(json);
  //       return json;
  //     });
  //   console.log("before response");
  //   console.log(response);
  //   return response;
  // }

  // console.log("before b");
  // const b = a();
  // console.log(b + " this is b");
  // const z = a();
  // console.log(z);
  // console.log(z);

  async function fetchNASAData() {
    const response = await fetch(baseUrl + apiKey);
    console.log(response);
    const data = await response.json();
    console.log(data);
    document.getElementById("title")!.innerText = data.title;
  }

  var zxc = "";

  //fetchNASAData().then((data) => (zxc = data));
  console.log("before zxc");
  console.log(zxc);

  // async function f(): Promise<string> {
  //   const value = await d();
  //   return value;
  // }

  console.log("before v");
  const v = fetchNASAData();
  console.log(v);
  // const valueFromV = v.then((value) => {
  //   return value;
  // });
  // console.log(valueFromV);
  const ti = (
    <p>
      {/* {v.then((value) => {
        value.title;
      })} */}
      {zxc}
    </p>
  );

  const NASAImagesList = NASAImages ? (
    <ul>
      {NASAImages.map((NASAImage) => {
        return (
          <li key={NASAImage.id}>
            {NASAImage.title}
            {NASAImage.likes}
            <button onClick={() => handeLikeNASAImage(NASAImage.id)}>
              Like
            </button>
            <button
              onClick={() => handleUnlikeNASAImage(NASAImage.id)}
            >
              Unlike
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error, please try again later</h2>;
  }

  const likeNASAImageErrorMessage = likeNASAImageError ? (
    <h4>Error liking NASA Image</h4>
  ) : null;

  const likeNASAImageLoadingMessage = likeNASAImageLoading ? (
    <h4>like in progress...</h4>
  ) : null;

  const unlikeNASAImageErrorMessage = unlikeNASAImageError ? (
    <h4>Error unliking NASA Image</h4>
  ) : null;

  const unlikeNASAImageLoadingMessage = unlikeNASAImageLoading ? (
    <h4>unliking in progress...</h4>
  ) : null;

  return (
    <div>
      <h2 id="title">{title}</h2>
      {NASAImagesList}
      {ti}
      {likeNASAImageErrorMessage}
      {likeNASAImageLoadingMessage}
      {unlikeNASAImageErrorMessage}
      {unlikeNASAImageLoadingMessage}
    </div>
  );
};
