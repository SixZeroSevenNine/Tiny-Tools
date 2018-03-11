#!/bin/bash
#  
# Small script to convert .flac files to mp3 files.
# Requires flac, metaflac and lame to be installed 
# on the machine. 
#
# Parameters are source path and target path.
# Script will transfer tags and if it finds a file named
# folder.jpg, it will be added to the album metadata
# as album cover.
#
find "$1" -name *.flac -print0 | while read -d $'\0' IF
do
  OF=`echo "$IF" | sed s/\.flac$/.mp3/g | sed s,"$1","$2",g`
  echo "$IF" "->" "$OF"
  mkdir -p "${OF%/*}"

  ARTIST=`metaflac "$IF" --show-tag=ARTIST | sed s/.*=//g`
  TITLE=`metaflac "$IF" --show-tag=TITLE | sed s/.*=//g`
  ALBUM=`metaflac "$IF" --show-tag=ALBUM | sed s/.*=//g`
  GENRE=`metaflac "$IF" --show-tag=GENRE | sed s/.*=//g`
  TRACKNUMBER=`metaflac "$IF" --show-tag=TRACKNUMBER | sed s/.*=//g`
  DATE=`metaflac "$IF" --show-tag=DATE | sed s/.*=//g`
  IMAGE="${IF%/*}/folder.jpg"

  flac -c -F -d "$IF" 2> /dev/null | lame -m j -q 0 --vbr-new -V 0 --ty "$DATE" --tt "$TITLE" --ta "$ARTIST" --tl "$ALBUM" --tg "$GENRE" --tn "$TRACKNUMBER" --ti "$IMAGE" --ignore-tag-errors -s 44.1 - "$OF" 2> /dev/null
done
