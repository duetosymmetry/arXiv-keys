// abs.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2013
//
// Part of the arXiv-keys extension
//
// This work is licensed as Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// For full details see http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US

//////////////////////////////////////////////////////////////////////
// /abs/ pages
//////////////////////////////////////////////////////////////////////

function getPDFLink() {
  var sidebarLinks = document.getElementsByClassName("full-text")[0].getElementsByTagName("a");
  for (var i = 0; i < sidebarLinks.length; i++)
    if (sidebarLinks[i].accessKey == "f")
      return sidebarLinks[i];

  return null;
};

function openPDF(inNewWin) {
  var PDFLink = getPDFLink();
  if (PDFLink)
    openURL(PDFLink.href, inNewWin);
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

function goPrevPage(isShifted) {
  followLinkEl(getBrowseLinksKey('p'));
};

function goNextPage(isShifted) {
  followLinkEl(getBrowseLinksKey('n'));
};

////////////////////////////////////////////////////////////

// Install key handlers
keyMap["OPENPDF"].act  = openPDF;
keyMap["PREVPAGE"].act = goPrevPage;
keyMap["NEXTPAGE"].act = goNextPage;
