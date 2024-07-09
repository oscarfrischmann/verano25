import { lineasHombre } from '../panel.js';
import { lineasMujer } from '../panel.js';

const lineaContainer = document.getElementById('lineaContainer');
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let lineaC = params.get('linea');
let category = params.get('category');
let lineaCollection;
let currentLinea;
console.log(lineaC, category);

const lineaTitle = document.getElementById('lineaTitle');
lineaTitle.textContent = `Línea ${lineaC}`;
category === 'mujer' ? (lineaCollection = lineasMujer) : (lineaCollection = lineasHombre);
console.log(lineaCollection);
lineaCollection.forEach((linea) => {
	console.log(linea.data());
	if (linea.data().data.linea === lineaC) currentLinea = linea.data();
});
console.log(currentLinea);

for (let [art, url] of Object.entries(currentLinea)) {
	const loader = document.getElementById('loader');
	loader.style.display = 'none';
	const imgQuantity = url.length;
	if (art != 'data') {
		let images = [];
		for (let i = 0; i < imgQuantity; i++) {
			images.push(url[i]);
		}
		console.log(images);
		const urlList = images.map((url) => `<img class="card-img" src=${url}>`).join('');
		lineaContainer.innerHTML += `
      <div class="card shadow d-md-none" style="width: 18rem;">
        ${urlList}
        <div class="card-body">
          <h5 class="card-title">Art. ${art}</h5>
        </div>
      </div>
      <div class="card shadow d-md-block d-none ms-1 me-1" style="width: 18rem;">
        <img src="${url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Art. ${art}</h5>
          <button type="button" class="btn btn-info d-md-block d-none" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop${art}">
            Ver más
        </div>
      </div>
      <!-- Modal -->
      <div class="modal fade" id="staticBackdrop${art}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel${art}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5" id="staticBackdropLabel${art}">Art. ${art}</h2>
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
