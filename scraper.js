(function () {
  var statusDOM = null;
  var API_DELAY = 5000;
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
      "<div id='scraped_playlists_close'>&times;</div>"+
      "<div id='scraped_playlists' style=''>" +
      "<textarea id='scraped_status' rows='20' cols='50'>initalizing</textarea>" +
      "<div id='scraped_playlists_submit'><input type='button' value='POST to:' id='scraped_playlists_post_button'/>" +
      "<input type='text' value='http://ks3278471.kimsufi.com:8765/archive' id='scraped_playlists_post_url' />" +
      "<br /> PLEASE CONSIDER CLICKING ABOVE BUTTON TO SAVE YOUR DATA TO MY SERVER</div></div>" +
      "<br /><br />CHROME WILL BLOCK non Secure connections. Click the Sheild in the URL bar to allow nonsecure content temporarily. This will refresh the page then run script again and POST." +
      "<style type='text/css'>" +
      "#scraped_playlists_window { padding: 2em; position: fixed; width: 400px; height: 300px; top: 100px; left: 300px; background-color: rgba(255,255,255, 0.3); cursor: pointer; z-index: 900; }" +
      "#scraped_playlists textarea { color: black; font-family: monospace; }" +
      "#scraped_playlists_submit { display: none; }" +
      "#scraped_playlists_post_url { width: 300px; }" +
      "#scraped_playlists_close { position: absolute; top: 0; right: 0; padding: 0 0.5em; font-size: 36px; cursor: pointer; }" +
      "</style>" +
      "</div>")
    statusDOM = $('#scraped_status')
    $('#scraped_playlists_close').on('click', close)
  }

  function close() {
    $('#scraped_playlists_window').remove()
  }
  var totalCount = 0;
  function scrape() {
    addStatusDOM()
    $.ajax('https://plug.dj/_/playlists', {
      dataType: 'json',
    }).done(function(data) {
      var playlists = data.data;
      totalCount = playlists.length
      setTimeout(function() {
        scrapePlaylist(playlists)
      }, API_DELAY)
    })
  }
  function updateStatus(text) {
    statusDOM.text(text)
  }
  var scrapedLists = []
  function scrapePlaylist(playlists) {
    var playlist = playlists.shift()
    updateStatus('scraping ' + playlist.name + ' (' + (scrapedLists.length + 1) + ' of ' + totalCount + ')')
    $.ajax('https://plug.dj/_/playlists/' + playlist.id + '/media', {
      datatype: 'json',
    }).done(function(data) {
      playlist.songs = data
      scrapedLists.push(playlist)

      if (playlists.length > 0) {
        setTimeout(function() {
          scrapePlaylist(playlists)
        }, API_DELAY)
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
    $('#scraped_playlists_submit').css('display', 'block')
    $('#scraped_playlists_post_button').on('click', post)
  }
  function post() {
    $('#scraped_playlists_submit').css('display', 'none')
    var postData = {
      username: API.getUser().username,
      room: $('#room-name .bar-value').text(),
      playlists: scrapedLists
    }
    var POST_URL = $('#scraped_playlists_post_url').val()
    $.ajax(POST_URL, {
      method: 'POST',
      data: JSON.stringify(postData),
      contentType: 'application/json'
    })
  }

  injectJqueryAndRun();



})();
