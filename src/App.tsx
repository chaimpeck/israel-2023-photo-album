import Accordion from 'react-bootstrap/Accordion';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import { Gallery } from './components/Gallery';

function App() {
  const [mediaEventData, setMediaEventData] = useState<MediaEventData>();

  useEffect(() => {
    const fetchMediaEvents = async () => {
      const res = await fetch('media-events.json');
      const newMediaEvents = await res.json();
      setMediaEventData(newMediaEvents);
    };

    void fetchMediaEvents();
  }, []);

  console.log('HERE', mediaEventData);

  return (
    <div>
      <h1>The Peck&apos;s in Israel - 2023</h1>
      <h2>Events</h2>
      <Accordion flush>
        {mediaEventData?.mediaEvents.map(mediaEvent => (
          <Accordion.Item key={mediaEvent.title} eventKey={mediaEvent.title}>
            <Accordion.Header>{mediaEvent.title}</Accordion.Header>
            <Accordion.Body>
              <Gallery
                mediaEvent={mediaEvent}
                mediaManifest={mediaEventData.mediaManifest}
              />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default App;
