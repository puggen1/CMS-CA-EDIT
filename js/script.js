console.log("hello from fetchApi");

//declaring api's
let categoryUrl =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/categories?per_page=50";
let postsUrl =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/posts?per_page=50";
let tagsUrl =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/tags?per_page=50";
//declaring global values
let eventDiv = document.querySelector(".events");
let tag = [];
let post = [];
let letcategory = [];
let processedPosts = "";
//for easier second hand filter, tbc
let currentMainFilter = "";
let mainFilterTags = ["student", "laerer", "styret"];

//declaring buttons and adding functionality
let buttons = document.querySelectorAll("button");
for (let button of buttons) {
  button.addEventListener("click", function () {
    createContent(event.target.id);
  });
}

//showing unfiltered content on load
document.querySelector("body").onload = startProcess();

/**
 * universal function to fetch
 */
async function fetchApi(api) {
  try {
    let response = await fetch(api);

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

/**
 * function to start process and make api calls
 */
async function startProcess() {
  tag = await fetchApi(tagsUrl);
  posts = await fetchApi(postsUrl);
  category = await fetchApi(categoryUrl);
  displayContent(category, posts);
}

/**
 * filtering function
 */
function filterEvents(events) {
  for (let listTags of events.tags) {
    for (let i = 0; i < tag.length; i++) {
      if (listTags === tag[i].id && tag[i].name == this) {
        return true;
      }
    }
  }
}

/**
 * Function to process data for chosen filter
 */
async function createContent(filter) {
  // checks for no filter/reset button
  if (!filter) {
    processedPosts = posts;
    currentMainFilter = "";
    console.log(currentMainFilter + "Filteret er resettet!");
  }
  // checks if a filter is already in use
  else if (!processedPosts) {
    processedPosts = posts.filter(filterEvents, filter);
    currentMainFilter = filter;
    console.log(currentMainFilter + " er satt som filter");
    // checks if the new filter pressed is one of the main filters
  } else if (mainFilterTags.includes(filter)) {
    processedPosts = posts.filter(filterEvents, filter);
    currentMainFilter = filter;
    console.log(currentMainFilter + " er satt som filter");
  } else if (currentMainFilter != "") {
    processedPosts = posts.filter(filterEvents, currentMainFilter);
    processedPosts = processedPosts.filter(filterEvents, filter);
  }
  // makes secondary filters work with primary filters
  else {
    processedPosts = processedPosts.filter(filterEvents, filter);
  }
  displayContent(category, processedPosts);
}

/**
 * Function that generates html
 */
async function displayContent(processedCategories, processedPosts) {
  let result = "";
  let eachMonth = "";
  let sortedMonths = await sortMonths(processedCategories);
  // loops through all months
  for (let months of sortedMonths) {
    eachMonth += `</div> <div class="month" id="${months.name}"> <section class="bottom"><div class="circle"> <h2> ${months.name} </h2> </div></section><div class="event">`;
    // loops through all posts for x month
    for (let i = 0; i < processedPosts.length; i++) {
      if (processedPosts[i].categories[0] == months.id) {
        eachMonth += `<p>  ${processedPosts[i].title.rendered} </p>`;
      }
    }
    // wipes months with no events
    if (!eachMonth.includes("<p>")) {
      //console.log("wiped " + months.name);
      eachMonth = "";
    }
    // pushes out html and gets loop ready for next month
    eachMonth += "</div>";
    result += eachMonth;
    eventDiv.innerHTML = result;
    eachMonth = "";
  }
}

/**
 * Sorting function for months
 */
async function sortMonths() {
  let monthsSorted = category.sort(function (a, b) {
    return a.slug - b.slug;
  });
  return monthsSorted;
}
