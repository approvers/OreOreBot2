export type Heading = {
  url: string;
  title: string;
  items?: Heading[];
};

export type Page = {
  body: string;
  dir: string;
  uri: string;
  absolutePath: string;
  title: string;
  headings: Heading[];
};
