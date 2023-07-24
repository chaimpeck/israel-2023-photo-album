import PhotoAlbum from 'react-photo-album';

interface GalleryProps {
  mediaEvent: MediaEvent;
  mediaManifest: MediaManifest;
}

export function Gallery({ mediaEvent, mediaManifest }: GalleryProps) {
  const { mediaGroups } = mediaEvent;

  const getMediaKey = (filename: string) =>
    filename.split('/').slice(-1)[0].split('.').slice(-3)[0];

  return mediaGroups.map(({ description, media, title }) => (
    <div key={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      <PhotoAlbum
        layout="columns"
        columns={5}
        photos={media.map(mediaKey => ({
          height: mediaManifest[mediaKey].thumbnailDim.height,
          src: mediaManifest[mediaKey].thumbnailSrc,
          width: mediaManifest[mediaKey].thumbnailDim.width,
        }))}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => (
          <div style={{ position: 'relative', ...wrapperStyle }}>
            {renderDefaultPhoto({ wrapped: true })}
            <div
              onClick={() => {
                navigator.clipboard
                  .writeText(getMediaKey(photo.src))
                  .catch(e => console.error(e));
              }}
              style={{
                backgroundColor: 'rgba(255 255 255 / .6)',
                inset: 'auto 0 0 0',
                overflow: 'hidden',
                padding: 8,
                position: 'absolute',
              }}
            >
              {getMediaKey(photo.src)}
            </div>
          </div>
        )}
      />
    </div>
  ));
}
