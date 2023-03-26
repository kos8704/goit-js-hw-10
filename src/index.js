import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

Notiflix.Notify.init({
  width: '300px',
  position: 'center-top',
  closeButton: false,
  });

const DEBOUNCE_DELAY    = 300;
const inputSearch       = document.querySelector('#search-box');
const countriesList     = document.querySelector('.country-list');
const countryInfo       = document.querySelector('.country-info');

countriesList.hidden    = true;
countryInfo.hidden      = true;

inputSearch.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  event.preventDefault();

  const countryName = inputSearch.value.trim();

  if (!countryName) {
    clearPage();
    return;
  }

  fetchCountries(countryName)
    .then(handleFetchResult)
    .catch(handleFetchError);
}

function handleFetchResult(result) {
  clearPage();
  if (result.length > 10) {
    
    Notiflix.Notify.info('Too many matches found. Please, enter a more specific name.');
    return;
  }
  renderedCountries(result);
}

function handleFetchError(error) {
  clearPage();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function renderedCountries(result) {
  const numResults = result.length;

  if (numResults > 2 && numResults <= 10) {
    countryInfo.innerHTML   = '';
    countryInfo.hidden      = true;
    countriesList.hidden    = false;
    renderCountryList(result);
  } else if (numResults === 1) {
    countriesList.innerHTML = '';
    countriesList.hidden    = true;
    countryInfo.hidden      = false;
    renderCountryInfoCard(result);
  }
}

function renderCountryList(result) {
  const listMarkup = result
    .map(({ name, flags }) => {
      return `
        <li>
          <img src="${flags.svg}" alt="${name}" width="50" height="auto">
          <span>${name.official}</span>
        </li>`;
    })
    .join('');
  countriesList.innerHTML = listMarkup;
}

function renderCountryInfoCard(result) {
  const { flags, name, capital, population, languages } = result[0];
  const languagesList = Object.values(languages).join(', ');
  const cardMarkup = `
    <img src="${flags.svg}" alt="${name}" width="250" height="auto">
    <h1>${name.official}</h1>
    <p>Capital: <span>${capital}</span></p>
    <p>Population: <span>${population}</span></p>
    <p>Languages: <span>${languagesList}</span></p>`;
  countryInfo.innerHTML = cardMarkup;
}

function clearPage() {
  countriesList.innerHTML = '';
  countryInfo.innerHTML   = '';
}