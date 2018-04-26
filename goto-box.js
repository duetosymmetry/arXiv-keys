// goto-box.js
// (C) Leo C. Stein (leo.stein@gmail.com)
// 2013 May
//
// Part of the arXiv-keys extension
//
// This work is licensed as Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// For full details see http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US

// Module export gotoBox
// exports:
//   function showGotoBox()
var gotoBox = (function($){

  var my = {};

////////////////////////////////////////////////////////////

var gotoBox, gotoInput;

function gotoCompletions( request, response ) {

  // Approach: If the request has no '/' character in it, then match it against a category.
  // If it does have a '/' character, then:
  //   if the part before the '/' is a valid category,
  //   then match against <cat>/new, <cat>/recent, <cat>/current

  var slashInd = request.term.indexOf('/');
  var hasSlash = (slashInd != -1);

  if (!hasSlash) {
    var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
    response( $.grep( categories, function( item ){
      return matcher.test( item );
    }) );
  } else {
    var cat = request.term.substring(0,slashInd);
    if ($.inArray(cat, categories) != -1) { // It is a valid category
      var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
      response( $.grep( catEndings(cat), function( item ){
        return matcher.test( item );
      }) );
    } else { // invalid category
      response();
    };
  };
};

// Returns a category with the possible endings
function catEndings(cat) {
  return [ cat + '/new',
           cat + '/recent',
           cat + '/current' ];
};

function gotoKeyDown(event) {

  var menuOpen = gotoInput.autocomplete( "widget" ).is(":visible");

  // Don't do anything if the menu is open and there is an item selected
  if (menuOpen && ($(".ui-state-focus").length != 0))
    return;

  if ((event.keyCode == 27) && !menuOpen) { // ESC
    hideGotoBox();
  } else if (event.keyCode == 13) { // ENTER
    gotoTryNavigate();
  };

  return;

};

my.showGotoBox =
function showGotoBox() {
  $("#gotoError").hide();
  gotoInput.val("");
  gotoBox.style.display = "block";
  gotoInput[0].focus();
};

function hideGotoBox() {
  gotoBox.style.display = "none";
  gotoInput[0].blur();
  document.body.focus();
};

function gotoTryNavigate() {
  if (isGotoInputValid()) {

    var splitInput = gotoInput.val().split("/");

    // If there is no slash, or there is nothing after the slash, go to /new
    if ((splitInput.length == 1) ||
        ((splitInput.length == 2) && (splitInput[1] == "")))
      splitInput = [ splitInput[0], "new" ];

    window.location = "/list/" + splitInput[0] + "/" + splitInput[1];

  } else {
    $("#gotoError").show();
  };
};

function isGotoInputValid() {
  // The gotoInput must either be the name of a category, or
  // <cat>/, <cat>/new, <cat>/recent, or <cat>/current

  var splitInput = gotoInput.val().split("/");

  if (splitInput.length > 2 || splitInput.length == 0)
    return false;

  if ($.inArray(splitInput[0], categories) == -1)
    return false;

  if (splitInput.length == 1)
    return true;

  // Only get here if splitInput.length == 2 and splitInput[0] is a valid cat
  return (splitInput[1] == '') || (splitInput[1] == 'new')
         || (splitInput[1] == 'recent') || (splitInput[1] == 'current');

};

////////////////////////////////////////////////////////////
// install goto box
////////////////////////////////////////////////////////////

  gotoBox = document.createElement("div");
  gotoBox.id = "gotoBox";

  var innerHTML = '\
<label for="gotoInput">\
Type a category to go to, optionally followed by /new, /recent, or /current.<br>\
</label>\
<input id="gotoInput"/>\
<div id="gotoError">\
Invalid category!\
</div>';

  gotoBox.innerHTML = innerHTML;

  // Initially hidden
  gotoBox.style.display = "none";

  // Insert it into the document
  document.body.appendChild(gotoBox);

  gotoInput = $("#gotoInput");

  // Note: it is important that this is registered first,
  // so that gotoKeyDown can tell if the menu is open
  // *before* the autocomplete widget hides it.
  gotoInput.on("keydown", gotoKeyDown);

  // Use jQuery autocomplete widget
  gotoInput.autocomplete({
    source: gotoCompletions
  });

////////////////////////////////////////////////////////////

  // export module definitions
  return my;

}(jQuery));
