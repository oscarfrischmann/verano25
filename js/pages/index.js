import { indexImagesDB } from "../panel.js";

const categoriesCont = document.getElementById("categories");
for (let key in await indexImagesDB) {
  console.log(indexImagesDB[key]);
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  categoriesCont.innerHTML += `
      <div class="col-sm p-2 position-relative">
        <img src=${indexImagesDB[key]} id="img" onload>
        <button class="main-type-title">${key}</button>
      </div>
    `;
}

const indexBTNs = document.querySelectorAll(".index button");
indexBTNs.forEach((button, i) => {
  console.log(button.firstChild.nodeValue);
  if (button.firstChild.nodeValue !== "colegial") {
    button.setAttribute(
      "onclick",
      `location.href ='./pages/${button.firstChild.nodeValue}.html'`
    );
  } else {
    button.setAttribute(
      "onclick",
      `location.href ='./pages/${button.firstChild.nodeValue}.html?category=colegial&linea=articulos'`
    );
  }
});
