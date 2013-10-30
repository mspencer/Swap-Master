swapGame.display = (function() {
    var dom = swapGame.dom,
        $ = dom.$,
        cols, rows,
        blockSize,
        firstRun = true,
        blockSprites;

    function createBackground () {
        var x, y, cell,
            background = document.createElement("div");
        for (x = 0; x < cols; x++) {
            for (y = 0; y < cols; y++) {
                if ((x+y) % 2) {
                    cell = document.createElement("div");
                    cell.style.left = x + "em";
                    cell.style.top = y + "em";
                    background.appendChild(cell);
                }
            }
        }
        dom.addClass(background, "board-bg");
        return background;
    }

    function setup() {
        var boardElement = $("#game-screen .game-board")[0],
            container = document.createElement("div"),
            sprite,
            x, y;

        cols = swapGame.settings.cols;
        rows = swapGame.settings.rows;
        blockSize = swapGame.settings.blockSize;
        blockSprites = [];

        for (x = 0; x < cols; x++) {
            blockSprites[x] = [];
            for (y = 0; y < cols; y++) {
                sprite = document.createElement("div");
                dom.addClass(sprite, "block");
                sprite.style.left = x + "em";
                sprite.style.top = y + "em";
                sprite.style.backgroundImage =
                    "url(images/blocks" + blockSize + ".png)";
                sprite.style.backgroundSize =
                     (swapGame.settings.numBlockTypes * 100) + "%";
                blockSprites[x][y] = sprite;
                container.appendChild(sprite);
            }
        }
        dom.addClass(container, "dom-container");
        boardElement.appendChild(container);
        boardElement.appendChild(createBackground());
    }

    function initialize (callback) {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        callback();
    }

    function drawBlock (type, x, y) {
        var sprite = blockSprites[x][y];
        sprite.style.backgroundPosition = type + "em 0em";
        sprite.style.display = "block";
    }

    function redraw(blocks, callback) {
        var x, y;
        for (x = 0; x < cols; x++) {
            for (y = 0; y < rows; y++) {
                drawBlock(blocks[x][y], x, y, 0, 0)
            }
        }
        callback();
    }

    return {
        initialize : initialize,
        redraw : redraw
    };
})();
