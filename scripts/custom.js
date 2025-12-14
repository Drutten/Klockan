// ES6+ JavaScript - Clock Solitaire Game
'use strict';

// Card configuration with Unicode symbols
const SUITS = {
  Hearts: { name: 'Hearts', symbol: '♥', color: 'red' },
  Diamonds: { name: 'Diamonds', symbol: '♦', color: 'red' },
  Clubs: { name: 'Clubs', symbol: '♣', color: 'black' },
  Spades: { name: 'Spades', symbol: '♠', color: 'black' }
};

const VALUES = {
  Ace: { name: 'Ace', display: 'A', numeric: 1 },
  Two: { name: 'Two', display: '2', numeric: 2 },
  Three: { name: 'Three', display: '3', numeric: 3 },
  Four: { name: 'Four', display: '4', numeric: 4 },
  Five: { name: 'Five', display: '5', numeric: 5 },
  Six: { name: 'Six', display: '6', numeric: 6 },
  Seven: { name: 'Seven', display: '7', numeric: 7 },
  Eight: { name: 'Eight', display: '8', numeric: 8 },
  Nine: { name: 'Nine', display: '9', numeric: 9 },
  Ten: { name: 'Ten', display: '10', numeric: 10 },
  Jack: { name: 'Jack', display: 'J', numeric: 11 },
  Queen: { name: 'Queen', display: 'Q', numeric: 12 },
  King: { name: 'King', display: 'K', numeric: 13 }
};

// Game state
const gameState = {
  playerScore: 0,
  gamesPlayed: 0,
  counter: 0,
  stacks: Array.from({ length: 13 }, () => []),
  correctlyPlaced: [],
  deck: [],
  isPlacingCard: false, // Prevent rapid clicking
  sounds: {
    card: new Audio('card.wav'),
    success: new Audio('success.wav'),
    win: new Audio('fanfar.mp3'),
    lose: new Audio('lose.mp3')
  }
};

// DOM Elements
const elements = {
  gameBtn: document.getElementById('game-btn'),
  cardDeckContainer: document.getElementById('card-deck-container'),
  cardDeck: document.getElementById('card-deck'),
  deckCards: null, // Will be set after DOM loads
  deckCount: null, // Will be set after DOM loads
  stopBtn: document.getElementById('stop-btn'),
  clearBtn: document.getElementById('clear-btn'),
  gameInfo: document.getElementById('game-info'),
  clock: document.getElementById('clock')
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  loadScore();
  elements.deckCards = document.querySelector('.deck-cards');
  elements.deckCount = document.querySelector('.deck-count');
  setupEventListeners();
  updateGameInfo();
});

// Local Storage Management
function loadScore() {
  if (typeof Storage !== 'undefined') {
    gameState.playerScore = parseInt(localStorage.getItem('score') || '0', 10);
    gameState.gamesPlayed = parseInt(localStorage.getItem('numGames') || '0', 10);
  }
}

function saveScore() {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('score', gameState.playerScore.toString());
    localStorage.setItem('numGames', gameState.gamesPlayed.toString());
  }
}

function clearScore() {
  if (typeof Storage !== 'undefined') {
    localStorage.removeItem('score');
    localStorage.removeItem('numGames');
  }
  gameState.playerScore = 0;
  gameState.gamesPlayed = 0;
}

// Event Listeners
function setupEventListeners() {
  elements.gameBtn.addEventListener('click', startNewGame);
  elements.cardDeck.addEventListener('click', drawAndPlaceCard);
  elements.stopBtn.addEventListener('click', stopGame);
  elements.clearBtn.addEventListener('click', clearProgress);
}

// Game Logic
function startNewGame() {
  removeAllCards();
  elements.gameInfo.innerHTML = `Antal vunna spel: ${gameState.playerScore}<br>Totalt antal spel: ${gameState.gamesPlayed}`;
  
  fillCorrectlyPlaced();
  
  elements.gameBtn.style.display = 'none';
  elements.cardDeckContainer.style.display = 'block';
  elements.stopBtn.style.display = 'inline-block';
  elements.clearBtn.style.display = 'none';
  
  gameState.deck = createDeck();
  shuffleDeck(gameState.deck);
  gameState.counter = 0; // Start at 0, will increment to 1 on first draw
  
  updateDeckDisplay();
}

function drawAndPlaceCard() {
  if (gameState.deck.length === 0 || gameState.isPlacingCard) return;
  
  gameState.isPlacingCard = true;
  
  // Find the next position that doesn't have a correctly placed card
  let nextPosition = gameState.counter;
  do {
    nextPosition++;
    if (nextPosition > 13) {
      nextPosition = 1;
    }
  } while (gameState.correctlyPlaced[nextPosition - 1]);
  
  gameState.counter = nextPosition;
  
  // Double-check this position is not already correctly placed
  if (gameState.correctlyPlaced[gameState.counter - 1]) {
    return;
  }
  
  const card = getNextCard();
  const targetPosition = document.getElementById(`c${gameState.counter}`);
  
  // Create flying card animation
  createFlyingCard(card, targetPosition, () => {
    // After animation, place the card
    gameState.sounds.card.play().catch(() => {});
    
    // Check if card value matches the position AND this position doesn't already have a correct card
    const cardValue = getCardNumericValue(card);
    const isCorrect = cardValue === gameState.counter && !gameState.correctlyPlaced[gameState.counter - 1];
    
    if (isCorrect) {
      // Return all stacked cards to deck
      gameState.stacks[gameState.counter - 1].forEach(stackedCard => {
        gameState.deck.push(stackedCard);
      });
      gameState.stacks[gameState.counter - 1] = [];
      
      // Place the correct card - clear everything first
      targetPosition.innerHTML = '';
      const cardElement = createCardElement(card);
      targetPosition.appendChild(cardElement);
      
      gameState.sounds.success.play().catch(() => {});
      targetPosition.classList.add('shadow');
      gameState.correctlyPlaced[gameState.counter - 1] = true;
    } else {
      // Add this incorrect card to the stack
      gameState.stacks[gameState.counter - 1].push(card);
      
      // Place the card (will be replaced by next card at this position)
      targetPosition.innerHTML = '';
      targetPosition.classList.remove('shadow');
      const cardElement = createCardElement(card);
      targetPosition.appendChild(cardElement);
    }
    
    updateDeckDisplay();
    
    if (checkWin()) {
      winGame();
    } else if (gameState.deck.length === 0) {
      gameOver();
    }
    
    // Re-enable card placement
    gameState.isPlacingCard = false;
  });
}

function createFlyingCard(card, targetElement, callback) {
  const deckRect = elements.deckCards.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  
  // Create temporary flying card
  const flyingCard = createCardElement(card);
  flyingCard.classList.add('flying-card');
  flyingCard.style.left = `${deckRect.left}px`;
  flyingCard.style.top = `${deckRect.top}px`;
  flyingCard.style.setProperty('--fly-x', `${targetRect.left - deckRect.left}px`);
  flyingCard.style.setProperty('--fly-y', `${targetRect.top - deckRect.top}px`);
  
  document.body.appendChild(flyingCard);
  
  // Remove flying card and execute callback after animation
  setTimeout(() => {
    if (flyingCard.parentNode) {
      flyingCard.parentNode.removeChild(flyingCard);
    }
    callback();
  }, 600);
}

function placeCard() {
  // Find next position that isn't correctly placed
  do {
    gameState.counter++;
    if (gameState.counter > 13) {
      gameState.counter = 1;
    }
  } while (gameState.correctlyPlaced[gameState.counter - 1]);
  
  const card = getNextCard();
  gameState.sounds.card.play().catch(() => {}); // Ignore audio errors
  
  const cardElement = createCardElement(card);
  const position = document.getElementById(`c${gameState.counter}`);
  position.innerHTML = '';
  position.appendChild(cardElement);
  
  if (getCardNumericValue(card) === gameState.counter) {
    gameState.sounds.success.play().catch(() => {});
    position.classList.add('shadow');
    gameState.correctlyPlaced[gameState.counter - 1] = true;
    
    // Return stacked cards to deck
    gameState.stacks[gameState.counter - 1].forEach(stackedCard => {
      gameState.deck.push(stackedCard);
    });
    gameState.stacks[gameState.counter - 1] = [];
  } else {
    gameState.stacks[gameState.counter - 1].push(card);
  }
  
  updateDeckDisplay();
  
  if (checkWin()) {
    winGame();
  } else if (gameState.deck.length === 0) {
    gameOver();
  }
}

function stopGame() {
  resetGame();
  removeAllCards();
}

function updateGameInfo() {
  if (gameState.gamesPlayed > 0) {
    const winRate = Math.round((gameState.playerScore / gameState.gamesPlayed) * 100);
    elements.gameInfo.innerHTML = `Vunna: ${gameState.playerScore} | Spelade: ${gameState.gamesPlayed} | Vinst%: ${winRate}% (Normal: 1-2%)`;
  } else {
    elements.gameInfo.innerHTML = 'Klockan är ett svårt spel - bara 1-2% av spel går att vinna!';
  }
}

function clearProgress() {
  if (confirm('Är du säker på att du vill rensa all statistik?')) {
    elements.gameInfo.innerHTML = '';
    clearScore();
    removeAllCards();
    updateGameInfo();
    alert('Statistik rensad!');
  }
}

// Card Management
function createDeck() {
  const deck = [];
  let id = 0;
  
  Object.values(SUITS).forEach(suit => {
    Object.values(VALUES).forEach(value => {
      deck.push({
        suit: suit.name,
        suitSymbol: suit.symbol,
        suitColor: suit.color,
        value: value.name,
        valueDisplay: value.display,
        numericValue: value.numeric,
        id: id++
      });
    });
  });
  
  // Verify we have exactly 52 cards
  if (deck.length !== 52) {
    console.error(`Deck has ${deck.length} cards instead of 52!`);
  }
  
  return deck;
}

function shuffleDeck(deck) {
  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getNextCard() {
  return gameState.deck.shift();
}

function createCardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.className = `playing-card ${card.suitColor}`;
  
  const topValue = document.createElement('div');
  topValue.className = 'card-value';
  topValue.textContent = card.valueDisplay;
  
  const suitSymbol = document.createElement('div');
  suitSymbol.className = 'card-suit';
  suitSymbol.textContent = card.suitSymbol;
  
  const bottomValue = document.createElement('div');
  bottomValue.className = 'card-bottom';
  bottomValue.textContent = card.valueDisplay;
  
  cardDiv.appendChild(topValue);
  cardDiv.appendChild(suitSymbol);
  cardDiv.appendChild(bottomValue);
  
  return cardDiv;
}

function removeAllCards() {
  for (let i = 1; i <= 13; i++) {
    const position = document.getElementById(`c${i}`);
    position.innerHTML = '';
    position.classList.remove('shadow');
  }
}

function getCardNumericValue(card) {
  return card.numericValue;
}

// Game State Management
function resetGame() {
  elements.gameBtn.style.display = 'inline-block';
  elements.cardDeckContainer.style.display = 'none';
  elements.stopBtn.style.display = 'none';
  elements.clearBtn.style.display = 'inline-block';
  elements.gameInfo.innerHTML = '';
  
  removeAllCards();
  
  gameState.stacks = Array.from({ length: 13 }, () => []);
  gameState.correctlyPlaced = [];
  gameState.deck = [];
  gameState.counter = 0;
}

function updateDeckDisplay() {
  const count = gameState.deck.length;
  if (elements.deckCount) {
    elements.deckCount.textContent = `${count} kort kvar`;
  }
  
  // Hide deck when empty
  if (count === 0 && elements.cardDeckContainer) {
    elements.deckCards.style.opacity = '0.3';
    elements.cardDeck.style.cursor = 'not-allowed';
  }
}

function winGame() {
  gameState.sounds.win.play().catch(() => {});
  resetGame();
  gameState.playerScore++;
  gameState.gamesPlayed++;
  saveScore();
  elements.gameInfo.innerHTML = 'Grattis! 🎉';
}

function gameOver() {
  gameState.sounds.lose.play().catch(() => {});
  resetGame();
  gameState.gamesPlayed++;
  saveScore();
  elements.gameInfo.innerHTML = 'Slut på spelkort! Bättre lycka nästa gång 😔';
}

function checkWin() {
  return gameState.correctlyPlaced.every(placed => placed === true);
}

function fillCorrectlyPlaced() {
  gameState.correctlyPlaced = Array(13).fill(false);
}
