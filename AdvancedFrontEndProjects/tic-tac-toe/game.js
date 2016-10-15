
class AI {
  constructor(){
    this.difficult = "easy";
  }

  cellDiff(cellsFilled, sequence){
    for(var i=0; i < cellsFilled.length; i++){
      var cell = cellsFilled[i];
      var index = sequence.indexOf(cell);
      if (index > -1) {
        sequence.splice(index, 1);
      }
    }

    return sequence;
  }

  completeSequence(cellsFilled, sequence){
    var result = this.cellDiff(cellsFilled, sequence);
    if (result.length == 1) {
      return result[0];
    }
  }

  tryToCompleteSequence(cellsFilledByAI, cellsFilledByUser) {

    var aiSeqCompletionCell = this.tryToCompleteAISequence(cellsFilledByAI, cellsFilledByUser);
    if(aiSeqCompletionCell !== undefined) return aiSeqCompletionCell;

    var userSeqCompletionCell = this.tryToCompleteUserSequence(cellsFilledByAI, cellsFilledByUser);
    if(userSeqCompletionCell !== undefined) return userSeqCompletionCell;
  }

  tryToCompleteUserSequence(cellsFilledByAI, cellsFilledByUser) {
    var sequences = this.getAllVictorySequences();

    for (var i=0; i<sequences.length; i++) {
      var sequence = sequences[i];
      var userSequenceCompletion = this.completeSequence(cellsFilledByUser, sequence);
      if (userSequenceCompletion !== undefined && cellsFilledByAI.indexOf(userSequenceCompletion) == -1) {
        return userSequenceCompletion;
      }
    }
  }

  tryToCompleteAISequence(cellsFilledByAI, cellsFilledByUser) {
    var sequences = this.getAllVictorySequences();

    for (var i=0; i<sequences.length; i++) {
      var sequence = sequences[i];
      var aiSequenceCompletion = this.completeSequence(cellsFilledByAI, sequence);
      if (aiSequenceCompletion !== undefined && cellsFilledByUser.indexOf(aiSequenceCompletion) == -1) {
        return aiSequenceCompletion;
      }
    }
  }

  getRandomNoCornerNoCenterCell() {
    var allowed = [1,3,5,7];
    return allowed[ Math.floor(Math.random() * allowed.length) ];
  }


  isConfigurationTypeSix(gameGrid) {

    /*  This configuration

    |     |  X   |     |
    |     |  O   |     |
    |     |  X   |     |

    */

    return ( gameGrid.getNoOfCellsFilled() == 3 &&
              gameGrid.gridArray[1] == 1 && gameGrid.gridArray[4] == 2 && gameGrid.gridArray[7] == 1 )
      ||
      ( gameGrid.getNoOfCellsFilled() == 3 &&
          gameGrid.gridArray[3] == 1 && gameGrid.gridArray[4] == 2 && gameGrid.gridArray[5] == 1 );

  }


  isConfigurationTypeOne(gameGrid) {

    /*  This configuration

    |  X  |      |     |
    |     |  O   |     |
    |     |      |  X  |

    */

    return (gameGrid.getNoOfCellsFilled() == 3 && gameGrid.gridArray[0] == 1 && gameGrid.gridArray[4] == 2
              && gameGrid.gridArray[8] == 1 )

    ||


    (gameGrid.getNoOfCellsFilled() == 3 && gameGrid.gridArray[2] == 1 && gameGrid.gridArray[4] == 2
              && gameGrid.gridArray[6] == 1 );


  }


  getAllVictorySequences() {
    return [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  }

  isConfigurationConsecutiveDiagonal(gameGrid) {

    /*  This configuration

    |     |      |  X  |
    |     |  X   |     |
    |  O  |      |     |

    */

    return gameGrid.getNoOfCellsFilled() == 3 && gameGrid.gridArray[4] == 1 && (

      (gameGrid.gridArray[2] == 1 && gameGrid.gridArray[6] == 2)

      ||

      (gameGrid.gridArray[2] == 2 && gameGrid.gridArray[6] == 1)

      ||

      (gameGrid.gridArray[0] == 1 && gameGrid.gridArray[8] == 2)

      ||

      (gameGrid.gridArray[0] == 2 && gameGrid.gridArray[8] == 1)

    );

  }


  getVictoryCellInTwoMoves(gameGrid) {
    var allTwoMovesToVictorySequences =
    this.getAllVictorySequences().filter(function(v) {
      return gameGrid.numberOfOccurrencesOfElementsInCell(v, 0) == 2
              && gameGrid.numberOfOccurrencesOfElementsInCell(v, 2) == 1;
    });

    var selectOneRandom = allTwoMovesToVictorySequences[Math.floor(Math.random() * allTwoMovesToVictorySequences.length )];

    /* Cells which can be filled */
    var emptyCells = selectOneRandom.filter(function(v) {
      return gameGrid.isEmpty(v);
    });

    /* Select one from them */
    return emptyCells[Math.floor(Math.random() * emptyCells.length )];
  }

  selectCell(gameGrid) {


    if (gameGrid.getNoOfCellsFilled() == 0) {
      /* Game just started, AI's turn */
      return 4;

    } else if(gameGrid.getNoOfCellsFilled() == 8) {
      /* All but one filled */
      /* Finish the game and draw */
      return gameGrid.getEmptyCells()[0];

    } else if ( gameGrid.getNoOfCellsFilled() == 1 &&  gameGrid.getLastClicked() == 4) {


    /*  This configuration

    |     |      |     |
    |     |  X   |     |
    |     |      |     |

    */

      return this.getRandomCorner();

    } else if ( gameGrid.getNoOfCellsFilled() == 1 ) {


      return 4;

    } else if ( this.isConfigurationTypeOne(gameGrid)  )  {

      return this.getRandomNoCornerNoCenterCell();

    } else if ( this.isConfigurationTypeSix(gameGrid) ) {

      return this.getRandomCorner();

    } else if ( this.isConfigurationConsecutiveDiagonal(gameGrid) ) {

      /*  This configuration

      |     |      |  X  |
      |     |  X   |     |
      |  O  |      |     |

      */

      return this.getListOfCornersRandomly().filter(function(v){
        return gameGrid.isEmpty(v);
      })[0];

    } else {

      var cellsFilledByUser = gameGrid.getCellsFilledByUser();
      var cellsFilledByAI = gameGrid.getCellsFilledByAI();


      var sequenceComplete = this.tryToCompleteSequence(cellsFilledByAI, cellsFilledByUser);
      if (sequenceComplete !== undefined) return sequenceComplete;


      if (gameGrid.getNoOfCellsEmpty() > 2) {
        return this.getVictoryCellInTwoMoves(gameGrid);
      }



      if (gameGrid.getNoOfCellsEmpty() == 2) {
        /* return any random empty cell */
        return gameGrid.getEmptyCells()[Math.floor(Math.random() * 2)];
      }

    }
  }

  getRandomCorner() {
    var r = 2 * Math.floor(Math.random() * 5);
    if (r == 4) {
      console.log("Dangerous Recursion.");
      return this.getRandomCorner();
    } else {
      return r;
    }
  }

  getListOfCornersRandomly() {
    var required = [0,2,6,8];

    var randomList = [];

    while(this.cellDiff(randomList, required).length > 0) {
      var r = this.getRandomCorner();
      if (randomList.indexOf(r) == -1) {
        randomList.push(r);
      }
    }

    return randomList;
  }
}

class GameGrid {
  constructor() {
    this.gridArray =  [
                        0,0,0,
                        0,0,0,
                        0,0,0
                      ];
    this.lastClicked = "";
  }

  numberOfOccurrencesOfElementsInCell(seq, num) {
    var count = 0;
    for (var i = 0; i < seq.length; i++) {
      var s = seq[i];
      if (this.gridArray[s] == num) {
        count++;
      }
    }
    return count;
  }

  isFilled(cell) {
    return this.gridArray[cell] > 0;
  }

  isEmpty(cell) {
    return this.gridArray[cell] == 0;
  }

  getCellsFilledByUser() {
    var indices = [];
    for (var i=0; i<this.gridArray.length; i++) {
      if(this.gridArray[i] == 1){
        indices.push(i);
      }
    }

    return indices;
  }

  getCellsFilledByAI() {
    var indices = [];
    for (var i=0; i<this.gridArray.length; i++) {
      if(this.gridArray[i] == 2){
        indices.push(i);
      }
    }

    return indices;
  }

  getNoOfCellsFilled() {
    return this.gridArray.reduce(function(aggregate, v){
      if (v != 0) {
        return aggregate + 1;
      } else {
        return aggregate;
      }
    }, 0);
  }

  getNoOfCellsEmpty() {
    return 9 - this.getNoOfCellsFilled();
  }

  getEmptyCells() {
    var indices = [];
    for (var i=0; i<this.gridArray.length; i++) {
      if(this.gridArray[i] == 0){
        indices.push(i);
      }
    }

    return indices;
  }

  mapPlayerToNum(player) {
    return player === "player1" ? 1 : 2;
  }

  alreadyClicked(cell) {
    return this.gridArray[cell] !== 0;
  }


  getLastClicked() {
    return this.lastClicked;
  }

  click(cell, whosTurn) {
    this.gridArray[cell] = this.mapPlayerToNum(whosTurn);
    this.lastClicked = cell;
    //this.lastPlayer = whosTurn;
  }

  checkGameOver() {
    var winResult = this.checkForWin();
    if (winResult) {
      return winResult;
    }

    return this.checkAllCellsFilled();
  }

  checkAllCellsFilled() {
    for (var i=0; i<this.gridArray.length; i++) {

        if(this.gridArray[i] == 0){
          return false;
        }

    }

    return { allfilled : true };
  }

  checkForWin() {
    // Condition I -> 1st row
    if (this.gridArray[0] != 0 && this.gridArray[0] == this.gridArray[1]
                                                                && this.gridArray[0]  == this.gridArray[2]) {
      return {win : true, winGrids : [0,1,2]};

      // 2nd row
    } else if (this.gridArray[3] != 0 && this.gridArray[3] == this.gridArray[4]
                                                                  && this.gridArray[3]  == this.gridArray[5]) {
      return {win : true, winGrids : [3,4,5]};

      // 3rd row
    } else if (this.gridArray[6] != 0 && this.gridArray[6] == this.gridArray[7]
                                                                  && this.gridArray[6]  == this.gridArray[8]) {
      return {win : true, winGrids : [6,7,8]};

      // 1st col
    } else if (this.gridArray[0] != 0 && this.gridArray[0] == this.gridArray[3]
                                                                  && this.gridArray[0]  == this.gridArray[6]) {
      return {win : true, winGrids : [0,3,6]};

      // 2nd col
    } else if (this.gridArray[1] != 0 && this.gridArray[1] == this.gridArray[4]
                                                                  && this.gridArray[1]  == this.gridArray[7]) {
      return {win : true, winGrids : [1,4,7]};

      // 3rd col
    } else if (this.gridArray[2] != 0 && this.gridArray[2] == this.gridArray[5]
                                                                  && this.gridArray[2]  == this.gridArray[8]) {
      return {win : true, winGrids : [2,5,8]};

      // left diagonal
    } else if (this.gridArray[0] != 0 && this.gridArray[0] == this.gridArray[4]
                                                                  && this.gridArray[0]  == this.gridArray[8]) {
      return {win : true, winGrids : [0,4,8]};

      //right diagonal
    } else if (this.gridArray[2] != 0 && this.gridArray[2] == this.gridArray[4]
                                                                  && this.gridArray[2]  == this.gridArray[6]) {
      return {win : true, winGrids : [2,4,6]};
    } else {
      return false;
    }
  }

}


class GameController {
  constructor() {
    this.noOfPlayers = 0;
    this.activeScreen = null;
    this.userChar = "";
    this.game = {};
    this.score = { "player1" : 0, "player2" : 0 };
    //this.game.whosTurn = "";
    //this.game.gameGrid = {};
    //this.game.ai = {};
  }

  startGame() {
    this.activeScreen = $("#screen1");
    this.renderScreen();
  }

  renderScreen() {
    $("div[id^=screen]").hide();
    this.activeScreen.show();
    //console.log(this);
  }

  registerEventHandlers() {
    this.registerScreenOneHandlers();
    this.registerScreenTwoHandlers();
    this.registerScreenThreeHandlers();
  }

  initializeGame(){
    this.gameOver = false;
    this.game.gameGrid = new GameGrid();
    this.game.ai = new AI();
    this.game.whosTurn = this.userChar === "X" ? "player1" : "player2";
  }

  getClickedCell(target) {
    if (target.is(".grid")) {
      return $(".grid").index(target);
    } else {
      return $(".grid").index(target.parent());
    }
  }

  updateGameScreen(cellNum) {
    var clickedBox = $(".tic")[cellNum];
    $(clickedBox).html( this.game.whosTurn === "player1" ? this.userChar : "OX".replace(this.userChar, "") );
    //console.log(this);
  }

  updateScore() {
    $("#score1").html(this.score.player1);
    $("#score2").html(this.score.player2);
  }

  handlePlayerWinAndGetWinMessage(){
    if (this.game.whosTurn === "player1") {
      var msg = "Player 1 Won";
      this.score.player1++;
    } else if (this.noOfPlayers === 2) {
      var msg = "Player 2 Won";
      this.score.player2++;
    } else {
      var msg = "Computer Won";
      this.score.player2++;
    }
    return msg;
  }

  highlightCellWithIndex(index) {
    $($(".tic")[index]).css("background", "gray");
  }

  highlightWinCells(winGrids){
    for (var i = 0; i<winGrids.length; i++) {
      this.highlightCellWithIndex(winGrids[i]);
    }
  }

  handleGameOver(gameOverStatus){
    if (gameOverStatus.win) {
      var msg = this.handlePlayerWinAndGetWinMessage();
      this.highlightWinCells(gameOverStatus.winGrids);
    } else if(gameOverStatus.allfilled){
      var msg = "Game Drawn!";
    }

    $("#result").html(msg);
    $("#result").show();

    this.updateScore();
    this.gameOver = true;
  }

  changePlayer(){
    this.game.whosTurn = (this.game.whosTurn === "player1" ? "player2" : "player1")
  }

  clickThisTick(index) {
    setTimeout(() => this.processCellClick(index), 1500);
  }

  processCellClick(clickedCellNum) {
    if(this.gameOver) {
      return;
    }
    if (this.game.gameGrid.alreadyClicked(clickedCellNum)) {
      return;
    }
    this.game.gameGrid.click(clickedCellNum, this.game.whosTurn);
    this.updateGameScreen(clickedCellNum);
    var gameOverStatus = this.game.gameGrid.checkGameOver();
    if (gameOverStatus) {
      this.handleGameOver(gameOverStatus);
      return;
    }
    this.changePlayer();
    this.updateNotification();
    if (this.noOfPlayers == 1 && this.game.whosTurn === "player2") {
      var cell = this.game.ai.selectCell(this.game.gameGrid);
      console.log("Selected cell "+cell);
      this.clickThisTick(cell);
    }
  }

  registerScreenThreeHandlers() {
    $(".grid").click((v) => {
      if (this.noOfPlayers == 2 || this.game.whosTurn === "player1") {
        var clickedCellNum = this.getClickedCell($(v.target));
        this.processCellClick(clickedCellNum);
      }
    });

    $(".reset").click(() => {
      if (this.game.whosTurn === "player1" || this.gameOver) {
        this.initializeGame();
        this.resetBoard();
        this.updateNotification();

        if (this.noOfPlayers == 1 && this.game.whosTurn === "player2") {
          var cell = this.game.ai.selectCell(this.game.gameGrid);
          console.log("Selected cell "+cell);
          this.clickThisTick(cell);
        }
      }
    });
  }

  resetBoard() {
    $(".tic").html("&nbsp;");
    $("#result").html("");
    $(".tic").css("background", "transparent");
  }

  registerScreenOneHandlers() {
    $("#screen1 .option").click((v) => {
      this.selectNumberOfPlayers(trim(v.target.innerHTML));
      this.activeScreen = this.activeScreen.next();
      this.renderScreen();
    });
  }

  registerScreenTwoHandlers() {
    $("#screen2 .option").click((v) => {
      this.selectUserChar(trim(v.target.innerHTML));
      this.activeScreen = this.activeScreen.next();
      this.initializeGame();
      this.renderScreen();
      this.setUpNotification();
      this.updateNotification();

      if (this.userChar === "O") {
        if (this.noOfPlayers == 1 && this.game.whosTurn === "player2") {
          var cell = this.game.ai.selectCell(this.game.gameGrid);
          console.log("Selected cell "+cell);
          this.clickThisTick(cell);
        }
      }
    });

    $("#screen2 .back").click(() => {
      this.activeScreen = this.activeScreen.prev();
      this.renderScreen();
    });
  }

  updateNotification() {
    this.hideElement($(".notification"));
    this.showElement(this.selectCurrentAlert());
  }

  selectCurrentAlert() {
    if(this.game.whosTurn === "player2") {
      return $(".notification:nth-of-type(2)");
    } else {
      return $(".notification:nth-of-type(1)");
    }
  }

  hideElement(element) {
    element.css("visibility", "hidden");
  }

  showElement(element) {
    element.css("visibility", "visible");
    element.show();
    if (element.is(".notification")) {
      element.css("display", "inline");
    }
  }

  removeElement(element) {
    element.remove();
  }

  setUpNotification() {
    switch(this.noOfPlayers) {
      case 1:
        this.showElement($("#your-turn"));
        this.showElement($("#computer-turn"));
        this.showElement($("#notification-bar"));

        this.removeElement($("#player1"));
        this.removeElement($("#player2"));
        break;
      case 2:
        this.showElement($("#player1"));
        this.showElement($("#player2"));
        this.showElement($("#notification-bar"));

        this.removeElement($("#your-turn"));
        this.removeElement($("#computer-turn"));
        break;
    }

    this.showElement($("#score"));
  }

  selectUserChar(selectedChar) {
    this.userChar = selectedChar;
  }

  selectNumberOfPlayers(noOfPlayers) {
    switch(noOfPlayers) {
      case "One Player":
        this.noOfPlayers = 1;
        break;
      case "Two Player":
        this.noOfPlayers = 2;
        break;
    }
  }
}
