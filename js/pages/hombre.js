import { lineasHombre } from '../panel.js';
const lineasHombreContainer = document.getElementById('lineasHombreContainer');
lineasHombre.forEach((linea) => {
	const loader = document.getElementById('loader');
	loader.style.display = 'none';
	console.log(linea.data());
	lineasHombreContainer.innerHTML += `
    <div class="card m-4" style="width: 18rem;">
      <img src="${linea.data().data.url}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title text-uppercase">${linea.data().data.linea}</h5>
        <p class="card-text">${linea.data().data.descripcion}</p>
        <a href="#" class="btn btn-primary">Ver <span class="text-uppercase">${linea.data().data.linea}</span> </a>
      </div>
    </div>
  `;
});
