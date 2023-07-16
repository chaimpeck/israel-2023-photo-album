import { ProGallery } from 'pro-gallery';

// The options of the gallery (from the playground current state)
const options = {
  behaviourParams: {
    item: {
      clickAction: 'MAGNIFY',
    },
  },
  layoutParams: {
    structure: {
      galleryLayout: 0,
    },
  },
};

// The size of the gallery container. The images will fit themselves in it
const container = {
  height: window.innerHeight,
  width: window.innerWidth,
};

// The eventsListener will notify you anytime something has happened in the gallery.
const eventsListener = (eventName: any, eventData: any) =>
  console.log({ eventData, eventName });

// The scrollingElement is usually the window, if you are scrolling inside another element, suplly it here
const scrollingElement = window;

interface GalleryProps {
  mediaEvent: MediaEvent;
}

export function Gallery({ mediaEvent }: GalleryProps) {
  const { baseDirectory, mediaGroups } = mediaEvent;

  return mediaGroups.map(({ media, title }) => (
    <div key={title}>
      <h2>{title}</h2>
      <ProGallery
        items={media.map(fileName => ({
          itemId: fileName,
          mediaUrl: `${baseDirectory}/${fileName}`,
        }))}
        options={options as any}
        container={container}
        eventsListener={eventsListener}
        scrollingElement={scrollingElement}
      />
    </div>
  ));
}
