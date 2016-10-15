$("document").ready(function() {
  var pom = new Pomodoro();
  $("button").click(function() {
    pom.handleButtonClick(this);
  });

  $(".clock, .background").click(function(){
    pom.handleClockClick();
  });
});


function getNewValue(operator, value) {
  if (value === "1" && operator === "-") {
    return 1;
  }
  switch(operator) {
    case "+":
      return parseInt(value)+1;
    case "-":
      return parseInt(value)-1;
  }
}


function pad(v) {
  v += "";
  if (v.length === 2) {
    return v;
  } else {
    return "0" + v;
  }
}

function getMinute(time) {
  if (time.includes(":")) {
    return time.substring(0,2);
  } else {
    return time;
  }
}

function getSecond(time) {
  if (time.includes(":")) {
    return time.substring(3);
  } else {
    return "00";
  }
}

function reduceOneSecond(time) {
  var second = getSecond(time);
  var minute = getMinute(time);
  if (second === "00") {
    return pad(parseInt(minute) - 1) + ":59";
  } else {
    return minute + ":" + pad(parseInt(second) - 1);
  }
}

function timeAsSecond(time) {
  return parseInt(getMinute(time)) * 60 + parseInt(getSecond(time));
}

function getPercentageRemaining(totalTime, timeRemaining) {
  return timeAsSecond(timeRemaining) * 100 / timeAsSecond(totalTime);
}


class Pomodoro {
  constructor() {
    this.running = false;
    this.interval = null;
    this.breakVal = null;
    this.sessionVal = null;
    this.mode = "session";
  }

  handleClockClick() {
    if (!this.running) {
      this.breakVal = $("#break_val").html();
      this.sessionVal = $("#session_val").html();
      if (this.mode === "session") {
        this.interval = setInterval(this.runSessionTimer.bind(this), 1000);
      } else {
        this.interval = setInterval(this.runBreakTimer.bind(this), 1000);
      }
      this.running = true;
    } else {
      clearInterval(this.interval);
      this.running = false;
    }
  }

  runSessionTimer() {
    var time = $("#timer").html();
    var oneSecLess = reduceOneSecond(time);
    $("#timer").html(oneSecLess);
    var percentage = getPercentageRemaining(this.sessionVal, oneSecLess) + "%";
    $(".upper").css("height", percentage);
    if (oneSecLess === "00:00") {
      $(".color-container").css("background-color", "#FF4444");
      $(".upper").css("height", "100%");
      $("#timer").html(this.breakVal);
      $("#title").html("Break!");
      clearInterval(this.interval);
      this.interval = setInterval(this.runBreakTimer.bind(this), 1000);
      this.mode = "break";
    }
  }

  runBreakTimer() {
    var time = $("#timer").html();
    var oneSecLess = reduceOneSecond(time);
    $("#timer").html(oneSecLess);
    var percentage = getPercentageRemaining(this.breakVal, oneSecLess) + "%";
    $(".upper").css("height", percentage);
    if (oneSecLess === "00:00") {
      $(".color-container").css("background-color", "#99CC00");
      $(".upper").css("height", "100%");
      $("#timer").html(this.sessionVal);
      $("#title").html("Session");
      clearInterval(this.interval);
      this.interval = setInterval(this.runSessionTimer.bind(this), 1000);
      this.mode = "session";
    }
  }

  handleButtonClick(button) {
    if (!this.running) {
      var span = $(button).siblings("span");
      var newVal = getNewValue($(button).val(), span.html());
      span.html(newVal);
      if (sessionButtonClicked(button) && this.mode === "session") {
        $("#timer").html(newVal);
      } else if (breakButtonClicked(button) && this.mode === "break") {
        $("#timer").html(newVal);
      }
    }
  }
}

function sessionButtonClicked(button) {
  return $(button).parents(".session").length > 0;
}

function breakButtonClicked(button) {
  return $(button).parents(".break").length > 0;
}
