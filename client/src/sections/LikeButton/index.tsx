import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Viewer } from "../../lib/types";
import {
  likeNASAImageData,
  likeNASAImageVariables,
  NASAImageData,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
} from "../NASAImages/types";

interface Props {
  viewer: Viewer;
  fetchedData: NASAImageData | undefined;
  fetchedDataLoading: boolean;
  refetch: () => void;
}

const LIKENASAIMAGE = gql`
  mutation likeNASAImage($id: ID!, $userId: String!) {
    like(id: $id, userId: $userId) {
      id
      likes
    }
  }
`;

const UNLIKENASAIMAGE = gql`
  mutation unlikeNASAImage($id: ID!, $userId: String!) {
    unlike(id: $id, userId: $userId) {
      id
      likes
    }
  }
`;

export const LikeButton = ({
  viewer,
  fetchedData,
  fetchedDataLoading,
  refetch,
}: Props) => {
  const userId = viewer.id ? (viewer.id as string) : "";
  const [liked, setLiked] = useState("init");

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

  const handleLikingNASAImage = async (id: string, userId: string) => {
    if (fetchedData?.NASAImageLikedByUser) {
      handleUnlikeNASAImage(id, userId);
    } else {
      handleLikeNASAImage(id, userId);
    }
  };

  const handleLikeNASAImage = async (id: string, userId: string) => {
    await likeNASAImage({ variables: { id, userId } });
    refetch();
  };

  const handleUnlikeNASAImage = async (id: string, userId: string) => {
    await unlikeNASAImage({ variables: { id, userId } });
    refetch();
  };

  useEffect(() => {
    if (fetchedDataLoading) {
      setLiked("Loading");
    } else {
      setLiked(fetchedData?.NASAImageLikedByUser ? "Unlike" : "Like");
    }
  }, [fetchedDataLoading, fetchedData]);

  const NASAImageId = fetchedData?.NASAImage.id || "";

  const likeButton = userId ? (
    <Button
      onClick={() => handleLikingNASAImage(NASAImageId, userId)}
      accessibilityLabel="like button"
    >
      {liked}
    </Button>
  ) : (
    <Button
      disabled={true}
      accessibilityLabel="like button is disabled until you login with google"
    >
      {liked}
    </Button>
  );
  return likeButton;
};
