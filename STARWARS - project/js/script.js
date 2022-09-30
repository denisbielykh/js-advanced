let actualHeroesArr;
let lastHeroesPage;
let activeHeroesPage = 1;
let prevBtnEventFlag = false;
let nextBtnEventFlag = false;
let unclickFlag = false;
let init = { method: 'GET' };
let filmsArr = new Array();
let heroesList = document.querySelector('.heroes-list');
let prevBtn = document.querySelector('.btns__button_prev');
let nextBtn = document.querySelector('.btns__button_next');
let actualPage = document.querySelector('.pages__actual');
let lastPage = document.querySelector('.pages__last');
let popup = document.querySelector('.popup');
let popupCloseBtn = document.querySelector('.popup__btn');

getAndSaveHeroes(activeHeroesPage);
getFIlms();

heroesList.addEventListener('click', showPopup);
popupCloseBtn.addEventListener('click', closePopup);
popup.addEventListener('click', closePopup);

function getAndSaveHeroes(arg) {
    let url = `https://swapi.dev/api/people/?page=${arg}`;
    fetch(url, init)
        .then((response) => { return response.json(); })
        .then((data) => {
            actualHeroesArr = data.results;
            setHeroes();
            tooglePrevBtnListenerAndClass(arg);
            toogleNextBtnListenerAndClass(arg);
            setActualPage()
            if (arg === 1) { setLastPage(arg, data); };
            unclickFlag = true;
        })
        .catch(() => { alert('try to reload this page') });
};
function setHeroes() {
    for (let i = 0; i < actualHeroesArr.length; i++) {
        let heroName = actualHeroesArr[i].name;
        let heroListItem = document.createElement('li');
        heroListItem.classList.add('hero-list__item');
        heroListItem.innerHTML = `<button id="${i}" class="hero" type="button">${heroName}</button>`;
        heroesList.insertAdjacentElement('beforeend', heroListItem);
    };
};
function setLastPage(arg, data) {
    lastHeroesPage = Math.ceil(data.count / actualHeroesArr.length);
    lastPage.innerHTML = lastHeroesPage;
};
function setActualPage() {
    actualPage.innerHTML = activeHeroesPage;
};
function tooglePrevBtnListenerAndClass(arg) {
    if (arg === 2 && !prevBtnEventFlag) {
        prevBtn.addEventListener('click', getNextHeroes);
        prevBtn.classList.add('btns__button_active');
        prevBtnEventFlag = true;
    } else if (arg === 1 && prevBtnEventFlag) {
        prevBtn.removeEventListener('click', getNextHeroes);
        prevBtn.classList.remove('btns__button_active');
        prevBtnEventFlag = false;
    };
};
function getFIlms() {
    let url = 'https://swapi.dev/api/films';
    fetch(url, init)
        .then((response) => { return response.json() })
        .then((data) => {
            for (elem of data.results) {
                filmsArr.push(elem.title);
            };
        })
        .catch(() => { filmsArr.push(`we don't know`) });
};
function toogleNextBtnListenerAndClass(arg) {
    if ((arg === 1 || arg === (lastHeroesPage - 1)) && !nextBtnEventFlag) {
        nextBtn.addEventListener('click', getNextHeroes);
        nextBtn.classList.add('btns__button_active');
        nextBtnEventFlag = true;
    } else if (arg === lastHeroesPage && nextBtnEventFlag) {
        nextBtn.removeEventListener('click', getNextHeroes);
        nextBtn.classList.remove('btns__button_active');
        nextBtnEventFlag = false;
    };
};
function getNextHeroes(event) {
    if (!unclickFlag) {
        return
    } else {
        unclickFlag = false
    }
    clearHeroesListAndArr();
    if (event.target === nextBtn) { getAndSaveHeroes(++activeHeroesPage); }
    if (event.target === prevBtn) { getAndSaveHeroes(--activeHeroesPage); }
};
function clearHeroesListAndArr() {
    let heroesArr = document.querySelectorAll('.heroes-list li');
    for (elem of heroesArr) { elem.remove() };
    actualHeroesArr.length = 0;
};
function showPopup(event) {
    let target = event.target;
    if (target.tagName === 'BUTTON') {
        let id = event.target.id;
        setName(event);
        setGender(id);
        setYearOfBirth(id)
        getAndSetPlanet(id);
        getAndSetSpecies(id);
        setFilms(id);
        popup.classList.add('active');
    };
};
function setName(arg) {
    let heroName = document.getElementById('hero_name');
    heroName.innerHTML = arg.target.innerHTML;
};
function setGender(arg) {
    let gender = document.getElementById('gender');
    let heroGender = actualHeroesArr[arg].gender;
    let genderArr = ['male', 'female', 'hermaphrodite'];
    if (genderArr.includes(heroGender)) {
        gender.innerHTML = heroGender;
    } else {
        gender.innerHTML = `we don't know`;
    }
};
function setYearOfBirth(arg) {
    let year = document.getElementById('year');
    let heroYear = actualHeroesArr[arg].birth_year;
    if (heroYear === 'unknown') {
        year.innerHTML = `we don't know`;
    } else {
        year.innerHTML = heroYear;
    };
};
function getAndSetPlanet(arg) {
    let planet = document.querySelector('#planet');
    let regexFirstIndex = actualHeroesArr[arg].homeworld.search(/\d/)
    let idRequest = actualHeroesArr[arg].homeworld.slice(regexFirstIndex, -1)
    let url = `https://swapi.dev/api/planets/${idRequest}`;
    fetch(url, init)
        .then((response) => { return response.json() })
        .then((data) => {
            let planet = document.getElementById('planet');
            let heroPlanet = data.name;
            if (heroPlanet === 'unknown') {
                planet.innerHTML = `we don't know`;
            } else {
                planet.innerHTML = heroPlanet;
            }
        })
        .catch(() => { planet.innerHTML = `we don't know`; })
}
function getAndSetSpecies(arg) {
    let species = document.getElementById('species')
    if (actualHeroesArr[arg].species.length === 0) {
        species.innerHTML = `we don't know`;
    } else {
        let regexFirstIndex = actualHeroesArr[arg].species[0].search(/\d/);
        let idRequest = actualHeroesArr[arg].species[0].slice(regexFirstIndex, -1)
        let url = `https://swapi.dev/api/species/${idRequest}`;
        fetch(url, init)
            .then((response) => { return response.json() })
            .then((data) => {
                species.innerHTML = data.name;
            })
            .catch(() => { species.innerHTML = `we don't know` })
    }
}
function closePopup(event) {
    let target = event.target;
    if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'SECTION'
    ) {
        popup.classList.remove('active');
    };
};
function setFilms(arg) {
    clearFilmsList();
    let heroFilmsIdArr = getHeroFilmsIdArr(arg);
    let filmsList = document.querySelector('.films-list');
    for (elem of heroFilmsIdArr) {
        let itemToAdd = document.createElement('li');
        itemToAdd.classList.add('films-list__item');
        itemToAdd.innerHTML = `${filmsArr[elem]}`;

        filmsList.insertAdjacentElement('beforeend', itemToAdd);
    };
};
function getHeroFilmsIdArr(arg) {
    let heroFilmsLinks = actualHeroesArr[arg].films;
    let heroFilmsIdArr = new Array();
    for (elem of heroFilmsLinks) {
        let regexFirstIndex = elem.search(/\d/);
        let filmsId = elem.slice(regexFirstIndex, -1) - 1;
        heroFilmsIdArr.push(filmsId);
    };
    return heroFilmsIdArr;
};
function clearFilmsList() {
    let filmsListArr = document.querySelectorAll('.films-list li');
    for (elem of filmsListArr) { elem.remove() };
};
