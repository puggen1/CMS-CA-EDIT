console.log("hello from fetchApi");

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

//function to show api on page
async function showApi(api){
    let response = await fetchApi(api);
    let output = "";
    for(posts of response){
        output += `<p> ${posts.title.rendered}</p>`;
    }
    eventDiv.innerHTML = output;
}

// run test
showApi(posts);


