// arXiv-keys.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2013 May
//
// Part of the arXiv-keys extension
//
// This work is licensed as Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// For full details see http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US


// Determine mode and install appropriate hooks
// This is run when the script starts (see bottom of script)
function startMode() {

  installSiteWide();

  if (document.getElementById("abs")!=null) {
    installAbsMode();
  } else if (document.getElementById("dlpage")!=null) {
    installListMode();
  };

};

function installSiteWide() {

  // Install key handlers
  // This will be overridden in Abs and List modes
  document.body.onkeypress = siteKeyHandler;

  // Install key help box
  installKeyHelp();

  // Install goto box
  installGotoBox();

};

// Construct a key entry object, used both for testing keys
// and for displaying help. The first character of displayChar
// will match for keypress.
function kEnt(displayChar, description) {
  this.match = function(c){ return c.toLowerCase() == displayChar[0].toLowerCase(); };
  this.displayChar = displayChar;
  this.description = description;
  this.rowEntry = function(){ return "<tr><td>" + displayChar + "</td><td>" + description + "</td></tr>"; };
};

var keyMap = {
  HELP:     new kEnt("?","Show/hide this help box"),
  SEARCH:   new kEnt("/","Focus the search box"),
  GOTO:     new kEnt("g","Go to category&hellip;"),
  USERPAGE: new kEnt("u","Go to user page"),
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
  for (var key in keyMap)
    innerHTML += keyMap[key].rowEntry();
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

  var c = String.fromCharCode(event.keyCode);

  // Toggle help box
  if (keyMap["HELP"].match(c))
    toggleHelpBox();

  // Show goto box
  if (keyMap["GOTO"].match(c)) {
    showGotoBox();
    // Have to stop the event from propagating now
    event.preventDefault();
    event.stopPropagation;
    return false;
  };

  // Focus search box.
  if (keyMap["SEARCH"].match(c)) {
    focusSearch();
    // Have to stop the event from propagating now
    event.preventDefault();
    event.stopPropagation;
    return false;
  };

  // Go to user page
  if (keyMap["USERPAGE"].match(c))
    goUserPage();

  return;

};

function toggleElement(idStr) {
  var el = document.getElementById(idStr);

  if (el.style.display == "none")
    el.style.display = "block";
  else el.style.display = "none";
};

function toggleHelpBox() {
  toggleElement("helpBox");
};
function focusSearch() {
  document.getElementsByName("query")[0].focus();
};

function goUserPage() {
  window.location = "/user/";
};

//////////////////////////////////////////////////////////////////////
// Abs mode
//////////////////////////////////////////////////////////////////////

function installAbsMode() {

  // Install key handlers
  document.body.onkeypress = absKeyHandler;

};

function absKeyHandler(event) {
  // Don't do anything when focus is on a field
  // This might be a hack.
  if(ignoreKeyboard(event.target))
    return;

  var c = String.fromCharCode(event.keyCode);

  // Open PDF
  if (keyMap["OPENPDF"].match(c))
    absOpenPDF(event.shiftKey);

  // Browse prev/next keys
  if (keyMap["PREVPAGE"].match(c))
    absGoPrevPage();
  if (keyMap["NEXTPAGE"].match(c))
    absGoNextPage();

  // Sitewide
  return siteKeyHandler(event);

};

function absGetPDFLink() {
  var sidebarLinks = document.getElementsByClassName("full-text")[0].getElementsByTagName("a");
  for (var i = 0; i < sidebarLinks.length; i++)
    if (sidebarLinks[i].accessKey == "f")
      return sidebarLinks[i];

  return null;
};

function absOpenPDF(inNewWin) {
  var PDFLink = absGetPDFLink();
  if (PDFLink)
    openURL(PDFLink.href, inNewWin);
};

function openURL(url, inNewWin) {
  if(inNewWin) {
    var newWin = window.open(url, '_blank');
    newWin.blur();
    window.focus();
  } else window.location = url;
};

function followLinkEl(el) {
  if (el)
    el.click();
};

function browseLinks() {
  return document.getElementsByClassName("prevnext")[0].getElementsByTagName("a");
};

function getBrowseLinksKey(key) {
  var links = browseLinks();
  for (var i = 0; i < links.length; i++)
    if (links[i].accessKey == key)
      return links[i];

  return null;
};

function absGoPrevPage() {
  followLinkEl(getBrowseLinksKey('p'));
};

function absGoNextPage() {
  followLinkEl(getBrowseLinksKey('n'));
};

//////////////////////////////////////////////////////////////////////
// List mode
//////////////////////////////////////////////////////////////////////

var items;
var selectedItem = 0;
function installListMode() {

  // Get the items
  items = document.getElementsByClassName("meta");

  // Install key handlers
  document.body.onkeypress = listKeyHandler;

  // Make the first one be selected
  setSelected(0,false);
};

function setSelected(i, doScroll) {
  if ((i<0) || (i>= items.length))
    return;

  // Clear anything else that's selected
  var prevSelected = document.getElementsByClassName("selected");
  for (var k=0; k<prevSelected.length; k++) {
    var thisItem = prevSelected[k];
    thisItem.className = thisItem.className.replace
      ( /(?:^|\s)selected(?!\S)/g , '' );
  };

  // Set the new one
  items[i].className += " selected";
  selectedItem = i;

  if (doScroll) {
    // The name of the anchor is item<i+1>.
    items[i].scrollIntoViewIfNeeded();
  };

};

function listKeyHandler(event) {
  // Don't do anything when focus is on a field
  // This might be a hack.
  if(ignoreKeyboard(event.target))
    return;

  var c = String.fromCharCode(event.keyCode);

  // Opening abstract/PDF
  if (keyMap["OPENABS"].match(c))
    listOpenAbstract(event.shiftKey);
  if (keyMap["OPENPDF"].match(c))
    listOpenPDF(event.shiftKey);

  // Nav keys
  if (keyMap["NEXTABS"].match(c))
    goDown();
  if (keyMap["PREVABS"].match(c))
    goUp();
  if (keyMap["PREVPAGE"].match(c))
    listGoPrevPage();
  if (keyMap["NEXTPAGE"].match(c))
    listGoNextPage();

  // Sitewide
  return siteKeyHandler(event);
};

function getSelectedLinks() {
  var theItems = document.getElementsByName("item" + (selectedItem+1));
  if (theItems.length > 0)
    return theItems[0].parentNode.getElementsByTagName("a");
  else return [];
};

function getSelLinkTitle(title) {
  var links = getSelectedLinks();
  for (var i = 0; i < links.length; i++)
    if (links[i].title == title)
      return links[i];

  return null;
};

function listOpenTitleLink(title,inNewWin) {
  var link = getSelLinkTitle(title);
  if (link)
    openURL(link.href, inNewWin);
};

function listOpenAbstract(inNewWin) {
  listOpenTitleLink("Abstract",inNewWin);
};

function listOpenPDF(inNewWin) {
  listOpenTitleLink("Download PDF",inNewWin);
};

function goDown() {
  if(selectedItem < items.length-1)
    setSelected(selectedItem + 1, true);
};

function goUp() {
  if(selectedItem > 0)
    setSelected(selectedItem - 1, true);
};

function curPageElement() {
  return document.getElementsByTagName("small")[0]
    .getElementsByTagName("b")[0];
};

function prevPageElement() {
  return curPageElement().previousElementSibling;
};

function nextPageElement() {
  return curPageElement().nextElementSibling;
};

function listGoPrevPage() {
  followLinkEl(prevPageElement());
};

function listGoNextPage() {
  followLinkEl(nextPageElement());
};

//////////////////////////////////////////////////////////////////////
// Run the thing.
//////////////////////////////////////////////////////////////////////

startMode();
