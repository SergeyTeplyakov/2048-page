var Model;
(function (Model) {
    (function (Tile) {
        // Values shoud start form 1, because otherwise first value would be falsy
        Tile[Tile["X"] = 1] = "X";
        Tile[Tile["O"] = 2] = "O";
    })(Model.Tile || (Model.Tile = {}));
    var Tile = Model.Tile;
    function getTileDisplayClass(value) {
        //return value === Tile.X ? "8" : "16";
        return value === Tile.X ? "X" : "O";
    }
    Model.getTileDisplayClass = getTileDisplayClass;
    function getTileString(value) {
        return value === Tile.X ? "\u274C" : "\u25EF";
    }
    Model.getTileString = getTileString;
    function getAnotherValue(value) {
        if (!value) {
            return undefined;
        }
        return (value) % 2 + 1;
    }
    Model.getAnotherValue = getAnotherValue;
})(Model || (Model = {}));
//# sourceMappingURL=tile.js.map