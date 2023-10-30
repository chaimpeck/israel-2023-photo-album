import { useCallback, useMemo, useRef, useState } from 'react';
import { Overlay } from 'react-bootstrap';
import YARLightbox, { type Slide } from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';

export interface LightboxProps {
  mediaGroup: MediaGroup;
  mediaManifest: MediaManifest;
  selectedMediaIndex: number | undefined;
  setSelectedMediaIndex: (i: number | undefined) => void;
}

export function Lightbox({
  mediaGroup,
  mediaManifest,
  selectedMediaIndex,
  setSelectedMediaIndex,
}: LightboxProps) {
  const [showCaptions, setShowCaptions] = useState(false);
  const slides = useMemo<Slide[]>(
    () =>
      mediaGroup.media.map(key => {
        const { fullDim, fullSrc, thumbnailDim, thumbnailSrc } =
          mediaManifest[key];

        if (fullSrc.endsWith('.mov')) {
          return {
            height: fullDim.height,
            poster: thumbnailSrc,
            sources: [
              {
                src: fullSrc,
                type: 'video/mp4',
              },
            ],
            type: 'video',
            width: fullDim.width,
          };
        }

        return {
          alt: mediaGroup.title,
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
      }),
    [mediaGroup, mediaManifest]
  );
  const handleClose = useCallback(() => setSelectedMediaIndex(undefined), []);

  return (
    <>
      <YARLightbox
        close={handleClose}
        index={selectedMediaIndex}
        open={selectedMediaIndex !== undefined}
        plugins={[Video]}
        on={{
          entered: () => setShowCaptions(true),
          exiting: () => setShowCaptions(false),
        }}
        slides={slides}
        video={{
          autoPlay: true,
          muted: true,
        }}
      />
      <Overlay target={null} show={showCaptions}>
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
                {mediaGroup.title}
              </h3>
            </div>
            <div
              style={{
                bottom: '20px',
                position: 'absolute',
                textAlign: 'center',
              }}
            >
              {mediaGroup.description}
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
}
