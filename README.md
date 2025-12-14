# Klockan - Clock Solitaire

A web-based implementation of the card game "Klockan" (Clock Patience/Solitaire).

## About the Game

Klockan is a classic solitaire card game where cards are arranged in a clock pattern. The goal is to place all cards in their correct positions (Ace at 1 o'clock, 2 at 2 o'clock, etc., with King in the center).

## Features

- **Modern Tech Stack**: Built with vanilla JavaScript ES6+, CSS3, and HTML5
- **No Dependencies**: Uses pure JavaScript
- **CSS-Generated Cards**: Playing cards rendered with CSS and Unicode symbols
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **CSS Custom Properties**: Modern styling with CSS variables for easy theming
- **Local Storage**: Tracks your wins and total games played
- **Smooth Animations**: CSS transitions and animations for enhanced UX

## Technologies Used

- **HTML5** - Semantic markup with Bootstrap 5
- **CSS3** - Modern features including:
  - CSS Grid and Flexbox
  - CSS Custom Properties (variables)
  - CSS Gradients and Animations
  - Responsive media queries
- **JavaScript ES6+**
- **Bootstrap 5**

## Project Structure

```
Klockan/
├── index.html          # Main HTML file
├── styles/
│   └── custom.css      # Modern CSS with variables and grid
├── scripts/
│   └── custom.js       # Vanilla ES6+ JavaScript
└── README.md           # This file
```

## How to Play

1. Click **"Nytt spel"** (New Game) to start
2. Click **"Lägg kort"** (Place Card) to draw and place cards
3. Cards are placed in a clock pattern (12 positions + 1 center)
4. Match cards to their positions (Ace=1, Jack=11, Queen=12, King=13)
5. Win by correctly placing all cards!

## Running Locally

Simply open `index.html` in a modern web browser. No build process or server required!

```bash
# Clone the repository
git clone https://github.com/Drutten/Klockan.git

# Navigate to the directory
cd Klockan

# Open in your browser
open index.html  # macOS
start index.html # Windows
```

## Modernization Updates (2025)

This project has been modernized from its 2020 version. For detailed information about the changes, see [MODERNIZATION_NOTES.md](MODERNIZATION_NOTES.md).
