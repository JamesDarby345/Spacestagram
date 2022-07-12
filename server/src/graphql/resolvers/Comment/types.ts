/* eslint-disable @typescript-eslint/no-explicit-any */
export enum CommentsFilter {
  ALL = "ALL",
  LATEST_COMMENTS = "LATEST_COMMENTS",
  OLDEST_COMMENTS = "OLDEST_COMMENTS",
  MOST_LIKED = "MOST_LIKED",
}

export interface CommentsArgs {
  limit: number;
  page: number;
  date: string;
  filter: CommentsFilter;
}

export interface CommentsData {
  total: number;
  result: any[];
}
