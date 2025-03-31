// latexml.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2025
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
  var AbsLink = null;
  var navbarLinks = document.getElementsByClassName("html-header-nav")[1].getElementsByTagName("a");
  for (var i = 0; i < navbarLinks.length; i++) {
    if (navbarLinks[i].innerText.includes('PDF'))
      PDFLink = navbarLinks[i];
    if (navbarLinks[i].innerText.toLowerCase().includes('abstract'))
      AbsLink = navbarLinks[i];
  }

function openPDF(inNewWin) {
  if (PDFLink)
    arXivKeys.openURL(PDFLink.href, inNewWin);
};

function openAbs(inNewWin) {
  if (AbsLink)
    arXivKeys.openURL(AbsLink.href, inNewWin);
};

////////////////////////////////////////////////////////////

// Install key handlers
arXivKeys.keyMap["OPENPDF"].act  = openPDF;
arXivKeys.keyMap["OPENABS"].act  = openAbs;

}());
