export interface EmbedMessageField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedMessageThumbnail {
  url: string;
}

export interface EmbedMessage {
  author?: {
    iconUrl?: string;
    name: string;
    url?: string;
  };
  color?: number;
  description?: string;
  fields?: EmbedMessageField[];
  footer?: string;
  title?: string;
  url?: string;
  thumbnail?: EmbedMessageThumbnail;
}
