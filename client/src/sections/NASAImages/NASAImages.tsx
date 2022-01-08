import { server } from "../../lib/api";

const NASAIMAGES = `
  query NASAImages {
    NASAImages {
      _id
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
interface Props {
  title: string;
}

export const NASAImages = ({ title }: Props) => {
  const fetchNASAImages = async () =>{
    const NASAImages = await server.fetch({ query: NASAIMAGES });
    console.log(NASAImages);
  }
  return <div>
          <h2>{title}</h2>
          <button onClick={ fetchNASAImages }>Query NASA Images!</button>
        </div>
}