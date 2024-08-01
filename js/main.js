class GameService {
    constructor(apiKey, apiHost) {
        this.apiKey = apiKey;
        this.apiHost = apiHost;
    }

    async fetchGames(category = 'shooter') {
        this.showLoadingScreen();
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.hideLoadingScreen();
            console.log(data)
            return data;
        } catch (error) {
            console.error(error);
            this.hideLoadingScreen();
            return [];
        }
    }

    async fetchGameDetails(id) {
        this.showLoadingScreen();
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.hideLoadingScreen();
            return data;

        } catch (error) {
            console.error(error);
            this.hideLoadingScreen();
            return null;
        }
    }

    showLoadingScreen() {
        document.getElementById('loadingScreen').classList.remove('d-none');
    }

    hideLoadingScreen() {
        document.getElementById('loadingScreen').classList.add('d-none');
    }
}

class UI {
    constructor(gameService) {
        this.gameService = gameService;
        this.links = document.querySelectorAll('.navbar .navbar-nav a');
        this.row = document.querySelector('.row');
        this.homeSection = document.querySelector('#home');
        this.detailsSection = document.querySelector('.details');
        this.initEventListeners();
        this.loadDefaultGames();
    }

    initEventListeners() {
        this.links.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                let category = e.target.getAttribute('data-cat');
                let games = await this.gameService.fetchGames(category);
                this.displayGames(games);
            });
        });
    }

    async loadDefaultGames() {
        let defaultGames = await this.gameService.fetchGames();
        this.displayGames(defaultGames);
    }

    displayGames(dataArray) {
        let box = '';
        dataArray.forEach(game => {
            box += `
            <div class="card-item col-xl-3 col-lg-4 col-md-6 col-sm-12">
                <div class="card h-100 bg-transparent" data-id="${game.id}">
                    <div class="card-body">
                        <div class="position-relative">
                            <img class="card-img-top object-fit-cover h-100" src="${game.thumbnail}">
                        </div>
                        <div>
                            <div class="hstack my-3 justify-content-between">
                                <h3 class="h6 small">${game.title}</h3>
                                <span class="badge text-bg-primary p-2">Free</span>
                            </div>
                            <p class="card-text small text-center opacity-50">
                                ${game.short_description}
                            </p>
                        </div>
                    </div>
                    <footer class="card-footer small hstack justify-content-between">
                        <span class="badge badge-color">${game.genre}</span>
                        <span class="badge badge-color">${game.platform}</span>
                    </footer>
                </div>
            </div>
            `;
        });
        this.row.innerHTML = box;

        let cards = this.row.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                let gameId = card.getAttribute('data-id');
                this.showGameDetails(gameId);
            });
        });
    }

    async showGameDetails(id) {
        this.homeSection.classList.add('d-none');
        this.detailsSection.classList.remove('d-none');
        this.detailsSection.innerHTML = '';

        let gameDetails = await this.gameService.fetchGameDetails(id);
        if (gameDetails) {
            this.displayDetails(gameDetails);
        }
    }

    displayDetails(detailGame) {
        let detailContent = `
        <div class="container">
            <header class="hstack justify-content-between">
                <h1 class="text-center h3 py-4 text-white">Details Game</h1>
                <button class="btn-close btn-close-white" id="btnClose"></button>
            </header>
            <div class="row g-4" id="detailsContent">
                <div class="col-md-4">
                    <div class="picture">
                        <img src="${detailGame.thumbnail}" class="w-100" alt="">
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="content text-white">
                        <h4>Title: ${detailGame.title}</h4>
                        <p class="py-2">Category: <span class="bg-info text-black rounded px-1">${detailGame.genre}</span></p>
                        <p class="pb-2">Platform: <span class="bg-info text-black rounded px-1">${detailGame.platform}</span></p>
                        <p>Status: <span class="bg-info text-black rounded px-1">${detailGame.status}</span></p>
                        <p>${detailGame.description}</p>
                        <button class="btn btn-outline-warning">
                            <a href="${detailGame.freetogame_profile_url}" target="_blank" class="text-decoration-none text-white">Show Game</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
        this.detailsSection.innerHTML = detailContent;

        document.getElementById('btnClose').addEventListener('click', () => {
            this.detailsSection.classList.add('d-none');
            this.homeSection.classList.remove('d-none');
        });
    }
}

const apiKey = '74bc22de12msh664c7a31eb59d13p1fcc97jsna0471ba836a1';
const apiHost = 'free-to-play-games-database.p.rapidapi.com';

const gameService = new GameService(apiKey, apiHost);
const ui = new UI(gameService);



