const players = document.getElementById('players');
const player2 = document.getElementById('player2');
const player1 = document.getElementById('player1');
const select_prefer = document.getElementById('select-prefer');
const game_button_start = document.getElementById('game-button-start');
const game = document.getElementById('game');
const rsp_selector = document.createElement('div');
const result_div= document.getElementById('results');
const rsp_command = document.createElement('h2');

const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const tieSound = document.getElementById('tie-sound');
const loseSound = document.getElementById('lose-sound');

// Función para reproducir sonidos
function playSound(audioElement) {
    audioElement.currentTime = 0; // Reinicia el audio si ya se está reproduciendo
    audioElement.play();
}

// Selecciona todos los botones
const buttons = document.querySelectorAll('button');

// Itera sobre cada botón para agregar un evento de clic
buttons.forEach(button => {
    button.addEventListener('click', () => {
        playSound(clickSound); // Reproduce el sonido al hacer clic
    });
});


rsp_selector.id = 'rsp_selector';

const imgs = ["./rock.png", "./scissors.png", "./paper.png"];
const names = ["rock", "scissors", "paper"];
const alt = ["rock", "scissors", "paper"];


function Start(num) {
    if (num === 2) {
        players.style.display = 'block';
        select_prefer.style.display = 'none';
    } else {
        players.style.display = 'none';
        select_prefer.style.display = 'none';
        game.style.display = 'block';
        CreateSelector();
    }
}


game_button_start.addEventListener('click', function() {
    

    if (player1.value.trim() === '' || player2.value.trim() === '') {
        alert("Please fill in all the fields");
    } else {
        players.style.display = 'none';
        game.style.display = 'block';
        CreateSelectorMultiplayer()
    }
});


function CreateSelector() {
    rsp_selector.innerHTML = "";
    rsp_selector.style.display = "block";
    result_div.style.display = "none";

    game.appendChild(rsp_command);

    for (let i = 0; i < imgs.length; i++) {
        const butn_selector = document.createElement('span');
        const img = document.createElement('img');

        img.src = imgs[i];
        img.alt = alt[i];
        img.className = 'rsp_img';
        butn_selector.className = 'rsp_butn';

        butn_selector.appendChild(img);
        butn_selector.addEventListener('click', function() {
            Play_Computer(names[i]);
            playSound(clickSound);
        });

        rsp_selector.appendChild(butn_selector);
        game.appendChild(rsp_selector);
    }

    rsp_command.textContent = "Make your choice:";
    rsp_command.style.display = "block";
    rsp_command.className = "decorText command";
}


function Play_Computer(playerChoice) {
    const computerChoice = names[Math.floor(Math.random() * names.length)];
    const result = getResult(playerChoice, computerChoice);

    result_div.style.display = "block";
    rsp_selector.style.display = "none";
    rsp_command.style.display = "none";
    

    result_div.innerHTML = `
        <p>You chose: <span>${playerChoice}</span></p>
        <p>Computer chose: <span>${computerChoice}</span></p>
        <p>${result}</p>
        <button onclick="CreateSelector()" id="play-again" class="butn-decor">Play Again</button>
        <button id="return-button" class="butn-decor" onclick="Return()">Menu</button>
    `;
}

function getResult(player, computer) {
    if (player === computer) {
        playSound(tieSound); // Sonido de empate
        return `<h2 class="decorText pixel" id="tie">It's a tie!</h2>`;
    }
    if (
        (player === "rock" && computer === "scissors") ||
        (player === "scissors" && computer === "paper") ||
        (player === "paper" && computer === "rock")
    ) {
        playSound(winSound); // Sonido de victoria
        return `<h2 class="decorText pixel" id="win">${player} destroyed ${computer}...<span>${player} wins!</span></h2>`;
    }
    playSound(loseSound); // Sonido de derrota
    return `<h2 class="decorText pixel" id="lose">${computer} destroyed ${player}...<span>${computer} wins!</span></h2>`;
}

function Return() {
    // Mostrar el menú principal
    select_prefer.style.display = "block";

    // Ocultar áreas de juego y resultados
    game.style.display = "none";
    result_div.style.display = "none";
    rsp_selector.style.display = "none";

    // Reiniciar variables para multijugador
    playerChoices = { player1: null, player2: null };
    currentPlayer = 1;

    // Mantener el encabezado limpio si existe
    const turnHeader = document.getElementById('turn-header');
    if (turnHeader) turnHeader.remove();

    // Limpiar solo el selector de jugadas
    rsp_selector.innerHTML = "";
    rsp_command.innerHTML = "";
}




let currentPlayer = 1;
let playerChoices = { player1: null, player2: null };

function CreateSelectorMultiplayer() {
    rsp_selector.innerHTML = "";
    rsp_selector.style.display = "block";
    result_div.style.display = "none";

    // Mostrar el nombre del jugador actual en lugar de modificar game.innerHTML
    const playerName = currentPlayer === 1 ? player1.value : player2.value;

    // Crear un encabezado dinámico para mostrar el turno del jugador
    const turnHeader = document.getElementById('turn-header') || document.createElement('h2');
    turnHeader.id = 'turn-header';
    turnHeader.className = "command"
    turnHeader.textContent = `${playerName}, make your choice:`;
    game.appendChild(turnHeader);

    for (let i = 0; i < imgs.length; i++) {
        const butn_selector = document.createElement('span');
        const img = document.createElement('img');

        img.src = imgs[i];
        img.alt = alt[i];
        img.className = 'rsp_img';
        butn_selector.className = 'rsp_butn';

        butn_selector.appendChild(img);
        butn_selector.addEventListener('click', function() {
            handleMultiplayerSelection(names[i]);
            playSound(clickSound);
        });

        rsp_selector.appendChild(butn_selector);
    }

    game.appendChild(rsp_selector); // Asegurarse de que el selector esté visible
}

function handleMultiplayerSelection(choice) {
    if (currentPlayer === 1) {
        playerChoices.player1 = choice;
        currentPlayer = 2;

        // Limpiar el encabezado y preparar el siguiente turno
        const existingH2 = document.getElementById('turn-header');
        if (existingH2) existingH2.remove();

        CreateSelectorMultiplayer();
    } else {
        playerChoices.player2 = choice;

        // Retrasar ligeramente para garantizar que el DOM esté actualizado
        setTimeout(() => {
            ShowMultiplayerResult();
        }, 100); // Ajusta el tiempo si es necesario
    }
}

function ShowMultiplayerResult() {
    // Limpia encabezados previos
    const existingH2 = document.getElementById('turn-header');
    if (existingH2) existingH2.remove();

    // Mostrar los resultados
    result_div.style.display = 'block';
    rsp_selector.style.display = 'none';

    result_div.innerHTML = `
        <p>${player1.value} chose: <span>${playerChoices.player1}</span></p>
        <p>${player2.value} chose: <span>${playerChoices.player2}</span></p>
        <p>${getResult(playerChoices.player1, playerChoices.player2)}</p>
        <button onclick="resetMultiplayerGame()" id="play-again" class="butn-decor">Play Again</button>
        <button id="return-button" class="butn-decor" onclick="Return()">Menu</button>
    `;
}

function resetMultiplayerGame() {
    playerChoices = { player1: null, player2: null };
    currentPlayer = 1;

    // Asegúrate de que el resultado no permanezca visible
    result_div.style.display = 'none';
    CreateSelectorMultiplayer();
}





const backgroundSound = document.getElementById('background-music');

function playBackgroundSound() {
    setTimeout(() => {
        backgroundSound.play().catch(err => {
            console.error("Aún no es posible reproducir el sonido:", err);
        });
    }, 500); // Espera 500ms después de la interacción
}

window.addEventListener('load', () => {
    document.body.addEventListener('mousemove', playBackgroundSound, { once: true });
});



