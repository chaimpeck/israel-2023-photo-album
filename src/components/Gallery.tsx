import PhotoAlbum from 'react-photo-album';

interface GalleryProps {
  mediaEvent: MediaEvent;
}

export function Gallery({ mediaEvent }: GalleryProps) {
  const { mediaGroups } = mediaEvent;

  return mediaGroups.map(({ description, media, title }) => (
    <div key={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      <PhotoAlbum
        layout="columns"
        photos={media.map(({ thumbnailDim, thumbnailSrc }) => ({
          height: thumbnailDim.height,
          src: thumbnailSrc,
          width: thumbnailDim.width,
        }))}
      />
    </div>
  ));
}
