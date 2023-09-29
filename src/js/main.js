'use strict';

//queryselector
const foundList = document.querySelector('.js-found-list');
const favList = document.querySelector('.js-fav-list');
const inputSearch = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-btn-search');
const btnReset = document.querySelector('.js-btn-reset');

const urlDefoult = 'https://api.tvmaze.com/search/shows?q=friends';

//constante para traer los favoritos guardados en el local
const favoriteStored = JSON.parse(localStorage.getItem('listFavs'));

//arrays vacíos que contendrán las listas
let listFound = [];
let listFavs = [];

// traer lista de series que aparezcan por defecto
// fetch(urlDefoult)
//   .then((response) => response.json())
//   .then((data) => {
//     listFound = data;
//     renderShowList(listFound);
//   });

//funciones

//función para pintar las favs guardadas en el local storage

function storedFavs() {
  if (favoriteStored) {
    renderShowFavs(favoriteStored);
  } else {
    renderShowFavs(listFavs);
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
      listFound = data;
      console.log(listFound);
      renderShowList(listFound);
    });
}

//función que pinta una serie
function renderShow(showData) {
  const articleShow = document.createElement('article');
  articleShow.classList.add('card');
  articleShow.classList.add('js-card');
  const tittleShow = document.createElement('h3');
  tittleShow.classList.add('tittle');
  const textTittle = document.createTextNode(showData.show.name);
  tittleShow.appendChild(textTittle);
  articleShow.appendChild(tittleShow);
  const imgShow = document.createElement('img');
  if (showData.show.image === null) {
    imgShow.setAttribute('src', '../assets/images/awesome_cards_logo.png');
  } else {
    imgShow.setAttribute('src', showData.show.image.medium);
  }
  imgShow.setAttribute('alt', `Cartel de la serie`);
  imgShow.classList.add('img');
  articleShow.appendChild(imgShow);
  articleShow.setAttribute('id', showData.show.id);

  return articleShow;
}

//función que pinta una lista de series
function renderShowList(listFound) {
  foundList.innerHTML = '';
  for (const oneShow of listFound) {
    foundList.appendChild(renderShow(oneShow));
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

function renderShowFavs(favShows) {
  favList.innerHTML = '';
  for (const item of favShows) {
    favList.appendChild(renderShow(item));
  }
  addEventToShow();
}
// función que hace que al hacer click, coja la serie seleccionada y la meta o la saque de la lista de favoritos
function handleClickFav(event) {
  const idShowClicked = parseInt(event.currentTarget.id);
  let showFavorite = listFound.find((item) => item.show.id === idShowClicked);
  const indexFav = listFavs.findIndex((item) => item.show.id === idShowClicked);

  if (indexFav === -1) {
    listFavs.push(showFavorite);
  } else {
    listFavs.splice(indexFav, 1);
  }

  renderShowList(listFound);
  renderShowFavs(listFavs);
  localStorage.setItem('listFavs', JSON.stringify(listFavs));
}

//función para agregar el evento click a las series
function addEventToShow() {
  const everyShows = document.querySelectorAll('.js-card');
  console.log(everyShows);
  for (const item of everyShows) {
    item.addEventListener('click', handleClickFav);
  }
}

//función para borrar TODOS los favs de la lista y del local

function handleClickReset(event) {
    localStorage.removeItem('listFavs');
    renderShowFavs(listFavs);
}

//función para cambiar color de fondo y de letras a los favoritos
// function colorChange {
//     if (articleShow) {
//         articleShow.classList.add('favColor')
//     }
// }

//eventos

btnSearch.addEventListener('click', handleClickSearch);
btnReset.addEventListener('click', handleClickReset);
