var Control;
(function (Control) {
    var TileClick = (function () {
        function TileClick(x, y) {
            this.x = x;
            this.y = y;
        }
        return TileClick;
    })();
    Control.TileClick = TileClick;
    var Restart = (function () {
        function Restart() {
        }
        return Restart;
    })();
    Control.Restart = Restart;
    var Undo = (function () {
        function Undo() {
        }
        return Undo;
    })();
    Control.Undo = Undo;
    var KeyboardListener = (function () {
        function KeyboardListener(gridSize) {
            this.gridSize = gridSize;
            this.listen();
        }
        KeyboardListener.prototype.subscribe = function (handler) {
            this.eventHandler = handler;
        };
        KeyboardListener.prototype.listen = function () {
            var _this = this;
            // TODO: why not to use the same approach and not to add evenlistener to sub-divs??
            // Respond to mouse presses
            addEventListener("mousedown", function (ev) {
                // Every div has it's own id, using this id we can compute row and col
                var i = ev.target["id"];
                var _a = [Math.floor((i - 1) / _this.gridSize), ((i - 1) % _this.gridSize)], y = _a[0], x = _a[1];
                _this.raise(ev, new TileClick(x, y));
            });
            // Respond to button presses
            this.bindButtonPress(".new-game-button", this.raiseRestart);
            this.bindButtonPress(".restart-button", this.raiseRestart);
            this.bindButtonPress(".undo-button", this.raiseUndo);
            // Respond to touch event
            // TODO: why not to use grid-container? in this case scope would be even smaller!
            //document.getElementsByClassName()
            var gameContainer = document.getElementsByClassName("game-container")[0];
            // TODO: check with IE! In 2048 magic tricks are used!
            gameContainer.addEventListener("touchend", function (ev) {
                console.log(ev);
                // Every div has it's own id, using this id we can compute row and col
                var i = ev.target["id"];
                var _a = [Math.floor((i - 1) / _this.gridSize), ((i - 1) % _this.gridSize)], y = _a[0], x = _a[1];
                _this.raise(ev, new TileClick(x, y));
            });
        };
        KeyboardListener.prototype.raise = function (event, boardEvent) {
            event.preventDefault();
            if (this.eventHandler) {
                this.eventHandler(boardEvent);
            }
        };
        KeyboardListener.prototype.raiseUndo = function (event) {
            this.raise(event, new Undo());
        };
        KeyboardListener.prototype.raiseRestart = function (event) {
            this.raise(event, new Restart());
        };
        KeyboardListener.prototype.bindButtonPress = function (selector, fn) {
            // Bind mouse click and touch press with function invocations
            var button = document.querySelector(selector);
            button.addEventListener("click", fn.bind(this));
            button.addEventListener("touchend", fn.bind(this));
        };
        return KeyboardListener;
    })();
    Control.KeyboardListener = KeyboardListener;
})(Control || (Control = {}));
//# sourceMappingURL=keyboard_listener.js.map