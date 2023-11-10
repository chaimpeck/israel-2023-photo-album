import Accordion from 'react-bootstrap/Accordion';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import { Gallery } from './components/Gallery';
import { Lightbox } from './components/Lightbox';

function App() {
  const [mediaEventData, setMediaEventData] = useState<MediaEventData>();
  const [selectedMediaEvent, setSelectedMediaEvent] = useState<MediaEvent>();
  const [nextMediaEvent, setNextMediaEvent] = useState<MediaEvent>();
  const [prevMediaEvent, setPrevMediaEvent] = useState<MediaEvent>();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<
    number | undefined
  >();

  useEffect(() => {
    const fetchMediaEvents = async () => {
      const res = await fetch('media-events.json');
      const newMediaEvents = await res.json();
      setMediaEventData(newMediaEvents);
    };

    void fetchMediaEvents();
  }, []);

  // This is a little hacky. Consider revising this.
  useEffect(() => {
    if (selectedMediaEvent === undefined) {
      return;
    }

    const index = mediaEvents.indexOf(selectedMediaEvent);
    console.log(mediaEvents, index);
    setNextMediaEvent(mediaEvents[index + 1]);
    setPrevMediaEvent(mediaEvents[index - 1]);
  }, [mediaEventData, selectedMediaEvent]);

  if (mediaEventData === undefined) {
    return <div>Loading...</div>;
  }

  const { mediaEvents, mediaManifest } = mediaEventData;

  return (
    <div>
      <h1>The Peck&apos;s in Israel - 2023</h1>
      {selectedMediaEvent !== undefined && (
        <Lightbox
          mediaManifest={mediaManifest}
          nextMediaEvent={nextMediaEvent}
          prevMediaEvent={prevMediaEvent}
          selectedMediaEvent={selectedMediaEvent}
          selectedMediaIndex={selectedMediaIndex}
          setSelectedMediaEvent={setSelectedMediaEvent}
          setSelectedMediaIndex={setSelectedMediaIndex}
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
                onClickImage={(index: number, mediaGroupIndex) => {
                  const newMediaIndex =
                    mediaEvent.mediaGroups
                      .slice(0, mediaGroupIndex)
                      .map(mediaGroup => mediaGroup.media.length)
                      .reduce((s, a) => s + a, 0) + index;
                  setSelectedMediaEvent(mediaEvent);
                  setSelectedMediaIndex(newMediaIndex);
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
