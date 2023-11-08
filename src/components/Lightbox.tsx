import { useCallback, useMemo, useState } from 'react';
import { Overlay } from 'react-bootstrap';
import YARLightbox, { type Slide } from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Form from 'react-bootstrap/Form';
import 'yet-another-react-lightbox/styles.css';

interface HideCaptionsSwitchProps {
  hideCaptions: boolean;
  toggleHideCaptions: () => void;
}

function HideCaptionsSwitch({
  hideCaptions,
  toggleHideCaptions,
}: HideCaptionsSwitchProps) {
  return (
    <Form
      style={{ left: '0', paddingLeft: 12, paddingTop: 6, position: 'fixed' }}
    >
      <Form.Check
        label="Hide Captions"
        type="switch"
        checked={hideCaptions}
        onChange={toggleHideCaptions}
      />
    </Form>
  );
}

export interface LightboxProps {
  mediaManifest: MediaManifest;
  selectedMediaEvent: MediaEvent;
  selectedMediaIndex: number | undefined;
  setSelectedMediaIndex: (i: number | undefined) => void;
}

export function Lightbox({
  mediaManifest,
  selectedMediaEvent,
  selectedMediaIndex,
  setSelectedMediaIndex,
}: LightboxProps) {
  const [canShowCaptions, setCanShowCaptions] = useState(false);
  const [hideCaptions, setHideCaptions] = useState(false);
  const slides = useMemo<Array<Slide & { description: string; title: string }>>(
    () =>
      selectedMediaEvent.mediaGroups.flatMap(mediaGroup =>
        mediaGroup.media.map(key => {
          const { fullDim, fullSrc, thumbnailDim, thumbnailSrc } =
            mediaManifest[key];

          if (fullSrc.endsWith('.mov')) {
            return {
              description: mediaGroup.description,
              height: fullDim.height,
              poster: thumbnailSrc,
              sources: [
                {
                  src: fullSrc,
                  type: 'video/mp4',
                },
              ],
              title: mediaGroup.title,
              type: 'video',
              width: fullDim.width,
            };
          }

          return {
            alt: mediaGroup.title,
            description: mediaGroup.description,
            src: encodeURI(fullSrc),
            srcSet: [
              {
                height: thumbnailDim.height,
                src: encodeURI(thumbnailSrc),
                width: thumbnailDim.width,
              },
              {
                height: fullDim.height,
                src: encodeURI(fullSrc),
                width: fullDim.width,
              },
            ],
            title: mediaGroup.title,
            type: 'image',
          };
        })
      ),
    [mediaManifest, selectedMediaEvent]
  );
  const handleClose = useCallback(() => setSelectedMediaIndex(undefined), []);

  return (
    <>
      <YARLightbox
        carousel={{ finite: true }}
        close={handleClose}
        index={selectedMediaIndex}
        open={selectedMediaIndex !== undefined}
        plugins={[Video]}
        on={{
          entered: () => setCanShowCaptions(true),
          exiting: () => setCanShowCaptions(false),
          view: ({ index }) => setSelectedMediaIndex(index),
        }}
        slides={slides}
        toolbar={{
          buttons: [
            <HideCaptionsSwitch
              hideCaptions={hideCaptions}
              toggleHideCaptions={() => setHideCaptions(!hideCaptions)}
              key="show-captions-switch"
            />,
            'close',
          ],
        }}
        video={{
          autoPlay: true,
          muted: true,
        }}
      />
      {selectedMediaIndex !== undefined && (
        <Overlay target={null} show={canShowCaptions && !hideCaptions}>
          {({ ...props }) => (
            <div
              style={{
                height: '100%',
                pointerEvents: 'none',
                position: 'fixed',
                textShadow: '1px 1px 10px #fff, 1px 1px 10px #ccc',
                top: 0,
                transform: 'none',
                width: '100%',
                zIndex: 10000,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '4em',
                  width: '100%',
                }}
              >
                <h3
                  style={{
                    textAlign: 'center',
                  }}
                >
                  {selectedMediaEvent.title}:<br />
                  {slides[selectedMediaIndex].title}
                </h3>
              </div>
              <div
                style={{
                  bottom: '20px',
                  position: 'absolute',
                  textAlign: 'center',
                }}
              >
                {slides[selectedMediaIndex].description}
              </div>
            </div>
          )}
        </Overlay>
      )}
    </>
  );
}
