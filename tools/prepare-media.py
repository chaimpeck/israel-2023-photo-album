from pathlib import Path
import json
from urllib.parse import urljoin
from PIL import Image
import ffmpeg

LOCAL_EXPORT_DIRECTORY = "/Users/chaim/Downloads/israel-2023-export-02/"
URL_BASE_PATH = "https://jeffpeck-media.s3.us-east-2.amazonaws.com/israel-2023/"
EVENT_ORDER = [
    "Going to Israel",
    "Ir David and Kotel",
    "Doing Things in Rechavia",
    "Stalagmites, Batcave, Rockslide, Spring, and Biblical Natural History Museum",
    "Mitzpe Ramon",
    "Pizza Hut and Night Roam",
    "Monster Slide and Pasta Basta",
    "Thursday Night in Jerusalem",
    "Botanical Gardens and Eruv Shabbat",
    "Motzei Shabbat Protests",
    "Sabba and Safta Visit Jerusalem Great Synagog",
    "First Station and Yair's Birthday",
    "Gan Sacher, Meet Abby Family and Aliza and Family",
    "Game Shopping and a Movie",
    "Galita Chololate Factory, Anu Museum, Tel Aviv Beach with Cousins, and Hanging out with the Weinstocks",
    "Camel Rides, Gan Ganroo, Gan HaShalosha, and Kineret Water Park",
    "Date Night",
    "Dead Sea",
    "Dinner in Ben Yehuda and the Game Store is Closed",
    "Second Protest",
    "17 Tammuz First Station and Around Old City and Kotel",
    "Sylvesky Visit and Erev Shabbat",
    "Motzei Shabbat Games in the Rova and Beyond",
    "Game Store, Shuk, and Visiting Noimans in Gilo",
    "Second Date Night and Bump into Sabba and Safta Who Are Also Out",
    "Morning in the Hotel",
    "Date Day",
    "Beerot Yitzchak, Visit Porats, and Binyomon Sheis Stops By",
    "Night Visit to the Kotel with Ben Skoler",
    "Flying Back to America",
    "Last Morning of the Trip, Yair Works on Game in Lobby",
    "Getting Ready to Leave, But One More Visit to the Kotel, and the Zoo!",
]


def main():
    export_dir = Path(LOCAL_EXPORT_DIRECTORY)

    media_events = []

    for album_path in export_dir.iterdir():
        if not album_path.is_dir():
            continue

        url_base = URL_BASE_PATH + album_path.name + "/"
        media = []

        # Generate thumbnails for all .jpeg files
        for file_path in album_path.glob("*.jpeg"):
            if len(file_path.suffixes) > 0 and file_path.suffixes[0] == ".thumb":
                continue

            thumbnail_path = file_path.parent.joinpath(file_path.stem + ".thumb.jpeg")

            image = Image.open(file_path)
            full_dim = (image.width, image.height)

            if thumbnail_path.exists():
                thumbnail = Image.open(thumbnail_path)
                thumbnail_dim = (thumbnail.width, thumbnail.height)
            else:
                image.thumbnail((640, 640))
                thumbnail_dim = (image.width, image.height)
                image.save(thumbnail_path)

            media.append(
                {
                    "fullSrc": urljoin(url_base, file_path.name),
                    "fullDim": {"width": full_dim[0], "height": full_dim[1]},
                    "thumbnailSrc": urljoin(url_base, thumbnail_path.name),
                    "thumbnailDim": {
                        "width": thumbnail_dim[0],
                        "height": thumbnail_dim[1],
                    },
                }
            )

        for file_path in album_path.glob("*.mov"):
            if len(file_path.suffixes) > 0 and file_path.suffixes[0] == ".thumb":
                continue

            thumbnail_path = file_path.parent.joinpath(file_path.stem + ".thumb.jpeg")

            probe = ffmpeg.probe(file_path)
            video_streams = [
                stream for stream in probe["streams"] if stream["codec_type"] == "video"
            ]

            if not thumbnail_path.exists():
                ffmpeg.input(file_path, ss=0).filter("scale", 640, -1).output(
                    str(thumbnail_path), vframes=1
                ).overwrite_output().run(capture_stdout=True, capture_stderr=True)

            thumbnail_width = 640
            thumbnail_height = (
                thumbnail_width * video_streams[0]["height"] / video_streams[0]["width"]
            )
            media.append(
                {
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
            )

        media_groups = [
            {
                "media": media,
                "title": "Group Placeholder",
                "desciption": "Group Description",
            }
        ]
        media_event = {
            "mediaGroups": media_groups,
            "title": album_path.name,
        }

        media_events.append(media_event)

    media_events_lookup = {
        media_event["title"]: media_event for media_event in media_events
    }
    ordered_media_events = [
        media_events_lookup[event_title] for event_title in EVENT_ORDER
    ]

    with open("starter-media-events.json", "w") as f:
        json.dump(ordered_media_events, f, sort_keys=True, indent=2)

    print("Wrote to starter-media-events.json")


if __name__ == "__main__":
    main()
