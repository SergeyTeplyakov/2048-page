/// <reference path="assert.ts"/>
/// <reference path="tile.ts"/>
/// <reference path="state.ts"/>
var Model;
(function (Model) {
    var Grid = (function () {
        function Grid(size, strike, firstMove, previousState) {
            this.moves = [];
            this.size = size;
            this.strike = strike;
            this.firstMove = firstMove;
            this.cells = empty(size);
            if (previousState) {
                this.initState(size, previousState);
            }
        }
        Grid.prototype.nextPlayer = function () {
            // Next player depends not only on the lengths of available cells
            // firstMove == X and occupiedCount == 0 -> X
            // firstMove == X and occupiedCount == 1 -> O
            // firstMove == O and occupiedCount == 0 -> O
            // firstMove == O and occupiedCount == 1 -> X
            // Keep in mind, that Value.X is 1!
            var gameStatus = this.gameStatus();
            if (gameStatus !== Model.GameStatus.KeepPlaying) {
                return undefined;
            }
            return ((this.occupiedCellsCount() + this.firstMove) % 2 === 1) ? Model.Tile.X : Model.Tile.O;
        };
        Grid.prototype.getState = function (x, y) {
            this.checkBounds(x, y);
            return this.cells[x][y];
        };
        Grid.prototype.gameStatus = function () {
            if (this.currentWinner !== undefined) {
                return Model.GameStatus.Victory;
            }
            if (this.isFull()) {
                return Model.GameStatus.Draw;
            }
            return Model.GameStatus.KeepPlaying;
        };
        Grid.prototype.isOccupied = function (x, y) {
            return this.getState(x, y) ? true : false;
        };
        Grid.prototype.makeMove = function (x, y, value) {
            if (this.isOccupied(x, y)) {
                throw new Error("Position (" + x + ", " + y + ") was already occupied");
            }
            value = value || this.nextPlayer();
            this.checkBounds(x, y);
            this.moves.push({ x: x, y: y, state: value });
            this.cells[x][y] = value;
            var winner = this.checkWinner({ x: x, y: y });
            if (winner) {
                this.currentWinner = winner.tile;
                return new Model.Victory(winner.tile, winner.strike);
            }
            else if (this.isFull()) {
                return new Model.Draw();
            }
            return new Model.KeepPlaying();
        };
        Grid.prototype.undoMove = function () {
            if (this.occupiedCellsCount() === 0) {
                return undefined;
            }
            var lastMove = this.moves.pop();
            this.cells[lastMove.x][lastMove.y] = undefined;
            this.currentWinner = undefined;
            return lastMove;
        };
        Grid.prototype.winner = function () {
            return this.currentWinner;
        };
        Grid.prototype.serialize = function () {
            var cellState = new Array(this.size);
            for (var x = 0; x < this.size; x++) {
                var row = cellState[x] = new Array(this.size);
                for (var y = 0; y < this.size; y++) {
                    row.push(this.cells[x][y] ? this.cells[x][y] : null);
                }
            }
            return {
                size: this.size,
                longestStrike: this.strike,
                cells: cellState
            };
        };
        // Checks whether grid is full or not
        Grid.prototype.isFull = function () {
            return this.emptyCellsCount() === 0;
        };
        Grid.prototype.emptyCellsCount = function () {
            return this.size * this.size - this.occupiedCellsCount();
        };
        Grid.prototype.occupiedCellsCount = function () {
            return this.moves.length;
        };
        Grid.prototype.checkBounds = function (x, y) {
            if (x < 0 || x >= this.size) {
                throw new Error("Out of bounds error. x: " + x + ", size: " + this.size);
            }
            if (y < 0 || y >= this.size) {
                throw new Error("Out of bounds error. x: " + x + ", size: " + this.size);
            }
        };
        /**
         * Checks the longest 'strike' of any tiles in the specified array.
        */
        /*internal*/ Grid.prototype.longestStrike = function (array) {
            var result = { value: undefined, count: 0, begin: 0 };
            var current = { value: undefined, count: 0, begin: 0 };
            for (var index = 0; index < array.length; index++) {
                var t = array[index];
                if (t) {
                    if (current.value === t.state) {
                        current.count++;
                    }
                    else {
                        current.value = t.state;
                        current.begin = index;
                        current.count = 1;
                    }
                }
                if (current.count > result.count) {
                    result = { value: current.value, count: current.count, begin: current.begin };
                }
            }
            var subArray = array.slice(result.begin, result.begin + result.count);
            return { value: result.value, strike: subArray };
        };
        /*internal*/ Grid.prototype.getSubArray = function (first, second) {
            var x = first.x;
            var y = first.y;
            var result = [];
            var dx = (second.x > first.x) ? 1 : (second.x < first.x) ? -1 : 0;
            var dy = (second.y > first.y) ? 1 : (second.y < first.y) ? -1 : 0;
            Debug.assert(dx !== 0 || dy !== 0, "dx or dy should not be 0");
            //Debug.assert(dx === 1, 'dx === 1');
            //Debug.assert(dy === -1, `dy === -1. dx = ${dx}, dy = ${dy}. first: (${first.x}, ${first.y}), second: (${second.x}, ${second.y})`);
            while (true) {
                if (this.withinBounds(x, y)) {
                    result.push({ x: x, y: y, state: this.cells[x][y] });
                }
                if (x === second.x && y === second.y) {
                    break;
                }
                x += dx;
                y += dy;
            }
            return result;
        };
        Grid.prototype.withinBounds = function (x, y) {
            return (x >= 0 && x < this.size) && (y >= 0 && y < this.size);
        };
        Grid.prototype.checkWinner = function (p) {
            // Implementation is relatively simple.
            // Because grid has arbitrary size the solution should be O(longestStrike) but
            // not O(gridSize).
            // To check winner, we need to check all diags with new point in the middle.
            // Need to get 4 arrays with max 2*strike - 1 elements and look for a strike in each of them
            var diff = this.strike - 1;
            var leftMost = { x: p.x, y: p.y - diff };
            var leftUpper = { x: p.x + diff, y: p.y - diff };
            var topMost = { x: p.x + diff, y: p.y };
            var upperRight = { x: p.x + diff, y: p.y + diff };
            var rightMost = { x: p.x, y: p.y + diff };
            var bottomRight = { x: p.x - diff, y: p.y + diff };
            var bottomMost = { x: p.x - diff, y: p.y };
            var bottomLeft = { x: p.x - diff, y: p.y - diff };
            var bottomLeftToUpperRight = this.getSubArray(bottomLeft, upperRight);
            var leftToRight = this.getSubArray(leftMost, rightMost);
            var upperLeftToBottomRight = this.getSubArray(leftUpper, bottomRight);
            var topToBottom = this.getSubArray(bottomMost, topMost);
            for (var _i = 0, _a = [bottomLeftToUpperRight, leftToRight, upperLeftToBottomRight, topToBottom]; _i < _a.length; _i++) {
                var array = _a[_i];
                var candidate = this.longestStrike(array);
                if (candidate.value && candidate.strike.length >= this.strike) {
                    return { tile: candidate.value, strike: candidate.strike };
                }
            }
            return undefined;
        };
        Grid.prototype.initState = function (size, state) {
            var cells = new Array(size);
            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    var tile = state[x][y];
                    if (tile) {
                        this.makeMove(x, y, tile);
                    }
                }
            }
            return cells;
        };
        return Grid;
    })();
    Model.Grid = Grid;
    //---------------------------------------------------------------------------------
    // Free helper functions
    //---------------------------------------------------------------------------------
    function empty(size) {
        var cells = new Array(size);
        for (var x = 0; x < size; x++) {
            cells[x] = new Array(size);
        }
        return cells;
    }
})(Model || (Model = {}));
//# sourceMappingURL=grid.js.map