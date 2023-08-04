interface Media {
  fullSrc: string;
  fullDim: { height: number; width: number };
  thumbnailSrc: string;
  thumbnailDim: { height: number; width: number };
}

type MediaManifest = Record<string, Media>;

interface MediaGroup {
  description: string;
  media: string[];
  title: string;
}

interface MediaEvent {
  baseUrl: string;
  mediaGroups: MediaGroup[];
  title: string;
}

interface MediaEventData {
  mediaEvents: MediaEvent[];
  mediaManifest: MediaManifest;
}
