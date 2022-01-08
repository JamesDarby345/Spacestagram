import { server } from "../../lib/api";
import { 
  NASAImagesData, 
  likeNASAImageData, 
  likeNASAImageVariables,
  unlikeNASAImageData,
  unlikeNASAImageVariables
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
`

const UNLIKENASAIMAGE = `
  mutation likeNASAImage($id: ID!) {
    like(id: $id) {
      id
      likes
    }
  }
`
interface Props {
  title: string;
}

export const NASAImages = ({ title }: Props) => {
  const fetchNASAImages = async () =>{
    const { data } = 
      await server.fetch<NASAImagesData>({ query: NASAIMAGES });
    console.log(data);
  }

  const likeNASAImage = async () => {
    const { data } = await server.fetch<likeNASAImageData,
     likeNASAImageVariables>({
       query: LIKENASAIMAGE,
       variables: {
         id: '61d8994b39fb054f6f21b294'
       }
     })
     console.log(data);
  };

  const unlikeNASAImage = async () => {
    const { data } = await server.fetch<unlikeNASAImageData,
     unlikeNASAImageVariables>({
       query: UNLIKENASAIMAGE,
       variables: {
         id: '61d8994b39fb054f6f21b294'
       }
     })
  };

  return ( 
    <div>
      <h2>{title}</h2>
      <button onClick={ fetchNASAImages }>
        Query NASA Images!
      </button>
      <button onClick={ likeNASAImage }>
        Like a NASA Image!
      </button>
      <button onClick={ unlikeNASAImage }>
        Unlike a NASA Image!
      </button>
    </div>
  )
}