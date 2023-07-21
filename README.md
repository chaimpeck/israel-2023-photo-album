# Israel 2023 Photo Album

## Background

We just got back from Israel and had lots of great pictures - three thousand in fact!

Each day was filled with so much activity and I wanted to remember it all and share it with others, so I opened the Apple Photos application and looked for some way to create a photo album that is sharable outside of the application and lets me put comments to go along with groupings of photos. And I could not find anything to that. Maybe iPhoto used to have that? I vaguely remember something. I googled and only found print photo book software (which I also want to make, but that is a separate project).

I was surprised to find that there is not already some tool that lets you drag drop photos and creates a static shareable web page. Maybe there is and I just didn't know what to search for? Anyway, I decided to make it myself.

For starters, I needed to export the photos, but I wanted them to retain their date and time so I could arrange them after exporting without losing context of when the photo was actually taken. Again, Photos did not help here.

I did observe that the export EXIF data retained date and time for images. Maybe I could write a small utility that uses that information. But, what about exported movies? There was no EXIF information with those. So, that wouldn't work.

Next option was to try exporting unmodified photos. This actualy exports a small movie to go along with each .HEIC file. I tried writing a small script that would find and delete those movie files, but then I observed that was left with lots of .aae files. Apparently these .aae files contain any edits or modifications to the .HEIC files. Basically, it would be too much work to try to reconstruct whatever Photos does to just get a simple .jpeg exported.

I considered several other options including doing two export runs, one for unmodified movies and the other for images. But, as the task grew more and more complicated, I ultimately realized that I would need to use AppleScript.

So, I finally wrote a small AppleScript to export all media (photos and videos) and rename them, one-by-one (not so efficient, but does the job) with the date/time supplied by Photos for the particular media file. And with that, I had a list of three thousand media files organized by date/time and I was ready to build an album!

I wrote a small Python script to make thumbnails and also create a manifest with image dimensions included (also works for movies!), along with a starter grouping of events, and then set out to manually edit that file, grouping files and adding comments.

Finally, and really happening adjacent to all of the above, I wrote a front-end for this in React with Bootstrap that would use a photo album library to actually display the photos.

For the photo album component, I originally tried Wix's pro-gallery because it looked pretty slick in the demos. However, it seemed to lack in support and possibly was intended to be used inside Wix applications. In particular, I could not figure out how to get the "MAGNIFY" option to work. Ah well. I then tried react-photo-album and it seemed to do the trick, and I found it more straightforward.

So, here is our Israel Photo Album. I tried to make this project a way that if we want to use it for another photo album one day, or if somebody finds this on the internet and wants to use it, they can do so easily, just following the instructions.

Of course, this is based on Apple Photos in 2023, and is hard to say if the AppleScript to export will work the same way in the future. Even if noone finds this useful, I am putting it here for my future self, for the next time we have some adventure and I want to collect and share the memories.

## Preperation

- Arrange albums in Photos app under a folder.
- In the `tools/Export Photos` AppleScript, modify the `folderName` and `exportPath` accordingly.
- Run the `Export Photos` AppleScript.
- Modify the `tools/prepare-media.py` script to reflect the export location and the remote base url.
- Run `python tools/prepare-media.py`
- Copy/move the output `starter-media-events.json` to the `public` directory and edit it there, adding comments and new groupings. (You may want to go back and edit this file with new comments, etc.)
- Upload the exported images to the desired remote location (i.e. `aws s3 sync --acl public-read israel-2023-export s3://my-bucket/israel-2023`)

## Dev

```sh
yarn
yarn start
```

## Deploy

```sh
yarn
yarn build
aws s3 sync --acl public-read build s3://my-album-bucket/
```
