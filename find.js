// find.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2013
//
// Part of the arXiv-keys extension
//
// This work is licensed as Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// For full details see http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US


//////////////////////////////////////////////////////////////////////
// /find/ specific code
//////////////////////////////////////////////////////////////////////

// Keep the namespace clean. Nothing to export.
(function(){

// Unfortunately, I have to get state by parsing the DOM tree.
// dlpage is non-null if we have a list of results
var dlpage   = document.getElementById("dlpage");
var prevLink = null, nextLink = null;

if (dlpage === null)
{
  // Nothing to do
}
else
{
  // There are four options:
  // 1. All the results are on one page, no next link, no prev link.
  // 2. We have both a next link and a prev link.
  // 3. We have only a next link.
  // 4. We have only a prev link.
  
  if (dlpage.children[1].tagName != "A") // only one page
  {
    // Nothing to do
  }
  else if (dlpage.children[2].tagName == "A") // have both next and prev
  {
    prevLink = dlpage.children[1];
    nextLink = dlpage.children[2];
  }
  else if (dlpage.children[1].innerText.indexOf("Next") == 0) // only one link, it's Next
  {
    nextLink = dlpage.children[1];
  }
  else // only one link, it's Prev
  {
    prevLink = dlpage.children[1];
  };

};

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
