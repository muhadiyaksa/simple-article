//PADA SAAT BODY DITAMPIL
const body = document.querySelector("body");

body.onload = async function () {
  const listArtikel = await getData();
  updateUI(listArtikel);
};

//PADA SAAT TOMBOL CARI DIKLIK
const searchButton = document.querySelector(".search-button");
const inputKeyword = document.querySelector(".input-keyword");
const buttonClose = document.querySelector("button.close");
const wadahList = document.querySelector(".search .list-group");

searchButton.addEventListener("click", async function () {
  const listArtikel = await getData();
  updateUISearch(listArtikel, inputKeyword);
  // tambahJSON(listArtikel);
});

function getData() {
  return fetch("data/artikel.json")
    .then((resp) => resp.json())
    .then((resp) => resp);
}

function populer(list) {
  return list.sort((a, b) => parseInt(b.jumlahklik) - parseInt(a.jumlahklik));
}

function updateUI(list) {
  let cards = "";
  let cards2 = "";
  const wadahUIcards = document.querySelector(".artikel-card");

  populer(list);
  list.forEach((e, i) => {
    if (i < 9) {
      const divCard = showCards(e);
      cards += divCard;
    } else {
      const divCard2 = showCards(e);
      cards2 += divCard2;
      console.log("Berhasil diumpetin");
    }
  });
  wadahUIcards.innerHTML = cards;
}

function updateUISearch(listResult, keyword) {
  let cards = "";
  const wadahUIcards = document.querySelector(".artikel-card");

  populer(listResult);
  if (keyword.value) {
    listResult.forEach((e) => {
      if (e.judul.includes(`${keyword.value}`)) {
        const divCardSearch = showCards(e);
        cards += divCardSearch;
      }
    });
  } else {
    alert("Input Belum Diisi!");
  }

  wadahUIcards.innerHTML = cards;
}

//PADA SAAT TOMBOL KATEGORI DIKLIK
let dataID = [];
const dataComment = [];

document.addEventListener("click", async function (e) {
  const listArtikel2 = await getData();
  const categoriType = e.target.getAttribute("type");
  const inputComment = document.querySelector(".teks-komen");
  const inputCommentName = document.querySelector(".comment-name");

  if (e.target.classList.contains("all-category")) updateUI(listArtikel2);
  if (e.target.classList.contains("programming")) updateUIkategori(listArtikel2, categoriType);
  if (e.target.classList.contains("javascript")) updateUIkategori(listArtikel2, categoriType);
  if (e.target.classList.contains("tipsandtrick")) updateUIkategori(listArtikel2, categoriType);
  if (e.target.classList.contains("mobileapp")) updateUIkategori(listArtikel2, categoriType);
  if (e.target.classList.contains("read-more")) {
    const idArtikel = e.target.dataset.id;
    dataID.unshift(idArtikel);

    updateUIArtikel(listArtikel2, idArtikel);
    updateUIComment(dataComment, idArtikel);
  }
  if (e.target.classList.contains("send-button")) {
    let date = new Date();
    let jam = date.getHours();
    let menit = date.getMinutes();

    let waktu = `${jam}:${menit}`;

    let comment = {
      idArtikel: dataID[0],
      nama: inputCommentName.value,
      komen: inputComment.value,
      waktu: waktu,
    };

    dataComment.push(comment);

    updateUIComment(dataComment, dataID[0]);
  }
  if (e.target.classList.contains("list-group-item")) {
    const idArtikel = e.target.dataset.id;
    wadahList.style.display = "none";
    inputKeyword.value = "";

    updateUIArtikel(listArtikel2, idArtikel);
    updateUIComment(dataComment, idArtikel);
  }

  inputKeyword.addEventListener("keyup", function () {
    buttonClose.style.display = "block";
  });
  buttonClose.addEventListener("click", function () {
    inputKeyword.value = "";
  });
});

function updateUIkategori(list, kategori) {
  let cards = "";
  const wadahUIcards = document.querySelector(".artikel-card");

  list.forEach((e) => {
    if (e.kategori.join(",").includes(`${kategori}`)) {
      const divCardSearch = showCards(e);
      cards += divCardSearch;
    }
  });
  wadahUIcards.innerHTML = cards;
}

let jumlahmaks = [];

function showCards(e) {
  katalog = "";
  e.kategori.forEach((el) => {
    const span = `<span class="border bg-light rounded px-2 py-1 my-1 me-2 rounded-pill">${el}</span>`;
    katalog += span;
  });

  jumlahmaks.push(e.jumlahklik);

  trending = "";

  if (e.jumlahklik == Math.max.apply(null, jumlahmaks)) {
    const divPopuler = `<div class="populer">On Trending</div>`;
    trending += divPopuler;
  }

  return `<div class="col-md-4 mb-4">
            <div class="card h-100 w-100">
                ${trending}
                <div class="view"><img src="image/eye.png"/>${e.jumlahklik}</div>
                <img src="image/${e.image}" class="card-img-top img-fluid" alt="Hobi" />
                <div class="card-body">
                <h5 class="card-title mb-3 text-capitalize">${e.judul}</h5>
                <p class="card-subtitle mb-2 text-muted ">${katalog}</p>
                <p class="card-text">${e.deskripsi.substring(0, 100)}...</p>
                <a href="#" class="btn btn-primary align-bottom read-more" data-id="${e.idArtikel}">Read More</a>
                </div>
            </div>
          </div>`;
}

function updateUIArtikel(list, idArtikel) {
  let wadah = "";
  const wadahUIcards = document.querySelector(".artikel-card");

  list.forEach((el) => {
    if (el.idArtikel == idArtikel) {
      wadah += showArtikel(el);
    }
  });
  wadahUIcards.innerHTML = wadah;
}

function showArtikel(e) {
  return `<div class="col-md">
            <h2 class="mb-3 text-capitalize">${e.judul}</h2>
            <p class="card-subtitle mb-2 text-muted">
              <span class="border bg-light rounded px-3 py-1 my-1 me-2 rounded-pill">${e.tanggal}</span>
              <span class="border bg-light rounded px-3 py-1 my-1 me-2 rounded-pill">${e.authors}</span>
            </p>
            <p class="mt-4 w-100 description" >${e.deskripsi}</p>
          </div>
          <div class="col-md-4">
            <img src="image/${e.image}" class="img-fluid" />
            <div class="input-group my-3">
              <input type="text" class="form-control teks-komen" placeholder="Comment" aria-label="Recipient's username" aria-describedby="button-addon2" />
              <button class="btn btn-outline-primary send-comment" type="button" id="button-addon2" data-bs-toggle="modal" data-bs-target="#getName"><img src="image/send.png" /></button>
            </div>
            <div class="kotak">
            </div>
          </div>
          `;
}

//Komen
function updateUIComment(list, idArtikel) {
  let komenCards = "";
  const kotakKomen = document.querySelector(".kotak");

  console.log(list);
  if (list.length > 0) {
    list.forEach((el) => {
      if (el.idArtikel == idArtikel) {
        komenCards += showComment(el);
      }
    });
  }
  kotakKomen.innerHTML = komenCards;
}
function showComment(el) {
  return `<div class="komen">
            <p class="comment">${el.komen}</p>
            <p class="nama">From ${el.nama}</p>
            <p class="tanggal">${el.waktu}</p>
          </div>`;
}
//PADA SAAT INPUT DIISI
inputKeyword.addEventListener("keyup", function () {
  checkSearch(inputKeyword.value);
});

async function checkSearch(keyword) {
  let listKeyword = keyword.split(" ");
  let listLi = "";
  const listArtikel = await getData();

  listArtikel.forEach((e) => {
    if (e.judul.includes(listKeyword.join(" "))) {
      wadahList.style.display = "block";
      listLi += `<li class="list-group-item" data-id=${e.idArtikel}>${e.judul}</li>`;
    }
    if (listKeyword == "") {
      buttonClose.style.display = "none";
      wadahList.style.display = "none";
    } else {
    }
  });

  wadahList.innerHTML = listLi;
}
const listGroup = document.querySelectorAll(".list-group-item");

function getList(idartikel) {}
