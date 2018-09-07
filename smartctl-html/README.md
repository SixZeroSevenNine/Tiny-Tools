The script [generate-drive-smart.sh(scripts/generate-drive-smart.sh)] is used to generate a JSON array of raw smartctl output. This can/should be added to crontab and output redirection to the web folder as smartctl-data.js. The HTML and JS files use this generated data to create a easy to glance list of SMART tables. Webserver should be configured to set cache headers to prevent caching. Example for Apache 2:

```
<FilesMatch "\.(html|htm|js|css|json)$">
  FileETag None

  <IfModule mod_headers.c>
    Header unset ETag
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
  </IfModule>
</FilesMatch>
```

Screenshot:
![Screen shot!](https://github.com/SixZeroSevenNine/Tiny-Tools/blob/master/smartctl-html/screenshot-1.png)
