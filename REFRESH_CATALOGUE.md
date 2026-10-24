# Refreshing the Vrark Art catalogue

1. Put the Google Drive OAuth desktop-client file in this folder and name it `credentials.json`.
2. Install the dependencies once:

   `py -m pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib`

3. Double-click `refresh_drive_catalogue.bat`.

The script rebuilds `drive-catalogue.js`, `drive-contributors.js`, `drive-dates.js`, `static-catalogue.js`, and `gump-catalogue.js`. Deleted Drive files disappear from the page, newly uploaded files are added on the next refresh, and the `Sliced art` branch is intentionally excluded.
