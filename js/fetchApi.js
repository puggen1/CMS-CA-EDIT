console.log("hello from fetchApi");
let category = "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/categories";
let posts = "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/posts?per_page=25";
let tags = "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/tags?per_page=25"
let eventDiv = document.querySelector(".events");

//universal function to fetch
async function fetchApi(api){
    try{
        let response = await fetch(api);
   
        return await response.json();
    }
    catch(error){
       console.log(error); 
    }

}
fetchApi(posts);



//shows data but not in right order, maybe need to fix months api
async function createAndShow(months, events){
        await tagHandler(tags);
        let result = "";
        let eachMonth = "";
        let sortedMonths = sortMonths(months);
        for(let months of sortedMonths){
            eachMonth += `</div><div class="${months.name}"><h2> ${months.name} </h2>`; // spør lasse om dette
            for(let i = 0; i < events.length; i++){
                if(events[i].categories[0] == months.id){
                    eachMonth += `<p> ${events[i].title.rendered} </p>`;
                }
                else{
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
    let tag = await fetchApi(tags);

    console.log(tag);
}
    
async function startProcess(catID, postCatId){
    let categoryId = await fetchApi(catID);
    let postCategoryId = await fetchApi(postCatId);
    createAndShow(categoryId, postCategoryId);
}
startProcess(category, posts);


// quick function to sort months
function sortMonths(months){
    let monthsSorted = months.sort(function (a,b){
        return a.slug - b.slug;
    });
   return monthsSorted
}


/* IDER 
3 = Styret
15 = Student    
16 = Lærer



*/