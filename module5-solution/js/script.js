$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

document.addEventListener("DOMContentLoaded", function (event) {

  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML, // Call function to handle categories
    true); // Get categories data from the server
});

function buildAndShowHomeHTML(categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      // STEP 2: Choose a random category
      var chosenCategory = chooseRandomCategory(categories);
      var chosenCategoryShortName = chosenCategory.short_name;

      // STEP 3: Substitute {{randomCategoryShortName}} with the chosen category short name
      var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");

      // STEP 4: Insert the final HTML into the main page
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false); // No need to process JSON for home snippet HTML
}

function chooseRandomCategory(categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex]; // Return the random category object
}

global.$dc = dc;

})(window);
