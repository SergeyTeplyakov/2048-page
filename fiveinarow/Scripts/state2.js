var Model;
(function (Model) {
    (function (GameStatus) {
        GameStatus[GameStatus["Draw"] = 0] = "Draw";
        GameStatus[GameStatus["Victory"] = 1] = "Victory";
        GameStatus[GameStatus["KeepPlaying"] = 2] = "KeepPlaying";
    })(Model.GameStatus || (Model.GameStatus = {}));
    var GameStatus = Model.GameStatus;
    var Draw = (function () {
        function Draw() {
        }
        return Draw;
    })();
    Model.Draw = Draw;
    var KeepPlaying = (function () {
        function KeepPlaying() {
        }
        return KeepPlaying;
    })();
    Model.KeepPlaying = KeepPlaying;
    var Victory = (function () {
        function Victory(winner) {
            this.winner = winner;
        }
        return Victory;
    })();
    Model.Victory = Victory;
})(Model || (Model = {}));
//# sourceMappingURL=state2.js.map