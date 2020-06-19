console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUserAll = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('se acabó el tiempo');
  }, 5000)
})

const getUser = new Promise(function(todoBien, todoMal) {
  // llamar a un api
  setTimeout(function() {
    // luego de 3 segundos
    todoBien('se acabó el tiempo 3');
  }, 3000)
})

// getUser
//   .then(function() {
//     console.log('todo está bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })

Promise.race([
  getUser,
  getUserAll,
])
.then(function(message) {
  console.log(message);
})
.catch(function(message) {
  console.log(message)
})



$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data) {
    console.log(data)
  },
  error: function(error) {
    console.log(error)
  }
})

fetch('https://randomuser.me/api/')
  .then(function (response) {
    // console.log(response)
    return response.json()
  })
  .then(function (user) {
    console.log('user', user.results[0].name.first)
  })
  .catch(function() {
    console.log('algo falló')
  });


(async function load() {
  // await
  // action
  // terror
  // animation
  async function getData(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const response = await fetch(url);
    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
    }
    
    throw new Error('No se encontró ningún resultado');
  }
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');
  const $featuringContainer = document.getElementById('featuring');

  function setAttributes($element, attributes){
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute])
    }
  }

  const BASE_API = 'https://yts.am/api/v2/';

  function featuringTemplate(peli) {
    return (
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
      `
    )
  }

  $form.addEventListener('submit', async(event) => {
      event.preventDefault();
      $home.classList.add('search-active'); 
      const $loader = document.createElement('img');
      setAttributes($loader, {src: 'src/images/loader.gif', 
      height: 50,
      width: 50, 
    })
    $featuringContainer.append($loader);

    const data = new FormData($form);
    try {
      const peli = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
      const HTMLString = featuringTemplate(peli.data.movies[0])
      $featuringContainer.innerHTML = HTMLString;
    } catch(error){
      
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }
    
  })



  function videoItemTemplate(movie, category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
        <div class="primaryPlaylistItem-image">
        <p style="display: none;">${movie.id}</p>
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }
  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }
  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal($element);
    })
  }
  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');
      })
      movieElement.classList.add('fadeIn');
      addEventClick(movieElement);
    })
  }

  async function cacheExist(category) {
    const listName = `${category}List`
    const cacheList = window.localStorage.getItem('listName')
    if (cacheList){
      return JSON.parse(cacheList);
    }

   const { data: { movies: data} }  = await getData(`${BASE_API}list_movies.json?genre=${category}`)
   localStorage.setItem(listName, JSON.stringify(data))
   return data;
  }

  const actionList = await cacheExist('action');
  // localStorage.setItem('actionList', JSON.stringify(actionList))
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');

  const dramaList = await cacheExist('drama');
  // localStorage.setItem('dramaList', JSON.stringify(dramaList))
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  const animationList = await cacheExist('animation');
  // localStorage.setItem('animationList', JSON.stringify(animationList))
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

 

  

  

  






  // const $home = $('.home .list #item');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');


  function findById(list, id){
    
    return list.find(movie => movie.id === parseInt(id, 10))
  }
  function findMovie(id, category) {
      switch (category) {
        case 'action' : {
          return findById(actionList, id)
          
        }
        case 'drama' : {
          return findById(dramaList, id)
    
        }
        default: {
         return findById(animationList, id)
    
        }
      }


    actionList.find(movie => movie.id === parseInt(id, 10)
    )
  }

  function showModal($element) {

    $overlay.classList.add('active');
    $modal.style.animation = "modalIn .8s forwards"
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category)
    
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full
   
  }

  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = "modalOut .8s forwards";
  }
})();

//guardamos la URL de la API donde vamos a buscar los datos
const friendsAPI = 'https://rickandmortyapi.com/api/';
//guardamos en variable los contenedores de contactos
const $contactContainer = document.querySelector('.playlistFriends');
const $playlistContainer = document.querySelector('.myPlaylist');
//function contenedora
(async function load(){

async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (data.info.count >0) {
        return data;
    } else {
        thrownewError('No se han encontrado contactos');
    }
}


//template para la seccion de contactos
function friendsTemplate(friend) {
    return (
        `<li class="playlistFriends-item">
         <a href="#">
        <img src="https://rickandmortyapi.com/api/character/avatar/${friend.id}.jpeg" alt="${friend.species}" />
        <span>
          ${friend.name}
        </span>
      </a>
      </li>`
    )
}
//template para la seccion de playlist
function playlistTemplate(item) {
    return (
        `<li class="myPlaylist-item">
        <a href="#">
          <span>
            ${item.episode}: ${item.name}
          </span>
        </a>
      </li>`
    )
}
function createTemplate(HTMLString) {
    const html = 
    document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
    
  }
//funcion para insertar el arrayFriends en la seccion de contactos
function insertHTML(array,template,container) {
  //iteramos el array de resultados
  array.forEach((item)=> {
    //generamos el template html
    const HTMLString = template(item);
    //convertimos a HTML el string
    const itemElement = createTemplate(HTMLString);
    container.append(itemElement);

})
}
//Traemos la lista de amigos desde la API
const friendsData = await getData(`${friendsAPI}character/`);
//guardamos los datos
const arrayFriends = []
friendsData.results.forEach(character => {
    arrayFriends.push(character);
}
);
//insertamos los datos del array en el HTML
insertHTML(arrayFriends,friendsTemplate,$contactContainer);
//traemos la lista de episodios desde la API
const episodesData = await getData(`${friendsAPI}episode/`);
//guardamos los datos
const arrayEpisodes = []
episodesData.results.forEach(episode => {
    arrayEpisodes.push(episode);
}
);
//insertamos los datos del array en el HTML
insertHTML(arrayEpisodes,playlistTemplate,$playlistContainer);

})();   