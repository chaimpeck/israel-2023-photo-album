import Accordion from 'react-bootstrap/Accordion';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import { Gallery } from './components/Gallery';
import Lightbox, { type ILightBoxProps } from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function App() {
  const [mediaEventData, setMediaEventData] = useState<MediaEventData>();
  const [selectedMediaGroup, setSelectedMediaGroup] = useState<MediaGroup>();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>();

  useEffect(() => {
    const fetchMediaEvents = async () => {
      const res = await fetch('media-events.json');
      const newMediaEvents = await res.json();
      setMediaEventData(newMediaEvents);
    };

    void fetchMediaEvents();
  }, []);

  if (mediaEventData === undefined) {
    return <div>Loading...</div>;
  }

  const { mediaEvents, mediaManifest } = mediaEventData;

  const { media } = selectedMediaGroup ?? {};

  const [prevMediaItem, selectedMediaItem, nextMediaItem] =
    selectedMediaIndex === undefined || media === undefined
      ? []
      : [
          mediaManifest[media[selectedMediaIndex - 1]],
          mediaManifest[media[selectedMediaIndex]],
          mediaManifest[media[selectedMediaIndex + 1]],
        ];

  const lightboxProps =
    selectedMediaItem === undefined
      ? undefined
      : ({
          mainSrc: selectedMediaItem.fullSrc,
          mainSrcThumbnail: selectedMediaItem.thumbnailSrc,
          nextSrc: nextMediaItem?.fullSrc,
          nextSrcThumbnail: nextMediaItem?.thumbnailSrc,
          prevSrc: prevMediaItem?.fullSrc,
          prevSrcThumbnail: prevMediaItem?.thumbnailSrc,
        } satisfies Pick<
          ILightBoxProps,
          | 'mainSrc'
          | 'mainSrcThumbnail'
          | 'nextSrc'
          | 'nextSrcThumbnail'
          | 'prevSrc'
          | 'prevSrcThumbnail'
        >);

  return (
    <div>
      <h1>The Peck&apos;s in Israel - 2023</h1>
      {lightboxProps !== undefined && (
        <Lightbox
          {...lightboxProps}
          onCloseRequest={() => {
            setSelectedMediaGroup(undefined);
            setSelectedMediaIndex(undefined);
          }}
          onMoveNextRequest={() => {
            if (selectedMediaIndex !== undefined) {
              setSelectedMediaIndex(selectedMediaIndex + 1);
            }
          }}
          onMovePrevRequest={() => {
            if (selectedMediaIndex !== undefined) {
              setSelectedMediaIndex(selectedMediaIndex - 1);
            }
          }}
        />
      )}
      <Accordion flush>
        {mediaEvents.map((mediaEvent, index) => (
          <Accordion.Item key={mediaEvent.title} eventKey={`${index}`}>
            <Accordion.Header>{mediaEvent.title}</Accordion.Header>
            <Accordion.Body>
              <Gallery
                mediaEvent={mediaEvent}
                mediaManifest={mediaManifest}
                onClickImage={(
                  index: number,
                  { description, media, title }
                ) => {
                  setSelectedMediaGroup({ description, media, title });
                  setSelectedMediaIndex(index);
                }}
              />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default App;
