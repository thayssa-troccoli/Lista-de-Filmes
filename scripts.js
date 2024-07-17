document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '7c1a3b9fd94115721fbb8caf92d41b6a';
    const moviesContainer = document.getElementById('movies-container');
    const searchModal = document.getElementById('search-modal'); 
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeSearchModalBtn = document.getElementById('close-search-modal');
    const movieForm = document.getElementById('movie-form');
    const addMovieBtn = document.getElementById('add-movie-btn');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const searchMovieBtn = document.getElementById('search-movie-btn');
    const searchResults = document.getElementById('search-results');
    const movieTitleInput = document.getElementById('movie-title');
    const movieImageInput = document.getElementById('movie-image');

    let movies = [];
    let myMovies = [];
    let editingMovieId = null;
/* O código faz duas requisições para a API The Movie Database (TMDb):
1 - Uma para buscar filmes por nome (/search/movie).
2 - Outra para buscar detalhes de um filme específico.

Manipula vários elementos do DOM:

* Adiciona e remove cards de filmes.
* Atualiza o conteúdo de modais.
* Abre e fecha modais.
* Obtém valores de campos de entrada.

Manipular objetos: código trabalha com objetos que representam filmes, armazenando e atualizando seus dados (id, título, imagem)

Utiliza Array: O código utiliza arrays para armazenar a lista de filmes da API (movies) e a lista de filmes do usuário (myMovies)

Forms: O código possui um formulário para adicionar/editar filmes

E tem varias funções como fetchMovies, renderSearchResults, addToMyMovies, renderMyMovies, addMovie, editMovie, deleteMovie.
*/
// ---------------------------------------------------------
 // Função para buscar filmes por nome da API TMDb
    function fetchMovies(query) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
            .then(response => response.json())
            .then(data => {
                movies = data.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }));
                renderSearchResults(movies);
            });
    }

    // Função para mostrar resultados da pesquisa
    function renderSearchResults(results) {
        searchResults.innerHTML = '';
        results.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${movie.title}</h3>
                <img src="${movie.image}" alt="${movie.title}">
                <button onclick="addToMyMovies(${movie.id})">Adicionar em minha Lista</button>
            `;
            searchResults.appendChild(card);
        });
    }

    // Função para adicionar filme à lista
    window.addToMyMovies = function (id) {
        const movie = movies.find(m => m.id === id);
        if (movie && !myMovies.find(m => m.id === movie.id)) {
            myMovies.push(movie);
            renderMyMovies();
            closeSearchModal();  
        }
    }

    // Função para mostrar filmes na lista principal
    function renderMyMovies() {
        moviesContainer.innerHTML = '';
        myMovies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${movie.title}</h3>
                <img src="${movie.image}" alt="${movie.title}">
                <button onclick="editMovie(${movie.id})">Editar</button>
                <button onclick="deleteMovie(${movie.id})">Delete</button>
            `;
            moviesContainer.appendChild(card);
        });
    }

    // Função para adicionar novo filme
    function addMovie() {
        const title = movieTitleInput.value;
        const image = movieImageInput.value;

        if (editingMovieId) {
            const movie = myMovies.find(m => m.id === editingMovieId);
            movie.title = title;
            movie.image = image;
            editingMovieId = null;
        } else {
            const id = Date.now();
            myMovies.push({ id, title, image });
        }

        renderMyMovies();
        modal.style.display = 'none';
        movieForm.reset();
    }

    // Função para editar filme
    window.editMovie = function (id) {
        const movie = myMovies.find(m => m.id === id);
        if (movie) {
            editingMovieId = id;
            movieTitleInput.value = movie.title;
            movieImageInput.value = movie.image;
            modal.style.display = 'block';
        }
    }

    // Função para deletar filme
    window.deleteMovie = function (id) {
        myMovies = myMovies.filter(m => m.id !== id);
        renderMyMovies();
    }

    // Função para abrir o modal de pesquisa
    searchBtn.onclick = function () {
        searchModal.style.display = 'flex'; 
        searchInput.focus(); 
    }

    // Função para fechar o modal de pesquisa
    function closeSearchModal() {
        searchModal.style.display = 'none';
        searchInput.value = '';  
        searchResults.innerHTML = '';  
    }

    closeSearchModalBtn.onclick = closeSearchModal;

    // Função para abrir o modal de adicionar/editar filme
    addMovieBtn.onclick = function () {
        modal.style.display = 'flex';
    }

    // Função para fechar o modal de adicionar/editar filme
    closeModalBtn.onclick = function () {
        modal.style.display = 'none';
    }

    // Fechar os modais quando clicar fora deles
    window.onclick = function (event) {
        if (event.target === searchModal) {
            closeSearchModal();
        }
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Fechar os modais quando pressionar a tecla "Esc"
    window.onkeydown = function (event) {
        if (event.key === 'Escape') {
            closeSearchModal();
            modal.style.display = 'none';
        }
    }

    // Evento de submit do formulário de filme
    movieForm.onsubmit = function (event) {
        event.preventDefault();
        addMovie();
    }

    // Evento de clique do botão de buscar filme
    searchMovieBtn.onclick = function () {
        const query = searchInput.value.trim();
        if (query) {
            fetchMovies(query);
        }
    }

    // Certifique-se de que os modais começam fechados
    searchModal.style.display = 'none';
    modal.style.display = 'none';
});
