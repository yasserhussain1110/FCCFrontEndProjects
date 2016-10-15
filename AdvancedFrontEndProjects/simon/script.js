$("document").ready(function(){
  var userEventHandler = new UserEventHandler();
  var game = new Game(userEventHandler);

  $(".click-box").click((v) => {
    if (game.userClickGuard === "allowClick") {
      game.action(v.target);
    }
  });

  $(".power").click(function() {
    game.handlePower();
  });

  $(".strict").click(function() {
    game.handleStrict();
  });

  $(".start").click(function() {
    game.handleStart();
  });
});

var timeStep = 400;


function lightPanel(panelIndex) {
    var panel = $($('.click-box').eq(panelIndex)[0]);
    var id = panel.attr("id");
    var onClass = id+"-"+"on";
    var offClass = id+"-"+"off";
    panel.removeClass(offClass);
    panel.addClass(onClass);

  }

function unlightPanel(panelIndex) {
    var panel = $($('.click-box').eq(panelIndex)[0]);
    var id = panel.attr("id");
    var onClass = id+"-"+"on";
    var offClass = id+"-"+"off";
    panel.removeClass(onClass);
    panel.addClass(offClass);
  }

function makeSound(panelIndex){
  var soundSource = "https://s3.amazonaws.com/freecodecamp/simonSound" + (panelIndex+1) + ".mp3";
  var audio = new Audio(soundSource);
  audio.play();
}

function makeErrorSound(errorSoundUrl){
  var audio = new Audio(errorSoundUrl);
  audio.play();
}


function getRandomNumberUptoFour() {
  return Math.floor(Math.random() * 4);
}

class UserEventHandler {
  constructor(){
    this.reset();
  }

  reset(){
    this.moveNumber = -1;
    this.clickedBoxIndex = null;
  }

  click(target) {
    this.moveNumber++;
    var panelIndex = $( ".click-box" ).index( target );
    this.clickedBoxIndex = panelIndex;
    makeSound(panelIndex);
    lightPanel(panelIndex);
    setTimeout(function(){
      unlightPanel(panelIndex);
    }, timeStep);
  }

  getClickInfo() {
    return {
      moveNumber : this.moveNumber,
      clickedBoxIndex : this.clickedBoxIndex
    };
  }
}

class Game {
  constructor(userEventHandler) {
    this.userEventHandler = userEventHandler;

    this.power = "off";
    this.gameRunning = false;
    this.strict = false;
    this.currentLevel = 0;
    this.totalLevels = 10;
    this.colorSequence = [];
    this.colorSequenceIndex = 0;
    this.userClickGuard = "noUserClick";

    this.colorSequenceCopy = [];
  }

  handleStrict() {
    if (this.power === "on") {
      if (!this.strict) {
        this.strict = true;
        $(".led").removeClass("led-off").addClass("led-on");
      } else {
        this.strict = false;
        $(".led").removeClass("led-on").addClass("led-off");
      }
    }
  }

  handlePower(){
    if (this.power === "on") {
      this.power = "off";
      $(".power").removeClass("power-on").addClass("power-off");
      $(".score").removeClass("score-on").addClass("score-off");
      this.stop();
      this.showCurrentLevel()
    } else {
      this.power = "on";
      $(".power").removeClass("power-off").addClass("power-on");
      $(".score").removeClass("score-off").addClass("score-on");
    }
  }

  handleStart() {
    if (this.power === "on") {
      if (this.gameRunning) {
        this.stop();
      }
      this.flashMessage("--", 2);
      this.start();
    }
  }

  start() {
    this.gameRunning = true;
    this.pushToColorSequence();
    this.changeCurrentLevel();
    this.clickHndl = setInterval(this.flashClickBox.bind(this), timeStep * 3);
  }

  stop(){
    this.userEventHandler.reset();
    this.gameRunning = false;
    this.currentLevel = 0;
    this.colorSequence = [];
    this.colorSequenceIndex = 0;
    clearTimeout(this.waitHndl);
    clearInterval(this.clickHndl);
  }

  handleSuccess() {
    this.stop();
    this.flashMessage("$$", 2);
    setTimeout(()=>{
      this.start();
    }, 3 * timeStep);
  }

  action(target){
    clearTimeout(this.waitHndl);
    clearInterval(this.clickHndl);

    this.userEventHandler.click(target);
    var info = this.userEventHandler.getClickInfo();

    if (this.colorSequence[info.moveNumber] === info.clickedBoxIndex) {
      if (info.moveNumber === this.currentLevel - 1) {
        console.log("correct dude");
        this.pushToColorSequence();
        this.userEventHandler.reset();
        this.clickHndl = setInterval(this.flashClickBox.bind(this), timeStep * 3);
        this.changeCurrentLevel();

        if (this.currentLevel > this.totalLevels) {
          this.handleSuccess();
        }

      } else {
        this.waitHndl = setTimeout(this.processNoResponse.bind(this), timeStep * 15);
      }
    } else {
      console.log("Error Happened");
      this.handleError("http://www.soundjay.com/button/button-4.mp3");
    }
  }

  makeACopyOfSequence(){
    if (this.colorSequenceCopy.length < this.colorSequence.length) {
      this.colorSequenceCopy = this.colorSequence.slice(0);
    }
  }

  handleError(errorSoundUrl){

    makeErrorSound(errorSoundUrl);
    this.flashMessage("!!", 2);

    if (this.strict) {
      this.makeACopyOfSequence();

      setTimeout(() => {
        this.stop();
        this.start();
      }, timeStep * 5);

    } else {

      this.userEventHandler.reset();
      setTimeout(() => {
        this.clickHndl = setInterval(this.flashClickBox.bind(this), timeStep * 3);
      }, timeStep * 2);
    }
  }

  changeCurrentLevel() {
    ++this.currentLevel;
  }

  showCurrentLevel(){
    if(this.currentLevel === 0){
      $(".score").text("--");
    } else {
      $(".score").text(this.currentLevel);
    }
  }

  flashClickBox(){

    this.userClickGuard = "noUserClick";

    var panelIndex = this.colorSequence[this.colorSequenceIndex];

    this.showCurrentLevel();
    lightPanel(panelIndex);

    //var _this = this;
    setTimeout(function(){
      unlightPanel(panelIndex);
    }, timeStep);

    makeSound(panelIndex);
    this.colorSequenceIndex++;

    if (this.colorSequenceIndex >= this.colorSequence.length) {
      clearInterval(this.clickHndl);
      this.colorSequenceIndex=0;
      this.userClickGuard = "allowClick";
      this.waitHndl = setTimeout(this.processNoResponse.bind(this), timeStep * 15);
    }
  }

  flashMessage(msg, times) {
    var scorePanel = $(".score");
    scorePanel.text(msg);

    var fl = function(){
      var lit = scorePanel.hasClass("score-on");
      if (lit) {
        $(".score").removeClass("score-on").addClass("score-off");
      } else {
        $(".score").removeClass("score-off").addClass("score-on");
      }
    };

    var count = 0;

    var _this = this;
    _this.flHndl = setInterval(function(){
      if (count >= times) {
        clearInterval(_this.flHndl);
      } else {
        count++;
        fl();
        setTimeout(fl, timeStep / 2);
      }
    }, timeStep);
  }

  pushToColorSequence() {
    if (this.colorSequenceCopy && this.colorSequence.length < this.colorSequenceCopy.length) {
      this.colorSequence.push(  this.colorSequenceCopy[this.colorSequence.length]  );
    } else {
      this.colorSequence.push( getRandomNumberUptoFour() );
    }
  }

  processNoResponse() {
    this.handleError("http://www.soundjig.com/pages/soundfx/futuristic.php?mp3=scifi23.mp3");
    console.log("There was no response.");
  }
}