$("document").ready(init_game);

function init_game() {
  var gc = new GameController();
  gc.registerEventHandlers();
  gc.startGame();
}

// Common Routines Used By GameController

function trim(s) {
  return s.replace(/^\s+|\s+$/g, "");
}
