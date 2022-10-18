/* 
Choose your character

Rule of thumb: 
if you only ever need ONE of something
use a module,
if you need multiples of something,
create them with factories
*/

/* Factory functions for anything of which 
you need multiple (e.g., players)

const FactoryFunction = (argument1, argument2) => {
    const _privateVariable = 'I stay within function';
    const _privateFunction = () => {};
    const variable = 'I will be returned to the outside of function';
    const function = () => {};
    return {argument1, argument2, variable, function}
}
(returns an object when called)

Modules for something of which you do not need copies

const Module = (function() {
    const _privateVariable = "foo";
    const variable = "bar";

    function _privateMethod() {
        console.log(_privateProperty);
    }

    function publicMethod() {
        _privateMethod();
    }
    return {
    variable,
    publicMethod
    };
})();

*/

// const createPlayer = (char) => {
//     return { char };
// }


const el = (selector) => document.querySelector(selector);

const start = (function () {
    let player1 = {};
    let player2 = {};
    const board = el(".board");
    const one = el(".one");
    const two = el(".two");
    const charSelect = el(".character-select");
    const xChar = document.createElement('div');
    xChar.classList.add('char', 'x')
    const oChar = document.createElement('div');
    oChar.classList.add('char', 'o');
    const display = el(".start-screen");
    const textDisplay = el(".text-display");

    function displayCharSelect() {
        one.remove();
        two.remove();
        charSelect.appendChild(xChar);
        charSelect.appendChild(oChar);
    }
    one.addEventListener("click", () => {
        displayCharSelect();
        createPlayer(1);
    })
    two.addEventListener("click", () => {
        displayCharSelect();
        createPlayer(2);
    })

    const createPlayer = (players) => {
        if (players === 2) {
            textDisplay.innerText = `Player 1\nChoose your character`;
        } else {
            textDisplay.textContent = `Choose your character`;
        }
        addCharSelectFunction(xChar, 'x');
        addCharSelectFunction(oChar, 'o');

        function addCharSelectFunction(element, character) {
            element.textContent = "";
            element.classList.add(character);
            element.addEventListener("click", () => {
                if (players === 1) {
                    player1.char = character;
                    board.classList.add(character);
                    gameBoard.initializeGame();
                } else {
                    if (!player1.char) {
                        player1.char = character;
                        board.classList.add(character);
                        textDisplay.innerText = `Player 2\nChoose your character`;
                        element.style.cssText = "opacity: 0.1; cursor: not-allowed";
                    } else {
                        if (player1.char === character) {
                            return
                        } else {
                            player2.char = character;
                            gameBoard.initializeGame();
                        }
                    }
                }
            })
        }
    };
    return { player1, player2, display, board };
})();

const gameBoard = (function () {
    let count = {};
    let teamX = {
        marks: [],
        character: 'X',
    };
    let teamO = {
        marks: [],
        character: 'O'
    };
    if (start.player1.char === "x") {
        teamX.player = "player1";
        teamO.player = "player2";
    } else {
        teamX.player = "player2";
        teamO.player = "player1";
    }
    const cells = document.querySelectorAll(".cell");
    const cellArray = Array.from(cells);
    function initializeGame() {
        start.display.classList.add("hide");
        setTimeout(() => {
            start.display.remove();
        }, 300)
        cells.forEach((cell) => {
            cell.addEventListener('click', (e) => {
                let place = cellArray.indexOf(cell);
                console.log(place);
                if (cell.classList.contains('o') || cell.classList.contains('x')
                    || endGame.checkForWin.won) return
                if (start.board.classList.contains('x')) {
                    cell.classList.add(`x`);
                    teamX.marks.push(place);
                    endGame.checkForWin(teamX);
                    computerMove(teamX);
                    start.board.classList.remove('x');
                    start.board.classList.add('o');
                } else if (start.board.classList.contains('o')) {
                    cell.classList.add('o');
                    teamO.marks.push(place);
                    endGame.checkForWin(teamO);
                    start.board.classList.remove('o');
                    start.board.classList.add('x');
                }
            })
        })
    }

    function computerMove(team) {
        let options = [];
        const winPossibilities = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < winPossibilities.length; i++) {
            let currentWinPossibility = winPossibilities[i];
            count[i] = 0;
            for (let o = 0; o < currentWinPossibility.length; o++) {
                for (let p = 0; p < team.marks.length; p++) {
                    if (team.marks[p] === currentWinPossibility[o]) {
                        count[i] += 1;
                    }
                }
            }
        }
    }
    return { initializeGame, cells, teamX, teamO, count }
})();

const endGame = (function () {
    const cellContainer = document.querySelector('.cell-container');
    const winDisplay = document.querySelector('.winDisplay');
    const buttonContainer = document.createElement('div');
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    const characterSelectButton = document.createElement('button');
    characterSelectButton.textContent = 'Character Select';
    buttonContainer.append(playAgainButton, characterSelectButton);
    let strike;

    function checkForWin(team) {
        if (gameBoard.teamX.marks.length + gameBoard.teamO.marks.length === 9) {
            winDisplay.textContent = 'Draw!';
            winDisplay.appendChild(buttonContainer);
        }
        checkForWin.won = false;
        const winPossibilities = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];
        function isIncluded(currentValue) {
            return team.marks.includes(currentValue);
        }
        for (let i = 0; i < winPossibilities.length; i++) {
            let check = winPossibilities[i];
            if (check.every(isIncluded)) {
                if (i > 2) {
                    cellContainer.classList.add('rows');
                }
                strike = 'win' + i;
                cellContainer.classList.add(strike);
                checkForWin.won = true;
                winDisplay.textContent = `${team.character} wins!`;
                winDisplay.appendChild(buttonContainer);
            }
        }
    }

    playAgainButton.addEventListener('click', reset);

    characterSelectButton.addEventListener('click', () => {
        location.reload();
    })

    function reset() {
        buttonContainer.remove();
        winDisplay.textContent = "";
        cellContainer.classList.remove(strike, "rows");
        checkForWin.won = false;
        gameBoard.cells.forEach((cell) => {
            cell.classList.remove("x", "o");
        })
        gameBoard.teamX.marks = [];
        gameBoard.teamO.marks = [];
    }
    return { checkForWin }
})();