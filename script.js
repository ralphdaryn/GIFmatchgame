const BASE_URL = "https://api.giphy.com";
const API_KEY = "?api_key=7hxB6Jns6YAhwUdDbzN9QRUHwz5VAXZf";
// const API_KEY = "?api_key=rvIStNLz18hrU8mzhXjqb86MLdfX4yBf";
let gameBoxEleArray = [];
let triesRemaining = 3;
updateTries(triesRemaining)

let PATH_URL = "";
let PARAMS = "";

function getGameModeURL() {
  const categoriesEle = document.querySelector(".controls__categories-select");
  const subcategoriesEle = document.querySelector(
    ".controls__subcategories-select"
  );
  gameCategory = categoriesEle.value;
  gameSubcategory = subcategoriesEle.value;

  if (gameCategory === "trending") {
    PATH_URL = "/v1/gifs/trending";
    PARAMS = `&limit=10&offset=0&rating=pg-13&bundle=messaging_non_clips`;
  } else {
    PATH_URL = "/v1/gifs/search";
    PARAMS = `&q=${gameSubcategory}&limit=10&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;
  }

  return `${BASE_URL}${PATH_URL}${API_KEY}${PARAMS}`;
}


// const stringifyResponse = JSON.stringify(response.data.data);
// localStorage.setItem("localTrending10", stringifyResponse);
const localCategoriesStr = localStorage.getItem("localCategories");
const localCategories = JSON.parse(localCategoriesStr);

const localTrending10Str = localStorage.getItem("localTrending10");
const localTrending10 = JSON.parse(localTrending10Str);
// console.log(localTrending10)
// displayGIFs(localTrending10, false);
// getTrendingGIFS();



// function getTrendingGIFS() {
//     const requestURL = `${BASE_URL}/v1/gifs/trending${API_KEY}&limit=15&offset=0&rating=pg-13&bundle=messaging_non_clips`
//     axios
//     .get(requestURL)
//     .then((response) => {
//     //   console.log(response.data);
//       const stringifyResponse = JSON.stringify(response.data.data);
//       localStorage.setItem("localTrending10", stringifyResponse);
//     //   displayGIFs(response.data.data, false);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

function getCategories() {
    console.log("categories requested")
    const requestURL = `${BASE_URL}/v1/gifs/categories${API_KEY}`
    axios
    .get(requestURL)
    .then((response) => {
      const stringifyResponse = JSON.stringify(response.data.data);
      localStorage.setItem("localCategories", stringifyResponse);
    //   displayGIFs(response.data.data, false);
    })
    .catch((error) => {
      console.log(error);
    });
}

if (localCategories) {
    populateCategories(localCategories);
    // console.log(localCategories)
} else {
    getCategories()
    populateCategories(localCategories);
}

// populate categories dropdown box
function populateCategories(categoriesArray) {
    const categoriesEle = document.querySelector(".controls__categories-select");
    categoriesArray.forEach((category) => {
      const categoryOptionEle = document.createElement("option");
      categoryOptionEle.classList.add("controls__categories-option");
      const categoryName = category.name;
      categoryOptionEle.value = categoryName;
      categoryOptionEle.innerText = titleCase(categoryName);
      categoriesEle.appendChild(categoryOptionEle);
    });
  }
  
  // populate subcategories dropdown box
  function populateSubcategories(categoryObj) {
    const subcategoriesEle = document.querySelector(
      ".controls__subcategories-select"
    );
    const subcategoriesArray = categoryObj.subcategories;
    subcategoriesArray.forEach((subcategory) => {
      const subcategoryOptionEle = document.createElement("option");
      subcategoryOptionEle.classList.add("controls__subcategories-option");
      const subcategoryName = subcategory.name;
      subcategoryOptionEle.value = subcategoryName;
      subcategoryOptionEle.innerText = titleCase(subcategoryName);
      subcategoriesEle.appendChild(subcategoryOptionEle);
    });
  }
  
  // category change event listener - run on page load
const categoriesEle = document.querySelector(".controls__categories-select");
categoriesEle.addEventListener("change", (event) => {
  const subcategoriesEle = document.querySelector(
    ".controls__subcategories-select"
  );
  subcategoriesEle.innerHTML = "";
  const categoryName = event.target.value;
  if (categoryName === "trending") {
    subcategoriesEle.disabled = true;
  } else {
    subcategoriesEle.disabled = false;
    const categoriesEle = localCategories.filter((category) => {
      return category.name === categoryName;
    });
    populateSubcategories(categoriesEle[0]);
  }
});






function requestCategoryGIFs() {
  const requestURL = getGameModeURL();
  axios
    .get(requestURL)
    .then((response) => {
    //   console.log(response.data);
    //   const stringifyResponse = JSON.stringify(response.data.data);
    //   localStorage.setItem("localCategories", stringifyResponse);
      displayGIFs(response.data.data, false);
    })
    .catch((error) => {
      console.log(error);
    });
}

function request5RandomGifs() {
  const randomURL = `${BASE_URL}/v1/gifs/random${API_KEY}&tag=&rating=g`;
  const gifArray = [];
  Promise.all([
    axios.get(randomURL),
    axios.get(randomURL),
    axios.get(randomURL),
    axios.get(randomURL),
    axios.get(randomURL),
  ])
    .then((responses) => {
    //   console.log(responses);
      const randomGifArray = [];
      responses.forEach((response) => {
        randomGifArray.push(response.data.data);
      });
    //   console.log(randomGifArray);
      displayGIFs(randomGifArray, true);
    })
    .catch((error) => {
      console.log(error);
    });
}

// start game
const btnEle = document.querySelector(".controls__button");
btnEle.addEventListener("click", (event) => {
gameBoxEleArray = []
//   event.preventDefault();
triesRemaining = 3;
updateTries(triesRemaining)
  const gifBoxEle = document.querySelector(".gifmatch__container");
  gifBoxEle.innerHTML = "";
  request5RandomGifs();
  requestCategoryGIFs();
// displayGIFs(localTrending10, true);
    setTimeout(() => {
        addSelectability()
},4000);
})



function displayGIFs(gifArray, isRandom) {
  const gifBoxEle = document.querySelector(".gifmatch__container");
  gifArray.forEach((gifObj) => {
    // console.log(gifObj);
    let gifFixedHeightURL = gifObj.images.fixed_height.url;
    const width = screen.width
    if (width < 767) {
        gifFixedHeightURL = gifObj.images.fixed_height_small.url;
    } 
    // const gifFixedHeightURL = gifObj.images.fixed_height_small.url;
    const gifImgEle = document.createElement("img");
    gifImgEle.classList.add("gifmatch__gif")
    gifImgEle.src = gifFixedHeightURL;
    const gifEleWithRandom = {}
    if (isRandom) {
        gifEleWithRandom.random = true
    } else {
        gifEleWithRandom.random = false
    }
    gifEleWithRandom.element = gifImgEle
    gameBoxEleArray.push(gifEleWithRandom);
  });

  gameBoxEleArray = shuffleArray(gameBoxEleArray);
  gameBoxEleArray.forEach((gifEle) => {
    gifBoxEle.appendChild(gifEle.element);
  });
}


// select/unselect event listener
function addSelectability() {
    
    const gifEles = document.querySelectorAll(".gifmatch__gif")
    gifEles.forEach(gifEle => {
    gifEle.addEventListener("click", event => {
        gifEle.classList.toggle("gifmatch__gif--selected")
    })
    
})
}


// submit answer
const submitBtn = document.querySelector(".gifmatch__button")
submitBtn.addEventListener('click', () =>{
    if (triesRemaining !== 0) {
        const gifEles = document.querySelectorAll(".gifmatch__gif")
    
        let gameWon = false
        wrongFound = false    

        for (i = 0; i < gifEles.length && !wrongFound; i++) {
            // console.log(gifEles[i])
            if (gifEles[i].classList.contains("gifmatch__gif--selected") && gameBoxEleArray[i].random)  {
                triesRemaining--
                gameWon = false
                wrongFound = true
            } else {
                gameWon = true
            }
            
            
        }
        
        updateTries(triesRemaining)
        // console.log("Tries remaining: " + triesRemaining)
        // console.log("gameWon?: " + gameWon)

        checkForWinLose(gameWon, triesRemaining);

    }

    

})

function updateTries(numberTries) {
    const triesEle = document.querySelector(".gifmatch__tries-remaining")
    triesEle.innerText = numberTries
}


function checkForWinLose(gameWon, triesLeft) {

    if (gameWon) {
        alert("You win!")
    } else if (triesLeft <= 0) {
        alert("You lose.")
    }

}


// Utility functions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
function titleCase(string) {
  const array = string.split(" ");

  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
  }
  return array.join(" ");
}
