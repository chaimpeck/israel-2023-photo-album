import PhotoAlbum, { type RenderPhoto } from 'react-photo-album';

interface GalleryProps {
  mediaEvent: MediaEvent;
  mediaManifest: MediaManifest;
  onClickImage: (index: number, mediaGroupIndex: number) => void;
}

const renderPhoto: RenderPhoto = ({
  photo,
  wrapperStyle,
  renderDefaultPhoto,
}) => {
  return (
    <div
      style={{
        boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        ...wrapperStyle,
      }}
    >
      {renderDefaultPhoto({ wrapped: true })}
    </div>
  );
};

export function Gallery({
  mediaEvent,
  mediaManifest,
  onClickImage,
}: GalleryProps) {
  const { mediaGroups } = mediaEvent;

  return mediaGroups.map(({ description, media, title }, mediaGroupIndex) => (
    <div key={mediaGroupIndex}>
      <h2>{title}</h2>
      <p>{description}</p>
      <PhotoAlbum
        layout="columns"
        columns={5}
        onClick={({ index }) => onClickImage(index, mediaGroupIndex)}
        photos={media.map(mediaKey => ({
          height: mediaManifest[mediaKey].thumbnailDim.height,
          src: mediaManifest[mediaKey].thumbnailSrc,
          width: mediaManifest[mediaKey].thumbnailDim.width,
        }))}
        renderPhoto={renderPhoto}
      />
    </div>
  ));
}
