swapGame.screens["game-screen"] = (function() {
    var board = swapGame.board,
        display = swapGame.display;

    function run() {
        board.initialise(function() {
            display.initialise(function() {
                display.redraw(board.getBoard(), function() {
                    // do nothing for now
                });
            });
        });
    }

    return {
        run : run
    };
})();
