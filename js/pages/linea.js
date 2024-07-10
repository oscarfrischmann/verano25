import { lineasHombre } from "../panel.js";
import { lineasMujer } from "../panel.js";

const lineaContainer = document.getElementById("lineaContainer");
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let lineaC = params.get("linea");
let category = params.get("category");
let lineaCollection;
let currentLinea;
console.log(lineaC, category);

lineaC === "mujer"
  ? (lineaCollection = lineasMujer)
  : (lineaCollection = lineasHombre);

lineaCollection.forEach((linea) => {
  if (linea.data().data.linea === lineaC) currentLinea = linea.data();
});
console.log(currentLinea);

for (let [art, url] of Object.entries(currentLinea)) {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  const imgQuantity = url.length;
  if (art != "data") {
    let images = [];
    for (let i = 0; i < imgQuantity; i++) {
      images.push(url);
    }
    console.log(images);
    // const urlList = images.map(
    //   (url) => `<img src=${url} class="card-img rounded mb-2">`
    // );
    let urlList = Object.entries(images)
      .map(([key, values]) => {
        let innerImgs = values
          .map(
            (value) => `<img class='card-img' src="${value}" alt="${value}">`
          )
          .join("");
        return `<div>${innerImgs}</div>`;
      })
      .join("");
    console.log(urlList);
    lineaContainer.innerHTML += `
      <div class="card shadow d-md-none" style="width: 18rem;">
        ${urlList}
        <div class="card-body">
          <h5 class="card-title">Art. ${art}</h5>
        </div>
      </div>
      <div class="card shadow d-md-block d-none m-2" style="width: 18rem;">
        ${urlList[0]}
        <div class="card-body">
          <h5 class="card-title">Art. ${art}</h5>
          <button type="button" class="btn btn-info d-md-block d-none" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop">
            Ver más
        </div>
      </div>
      <!-- Modal -->
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5" id="staticBackdropLabel">Art. ${art}</h2>

              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${urlList}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Preguntale más a Santi</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
