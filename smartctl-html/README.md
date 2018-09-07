The script [generate-drive-smart.sh(scripts/generate-drive-smart.sh)] is used to generate a JSON array of raw smartctl output. This can/should be added to crontab and output redirection to the web folder as smartctl-data.js. The HTML and JS files use this generated data to create a easy to glance list of SMART tables.

Screenshot:
![Screen shot!](https://github.com/SixZeroSevenNine/Tiny-Tools/blob/master/smartctl-html/screenshot-1.png)
