import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@shopify/polaris";
import { useState } from "react";
import { Viewer } from "../../lib/types";
import {
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
} from "../NASAImages/types";

interface Props {
  viewer: Viewer;
  NASAImageId: string;
}
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

export const LikeButton = ({ viewer, NASAImageId }: Props) => {
  const userId = viewer.id;
  const [liked, setLiked] = useState("Like");

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

  const handeLikingNASAImage = async (id: string, userId: string) => {
    if (liked === "Like") {
      handeLikeNASAImage(id, userId);
      setLiked("Unlike");
    } else {
      handleUnlikeNASAImage(id, userId);
      setLiked("Like");
    }
  };

  const handeLikeNASAImage = async (id: string, userId: string) => {
    await likeNASAImage({ variables: { id, userId } });
    //refetch();
  };

  const handleUnlikeNASAImage = async (id: string, userId: string) => {
    await unlikeNASAImage({ variables: { id, userId } });
    //refetch();
  };

  const likeButton = userId ? (
    <Button
      onClick={() => handeLikingNASAImage(NASAImageId, userId)}
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
