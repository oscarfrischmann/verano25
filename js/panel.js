import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import {
	getStorage,
	ref,
	uploadBytes,
	listAll,
	getDownloadURL,
	deleteObject,
} from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js';
import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	doc,
	setDoc,
	deleteDoc,
	updateDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js';

const firebaseConfig = {
	apiKey: 'AIzaSyBroVNx30DfKRGO1yBedvg4cwTnNQeNkqs',
	authDomain: 'verano25-fc8ff.firebaseapp.com',
	projectId: 'verano25-fc8ff',
	storageBucket: 'verano25-fc8ff.appspot.com',
	messagingSenderId: '852998628617',
	appId: '1:852998628617:web:85a17711c232e308e61fd8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const storageRef = ref(storage);

//UPLOAD INDEX IMG
const indexForm = document.getElementById('indexForm');
if (indexForm) {
	indexForm.addEventListener('submit', (e) => {
		e.preventDefault();
		console.log('hola');
		const file = document.getElementById('indexImgs').files;
		console.log(file.length);
		for (let i = 0; i < file.length; i++) {
			const fileRef = ref(storage, `index/${file[i].name}`);
			uploadBytes(fileRef, file[i])
				.then((snapshot) => {
					console.log('Uploaded a blob or file!');
				})
				.catch((error) => {
					console.log('Upload failed:', error);
				});
		}
	});
}
const listRef = ref(storage, 'index');
const indexImages = document.getElementById('indexImages');
const showIndexImages = document.getElementById('showIndexImages');
const imgIndexLinks = [];
if (showIndexImages) {
	showIndexImages.addEventListener('click', async () => {
		listAll(listRef)
			.then((res) => {
				res.items.forEach((itemRef, i) => {
					console.log(itemRef);
					getDownloadURL(ref(storage, `index/${itemRef.name}`))
						.then((url) => {
							imgIndexLinks.push(url);
							indexImages.innerHTML += `
          <div>
            <img src=${url} style="width: 200px;" class="mb-3" id=${itemRef.name}>
            <button id=index-${itemRef.name} class="btn btn-primary ms-2 img-use-button">Usar</button>
          </div>
          `;
						})
						.catch((err) => {
							console.log(err);
						});
				});
			})
			.catch((err) => {
				console.log(err);
			});
		useImageButtons();
	});
}

//USAR IMAGENES

const useIndexImgs = document.getElementById('useIndexImgs');
if (useIndexImgs) {
	useIndexImgs.addEventListener('submit', async (e) => {
		e.preventDefault();
		let indexImage = {};
		const cat = useIndexImgs['categoryIndex'].value.toLowerCase();
		indexImage[cat] = useIndexImgs['indexImage'].value;
		// const key = Object.keys(indexImage);
		// const update = {};
		// update[key] = true;
		// console.log(update);

		try {
			await updateDoc(doc(db, 'index', 'indexImages'), indexImage);
			console.log('OK!');
		} catch (err) {
			throw new Error('set Category Image', err);
		}
	});
}

async function useImageButtons() {
	setTimeout(() => {
		const use = document.querySelectorAll('.img-use-button');
		console.log(use);
		use.forEach((button, i) => {
			button.addEventListener('click', (event) => {
				const img = imgIndexLinks[i];
				console.log(img);
				useIndexImgs['indexImage'].value = img;
			});
		});
	}, 2500);
}

//get DATA for index
const getIndexImages = async () => {
	try {
		const indexImages = doc(db, 'index', 'indexImages');
		const imgSnap = await getDoc(indexImages);
		const newIndexImages = imgSnap.data();
		return newIndexImages;
	} catch (err) {
		throw new Error('get cambridge price', err);
	}
};

export const indexImagesDB = await getIndexImages();
