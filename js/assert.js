var Debug;
(function (Debug) {
    function assert(expression, message) {
        if (!expression) {
            throw new Error('Assertion failed: ' + message);
        }
    }
    Debug.assert = assert;
})(Debug || (Debug = {}));
//# sourceMappingURL=assert.js.map