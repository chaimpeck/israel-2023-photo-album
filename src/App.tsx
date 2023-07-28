import Accordion from 'react-bootstrap/Accordion';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { Gallery } from './components/Gallery';
import AccordionContext from 'react-bootstrap/AccordionContext';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function App() {
  const [mediaEventData, setMediaEventData] = useState<MediaEventData>();
  const [activeMediaEventIndex, setActiveMediaEventIndex] = useState<number>();

  useEffect(() => {
    const fetchMediaEvents = async () => {
      const res = await fetch('media-events.json');
      const newMediaEvents = await res.json();
      setMediaEventData(newMediaEvents);
    };

    void fetchMediaEvents();
  }, []);

  // Make an object AccordinateItems that can keep track of the current active index
  const AccordianItems = ({ children }: { children: any }) => {
    const { activeEventKey } = useContext(AccordionContext);
    useEffect(() => {
      setActiveMediaEventIndex(
        typeof activeEventKey === 'string'
          ? parseInt(activeEventKey)
          : undefined
      );
    }, [activeEventKey]);

    return <>{children}</>;
  };

  const activeImageKey =
    activeMediaEventIndex !== undefined
      ? mediaEventData?.mediaEvents?.[activeMediaEventIndex].mediaGroups[0]
          .media[0]
      : undefined;

  const activeImage =
    activeImageKey !== undefined
      ? mediaEventData?.mediaManifest[activeImageKey]
      : undefined;

  console.log(activeImageKey, activeImage);

  const [lightboxImage, setLightboxImage] = useState<string>();

  return (
    <div>
      <h1>The Peck&apos;s in Israel - 2023</h1>
      <h2>Events {activeMediaEventIndex}</h2>
      {lightboxImage !== undefined && (
        <Lightbox
          mainSrc={lightboxImage}
          onCloseRequest={() => {
            setLightboxImage(undefined);
          }}
        />
      )}
      <Accordion flush>
        <AccordianItems>
          {mediaEventData?.mediaEvents.map((mediaEvent, index) => (
            <Accordion.Item key={mediaEvent.title} eventKey={`${index}`}>
              <Accordion.Header>{mediaEvent.title}</Accordion.Header>
              <Accordion.Body>
                <Gallery
                  mediaEvent={mediaEvent}
                  mediaManifest={mediaEventData.mediaManifest}
                  onClickImage={(imgSrc: string) => setLightboxImage(imgSrc)}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </AccordianItems>
      </Accordion>
    </div>
  );
}

export default App;
