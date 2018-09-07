#!/bin/bash

function generate_drive_smart_js() {
	IFS=
	echo "window.Disks.push({\"Device\": \"$1\", \"RawData\": \"" $(/usr/sbin/smartctl -i -A /dev/$1 | /bin/sed ':a;N;$!ba;s/\n/__NEWLINE__/g') "\", \"Timestamp\": \"$(date)\"});"
}

echo "window.Disks=[];"
generate_drive_smart_js sda
generate_drive_smart_js sdb
generate_drive_smart_js sdc
generate_drive_smart_js sdd
generate_drive_smart_js sde
generate_drive_smart_js sdf
