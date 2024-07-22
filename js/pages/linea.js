import { lineasHombre } from "../panel.js";
import { lineasMujer } from "../panel.js";
import { colegiales } from "../panel.js";

const lineaContainer = document.getElementById("lineaContainer");
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let lineaC = params.get("linea");
let category = params.get("category");
let lineaCollection;
let currentLinea;
let modalLabel;
console.log(lineaC, category);
document.title = `Línea ${lineaC} || Calzados Roble `;
if (typeof gtag === "function") {
  // Send a pageview with the updated title
  gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}
lineaC === "lerici" ? (lineaC = "lerich") : (lineaC = params.get("linea"));
const lineaTitle = document.getElementById("lineaTitle");
// category === "mujer"
//   ? (lineaCollection = lineasMujer)
//   : (lineaCollection = lineasHombre);
if (category === "mujer") {
  lineaCollection = lineasMujer;
} else if (category === "hombre") {
  lineaCollection = lineasHombre;
} else {
  lineaCollection = colegiales;
}
console.log(lineaCollection);
if (category !== "colegial") {
  lineaCollection.forEach((linea) => {
    if (linea.data().data.linea === lineaC) currentLinea = linea.data();
  });
} else {
  lineaCollection.forEach((linea) => {
    console.log(linea.data());
    currentLinea = linea.data();
  });
}

const sortedKeys = Object.keys(currentLinea).sort();
const sortedObj = {};
sortedKeys.forEach((key) => {
  sortedObj[key] = currentLinea[key];
});

if (category !== "colegial") {
  let equis;
  sortedObj.data.linea == "lerich"
    ? (equis = "lerici")
    : (equis = sortedObj.data.linea);
  lineaTitle.innerHTML = `
        <h2>Linea ${equis}</h2>
        <h4>Fondo ${sortedObj.data.fondo}</h4>
        <h4>${sortedObj.data.numeracion[0]} / ${sortedObj.data.numeracion[1]}</h4>  
  `;
}
for (let [art, url] of Object.entries(sortedObj)) {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  const imgQuantity = url.length;
  if (art != "data") {
    let images = [];
    for (let i = 0; i < imgQuantity; i++) {
      images.push(url[i]);
    }
    const urlList = images
      .map((url) => `<img class="card-img mt-1" src=${url}>`)
      .join("");
    if (art.includes(" ")) {
      modalLabel = art.split(" ").join("");
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
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
