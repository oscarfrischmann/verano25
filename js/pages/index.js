import { indexImagesDB } from '../panel.js';

const categoriesCont = document.getElementById('categories');
console.log(indexImagesDB);
for (let key in await indexImagesDB) {
	console.log(indexImagesDB[key]);
	categoriesCont.innerHTML += `
      <div class="col-sm p-2 position-relative">
        <img src=${indexImagesDB[key]}>
        <button class="main-type-title" id="mujer">${key}</button>
      </div>
    `;
}
const indexBTNs = document.querySelectorAll('.index button');
indexBTNs.forEach((button, i) => {
	button.setAttribute('onclick', `location.href ='./pages/${indexBTNs[i].attributes[1].nodeValue}.html'`);
});
