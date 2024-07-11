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
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
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
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const login = document.getElementById("googleLogIn");
const logout = document.getElementById("googleLogOut");

let user;
let prevUser;
if (login) {
  onAuthStateChanged(auth, (user) => {
    const laodPage = document.getElementById("mainPanel");
    if (user != null) {
      console.log("User Logged In");
      laodPage.classList.remove("d-none");
      // console.log(user);
      prevUser = user;
      login.classList.toggle("display-none");

      // console.log(user);
    } else {
      laodPage.classList.add("d-none");
      console.log("No User Logged In");
    }
  });
}
if (login && logout) {
  login.addEventListener("click", async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        user = result.user;
        // console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        console.log(error);
      });
  });
  logout.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("Signed Out succesfully");
      })
      .catch((error) => {
        console.log("We couldn´t sign you Out", error);
      });
  });
}

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
          .then((snapshot) => {})
          .catch((error) => {
            console.log("Upload failed:", error);
          });
      }
      alert(`Uploaded for ${DBdirectory}!`);
    });
  }
};
//UPLOAD IMAGES END

// Activar UPLOAD IMAGES para cada sección
uploadImages("indexForm", "indexImgs", "index");
uploadImages("mujerImgForm", "lineasMujerImgs", "lineasMujer");
uploadImages("hombreImgForm", "lineasHombreImgs", "lineasHombre");

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
          console.log(res.items);
          res.items.forEach((itemRef) => {
            getDownloadURL(ref(storage, `${DBdirectory}/${itemRef.name}`))
              .then((url) => {
                imgLinks.push(url);
                HTMLimgsContainer.innerHTML += `
            <div>
              <img src=${url} style="width: 200px;" class="mb-3" id=${itemRef.name}>
							<span>${itemRef.name}</span>
              <button id="${DBdirectory}-${itemRef.name}" class="btn btn-primary m-2 ${DBdirectory}" disabled>Usar</button>
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
      alert("OK!");
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
      articulo: {
        articulo: {
          art: useLineasMujerImgs["artMujerURL"].value,
          url: useLineasMujerImgs["lineaMujerURL"].value,
        },
      },
    };
    try {
      let newImgMujer;
      if (!data.articulo.articulo.art) {
        await setDoc(doc(db, "mujer", data.linea), data.data, { merge: true });
        alert("OK! agregando linea mujer");
      } else {
        console.log("else");
        const artRef = await getDoc(doc(db, "mujer", data.linea));
        console.log(artRef.data());
        if (artRef.data().hasOwnProperty(data.articulo.articulo.art)) {
          console.log(artRef.data()[data.articulo.articulo.art]);
          newImgMujer = artRef.data()[data.articulo.articulo.art];
          console.log(newImgMujer);
          newImgMujer.push(data.articulo.articulo.url);
          console.log(newImgMujer);
          const addImg = {
            [data.articulo.articulo.art]: newImgMujer,
          };
          await setDoc(doc(db, "mujer", data.linea), addImg, { merge: true });
          alert(
            `OK! nueva imagen agregnda a art ${data.articulo.articulo.art}`
          );
        } else {
          const newArticle = {
            [data.articulo.articulo.art]: [data.articulo.articulo.url],
          };
          await setDoc(doc(db, "mujer", data.linea), newArticle, {
            merge: true,
          });
          alert(`OK! articulo ${data.articulo.articulo.art} mujer agregado`);
        }
      }
    } catch (err) {
      throw new Error("set Category Image", err);
    }
  });
}
const useLineasHombreImgs = document.getElementById("useLineasHombreImgs");
if (useLineasHombreImgs) {
  useLineasHombreImgs.addEventListener("submit", async (e) => {
    e.preventDefault();
    let lineaHombreImage = {};
    const data = {
      linea: useLineasHombreImgs["lineaHombre"].value.toLowerCase(),
      data: {
        data: {
          descripcion:
            useLineasHombreImgs["lineaHombreDescipcion"].value.toLowerCase(),
          fondo: useLineasHombreImgs["lineaHombreFondo"].value.toLowerCase(),
          numeracion: [
            useLineasHombreImgs["lineaHombreNumeracionMin"].value,
            useLineasHombreImgs["lineaHombreNumeracionMax"].value,
          ],
          url: useLineasHombreImgs["lineaHombreURL"].value,
          linea: useLineasHombreImgs["lineaHombre"].value.toLowerCase(),
        },
      },
      articulo: {
        articulo: {
          art: useLineasHombreImgs["artHombreURL"].value,
          url: useLineasHombreImgs["lineaHombreURL"].value,
        },
      },
    };
    try {
      let newImg;
      if (!data.articulo.articulo.art) {
        await setDoc(doc(db, "hombre", data.linea), data.data, { merge: true });
        alert("OK! agregando linea HOMBRE");
      } else {
        console.log("else");
        const artRef = await getDoc(doc(db, "hombre", data.linea));
        console.log(artRef.data());
        if (artRef.data().hasOwnProperty(data.articulo.articulo.art)) {
          console.log(artRef.data()[data.articulo.articulo.art]);
          newImg = artRef.data()[data.articulo.articulo.art];
          console.log(newImg);
          newImg.push(data.articulo.articulo.url);
          const addImg = {
            [data.articulo.articulo.art]: newImg,
          };
          await setDoc(doc(db, "hombre", data.linea), addImg, { merge: true });
          alert(
            `OK! nueva imagen agregnda a art ${data.articulo.articulo.art}`
          );
        } else {
          const newArticle = {
            [data.articulo.articulo.art]: [data.articulo.articulo.url],
          };
          await setDoc(doc(db, "hombre", data.linea), newArticle, {
            merge: true,
          });
          alert(`OK! articulo ${data.articulo.articulo.art} HOMBRE agregado`);
        }
      }
    } catch (err) {
      throw new Error("set Category Image", err);
    }
  });
}
//(DBdirectory, imgsContainer, button, URLinput, form)
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
showImages(
  "lineasHombre",
  "lineasHombreImages",
  "showLineasHombreImages",
  "lineaHombreURL",
  useLineasHombreImgs
);

async function useImageButtons(DBdirectory, form, URLinput) {
  setTimeout(() => {
    const use = document.querySelectorAll(`.${DBdirectory}`);
    use.forEach((button, i) => {
      if (button.id.includes(" ")) {
        button.id = button.id.split(" ").join("");
      } else {
        button.id = button.id;
      }
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
export const lineasHombre = await getLineas("hombre");

//MODIFICAR ARTíCULO

/* 
1. buscar art a modificar.
2. desplegar fotos y nombre
3. borrar foto
4 agregar foto
*/

const searchArtForm = document.getElementById("searchArtForm");
if (searchArtForm) {
  searchArtForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const imgName = searchArtForm["searchArt"].value;
    const imgFolder = searchArtForm["folder"].value;
    const imgRef = ref(storage, `${imgFolder}/${imgName}`);
    getDownloadURL(imgRef).then((url) => {
      const cont = document.getElementById("displayArtToUpdate");
      cont.textContent = url;
    });
  });
}
