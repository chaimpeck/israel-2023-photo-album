interface Media {
  fullSrc: string;
  fullDim: { height: number; width: number };
  thumbnailSrc: string;
  thumbnailDim: { height: number; width: number };
}

type MediaManifest = Record<string, Media>;

interface MediaEvent {
  baseUrl: string;
  mediaGroups: Array<{
    description: string;
    media: string[];
    title: string;
  }>;
  title: string;
}

interface MediaEventData {
  mediaEvents: MediaEvent[];
  mediaManifest: MediaManifest;
}
