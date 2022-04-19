console.log("hello from fetchApi");
let categoryUrl =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/categories";
let postsUrl =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/posts?per_page=25";
let tagsUrl =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/tags?per_page=25";
let eventDiv = document.querySelector(".events");
tag = [];
post = [];
category = [];
let studBtn = document.querySelector("#student");
let laererBtn = document.querySelector("#laerer");
let styretBtn = document.querySelector("#styret");
document.querySelector("body").onload = startProcess();

studBtn.addEventListener("click", function () {
  filterTest()
});
laererBtn.addEventListener("click", function () {
  filterTest()
});
styretBtn.addEventListener("click", function () {
  filterTest()
});


//universal function to fetch
async function fetchApi(api) {
  try {
    let response = await fetch(api);

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function startProcess(filter = "all") {
  tag = await fetchApi(tagsUrl);
  posts = await fetchApi(postsUrl);
  category = await fetchApi(categoryUrl);
  if (filter === "all") {
    createContent();
  }
  else {
    createContent(filter)
  }
}

function filterTest() {
  startProcess(event.target.id);

} 
function filterEvents(events) {
  for(let listTags of events.tags){
    for(let i = 0; i < tag.length; i++){
      if(listTags === tag[i].id && tag[i].name == this){
        return true;
  }
}
  }
}
  
  
    

//shows data but not in right , maybe need to fix months api
async function createContent(filter) {
  if (!filter) {
    displayContent(category, posts)
  }
  else {
    let processedPosts = posts.filter(filterEvents, filter);
    displayContent(category, processedPosts)
  }
  
}
async function displayContent(processedCategories, processedPosts){
  let result = "";
  let eachMonth = "";
  let sortedMonths = await sortMonths(processedCategories);
  for (let months of sortedMonths) {
    eachMonth += `</div><div id="${months.name}"><h2> ${months.name} </h2>`; // spør lasse om dette
    for (let i = 0; i < processedPosts.length; i++) {
      if (processedPosts[i].categories[0] == months.id) {
        eachMonth += `<p> ${processedPosts[i].title.rendered} </p>`;
      } else {
        continue;
      }

      result += eachMonth;
      //remove data for next loop
      eachMonth = "";
    }
  }
  eventDiv.innerHTML = result;
}


async function tagHandler(tags) {
  tag = await fetchApi(tags);
  console.log(tag);
  return tag;
}




// quick function to sort months
async function sortMonths() {
  let monthsSorted = category.sort(function (a, b) {
    return a.slug - b.slug;
  });
  return monthsSorted;
}
