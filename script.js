const searchBar = document.querySelector('.search__bar');
const searchDropdown = document.querySelector('.search__list');
const addedItems = document.querySelector('.added');

//Отрисовка 5-ти элементов по запросу и занесение в dataset значений owner и stars
function createSearchItems(response) {
  for (let i = 0; i < 5; i++) {
    let name = response.items[i].name;
    let owner = response.items[i].owner.login;
    let stars = response.items[i].stargazers_count;
    searchDropdown.innerHTML += `<li class="search__item" data-owner='${owner}' data-stars='${stars}'>${name}</li>`;
  }

}

//Создание элемента 
function addSelectedItem(data) {

  addedItems.innerHTML += `          <li class="added__item">
                                        <div class="added__content">
                                          <div class="added__text">Name: ${data.textContent}</div>
                                          <div class="added__text">Owner: ${data.dataset.owner}</div>
                                          <div class="added__text">Stars: ${data.dataset.stars}</div>
                                        </div>
                                        <button class="button button__delete"></button>
                                      </li>
                          `;
}

//реагирую на отрисованные элементы и отрисовываю добавленные
searchDropdown.addEventListener('click', function (event) {
  if (event.target && event.target.tagName === 'LI') {
    const target = event.target;

    addSelectedItem(target);

    //очищаю value
    searchBar.value = '';

    //очищаю
    searchDropdown.innerHTML = '';
  }

});

//Удаление выбранного элемента
addedItems.addEventListener('click', function (event) {
  if (event.target && event.target.tagName === 'BUTTON') {
    event.target.parentElement.remove();
  }
});

const getContent = function () {
  getData(searchBar.value)
    .then(res => {
      searchDropdown.innerHTML = '';

      //Отрисовка 5 эл-ов запроса 
      createSearchItems(res);
    });
};

//запрос
const getData = async function (name) {
  try {
    const data = await fetch(`https://api.github.com/search/repositories?q=${name}`);
    if (data.ok) {
      return await data.json();
    }
    throw new Error('Проблемы с получением запроса от сервера');
  } catch (error) {
    console.error(error.stack);
  }

};

//Ограничение запросов
const debounce = (fn, debounceTime) => {
  let timeout;

  return function wrapper() {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, debounceTime);
  };
};

const getContentDebounce = debounce(getContent, 500);
searchBar.addEventListener('input', getContentDebounce);