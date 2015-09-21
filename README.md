# plugdj_playlist_scraper
## Bookmarklet code

    javascript:(function()%7B(function()%7Bdocument.body.appendChild(document.createElement('script')).src%3D'https%3A%2F%2Frawgit.com%nthitz%2Fplugdj_playlist_scraper%2Fmaster%2Fscraper.js'%3B%7D)()%7D)()

## Usage

* Drag the bookmarklet to your bookmark toolbar.
  * Alternatively, create a new bookmark with any name and paste the code into the "Location" box.
  * scraper is included in [http://is.gd/pluggedN](Chrome Plug plugin)
* Visit a room on https://plug.dj (for example, https://plug.dj/mashupfm).
* Click the bookmarklet to run the code.
* A textarea with the text (JSON) of all your playlists will appear. They are organized by playlist.
* Optionally, press the button to save your playlist to @nthitz's server for posterity. TBD what will happen with em. Please do. Otherwise, enter your own URL to POST the JSON to. (sent as a application/json form encoding)