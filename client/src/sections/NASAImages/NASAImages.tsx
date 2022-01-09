import { useQuery, useMutation } from "../../lib/api";
import {
  NASAImagesData,
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
} from "./types";

const NASAIMAGES = `
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

const LIKENASAIMAGE = `
  mutation likeNASAImage($id: ID!) {
    like(id: $id) {
      id
      likes
    }
  }
`;

const UNLIKENASAIMAGE = `
  mutation unlikeNASAImage($id: ID!) {
    unlike(id: $id) {
      id
      likes
    }
  }
`;

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
    await likeNASAImage({ id });
    refetch();
  };

  const handleUnlikeNASAImage = async (id: string) => {
    await unlikeNASAImage({ id });
    refetch();
  };

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
      <h2>{title}</h2>
      {NASAImagesList}
      {likeNASAImageErrorMessage}
      {likeNASAImageLoadingMessage}
      {unlikeNASAImageErrorMessage}
      {unlikeNASAImageLoadingMessage}
    </div>
  );
};
