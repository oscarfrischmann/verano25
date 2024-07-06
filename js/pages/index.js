import { indexImagesDB } from '../panel.js';
const categoriesCont = document.getElementById('categories');
for (let key in await indexImagesDB) {
	console.log(indexImagesDB[key]);
	const loader = document.getElementById('loader');
	loader.style.display = 'none';
	categoriesCont.innerHTML += `
      <div class="col-sm p-2 position-relative">
        <img src=${indexImagesDB[key]} id="img" onload>
        <button class="main-type-title" id="mujer">${key}</button>
      </div>
    `;
}

const indexBTNs = document.querySelectorAll('.index button');
indexBTNs.forEach((button, i) => {
	button.setAttribute('onclick', `location.href ='./pages/${indexBTNs[i].attributes[1].nodeValue}.html'`);
});
