import PhotoAlbum from 'react-photo-album';

interface GalleryProps {
  mediaEvent: MediaEvent;
  mediaManifest: MediaManifest;
  onClickImage: (
    index: number,
    mediaGroup: MediaEvent['mediaGroups'][0]
  ) => void;
}

export function Gallery({
  mediaEvent,
  mediaManifest,
  onClickImage,
}: GalleryProps) {
  const { mediaGroups } = mediaEvent;

  return mediaGroups.map(({ description, media, title }) => (
    <div key={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      <PhotoAlbum
        layout="columns"
        columns={5}
        onClick={({ index }) =>
          onClickImage(index, { description, media, title })
        }
        photos={media.map(mediaKey => ({
          height: mediaManifest[mediaKey].thumbnailDim.height,
          src: mediaManifest[mediaKey].thumbnailSrc,
          width: mediaManifest[mediaKey].thumbnailDim.width,
        }))}
        renderPhoto={({ wrapperStyle, renderDefaultPhoto }) => (
          <div style={{ position: 'relative', ...wrapperStyle }}>
            {renderDefaultPhoto({ wrapped: true })}
          </div>
        )}
      />
    </div>
  ));
}
