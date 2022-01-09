export interface NASAImage {
  id: string;
  likes: number;
  copyright?: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export interface NASAImagesData {
  NASAImages: NASAImage[];
}

export interface likeNASAImageData {
  like: NASAImage;
}

export interface likeNASAImageVariables {
  id: string;
}

export interface unlikeNASAImageData {
  like: NASAImage;
}

export interface unlikeNASAImageVariables {
  id: string;
}