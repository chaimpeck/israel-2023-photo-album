# Israel 2023 Photo Album

## Preperation

* Arrange albums in Photos app under a folder.
* In the `tools/Export Photos` AppleScript, modify the `folderName` and `exportPath` accordingly.
* Run the `Export Photos` AppleScript.
* Modify the python scripts in `tools` to reflect the export location and the remote base url.
* Run `python tools/generate-thumbnails.py`
* Upload the exported images to the desired remote location (i.e. `aws s3 sync --acl public-read israel-2023-export s3://my-bucket/israel-2023`)
* Run the python script in the `tools` directory to generate the starter json `media-events.json` file (need to update script with correct paths): `python tools/generate-starter-media-events.py | pbcopy`
* Edit the media-events file accordingly and save to `public/media-events.json`