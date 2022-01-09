import { server, useQuery } from "../../lib/api";
import {
  NASAImagesData,
  likeNASAImageData,
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
  NASAImage,
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

  const NASAImages = data ? data.NASAImages : null;

  const likeNASAImage = async (id: string) => {
    await server.fetch<likeNASAImageData, likeNASAImageVariables>({
      query: LIKENASAIMAGE,
      variables: {
        id,
      },
    });

    refetch();
  };

  const unlikeNASAImage = async (id: string) => {
    await server.fetch<unlikeNASAImageData, unlikeNASAImageVariables>(
      {
        query: UNLIKENASAIMAGE,
        variables: {
          id,
        },
      }
    );

    refetch();
  };

  const NASAImagesList = NASAImages ? (
    <ul>
      {NASAImages.map((NASAImage) => {
        return (
          <li key={NASAImage.id}>
            {NASAImage.title}
            {NASAImage.likes}
            <button onClick={() => likeNASAImage(NASAImage.id)}>
              Like
            </button>
            <button onClick={() => unlikeNASAImage(NASAImage.id)}>
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

  return (
    <div>
      <h2>{title}</h2>
      {NASAImagesList}
    </div>
  );
};
