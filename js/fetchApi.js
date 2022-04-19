console.log("hello from fetchApi");
let category =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/categories";
let posts =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/posts?per_page=25";
let tags =
  "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/tags?per_page=25";
let eventDiv = document.querySelector(".events");
let tag = "";

//let studBtn = document.querySelector("#student");

//studBtn.addEventListener("click", function(){
//    filterTest()
//});

function filterTest(){
        startProcess(category, posts, event.target.id);
    
}
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
async function createAndShow(months, events, filter) {
  tag = await fetchApi(tags);
  if(!filter){
    console.log("all");
  }
  else{
      console.log(filter);
  }
  let result = "";
  let eachMonth = "";
  let sortedMonths = sortMonths(months);
  for (let months of sortedMonths) {
    eachMonth += `</div><div class="${months.name}"><h2> ${months.name} </h2>`; // spør lasse om dette
    for (let i = 0; i < events.length; i++) {
        events[i].id = "";
        for (let n = 0; n < tag.length; n++) {
            for (let m = 0; m <= 3; m++) {
        if(events[i].tags[m] == tag[n].id) {
            events[i].id +=[tag[n].name] + " ";
        }
    }
        }            

      if (events[i].categories[0] == months.id) {
        eachMonth += `<p id="${events[i].id}"> ${events[i].title.rendered} </p>`;
      } else {
        continue;
      }

      result += eachMonth;
      //remove data for next loop
      eachMonth = "";
    }
  }
  eventDiv.innerHTML = result;
  console.log(events)
}

async function startProcess(catID, postCatId, filter="all") {

    
  let categoryId = await fetchApi(catID);
  let postCategoryId = await fetchApi(postCatId);
  if(filter ==="all"){
  createAndShow(categoryId, postCategoryId);
    }
    else{
        createAndShow(catID, postCategoryId, filter)
}
}
startProcess(category, posts);

// quick function to sort months
function sortMonths(months) {
  let monthsSorted = months.sort(function (a, b) {
    return a.slug - b.slug;
  });
  return monthsSorted;
}


