/// <reference path="state2.ts"/>
var Control;
(function (Control) {
    var permanentStateKey = "score";
    var temporaryStateKey = "gameState";
    var defaultStorageName = "fakeStorage";
    var ContentStorage = (function () {
        function ContentStorage(storageName) {
            this.storage = createStorage(storageName || defaultStorageName);
        }
        ContentStorage.prototype.getGameStatistics = function () {
            var stateJson = this.getGameStatisticsCore();
            return stateJson ? JSON.parse(stateJson) : null;
        };
        /*internal*/ ContentStorage.prototype.getGameStatisticsCore = function () {
            return this.storage.getItem(permanentStateKey);
        };
        ContentStorage.prototype.updateGameStatistics = function (state) {
            this.storage.setItem(permanentStateKey, JSON.stringify(state));
        };
        ContentStorage.prototype.getGameState = function () {
            var stateJson = this.getGameStateCore();
            return stateJson ? JSON.parse(stateJson) : null;
        };
        /*internal*/ ContentStorage.prototype.getGameStateCore = function () {
            return this.storage.getItem(temporaryStateKey);
        };
        ContentStorage.prototype.updateGameState = function (state) {
            this.storage.setItem(temporaryStateKey, JSON.stringify(state));
        };
        ContentStorage.prototype.reset = function () {
            this.storage.setItem(permanentStateKey, null);
            this.storage.setItem(temporaryStateKey, null);
        };
        return ContentStorage;
    })();
    Control.ContentStorage = ContentStorage;
    var CustomLocalStorage = (function () {
        function CustomLocalStorage() {
            // TODO: switch to Map<??, string>. Is there anything like this in TS?s
            this.data = {};
        }
        CustomLocalStorage.prototype.setItem = function (key, data) {
            this.data[key] = data;
        };
        CustomLocalStorage.prototype.getItem = function (key) {
            return this.data.hasOwnProperty(key) ? this.data[key] : undefined;
        };
        CustomLocalStorage.prototype.removeItem = function (key) {
            delete this.data[key];
        };
        CustomLocalStorage.prototype.clear = function () {
            this.data = {};
        };
        return CustomLocalStorage;
    })();
    function createStorage(storageName) {
        function localStorageSupported() {
            var testKey = "test";
            var storage = window.localStorage;
            try {
                storage.setItem(testKey, "1");
                storage.removeItem(testKey);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        if (localStorageSupported()) {
            return window.localStorage;
        }
        var storage = window[storageName];
        if (!storage) {
            storage = new CustomLocalStorage();
            window[storageName] = storage;
        }
        return storage;
    }
})(Control || (Control = {}));
//# sourceMappingURL=content_storage.js.map