import { lineasHombre } from '../panel.js';
import { lineasMujer } from '../panel.js';

const lineasContainer = document.getElementById('lineasContainer');
const currentURL = window.location.href;
let lineas;
currentURL.includes('mujer') ? (lineas = lineasMujer) : (lineas = lineasHombre);

lineas.forEach((linea) => {
	const loader = document.getElementById('loader');
	loader.style.display = 'none';
	console.log(linea.data());
	lineasContainer.innerHTML += `
    <div class="card m-4 shadow mt-0" style="width: 18rem;">
      <img src="${linea.data().data.url}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title text-uppercase">${linea.data().data.linea}</h5>
        <p class="card-text lead">${linea.data().data.descripcion}</p>
        <a href="./linea.html?linea=${
					linea.data().data.linea
				}" class="btn btn-primary">Ver <span class="text-uppercase">${linea.data().data.linea}</span>
        </a>
      </div>
    </div>
  `;
});
