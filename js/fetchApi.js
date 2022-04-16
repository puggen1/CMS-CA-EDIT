console.log("hello from fetchApi");
let category = "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/categories";
let posts = "https://www.bendik.one/www/noroffquality/wp-json/wp/v2/posts?per_page=25";
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
async function createAndShow(first, second){
        let result = "";
        let eachMonth = "";
        let sortedMonths = sortMonths(first);
        for(months of sortedMonths){
            eachMonth += `<h2> ${months.name} </h2>`;
            for(let i = 0; i < second.length; i++){
                if(second[i].categories[0] == months.id){
                    eachMonth += `<p> ${second[i].title.rendered} </p>`;
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
