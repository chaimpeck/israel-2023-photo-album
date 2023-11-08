from pathlib import Path
import json
import csv
from urllib.parse import urljoin
from PIL import Image
import ffmpeg

LOCAL_EXPORT_DIRECTORY = "/Users/chaim/Downloads/israel-2023-export/"
REMOTE_URL_BASE_PATH = "https://jeffpeck-media.s3.us-east-2.amazonaws.com/israel-2023/"


def main():
    export_dir = Path(LOCAL_EXPORT_DIRECTORY)

    album_order_path = export_dir.joinpath("album-names.txt")
    with open(album_order_path) as f:
        album_order = list(filter(None, [l.strip() for l in f.readlines()]))

    media_manifest = {}
    media_events = []

    for album_path in export_dir.iterdir():
        if not album_path.is_dir():
            continue

        url_base = REMOTE_URL_BASE_PATH + album_path.name + "/"
        media = []

        # Generate thumbnails for all .jpeg and *.mov files
        for file_path in [*album_path.glob("*.jpeg"), *album_path.glob("*.mov")]:
            if len(file_path.suffixes) > 0 and file_path.suffixes[0] == ".thumb":
                continue

            thumbnail_path = file_path.parent.joinpath(file_path.stem + ".thumb.jpeg")

            if file_path.suffix == ".mov":
                probe = ffmpeg.probe(file_path)
                video_streams = [
                    stream
                    for stream in probe["streams"]
                    if stream["codec_type"] == "video"
                ]

                if not thumbnail_path.exists():
                    ffmpeg.input(file_path, ss=0).filter("scale", 640, -1).output(
                        str(thumbnail_path), vframes=1
                    ).overwrite_output().run(capture_stdout=True, capture_stderr=True)

                thumbnail_width = 640
                thumbnail_height = (
                    thumbnail_width
                    * video_streams[0]["height"]
                    / video_streams[0]["width"]
                )
                media_manifest[file_path.stem] = {
                    "fullSrc": urljoin(url_base, file_path.name),
                    "fullDim": {
                        "width": video_streams[0]["width"],
                        "height": video_streams[0]["height"],
                    },
                    "thumbnailSrc": urljoin(url_base, thumbnail_path.name),
                    "thumbnailDim": {
                        "width": thumbnail_width,
                        "height": thumbnail_height,
                    },
                }
            else:
                image = Image.open(file_path)
                full_dim = (image.width, image.height)

                if thumbnail_path.exists():
                    thumbnail = Image.open(thumbnail_path)
                    thumbnail_dim = (thumbnail.width, thumbnail.height)
                else:
                    image.thumbnail((640, 640))
                    thumbnail_dim = (image.width, image.height)
                    image.save(thumbnail_path)

                media_manifest[file_path.stem] = {
                    "fullSrc": urljoin(url_base, file_path.name),
                    "fullDim": {"width": full_dim[0], "height": full_dim[1]},
                    "thumbnailSrc": urljoin(url_base, thumbnail_path.name),
                    "thumbnailDim": {
                        "width": thumbnail_dim[0],
                        "height": thumbnail_dim[1],
                    },
                }

            title_path = file_path.parent.joinpath(file_path.name + ".title.txt")
            description_path = file_path.parent.joinpath(
                file_path.name + ".description.txt"
            )

            if title_path.exists():
                with open(title_path) as f:
                    media_manifest[file_path.stem]["title"] = f.read().strip()

            if description_path.exists():
                with open(description_path) as f:
                    media_manifest[file_path.stem]["description"] = f.read().strip()

            media.append(file_path.stem)

        # Put media into groups
        media_groups = []

        current_media_group = {
            "description": "Placeholder Description",
            "media": [],
            "title": "Placeholder Title",
        }

        for media_id in sorted(media):
            media_item = media_manifest[media_id]
            if media_item.get("title") or media_item.get("description"):
                if len(current_media_group["media"]) > 0:
                    media_groups.append(current_media_group)

                current_media_group = {
                    "description": media_item.get(
                        "description", "Placeholder Description"
                    ),
                    "media": [],
                    "title": media_item.get("title", "Placeholder Title"),
                }

            current_media_group["media"].append(media_id)

        if len(current_media_group["media"]) > 0:
            media_groups.append(current_media_group)

        media_event = {
            "mediaGroups": media_groups,
            "title": album_path.name,
        }
        media_events.append(media_event)

    media_events_lookup = {
        media_event["title"]: media_event for media_event in media_events
    }
    event_order = album_order
    ordered_media_events = [
        media_events_lookup[event_title] for event_title in event_order
    ]

    from pprint import pprint

    # pprint(ordered_media_events)

    with open("starter-media-events.json", "w") as f:
        json.dump(
            {
                "mediaEvents": ordered_media_events,
                "mediaManifest": media_manifest,
            },
            f,
            sort_keys=True,
            indent=2,
        )

    print("Wrote to starter-media-events.json")


if __name__ == "__main__":
    main()
