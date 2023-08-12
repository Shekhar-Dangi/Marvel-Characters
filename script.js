let characterImage = document.getElementById("character-image");
let characterName = document.getElementById("character-name");
let characterContainer = document.querySelector(".character-container");
let characterDes = document.getElementById("character-description");
let input = document.getElementById("character-input");
let searchBtn = document.getElementById("search-button");
let sgnBox = document.getElementById("suggestions-box");
let suggestions = document.querySelectorAll(".suggestion");
import { apiKey, ts, hash } from "./auth.js";

const validate = () => {
  if (input.value.length == 0) return false;
  return true;
};

const fetchCharacters = async (value, suggestion) => {
  try {
    if (!validate()) throw new Error("Search value can't be empty");
    let res = "";
    if (!suggestion) {
      res = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters?name=${input.value}&ts=${ts}&apikey=${apiKey}&hash=${hash}`
      );
    } else {
      res = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${value}&ts=${ts}&apikey=${apiKey}&hash=${hash}`
      );
    }
    let parsedData = await res.json();
    return parsedData.data.results;
  } catch (error) {
    console.log(error);
  }
};

searchBtn.addEventListener("click", async () => {
  let chars = await fetchCharacters(input.value, false);
  sgnBox.innerHTML = "";
  characterContainer.style.display = "block";
  if (chars.length > 0) {
    let imgPath = chars[0].thumbnail.path;
    characterName.textContent = chars[0].name;
    let ext = chars[0].thumbnail.extension || null;
    characterImage.style.display = "block";
    characterImage.src = `${imgPath}.${ext}`;
    characterDes.textContent = chars[0].description || "No description found";
  } else {
    characterName.textContent = "No such Character!";
    characterImage.style.display = "none";
  }
});

const updateSuggestion = async (e) => {
  let value = e.target.value || e.target.innerText;
  sgnBox.innerHTML = "";
  if (value.length > 2) {
    let result = await fetchCharacters(value, true);
    sgnBox.innerHTML = "";
    sgnBox.style.display = "block";
    if (e.target.innerText) return;
    result.forEach((char) => {
      let elem = document.createElement("p");
      elem.classList.add("suggestion");
      elem.textContent = char.name;
      sgnBox.appendChild(elem);
      elem.addEventListener("click", (e) => {
        input.value = e.target.innerText;
        updateSuggestion(e);
      });
    });
  }
};

input.addEventListener("input", updateSuggestion);
