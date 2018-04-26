// search.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2013
//
// Part of the arXiv-keys extension
//
// This work is licensed as Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// For full details see http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US


//////////////////////////////////////////////////////////////////////
// /search specific code
//////////////////////////////////////////////////////////////////////

// Keep the namespace clean. Nothing to export.
(function(){

var items;
var selectedItem = 0;

// See https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
function isElementInViewport (el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 && rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
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

  if (doScroll && !isElementInViewport(items[i])) {
    // The name of the anchor is item<i+1>.
    items[i].scrollIntoView({behavior: "smooth"});
  };

};

function openAbstract(inNewWin) {
  var link = $(".selected a[href*='/abs/']")[0];
  if (link)
    arXivKeys.openURL(link.href, inNewWin);
};

function openPDF(inNewWin) {
  var link = $(".selected a[href*='/pdf/']")[0];
  if (link)
    arXivKeys.openURL(link.href, inNewWin);
};

function goDown() {
  if(selectedItem < items.length-1)
    setSelected(selectedItem + 1, true);
};

function goUp() {
  if(selectedItem > 0)
    setSelected(selectedItem - 1, true);
};

////////////////////////////////////////////////////////////

  // Get the items
  items = document.getElementsByClassName("arxiv-result");

  // Install key handlers
  arXivKeys.keyMap["NEXTABS"].act  = goDown;
  arXivKeys.keyMap["PREVABS"].act  = goUp;
  arXivKeys.keyMap["OPENABS"].act  = openAbstract;
  arXivKeys.keyMap["OPENPDF"].act  = openPDF;

  // Add click handlers
  var makeSelect = function(I) {
    return function() { setSelected(I, false); };
  };

  for (var i=0; i < items.length; i++) {
    items[i].onclick = makeSelect(i);
  };

  // Make the first one be selected
  setSelected(0,false);

  //////////////////////////////////////////////////////////////////////
  // next/prev page code
  //////////////////////////////////////////////////////////////////////

  // Unfortunately, I have to get state by parsing the DOM tree.

  var prevLink = document.getElementsByClassName("pagination-previous")[0],
      nextLink = document.getElementsByClassName("pagination-next")[0];

  // If they point to self, disable prev/next
  if (!prevLink || (prevLink.href == document.location.href))
    prevLink = null;
  if (!nextLink || nextLink.href == document.location.href)
    nextLink = null;
  
  function goPrevPage() {
    arXivKeys.followLinkEl(prevLink);
  };

  function goNextPage() {
    arXivKeys.followLinkEl(nextLink);
  };

  ////////////////////////////////////////////////////////////

  // Install key handlers
  arXivKeys.keyMap["PREVPAGE"].act = goPrevPage;
  arXivKeys.keyMap["NEXTPAGE"].act = goNextPage;

}());
