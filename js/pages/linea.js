import { lineasHombre } from "../panel.js";
import { lineasMujer } from "../panel.js";

const lineaContainer = document.getElementById("lineaContainer");
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let lineaC = params.get("linea");
let category = params.get("category");
let lineaCollection;
let currentLinea;
let modalLabel;
console.log(lineaC, category);
lineaC === "lerici" ? (lineaC = "lerich") : (lineaC = params.get("linea"));
const lineaTitle = document.getElementById("lineaTitle");
category === "mujer"
  ? (lineaCollection = lineasMujer)
  : (lineaCollection = lineasHombre);
console.log(lineaCollection);
lineaCollection.forEach((linea) => {
  console.log(linea.data());
  if (linea.data().data.linea === lineaC) currentLinea = linea.data();
});
console.log(currentLinea);
console.log(currentLinea.data);
let equis;
currentLinea.data.linea == "lerich"
  ? (equis = "lerici")
  : (equis = currentLinea.data.linea);
lineaTitle.innerHTML = `
      <h2>Linea ${equis}</h2>
      <h4>Fondo ${currentLinea.data.fondo}</h4>
      <h4>${currentLinea.data.numeracion[0]} / ${currentLinea.data.numeracion[1]}</h4>  
`;

for (let [art, url] of Object.entries(currentLinea)) {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  const imgQuantity = url.length;
  if (art != "data") {
    let images = [];
    for (let i = 0; i < imgQuantity; i++) {
      images.push(url[i]);
    }
    console.log(images);
    const urlList = images
      .map((url) => `<img class="card-img" src=${url}>`)
      .join("");
    if (art.includes(" ")) {
      modalLabel = art.split(" ").join("");
      console.log(modalLabel);
    } else {
      modalLabel = art;
    }
    lineaContainer.innerHTML += `
      <div class="card shadow d-md-none mb-3" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Art. ${art}</h5>
      </div>
        ${urlList}
      </div>
      <div class="card shadow d-md-block d-none ms-1 me-1" style="width: 18rem;">
        <img src="${url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Art. ${art}</h5>
          <button type="button" class="btn btn-info d-md-block d-none" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop${modalLabel}">
            Ver más
        </div>
      </div>
      <!-- Modal -->
      <div class="modal fade" id="staticBackdrop${modalLabel}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel${modalLabel}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5" id="staticBackdropLabel${modalLabel}">Art. ${art}</h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            ${urlList}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
