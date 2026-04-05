export const ROUTES = {
  home: "/",
  studio: "/studio",
  studioBackground: "/studio/:id",
  docs: "/docs",
  docsBackground: "/docs/:id",
} as const;

export function studioRoute(id: string) { return `/studio/${id}`; }
export function docsRoute(id: string)   { return `/docs/${id}`; }

export const GITHUB_URL = "https://github.com/dano796/reart";

export const CLI_PACKAGE = "@dano796/react-reart";
