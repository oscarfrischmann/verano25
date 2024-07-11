import { lineasHombre } from "../panel.js";
import { lineasMujer } from "../panel.js";

const lineasContainer = document.getElementById("lineasContainer");
const currentURL = window.location.href;
let lineas;
let category;
currentURL.includes("mujer") ? (lineas = lineasMujer) : (lineas = lineasHombre);
currentURL.includes("mujer") ? (category = "mujer") : (category = "hombre");

lineas.forEach((linea) => {
  let lineaName = linea.data().data.linea;
  if (lineaName === "lerich") {
    lineaName = "lerici";
  }
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  console.log(linea.data());
  lineasContainer.innerHTML += `
    <div class="card m-4 shadow mt-0" style="width: 18rem;">
      <img src="${linea.data().data.url}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title text-uppercase">${lineaName}</h5>
        <p class="card-text lead">${linea.data().data.descripcion}</p>
        <a href="./linea.html?linea=${lineaName}&category=${category}" class="btn btn-primary">Ver</span>
        </a>
      </div>
    </div>
  `;
});
