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
    const urlList = images.map((url) => `<img src=${url}>`);
    lineaContainer.innerHTML += `
 <div class="card shadow d-md-none" style="width: 18rem;">
        <img src="../img/02.jpg" class="card-img-top" alt="...">
        <img src="../img/02.jpg" class="card-img-bottom" alt="...">
        <div class="card-body">
          <h5 class="card-title">Art. ${art}</h5>
        </div>
      </div>
      <div class="card shadow d-md-block d-none" style="width: 18rem;">
        <img src="../img/02.jpg" class="card-img-top" alt="...">
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
              <img src="../img/02.jpg" class="card-img-top rounded mb-2" alt="...">
              <img src="../img/02.jpg" class="card-img-bottom rounded" alt="...">
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
