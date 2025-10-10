'use client';

import { ShareButton } from "./share-button";

interface ShareButtonClientProps {
  url: string;
  title: string;
}

export function ShareButtonClient({ url, title }: ShareButtonClientProps) {
  return <ShareButton url={url} title={title} />;
}
