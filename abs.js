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

// Keep the namespace clean. Nothing to export.
(function(){

  var PDFLink = null;
  var HTMLLink = null;
  var sidebarLinks = document.getElementsByClassName("full-text")[0].getElementsByTagName("a");
  for (var i = 0; i < sidebarLinks.length; i++) {
    if (sidebarLinks[i].accessKey == "f")
      PDFLink = sidebarLinks[i];
    if (sidebarLinks[i].id == "latexml-download-link")
      HTMLLink = sidebarLinks[i];
  }

function openPDF(inNewWin) {
  if (PDFLink)
    arXivKeys.openURL(PDFLink.href, inNewWin);
};

function openHTML(inNewWin) {
  if (HTMLLink)
    arXivKeys.openURL(HTMLLink.href, inNewWin);
};

var links = document.getElementsByClassName("prevnext")[0]
    .getElementsByTagName("a");

function getBrowseLinksKey(key) {
  for (var i = 0; i < links.length; i++)
    if (links[i].accessKey == key)
      return links[i];

  return null;
};

function goPrevPage(isShifted) {
  arXivKeys.followLinkEl(getBrowseLinksKey('p'));
};

function goNextPage(isShifted) {
  arXivKeys.followLinkEl(getBrowseLinksKey('n'));
};

////////////////////////////////////////////////////////////

// Install key handlers
arXivKeys.keyMap["OPENPDF"].act  = openPDF;
arXivKeys.keyMap["OPENHTML"].act  = openHTML;
arXivKeys.keyMap["PREVPAGE"].act = goPrevPage;
arXivKeys.keyMap["NEXTPAGE"].act = goNextPage;

}());
