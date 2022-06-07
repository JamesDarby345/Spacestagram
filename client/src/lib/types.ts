export interface Viewer {
  id: string | null;
  token: string | null;
  avatar: string | null;
  name: string | null;
  didRequest: boolean;
}
