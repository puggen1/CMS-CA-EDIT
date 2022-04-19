console.log("hello from fetchApi");
let category =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/categories";
let posts =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/posts?per_page=25";
let tags =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/tags?per_page=25";
let eventDiv = document.querySelector(".events");
let tag = "";

//universal function to fetch
async function fetchApi(api) {
  try {
    let response = await fetch(api);

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
fetchApi(posts);

//shows data but not in right , maybe need to fix months api
async function createAndShow(months, events) {
  tag = await tagHandler(tags);
  let result = "";
  let eachMonth = "";
  let sortedMonths = sortMonths(months);
  for (let months of sortedMonths) {
    eachMonth += `</div><div class="${months.name}"><h2> ${months.name} </h2>`; // spør lasse om dette
    for (let i = 0; i < events.length; i++) {
      if (events[i].categories[0] == months.id) {
        eachMonth += `<p> ${events[i].title.rendered} </p>`;
      } else {
        continue;
      }

      result += eachMonth;
      //remove data for next loop
      console.log(eachMonth);
      eachMonth = "";
    }
  }
  eventDiv.innerHTML = result;
}

async function tagHandler(tags) {
  tag = await fetchApi(tags);
  console.log(tag);
  for (let i = 0; i < tag.length; i++) {
    tag[i].id = tag[i].name;
  }
  return tag;
}

/* 
    if (events[i].id != tag[i].id) {
        events[i].id = tag[i].id;
    }

*/

async function startProcess(catID, postCatId) {
  let categoryId = await fetchApi(catID);
  let postCategoryId = await fetchApi(postCatId);
  createAndShow(categoryId, postCategoryId);
}
startProcess(category, posts);

// quick function to sort months
function sortMonths(months) {
  let monthsSorted = months.sort(function (a, b) {
    return a.slug - b.slug;
  });
  return monthsSorted;
}
