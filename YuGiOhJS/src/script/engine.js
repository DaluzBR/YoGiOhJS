const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        cardPlayer: "player-field-card",
        cardComputer: "computer-field-card",
        playerBox: document.querySelector("#player-cards"),
        computerBox: document.querySelector("#computer-cards"),
        player1: "player-cards",
        computer: "computer-cards"
    },
    actions: {
        button: document.getElementById("next-duel"),
    }
}

const ATTACK_ROCK = 0;
const ATTACK_PAPER = 1;
const ATTACK_SCISSOR = 2;

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/blue_eyes_white_dragon.png",
        attack: ATTACK_PAPER,
    }, {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/dark_magician.png",
        attack: ATTACK_ROCK,
    }, {
        id: 2,
        name: "Exordia",
        type: "Scissors",
        img: "./src/assets/icons/exodia.png",
        attack: ATTACK_SCISSOR,
    }, 
    {
        id: 3,
        name: "Apooliphort Towers",
        type: "Paper",
        img: "./src/assets/icons/apooliphort_towers.png",
        attack: ATTACK_PAPER,
    },
    {
        id: 4,
        name: "Black Rose Dragon",
        type: "Rock",
        img: "./src/assets/icons/black_rose_dragon.png",
        attack: ATTACK_ROCK,
    },
    {
        id: 5,
        name: "Giltia",
        type: "Scissors",
        img: "./src/assets/icons/giltia.png",
        attack: ATTACK_SCISSOR,
    },
    {
        id: 6,
        name: "Magician of Chaos",
        type: "Paper",
        img: "./src/assets/icons/magician_chaos.png",
        attack: ATTACK_PAPER,
    },
    {
        id: 7,
        name: "Morphing Jar",
        type: "Rock",
        img: "./src/assets/icons/morphing_jar.png",
        attack: ATTACK_ROCK,
    },
    {
        id: 8,
        name: "Pumpking",
        type: "Scissors",
        img: "./src/assets/icons/pumpking.png",
        attack: ATTACK_SCISSOR,
    },
    {
        id: 9,
        name: "Ruklamba",
        type: "Paper",
        img: "./src/assets/icons/ruklamba.png",
        attack: ATTACK_PAPER,
    },
    {
        id: 10,
        name: "Winged Dragon",
        type: "Rock",
        img: "./src/assets/icons/winged_dragon.png",
        attack: ATTACK_ROCK,
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(randomIdCard)
        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        });
        
        cardImage.addEventListener("mouseleave", () => {
            cardSpritesDefault();
        });
    }

    return cardImage;
}

async function setCardsField(playerCardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImage(true);

    await hiddenCardDetails();

    await drawCardsInField(playerCardId, computerCardId)

    let duelResults = await checkDuelResults(playerCardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(playerCardId, computerCardId){
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}
async function showHiddenCardFieldsImage(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];
    let computerCard = cardData[computerCardId];

    console.log(`playerCardId: ${playerCard.attack} | computerCardId: ${computerCard.attack} | `);

    if (playerCard.attack === ATTACK_PAPER && computerCard.attack === ATTACK_ROCK||
        playerCard.attack === ATTACK_ROCK && computerCard.attack === ATTACK_SCISSOR||
        playerCard.attack === ATTACK_SCISSOR && computerCard.attack === ATTACK_PAPER) {
        duelResults = "Ganhou!";
        state.score.playerScore++;
        await playAudio("win.wav");
    } else   if (playerCard.attack === ATTACK_ROCK && computerCard.attack === ATTACK_PAPER||
        playerCard.attack === ATTACK_PAPER && computerCard.attack === ATTACK_SCISSOR||
        playerCard.attack === ATTACK_SCISSOR && computerCard.attack === ATTACK_ROCK) {
        duelResults = "Perdeu!";
        state.score.computerScore++;

        await playAudio("lose.wav");
    }else{
        duelResults = "Empate!";
        await playAudio("draw.mp3");
    }

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBox, playerBox } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
async function cardSpritesDefault(){
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";
    state.cardSprites.avatar.src = "./src/assets/icons/card-back.png";
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
   
    cardSpritesDefault();

    init();
}


async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}`);
    try {
        audio.play();
    } catch { }
}


function init() {
    showHiddenCardFieldsImage(false);
    drawCards(7, state.playerSides.player1);
    drawCards(7, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();