set folderName to "Israel 2023"
set exportPath to "Macintosh HD:Users:chaim:Downloads:israel-2023-export-1"

-- make the export directory
do shell script "mkdir -p " & quoted form of (POSIX path of exportPath)

tell application "Photos"
	with timeout of 21600 seconds
		tell its folder folderName
			set currentAlbums to albums
			set albumNamesFilePath to exportPath & ":" & "album-names.txt"
			set posixAlbumNamesFilePath to POSIX path of albumNamesFilePath
			do shell script "echo > " & quoted form of posixAlbumNamesFilePath
			repeat with thisAlbum in currentAlbums
				set thisAlbumName to thisAlbum's name
				set directoryPath to exportPath & ":" & thisAlbumName
				set posixDirectoryPath to POSIX path of directoryPath
				do shell script "mkdir -p " & quoted form of posixDirectoryPath
				set exportPathAlias to POSIX file posixDirectoryPath as alias
				
				set mediaItems to thisAlbum's media items
				repeat with mediaItem in mediaItems
					-- Export a single media item and capture the name of the tile
					export {mediaItem} to exportPathAlias
					set exportedFile to (do shell script "ls -Art " & (quoted form of posixDirectoryPath) & "| tail -n 1")
					
					-- Get the date/time of the media item
					set theDate to mediaItem's date
					set theMonth to text -1 thru -2 of ("0" & (month of theDate as number))
					set theDay to text -1 thru -2 of ("0" & day of theDate)
					set theYear to year of theDate
					set theHour to text -1 thru -2 of ("0" & hours of theDate)
					set theMinute to text -1 thru -2 of ("0" & minutes of theDate)
					set theSecond to text -1 thru -2 of ("0" & seconds of theDate)
					set theDateFormatted to "" & theYear & "-" & theMonth & "-" & theDay & "-" & theHour & "-" & theMinute & "-" & theSecond
					
					-- Rename the file to include the date
					set currentPath to quoted form of (posixDirectoryPath & "/" & exportedFile)
					set newPath to quoted form of (posixDirectoryPath & "/" & theDateFormatted & "-" & exportedFile)
					do shell script "mv " & currentPath & " " & newPath
					
					-- Output a title
					set theTitle to mediaItem's name as text
					if theTitle is not "missing value" then
						do shell script "echo " & quoted form of theTitle & " > " & quoted form of (posixDirectoryPath & "/" & theDateFormatted & "-" & exportedFile & ".title.txt")
					end if
					
					-- Output a description
					set theDescription to mediaItem's description as text
					if theDescription is not "missing value" then
						do shell script "echo " & quoted form of theDescription & " > " & quoted form of (posixDirectoryPath & "/" & theDateFormatted & "-" & exportedFile & ".description.txt")
					end if
				end repeat
				do shell script "echo " & quoted form of (thisAlbumName as text) & " >> " & posixAlbumNamesFilePath
			end repeat
		end tell
	end timeout
end tell
