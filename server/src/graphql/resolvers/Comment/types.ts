/* eslint-disable @typescript-eslint/no-explicit-any */
export enum CommentsFilter {
  ALL = "ALL",
  LATEST_COMMENTS = "LATEST_COMMENTS",
  OLDEST_COMMENTS = "OLDEST_COMMENTS",
  MOST_LIKED = "MOST_LIKED",
  SAFE_COMMENTS = "SAFE_COMMENTS",
}

export interface CommentsArgs {
  userId: string;
  limit: number;
  page: number;
  date: string;
  filter: CommentsFilter;
}

export interface CommentsData {
  total: number;
  result: any[];
}
