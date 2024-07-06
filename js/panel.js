import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBroVNx30DfKRGO1yBedvg4cwTnNQeNkqs",
  authDomain: "verano25-fc8ff.firebaseapp.com",
  projectId: "verano25-fc8ff",
  storageBucket: "verano25-fc8ff.appspot.com",
  messagingSenderId: "852998628617",
  appId: "1:852998628617:web:85a17711c232e308e61fd8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const storageRef = ref(storage);

//UPLOAD IMAGES
const uploadImages = async (HtMLform, fileInput, DBdirectory) => {
  const formU = document.getElementById(`${HtMLform}`);

  if (formU) {
    formU.addEventListener("submit", (e) => {
      e.preventDefault();
      const file = document.getElementById(`${fileInput}`).files;
      for (let i = 0; i < file.length; i++) {
        const fileRef = ref(storage, `${DBdirectory}/${file[i].name}`);
        uploadBytes(fileRef, file[i])
          .then((snapshot) => {
            console.log(`Uploaded for ${DBdirectory}!`);
          })
          .catch((error) => {
            console.log("Upload failed:", error);
          });
      }
    });
  }
};
//UPLOAD IMAGES END

// Activar UPLOAD IMAGES para cada formulario
uploadImages("indexForm", "indexImgs", "index");
uploadImages("mujerImgForm", "lineasMujerImgs", "lineasMujer");

//LIST IMAGES
const imgLinks = [];

const showImages = (DBdirectory, imgsContainer, button, URLinput, form) => {
  const listRef = ref(storage, `${DBdirectory}`);
  const HTMLimgsContainer = document.getElementById(`${imgsContainer}`);
  const showImgsButton = document.getElementById(`${button}`);
  if (showImgsButton) {
    showImgsButton.addEventListener("click", async () => {
      listAll(listRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(ref(storage, `${DBdirectory}/${itemRef.name}`))
              .then((url) => {
                imgLinks.push(url);
                HTMLimgsContainer.innerHTML += `
             <div>
              <img src=${url} style="width: 200px;" class="mb-3" id=${itemRef.name}>
              <button id=index-${itemRef.name} class="btn btn-primary ms-2 ${DBdirectory}" disabled>Usar</button>
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
      useImageButtons(DBdirectory, form, URLinput);
      console.log(imgLinks);
    });
  }
};

//USAR IMAGENES y cargar por Formulario

const useIndexImgs = document.getElementById("useIndexImgs");
if (useIndexImgs) {
  useIndexImgs.addEventListener("submit", async (e) => {
    e.preventDefault();
    let indexImage = {};
    const cat = useIndexImgs["categoryIndex"].value.toLowerCase();
    indexImage[cat] = useIndexImgs["indexImage"].value;
    // const key = Object.keys(indexImage);
    // const update = {};
    // update[key] = true;
    // console.log(update);

    try {
      await updateDoc(doc(db, "index", "indexImages"), indexImage);
      console.log("OK!");
    } catch (err) {
      throw new Error("set Category Image", err);
    }
  });
}

const useLineasMujerImgs = document.getElementById("useLineasMujerImgs");
if (useLineasMujerImgs) {
  useLineasMujerImgs.addEventListener("submit", async (e) => {
    e.preventDefault();
    let lineaMujerImage = {};
    const data = {
      linea: useLineasMujerImgs["lineaMujer"].value.toLowerCase(),
      data: {
        data: {
          descripcion:
            useLineasMujerImgs["lineaMujerDescipcion"].value.toLowerCase(),
          fondo: useLineasMujerImgs["lineaMujerFondo"].value.toLowerCase(),
          numeracion: [
            useLineasMujerImgs["lineaMujerNumeracionMin"].value,
            useLineasMujerImgs["lineaMujerNumeracionMax"].value,
          ],
          url: useLineasMujerImgs["lineaMujerURL"].value,
          linea: useLineasMujerImgs["lineaMujer"].value.toLowerCase(),
        },
      },
    };
    try {
      await setDoc(doc(db, "mujer", data.linea), data.data, { merge: true });
      console.log("OK! agregando linea");
    } catch (err) {
      throw new Error("set Category Image", err);
    }
  });
}

showImages(
  "index",
  "indexImages",
  "showIndexImages",
  "indexImage",
  useIndexImgs
);
showImages(
  "lineasMujer",
  "lineasMujerImages",
  "showLineasMujerImages",
  "lineaMujerURL",
  useLineasMujerImgs
);
async function useImageButtons(DBdirectory, form, URLinput) {
  setTimeout(() => {
    const use = document.querySelectorAll(`.${DBdirectory}`);
    console.log(use);
    use.forEach((button, i) => {
      button.removeAttribute("disabled");
      button.addEventListener("click", (event) => {
        const img = imgLinks[i];
        console.log(img);
        form[URLinput].value = img;
      });
    });
  }, 2500);
}

//get DATA for index
const getIndexImages = async (collection, document) => {
  try {
    const indexImages = doc(db, collection, document);
    const imgSnap = await getDoc(indexImages);
    const data = imgSnap.data();
    return data;
  } catch (err) {
    throw new Error("get cambridge price", err);
  }
};

export const indexImagesDB = await getIndexImages("index", "indexImages");

//get docs in a collection
const getLineas = async (category) => {
  try {
    const querySNAP = await getDocs(collection(db, category));
    querySNAP.forEach((linea) => {
      // console.log(linea.data());
    });
    return querySNAP;
  } catch (err) {
    throw new Error("get lineas", err);
  }
};

//get LINEA
export const lineasMujer = await getLineas("mujer");

//GET DATA for MUJER

// const buscar = async () => {
//   try {
//     const modeloRef = doc(db, "mujer", "relax");
//     const querySNAP = await getDoc(modeloRef);
//     const data = querySNAP.data();
//     console.log(data[2006]);
//   } catch (err) {
//     console.log(err, "query");
//   }
// };
// await buscar();
