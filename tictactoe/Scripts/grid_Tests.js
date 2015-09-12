/// <reference path="../js/grid.ts"/>
QUnit.module("grid.ts tests");
var size = 3;
var Value = Logic.TileValue;
var firstMove = Value.X;
function createGrid() {
    return new Logic.Grid(size, firstMove);
}
function syncGridState(grid, state) {
    for (var x = 0; x < state.length; x++) {
        var row = state[x];
        for (var y = 0; y < row.length; y++) {
            grid.makeMove(x, y, state[x][y]);
        }
    }
}
test("basic grid test", function () {
    var grid = new Logic.Grid(size, Logic.TileValue.X);
    // First player should match constructor's argument
    equal(grid.nextPlayer(), Logic.TileValue.X, "first move should be X!");
    // Making first move
    grid.makeMove(0, 0);
    //expect(grid.gameStatus()).toBe(Logic.GameStatus.KeepPlaying);
    equal(grid.gameStatus(), Logic.GameStatus.KeepPlaying);
    equal(grid.getState(0, 0), Logic.TileValue.O);
    equal(grid.nextPlayer(), Logic.TileValue.O);
});
test("test draw", function () {
    // Arrange
    var grid = createGrid();
    var cells = [
        [Value.X, Value.X, Value.O],
        [Value.O, Value.O, Value.X],
        [Value.O, Value.X, Value.O]
    ];
    // Act
    syncGridState(grid, cells);
    // Assert
    equal(grid.gameStatus(), Logic.GameStatus.Draw);
    equal(grid.nextPlayer(), undefined, "When game is done nextPlayer() should be 'undefined'");
});
test("move on occupied cell should throw", function () {
    var grid = createGrid();
    grid.makeMove(0, 0);
    throws(function () { return grid.makeMove(0, 0); });
});
//# sourceMappingURL=grid_Tests.js.map