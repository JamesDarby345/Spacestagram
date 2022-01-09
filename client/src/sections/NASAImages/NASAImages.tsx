import { useState, useEffect } from "react";
import { server } from "../../lib/api";
import { 
  NASAImagesData, 
  likeNASAImageData, 
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables,
  NASAImage
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
  const [NASAImages, setNASAImages] = useState<
    NASAImage[] | null
  >(null);

  useEffect(() => {
    fetchNASAImages();
  }, []);

  const fetchNASAImages = async () =>{
    const { data } = 
      await server.fetch<NASAImagesData>({ query: NASAIMAGES });
    setNASAImages(data.NASAImages);
  }

  const likeNASAImage = async (id: string) => {
    await server.fetch<likeNASAImageData,
     likeNASAImageVariables>({
       query: LIKENASAIMAGE,
       variables: {
         id
       }
     })
     fetchNASAImages();
  };

  const unlikeNASAImage = async (id: string) => {
    await server.fetch<unlikeNASAImageData,
     unlikeNASAImageVariables>({
       query: UNLIKENASAIMAGE,
       variables: {
         id
       }
     })
     fetchNASAImages();
  };

  const NASAImagesList = NASAImages 
  ? <ul>
      {NASAImages.map((NASAImage) => {
        return ( 
          <li key={ NASAImage.id }>
            { NASAImage.title }
            { NASAImage.likes }
            <button onClick={() => likeNASAImage(NASAImage.id)}>Like</button>
            <button onClick={() => unlikeNASAImage(NASAImage.id)}>Unlike</button>
          </li>
        )
      })}
    </ul>
  : null;

  return ( 
    <div>
      <h2>{title}</h2>
      { NASAImagesList }
    </div>
  )
}