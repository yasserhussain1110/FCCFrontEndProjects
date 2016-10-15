$("document").ready(function() {
  var calculator = new Calculator();
  $(".key").click(function() {
    calculator.processInput($(this).find("button").val());
  });
})


class Calculator {

  constructor() {
    this.state = "INIT";
    this.currentEntry = "0";
    this.expression = "0";

    this.handlers = {
      INIT           : this.initHandler.bind(this),
      GOT_NUM        : this.gotNumHandler.bind(this),
      GOT_OPERATOR   : this.gotOperatorHandler.bind(this),
      EVALUATED      : this.gotEvaluatedHandler.bind(this)
    }

  }

  gotEvaluatedHandler(input) {
    var operators = "+-*/".split("");
    var digits = "0123456789".split("");
    if (operators.indexOf(input) > -1) {
      this.expression = this.currentEntry + input;
      this.currentEntry = input;
      this.state = "GOT_OPERATOR";
    } else if (digits.indexOf(input) > -1){
      this.expression = this.currentEntry = input;
      this.state = "GOT_NUM";
    }
  }

  gotOperatorHandler(input) {
    var processableInputs = ".123456789".split("");
    if (processableInputs.indexOf(input) === -1) {
      console.log("can't process this");
      return;
    }

    if (input === ".") {
      this.currentEntry = "0.";
      this.expression += "0.";
    } else {
      this.currentEntry = input;
      this.expression += input;
    }

    this.state = "GOT_NUM";
  }

  initHandler(input) {
    var processableInputs = ".123456789".split("");
    if (processableInputs.indexOf(input) === -1) {
      console.log("can't process this");
      return;
    }

    if (input === ".") {
      this.currentEntry = "0.";
      this.expression = "0.";
    } else {
      this.currentEntry = input;
      this.expression = input;
    }
    this.state = "GOT_NUM";
  }

  gotNumHandler(input) {
    switch (input) {
      case "=":
        this.currentEntry = eval(this.expression).toFixed(2).replace(/\.?0+$/, "");
        this.expression += "=" + this.currentEntry;
        this.state = "EVALUATED";
        break;
      case "+":
      case "-":
      case "/":
      case "*":
        if (this.currentEntry.endsWith(".")) {
          this.expression += "0";
        }
        this.currentEntry = input;
        this.expression += input;
        this.state = "GOT_OPERATOR";
        break;
      case ".":
        if (this.expression.indexOf(".") > -1) {
          break;
        }
      default:
        this.currentEntry = this.currentEntry + input;
        this.expression = this.expression + input;
    }
  }

  processInput(input) {
    if (!this.checkForACOrCE(input)) {
      this.handlers[this.state](input);
    }
    this.updateScreen();
  }

  updateScreen() {
    $("#input").html(this.currentEntry);
    $("#result").html(this.expression);
  }


  reset() {
    this.state = "INIT";
    this.currentEntry = "0";
    this.expression = "0";
  }

  clearLastInput() {
    this.currentEntry = this.removeLastEntry(this.currentEntry);
    this.expression = this.removeLastEntry(this.expression);
  }

  removeLastEntry(entry) {
    var removed = entry.substring(0,entry.length-1);
    if (removed === "") {
      removed = "0"
    }
    return removed;
  }

  checkForACOrCE(input) {
    switch(input) {
      case "ac":
        this.reset();
        return true;
      case "ce":
        this.clearLastInput();
        return true;
      default:
        return false;
    }
  }
}
