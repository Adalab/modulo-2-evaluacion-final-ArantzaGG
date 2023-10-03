'use strict';
//queryselector
const foundList = document.querySelector('.js-found-list');
const favList = document.querySelector('.js-fav-list');
const inputSearch = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-btn-search');
const btnReset = document.querySelector('.js-btn-reset');
const msjError = document.querySelector('.js-p');
const button = document.querySelector('.button');

//constante para traer los favoritos guardados en el local
const favoriteStored = JSON.parse(localStorage.getItem('listFavs'));

//arrays vacíos que contendrán las listas
let listFound = [];
let listFavs = [];

//funciones

//función para pintar las favs guardadas en el local storage
function storedFavs() {
  if (favoriteStored !== null) {
    listFavs = favoriteStored;
    renderShowFavs(listFavs, true);
    if (listFavs.length === 0) {
      localStorage.removeItem('listFavs');
    }
  }
}
storedFavs();

// función que trae los datos de la api
function searchShow() {
  const searchValue = inputSearch.value;
  const urlSearch = `https://api.tvmaze.com/search/shows?q=${searchValue}`;
  fetch(urlSearch)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        msjError.innerHTML =
          '¡Ups! No hemos encontrado tu serie. ¿Por qué no pruebas con otro título?';
      } else {
        msjError.innerHTML = '';
        listFound = data;
        renderShowList(listFound);
      }
    });
}

//función que pinta una serie (el segundo parámetro es para el botón)
function renderShow(showData, favX) {
  const articleShow = document.createElement('article');
  articleShow.classList.add('card');
  const tittleShow = document.createElement('h3');
  tittleShow.classList.add('tittle');
  const textTittle = document.createTextNode(showData.show.name);
  tittleShow.appendChild(textTittle);
  articleShow.appendChild(tittleShow);
  const pstatus = document.createElement('h4');
  const textStatus = document.createTextNode(showData.show.status);
  pstatus.appendChild(textStatus);
  articleShow.appendChild(pstatus);
  const imgShow = document.createElement('img');
  if (showData.show.image === null) {
    imgShow.setAttribute('src', '../assets/images/justRainbow.png');
  } else {
    imgShow.setAttribute('src', showData.show.image.medium);
  }
  imgShow.setAttribute('alt', `Cartel de la serie`);
  imgShow.classList.add('img');
  articleShow.appendChild(imgShow);
  articleShow.setAttribute('id', showData.show.id);

  //para cambiar el color de fondo y de fuente y añadir botón para quitar de favs

  if (
    listFavs.findIndex((itemFav) => itemFav.show.id === showData.show.id) !== -1
  ) {
    articleShow.classList.add('favColor');
  }

  //para añadir la x solo cuando está en el array de favoritos, lo pasaremos como parámetro en la función de renderizar la lista
  if (favX) {
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('delete_button');
    btnDelete.classList.add('js-btn-delete');
    const textBtnDelete = document.createTextNode(`X`);
    btnDelete.appendChild(textBtnDelete);
    articleShow.appendChild(btnDelete);
    btnDelete.setAttribute('id', showData.show.id);
  }
  if (!favX) {
    articleShow.classList.add('js-card');
  }
  return articleShow;
}

//función que pinta una lista de series
function renderShowList(listFound, favX) {
  foundList.innerHTML = '';
  for (const oneShow of listFound) {
    foundList.appendChild(renderShow(oneShow, favX));
  }

  //esta función añade el evento click a las series
  addEventToShow();
}

//función que pinta las series según el input
function handleClickSearch(event) {
  event.preventDefault();
  searchShow();
}

//función que añade series a la lista de favoritos
function renderShowFavs(favShows, favX) {
  favList.innerHTML = '';
  for (const item of favShows) {
    favList.appendChild(renderShow(item, favX));
  }
  addEventToShow();
  addEventBtnDelete();
}

// función que hace que al hacer click, coja la serie seleccionada y la meta o la saque de la lista de favoritos
function handleClickFav(event) {
  const idShowClicked = parseInt(event.currentTarget.id);
  let showFavorite = listFound.find((item) => item.show.id === idShowClicked);
  const indexFav = listFavs.findIndex((item) => item.show.id === idShowClicked);

  if (indexFav === -1) {
    listFavs.push(showFavorite);
  } else {
    handleDeleteFav();
  }

  renderShowList(listFound, false);
  renderShowFavs(listFavs, true);
  localStorage.setItem('listFavs', JSON.stringify(listFavs));
}

//función manejadora para el botón de borrar de favs
function handleDeleteFav(event) {
  const idBtnDelete = parseInt(event.currentTarget.id);
  const indexFav = listFavs.findIndex((item) => item.show.id === idBtnDelete);
  listFavs.splice(indexFav, 1);
  renderShowList(listFound, false);
  renderShowFavs(listFavs, true);
  localStorage.setItem('listFavs', JSON.stringify(listFavs));
}

//función para agregar el evento click a las series
function addEventToShow() {
  const everyShows = document.querySelectorAll('.js-card');
  for (const item of everyShows) {
    item.addEventListener('click', handleClickFav);
  }
}

//función para agregar el evento click al botón de borrar
function addEventBtnDelete() {
  const everyButton = document.querySelectorAll('.js-btn-delete');
  for (const item of everyButton) {
    item.addEventListener('click', handleDeleteFav);
  }
}

//función para borrar TODOS los favs de la lista y del local
function handleClickReset() {
  listFavs = [];
  listFound = [];
  localStorage.removeItem('listFavs');
  renderShowFavs(listFavs, true);
  renderShowList(listFound, false);
  inputSearch.value = '';
  msjError.innerHTML = '';
}
function handleClickLog() {
  for (const item of listFavs) {
    console.log(item.show.name);
  }
}

//eventos
button.addEventListener('click', handleClickLog);
btnSearch.addEventListener('click', handleClickSearch);
btnReset.addEventListener('click', handleClickReset);
