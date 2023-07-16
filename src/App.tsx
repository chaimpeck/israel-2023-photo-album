import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import 'pro-gallery/dist/statics/main.css';
import { Gallery } from './components/Gallery';
import { mediaEvents } from './mediaEvents';

function App() {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>();

  return (
    <div>
      <h1>The Peck&apos;s in Israel - 2023</h1>
      <h2>Events</h2>
      <ListGroup>
        {mediaEvents.map((event, index) => (
          <ListGroupItem
            action
            active={selectedEventIndex === index}
            key={index}
            onClick={() => setSelectedEventIndex(index)}
          >
            {event.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <div>Selected: {selectedEventIndex}</div>
      {selectedEventIndex !== undefined ? (
        <Gallery mediaEvent={mediaEvents[selectedEventIndex]} />
      ) : null}
    </div>
  );
}

export default App;
