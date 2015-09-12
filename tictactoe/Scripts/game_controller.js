/// <reference path="assert.ts" />
/// <reference path="keyboard_listener.ts" />
/// <reference path="game_view.ts" />
/// <reference path="content_storage.ts" />
var Control;
(function (Control) {
    var defaultTile = Model.Tile.X;
    var firstPlayer = Model.Tile.X;
    var GameController = (function () {
        //private firstPlayer(): { name: string, score: number } { return this.player(Model.Tile.X); }
        //private secondPlayer(): { name: string, score: number } { return this.player(Model.Tile.X); }
        function GameController(gridSize, longestStrike, view, keyboardListener, firstPlayer, secondPlayer) {
            this.firstPlayer = { name: "Player1", score: 0 };
            this.secondPlayer = { name: "Player2", score: 0 };
            this.view = view;
            this.keyboardListener = keyboardListener || new Control.KeyboardListener(gridSize);
            this.contentStorage = new Control.ContentStorage();
            this.firstPlayer.name = firstPlayer;
            this.secondPlayer.name = secondPlayer;
            // this will create this.grid
            this.restoreGameStateIfNeeded(gridSize, longestStrike);
            // For JS newby: bind is super critical, because 'this' in callbacks would be equal to sender, not to the receiver!
            this.keyboardListener.subscribe(this.handleInput.bind(this));
            // this will initialize the score
            this.restoreGameStatistics();
            // Need to introduce next player
            this.view.introduceNextPlayer(this.player(this.grid.nextPlayer()).name);
        }
        GameController.prototype.player = function (value) {
            return value === firstPlayer ? this.firstPlayer : this.secondPlayer;
        };
        GameController.prototype.handleInput = function (event) {
            if (event instanceof Control.TileClick) {
                this.handleClick(event.x, event.y);
            }
            else if (event instanceof Control.Restart) {
                this.restart();
            }
            else if (event instanceof Control.Undo) {
                this.handleUndo();
            }
        };
        GameController.prototype.handleUndo = function () {
            var currentWinner = this.grid.winner();
            var lastMove = this.grid.undoMove();
            if (!lastMove) {
                return;
            }
            // Making a move on the view
            this.view.makeMove(lastMove.x, lastMove.y, undefined);
            if (currentWinner) {
                this.player(currentWinner).score--;
            }
            var gameStatistics = this.getGameStatistics();
            this.contentStorage.updateGameStatistics(gameStatistics);
            this.view.updateGameStatistics(gameStatistics);
            // Keep playing. Need to introduce next player then
            var nextPlayer = this.grid.nextPlayer();
            this.view.introduceNextPlayer(this.player(nextPlayer).name);
            this.contentStorage.updateGameState(this.getGameState());
        };
        GameController.prototype.handleClick = function (x, y) {
            // Argument validation (check for -1 is required for now!)
            if ((x === -1 || y === -1) || this.grid.isOccupied(x, y)) {
                return;
            }
            // Making a move at the grid
            var nextValue = this.grid.nextPlayer();
            var moveResult = this.grid.makeMove(x, y);
            // Making a move on the view
            this.view.makeMove(x, y, nextValue);
            // Checking the results
            if (moveResult instanceof Model.Victory) {
                this.player(moveResult.winner).score++;
                this.view.victory(this.player(moveResult.winner).name);
                // Need to store the statistics as well, because game was finished!
                var gameStatistics = this.getGameStatistics();
                this.contentStorage.updateGameStatistics(gameStatistics);
                this.view.updateGameStatistics(gameStatistics);
            }
            else if (moveResult instanceof Model.Draw) {
                this.view.draw();
            }
            else {
                // Keep playing. Need to introduce next player then
                var nextPlayer = this.grid.nextPlayer();
                this.view.introduceNextPlayer(this.player(nextPlayer).name);
            }
            this.contentStorage.updateGameState(this.getGameState());
        };
        GameController.prototype.restoreGameStateIfNeeded = function (size, longestStrike) {
            var gameState = this.contentStorage.getGameState();
            // Reload the game from a previous game if present
            if (gameState && gameState.grid.size === size && gameState.grid.longestStrike === longestStrike) {
                this.grid = new Model.Grid(gameState.grid.size, gameState.grid.longestStrike, gameState.firstPlayer, gameState.grid.cells);
                this.view.updateGameState(gameState);
            }
            else {
                this.grid = new Model.Grid(size, longestStrike, defaultTile);
            }
        };
        GameController.prototype.restoreGameStatistics = function () {
            var gameStatistics = this.contentStorage.getGameStatistics();
            if (gameStatistics) {
                this.firstPlayer.score = gameStatistics.firstPlayerScore;
                this.secondPlayer.score = gameStatistics.secondPlayerScore;
                this.view.updateGameStatistics(gameStatistics);
            }
        };
        GameController.prototype.restart = function () {
            var size = this.grid.size;
            var strike = this.grid.strike;
            this.grid = new Model.Grid(size, strike, Model.getAnotherValue(this.grid.firstMove));
            var gameState = this.getGameState();
            this.contentStorage.updateGameState(gameState);
            this.view.clearMessage();
            this.view.updateGameState(gameState);
            this.view.introduceNextPlayer(this.player(this.grid.nextPlayer()).name);
        };
        GameController.prototype.getGameState = function () {
            return {
                firstPlayer: this.grid.firstMove,
                nextPlayer: this.grid.nextPlayer(),
                winner: this.grid.winner(),
                gameStatus: this.grid.gameStatus(),
                grid: this.grid.serialize()
            };
        };
        GameController.prototype.getGameStatistics = function () {
            return {
                firstPlayerScore: this.firstPlayer.score,
                secondPlayerScore: this.secondPlayer.score
            };
        };
        return GameController;
    })();
    Control.GameController = GameController;
})(Control || (Control = {}));
//# sourceMappingURL=game_controller.js.map