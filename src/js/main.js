'use strict';

//queryselector
const foundList = document.querySelector('.js-found-list');
const favList = document.querySelector('.js-fav-list');
const inputSearch = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-btn-search');

const urlDefoult = 'https://api.tvmaze.com/search/shows?q=friends';
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

// traer datos del input api

function searchShow() {
  const searchValue = inputSearch.value;
  const urlSearch = `https://api.tvmaze.com/search/shows?q=${searchValue}`;
  fetch(urlSearch)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      listFound = data;
      renderShowList(listFound);
    });
}

//funciones
//función que pinta una serie
function renderShow(showData) {
  const articleShow = document.createElement('article');
  articleShow.classList.add('card');
  const tittleShow = document.createElement('h3');
  tittleShow.classList.add('tittle');
  const textTittle = document.createTextNode(showData.show.name);
  tittleShow.appendChild(textTittle);
  articleShow.appendChild(tittleShow);
  const imgShow = document.createElement('img');
  if (showData.show.image === null) {
    imgShow.setAttribute('src', "../assets/images/awesome_cards_logo.png");
  } else {
    imgShow.setAttribute('src', showData.show.image.medium);
  }

  imgShow.setAttribute('alt', `Cartel de la serie`);
  imgShow.classList.add('img');
  articleShow.appendChild(imgShow);

  return articleShow;
}

function renderShowList(listFound) {
  for (const oneShow of listFound) {
    foundList.appendChild(renderShow(oneShow));
  }
}
console.log(renderShowList(listFound));

function handleClickSearch(event) {
  event.preventDefault();
  searchShow();
}

//eventos

btnSearch.addEventListener('click', handleClickSearch);
