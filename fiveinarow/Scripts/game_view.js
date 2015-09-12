/// <reference path="assert.ts"/>
/// <reference path="tile.ts"/>
/// <reference path="grid.ts"/>
var View;
(function (View) {
    var GameView = (function () {
        function GameView(firstPlayerName, secondPlayerName) {
            this.moves = [];
            this.tileContainer = document.querySelector(".tile-container");
            this.firstPlayerScoreContainer = document.querySelector(".first-player-container");
            this.secondPlayerScoreContainer = document.querySelector(".second-player-container");
            this.messageContainer = document.querySelector(".game-message");
            this.gameHintContainer = document.querySelector(".game-intro");
            // TODO: have no idea how to change player names!
        }
        GameView.prototype.introduceNextPlayer = function (playerName) {
            var type = "game-intro";
            var message = playerName + ", this is your turn!";
            this.gameHintContainer.classList.add(type);
            this.gameHintContainer.getElementsByTagName("p")[0].textContent = message;
        };
        GameView.prototype.makeMove = function (x, y, value) {
            if (value) {
                this.addTile(x, y, value);
            }
            else {
                this.removeTile(x, y);
            }
        };
        // Continues the game (both restart and keep playing)
        GameView.prototype.clearMessage = function () {
            this.clearMessages();
        };
        GameView.prototype.victory = function (winner) {
            var type = "game-won";
            var message = winner + ": You win!";
            this.messageContainer.classList.add(type);
            this.messageContainer.getElementsByTagName("p")[0].textContent = message;
        };
        GameView.prototype.draw = function () {
            var type = "game-over";
            var message = "Game over! This is DRAW!!";
            this.messageContainer.classList.add(type);
            this.messageContainer.getElementsByTagName("p")[0].textContent = message;
        };
        GameView.prototype.updateGameStatistics = function (gameStatistics) {
            this.updateScore(gameStatistics.firstPlayerScore, gameStatistics.secondPlayerScore);
        };
        GameView.prototype.updateGameState = function (gameState) {
            var _this = this;
            window.requestAnimationFrame(function () {
                _this.clearContainer(_this.tileContainer);
                var grid = gameState.grid;
                for (var x = 0; x < grid.size; x++) {
                    for (var y = 0; y < grid.size; y++) {
                        var state = grid[x] && grid[x][y];
                        if (state) {
                            _this.addTile(x, y, state.toString());
                        }
                    }
                }
            });
        };
        GameView.prototype.setPlayerNames = function (firstPlayerName, secondPlayerName) {
            // NOT IMPLEMENTED!
            //.first - player - container: .first-player-container
            var first = document.querySelector(".first-player-container");
            first.textContent = 'asfasfa';
            var second = document.querySelector(".first-player-container");
        };
        GameView.prototype.clearContainer = function (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
        GameView.prototype.addTile = function (x, y, tile) {
            var wrapper = document.createElement("div");
            var inner = document.createElement("div");
            // TODO: need to call getTileClass!
            var positionClass = getPositionClass({ x: x, y: y });
            // We can't use classlist because it somehow glitches when replacing classes
            var classes = ["tile", "tile-" + Model.getTileDisplayClass(tile), positionClass];
            this.applyClasses(wrapper, classes);
            inner.classList.add("tile-inner");
            inner.textContent = Model.getTileString(tile);
            classes.push("tile-new");
            this.applyClasses(wrapper, classes);
            // Add the inner part of the tile to the wrapper
            wrapper.appendChild(inner);
            // Put the tile on the board
            this.tileContainer.appendChild(wrapper);
            this.moves.push(wrapper);
        };
        GameView.prototype.removeTile = function (x, y) {
            this.clearMessage();
            var lastMove = this.moves.pop();
            if (lastMove) {
                this.tileContainer.removeChild(lastMove);
            }
        };
        GameView.prototype.applyClasses = function (element, classes) {
            element.setAttribute("class", classes.join(" "));
        };
        GameView.prototype.updateScore = function (firstPlayerScore, secondPlayerScore) {
            this.clearContainer(this.firstPlayerScoreContainer);
            var firstPlayerScoreDiff = firstPlayerScore - this.firstPlayerScore;
            this.firstPlayerScore = firstPlayerScore;
            this.firstPlayerScoreContainer.textContent = this.firstPlayerScore.toString();
            if (firstPlayerScoreDiff > 0) {
                var addition = document.createElement("div");
                addition.classList.add("score-addition");
                addition.textContent = "+" + firstPlayerScoreDiff;
                this.firstPlayerScoreContainer.appendChild(addition);
            }
            this.clearContainer(this.secondPlayerScoreContainer);
            var secondPlayerDiff = secondPlayerScore - this.secondPlayerScore;
            this.secondPlayerScore = secondPlayerScore;
            this.secondPlayerScoreContainer.textContent = this.secondPlayerScore.toString();
            if (secondPlayerDiff > 0) {
                var addition = document.createElement("div");
                addition.classList.add("score-addition");
                addition.textContent = "+" + secondPlayerDiff;
                this.secondPlayerScoreContainer.appendChild(addition);
            }
        };
        GameView.prototype.clearMessages = function () {
            // IE only takes one value to remove at a time.
            this.messageContainer.classList.remove("game-won");
            this.messageContainer.classList.remove("game-over");
        };
        return GameView;
    })();
    View.GameView = GameView;
    function normalizePosition(position) {
        return { x: position.x + 1, y: position.y + 1 };
    }
    function getPositionClass(position) {
        var np = normalizePosition(position);
        return "tile-position-" + np.x + "-" + np.y;
    }
    function getTileClass(tile) {
        return "tile-value-" + tile.toString();
    }
})(View || (View = {}));
//# sourceMappingURL=game_view.js.map