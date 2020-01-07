// arXiv-keys.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2013
//
// Part of the arXiv-keys extension
//
// This work is licensed as Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// For full details see http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US

// Module export arXivKeys
// exports:
//   var keyMap
//   function openURL(url, inNewWin)
//   function followLinkEl(el)
var arXivKeys = (function($){

  var my = {};

// Construct a key entry object, used both for testing keys
// and for displaying help. The first character of displayChar
// will match for keypress.
// The function act is called if a key is pressed. This is set
// here and in abs.js, list.js
function kEnt(displayChar, description, act) {
  this.match = function(c){ return c.toLowerCase() == displayChar[0].toLowerCase(); };
  this.displayChar = displayChar;
  this.description = description;
  this.rowEntry = function(){ return "<tr><td>" + displayChar + "</td><td>" + description + "</td></tr>"; };
  this.act = typeof act !== 'undefined' ? act :
             function( isShifted ){ return true; };
};

my.keyMap = {
  HELP:     new kEnt("?","Show/hide this help box", toggleHelpBox),
  SEARCH:   new kEnt("/","Focus the search box",    focusSearch),
  GOTO:     new kEnt("g","Go to category&hellip;",  gotoBox.showGotoBox),
  USERPAGE: new kEnt("u","Go to user page",         goUserPage),
  NEXTABS:  new kEnt("j","List page: Next abstract"),
  PREVABS:  new kEnt("k","List page: Previous abstract"),
  OPENABS:  new kEnt("a/A","List page: Open abstract in current/new window"),
  OPENPDF:  new kEnt("p/P","Open PDF in current/new window"),
  PREVPAGE: new kEnt("[","List page: Previous abstracts page<br>Abstract page: Browse previous"),
  NEXTPAGE: new kEnt("]","List page: Next abstracts page<br>Abstract page: Browse next")
};

function installKeyHelp() {

  // HTML for help box
  var helpBox = document.createElement("div");
  helpBox.id = "helpBox";

  var innerHTML = "<table><thead><tr><th>Key</th><th>Function</th></tr></thead><tbody>";
  for (var key in my.keyMap)
    innerHTML += my.keyMap[key].rowEntry();
  innerHTML += "</tbody></table>";
  helpBox.innerHTML = innerHTML;

  // Initially hidden
  helpBox.style.display = "none";

  // Insert it into the document!
  document.body.appendChild(helpBox);

};

function ignoreKeyboard(tag) {
  switch (tag.tagName.toLowerCase()) {
  case "select":
  case "input":
  case "textarea":
    return true;
  default:
    return false;
  };

};

function siteKeyHandler(event) {
  // Don't do anything when focus is on a field
  // This might be a hack.
  if(ignoreKeyboard(event.target))
    return;

  var c = event.key;
  var isShifted = event.shiftKey;

  // Step through the key map and find a match
  for (var k in my.keyMap) {
    if (my.keyMap[k].match(c)) {
      my.keyMap[k].act(isShifted);
      // Have to stop the event from propagating now
      event.preventDefault();
      event.stopPropagation;
      return false;
    };
  };

  // No match!
  return;

};

my.openURL =
function openURL(url, inNewWin) {
  if(inNewWin) {
    // In Chrome 44, window.open started creating a new
    // window instead of new tab.
    // See crbug 506638, https://code.google.com/p/chromium/issues/detail?id=506638
    // which is marked as WontFix
    // This is a workaround
    var e = document.createElement("a");
    e.href = url; e.target = "_blank";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
    window.focus();
  } else window.location = url;
};

function toggleElement(idStr) {
  var el = document.getElementById(idStr);

  if (el.style.display == "none")
    el.style.display = "block";
  else el.style.display = "none";
};

function toggleHelpBox(isShifted) {
  toggleElement("helpBox");
};

function focusSearch(isShifted) {
  document.getElementsByName("query")[0].focus();
};

function goUserPage(isShifted) {
  window.location = "/user/";
};

my.followLinkEl =
function followLinkEl(el) {
  if (el)
    el.click();
};

//////////////////////////////////////////////////////////////////////
// For sessionStorage stuff
//////////////////////////////////////////////////////////////////////

// This is for sessionStorage access
my.selectedKey = 'AK.selectedItem-' + location.pathname + location.search;

my.setSessionSelected = function setSessionSelected(i) {
  sessionStorage.setItem(my.selectedKey, i);
};

// This defaults to 0 if not found in sessionStorage
my.getSessionSelected = function getSessionSelected() {
  var savedValue = sessionStorage.getItem(my.selectedKey);
  return savedValue ? Number(savedValue) : 0;
};

//////////////////////////////////////////////////////////////////////
// Install
//////////////////////////////////////////////////////////////////////

  // Install key help box
  installKeyHelp();

  // Install key handlers
  // This will be overridden in Abs and List modes
  document.body.onkeypress = siteKeyHandler;

////////////////////////////////////////////////////////////

  // export module definitions
  return my;

}(jQuery));
