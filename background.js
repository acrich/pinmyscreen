chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.getCurrent(function (win) {
    chrome.tabs.captureVisibleTab(win.id, {"format":"png"}, function(img) {
      var data = "img="+img;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://www.computedscience.com/assets/processImage.php", true);

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange=function() {
        if (xhr.readyState==4 && xhr.status==200) {
          var href = 'http://pinterest.com/pin/create/button/?url=';
          href += tab.url;
          href += '&media=';
          href += xhr.responseText;
          href += '&description='+tab.title;

          chrome.windows.create({'url': href, 'type': 'popup', 'height': 260, 'width': 600}, function(popup) {
            chrome.windows.onRemoved.addListener(function(windowId) {
              if (windowId == popup.id) {
                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST", "http://www.computedscience.com/assets/closeImage.php", true);
                xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr2.send("img="+xhr.responseText);
              }
            });
          });
        }
      }
      xhr.send(data);
    });
  });

});
