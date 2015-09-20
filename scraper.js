(function () {
  var statusDOM = null;
  function injectJqueryAndRun() {
    // the minimum version of jQuery we want
    var v = "1.3.2";

    // check prior inclusion and version
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
      var done = false;
      var script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
          done = true;
          scrape();
        }
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    } else {
      scrape();
    }
  }
  function addStatusDOM() {
    if ($('#scraped_playlists_window').length > 0) {
      statusDOM = $('#scraped_status')
      return
    }
    $("body").append(
      "<div id='scraped_playlists_window'>" +
      "<div id='scraped_playlists' style=''>" +
      "<textarea id='scraped_status' rows='20' cols='50'>initalizing</textarea>" +
      "</div>" +
      "<style type='text/css'>" +
      "#scraped_playlists { padding: 2em; position: fixed; width: 400px; height: 200; top: 2em; left: 2em; background-color: rgba(255,255,255, 0.3); cursor: pointer; z-index: 900; }" +
      "#scraped_playlists textarea { color: black; font-family: monospace; }" +
      "</style>" +
      "</div>")
    statusDOM = $('#scraped_status')
  }

  function scrape() {
    addStatusDOM()
    $.ajax('https://plug.dj/_/playlists', {
      dataType: 'json',
    }).done(function(data) {
      var playlists = data.data;
      scrapePlaylist(playlists)
    })
  }
  function updateStatus(text) {
    statusDOM.text(text)
  }
  var scrapedLists = []
  function scrapePlaylist(playlists) {
    var playlist = playlists.shift()
    updateStatus('scraping ' + playlist.name)
    $.ajax('https://plug.dj/_/playlists/' + playlist.id + '/media', {
      datatype: 'json',
    }).done(function(data) {
      playlist.songs = data
      scrapedLists.push(playlist)

      if (playlists.length > 0) {
        setTimeout(function() {
          scrapePlaylist(playlists)
        }, 750)
      } else {
        end()
      }
    })

  }
  function end() {
    console.log(scrapedLists)
    updateStatus(JSON.stringify(
      scrapedLists, null, 2
    ))
  }

  injectJqueryAndRun();



})();

/*

var playlistJson = JSON.stringify({ playlist }, null, 4);

$("body").append(`
<div id='scraped_playlists_window'>
<div id='scraped_playlists' style=''>
<textarea name="scraped_playlists_textarea" rows="20" cols="50">` + playlistJson + `</textarea>
</div>
<style type='text/css'>
#scraped_playlists { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255); cursor: pointer; z-index: 900; }
#scraped_playlists textarea { color: black; sans-serif; position: absolute; top: 10%; left: 10%; }
</style>
</div>`
);

$("#scraped_playlists").fadeIn(750);
*/
