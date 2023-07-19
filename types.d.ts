interface Media {
  fullSrc: string;
  fullDim: { height: number; width: number };
  thumbnailSrc: string;
  thumbnailDim: { height: number; width: number };
}

interface MediaEvent {
  baseUrl: string;
  mediaGroups: Array<{
    description: string;
    media: Media[];
    title: string;
  }>;
  title: string;
}
