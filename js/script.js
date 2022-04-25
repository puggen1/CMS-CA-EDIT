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

//showing unfiltered content on load
document.querySelector("body").onload = startProcess();

//declaring buttons and adding functionality
let buttons = document.querySelectorAll("button");
for (let button of buttons) {
  button.addEventListener("click", function () {
    createContent(event.target.id);
    isPressed(event.target.id);
  });
}
//getting info icon and info text
let infoIcon = document.querySelector("#infoIcon");
let infoText = document.querySelector("#info");
infoIcon.addEventListener("click", function () {
  infoText.classList.toggle("hiddenMobile");
});
/**
 * universal function to fetch
 */
async function fetchApi(api) {
  try {
    let response = await fetch(api);
    if (response.ok) {
      return await response.json();
    } else {
      alert(
        response.status +
          " failed fetch, please try again or contact site owners"
      );
      document.getElementById("content").innerHTML =
        "<p style='text-align: center; max-width: 100%;'>Error please try again</p>";
    }
  } catch (error) {
    alert(error + "  please try again");

    document.getElementById("content").innerHTML =
      "<p style='text-align: center; max-width: 100%;'>Error please try again</p>";
  }
}
/**
 * function to start process and make api calls
 */
async function startProcess() {
  tag = await fetchApi(tagsUrl);
  posts = await fetchApi(postsUrl);
  category = await fetchApi(categoryUrl);
  for (let button of buttons) {
    button.removeAttribute("disabled");
  }
  displayContent(category, posts);
}
/**
 * Makes buttons work visually
 */
function isPressed() {
  // Fixes show all button
  if (event.target.name == "visAlt") {
    for (let button of buttons) {
      let list = button.classList;
      if (!mainFilterTags.includes(button.id)) {
        list.toggle("hidden");
      } else {
        list.remove("pressed");
      }
    }
  }
  // Shows secondary buttons
  if (mainFilterTags.includes(event.target.id)) {
    event.target.classList.toggle("pressed");
    for (let button of buttons) {
      let list = button.classList;
      if (list == "hidden") {
        list.toggle("hidden");
      }
      // Makes primary buttons show and hide secondary buttons
      if (
        event.target.classList[0] !== "pressed" &&
        !mainFilterTags.includes(button.id)
      ) {
        button.classList.toggle("hidden");

        // deselects primary buttons
      }
      if (
        event.target.classList[0] == "pressed" &&
        mainFilterTags.includes(button.id) &&
        button.id != event.target.id
      ) {
        button.classList.remove("pressed");
        for (let button of buttons) {
          if (
            !mainFilterTags.includes(button.id) &&
            event.target.classList[0] == "pressed"
          ) {
            button.classList.remove("pressed");
          }
        }
      }
    }
  } else {
    // makes show all reset all presses
    if (event.target.name == "visAlt") {
      for (let button of buttons) {
        button.classList.remove("pressed");
      }
    }
    // removes pressed from other filter if new one is pressed
    else if (event.target.classList != "pressed") {
      for (let button of buttons) {
        if (!mainFilterTags.includes(button.id)) {
          button.classList.remove("pressed");
        }
      }
      // makes button pressed if second filter
      event.target.classList = "pressed";
    }
    // removes pressed if pressed again
    else {
      event.target.classList.remove("pressed");
      createContent(currentMainFilter);
    }
  }
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
  if (!filter || currentMainFilter == event.target.id) {
    processedPosts = posts;
    currentMainFilter = "";
    for (let button of buttons) {
      if (!mainFilterTags.includes(button.id)) {
        button.classList.remove("pressed");
      }
    }

    console.log("Filteret er resettet!");
  }
  // checks if the new filter pressed is one of the main filters
  else if (mainFilterTags.includes(filter)) {
    processedPosts = posts.filter(filterEvents, filter);
    currentMainFilter = filter;
    console.log(currentMainFilter + " er satt som filter");
    // makes secondary filters work
  } else {
    processedPosts = posts.filter(filterEvents, currentMainFilter);
    processedPosts = processedPosts.filter(filterEvents, filter);
    console.log(filter + " er satt som andre filter");
  }
  displayContent(category, processedPosts);
}

/**
 * Function that generates html
 */
async function displayContent(processedCategories, processedPosts) {
  let result = "";
  let eachMonth = "";
  let quarter = "";
  let sortedMonths = await sortMonths(processedCategories);
  // loops through all months
  for (let months of sortedMonths) {
    if (months.slug <= 3) {
      quarter = "qOne";
    } else if (months.slug <= 6) {
      quarter = "qTwo";
    } else if (months.slug <= 9) {
      quarter = "qThree";
    } else {
      quarter = "qFour";
    }
    eachMonth += `</div> <div class="month" id="${months.name}"> <section class="bottom"><div class="circle ${quarter}"> <h2> ${months.name} </h2> </div></section><div class="event">`;
    // loops through all posts for x month
    for (let i = 0; i < processedPosts.length; i++) {
      if (processedPosts[i].categories[0] == months.id) {
        eachMonth += `<p>  ${processedPosts[i].title.rendered} </p>`;
      }
    }
    // wipes months with no events
    if (!eachMonth.includes("<p>")) {
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
