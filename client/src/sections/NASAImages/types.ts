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
  comments: [string];
}

export interface NASAImagesData {
  NASAImages: NASAImage[];
}

export interface NASAImageData {
  NASAImage: NASAImage;
}

export interface addNASAImageData {
  response: string;
}

export interface addNASAImageVariables {
  dateToGet: string;
}

export interface likeNASAImageData {
  like: NASAImage;
}

export interface likeNASAImageVariables {
  id: string;
  userId: string;
}

export interface unlikeNASAImageData {
  like: NASAImage;
}

export interface unlikeNASAImageVariables {
  id: string;
  userId: string;
}

export interface postCommentNASAImageData {
  comments: NASAImage;
}

export interface postCommentNASAImageVariables {
  id: string;
  comment: string;
}
