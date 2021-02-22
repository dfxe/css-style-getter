"use strict";

const pp = (item) => {
  console.log(item);
};

class TooltipUtils {
  static idNum = 0;
  static lastTooltipId = "";
  static lockTooltip = true;
  static legalInput = ["id", "class"];

  static idsList = [];

  static instantiateTooltip() {
    const newTT = document.createElement("div");
    this.lastTooltipId = "ctts" + this.idNum.toString();
    this.idsList.push(this.lastTooltipId);
    this.idNum++;
    newTT.id = this.lastTooltipId;
    newTT.className = "ctts";
    document.body.appendChild(newTT);
    return document.getElementById(this.lastTooltipId);
  }

  static destroyTooltip(tooltipID) {
    document.getElementById(tooltipID).remove();
  }
}

class MouseTooltip {
  constructor() {
    this.lockTooltip = TooltipUtils.lockTooltip;
    [this.cursorX, this.cursorY] = [0, 0];
    this.allAttr = window.getComputedStyle(document.body);

    this.tooltip = TooltipUtils.instantiateTooltip();

    this.copyText = "";

    this.txtHtmHeader = "";
    this.txtToDisplay = "";

    document.addEventListener("keydown", (e) => {
      //doesn't work, lockTooltip var is not being accessed properly
      if (e.defaultPrevented) {
        return;
      }

      switch (e.code) {
        case "KeyS":
        case "ArrowDown":
          this.lockTooltip = !this.lockTooltip;
          this.tooltip = TooltipUtils.instantiateTooltip();
          break;
        default:
          break;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (this.lockTooltip) {
        this.tooltip.style.left = e.pageX + "px";
        this.tooltip.style.top = e.pageY + "px";
        this.cursorX = e.pageX;
        this.cursorY = e.pageY;
      }
    });

    document.addEventListener("mousedown", (e) => {
      //copy css
      navigator.clipboard.writeText(this.txtToDisplay);
      this.tooltip.style.backgroundColor = "#c8e6c9";
      this.tooltip.innerHTML = "copied";
      const timerez = (duration) => {
        let seconds = duration;
        setInterval(function () {
          this.tooltip.style.backgroundColor = "lightgray";
          if (--seconds < 0) {
            return;
          }
        }, 1000);
      };

      timerez(1);
      clearInterval(timerez);
    });

    setInterval(() => {
      this.displayCSSData_test();
      //th.cssk();
    }, 300);
  }

  tooltipFollow() {
    //
  }

  foundInString = (expr, nStr) => {
    return nStr.match(expr) !== null;
  };

  extractCSS(byAttribute, elementToView) {
    if (
      byAttribute === false ||
      elementToView === null ||
      elementToView === "undefined"
    ) {
      return "";
    }
    let outputTxt = "";
    for (const it of TooltipUtils.legalInput) {
      if (it === byAttribute) {
        if (elementToView.getAttribute(it)) {
          for (let i = 0; i < document.styleSheets[0].cssRules.length; i++) {
            if (
              this.foundInString(
                elementToView.getAttribute(it),
                document.styleSheets[0].cssRules[i].cssText
              )
            )
              outputTxt += this.prettyTextFormat(
                document.styleSheets[0].cssRules[i].cssText
              );
          }
        }
      }
    }

    return outputTxt;
  }

  prettyTextFormat = (nStr) => {
    //adds return character
    let nuStr = nStr;

    const endLn = /; /gm;
    const propertyBegin = / { /gm;
    const propertyEnd = /}/gm;
    nuStr = nuStr.replace(endLn, ";\n");
    nuStr = nuStr.replace(propertyBegin, " {\n");
    nuStr = nuStr.replace(propertyEnd, "}\n");
    return nuStr;
  };

  displayCSSData_test() {
    this.txtToDisplay = "";
    this.txtHtmHeader = "";

    let i = 0;
    let pointOfCursorFocus = document.elementFromPoint(
      this.cursorX,
      this.cursorY
    );
    /*
    //class 
    pp(document
        .elementFromPoint(this.cursorX, this.cursorY)
        .getAttribute('class'));
    //id
    pp(document
      .elementFromPoint(this.cursorX, this.cursorY)
      .getAttribute('id'));
    */
    //TODO get htm attributes

    if (typeof pointOfCursorFocus.attributes[0] !== "undefined") {
      pp(
        pointOfCursorFocus.attributes[0].name +
          "=" +
          pointOfCursorFocus.attributes[0].value +
          "\n"
      );
    }

    this.txtToDisplay =
      pointOfCursorFocus.tagName.toLocaleLowerCase() +
      "\n" +
      this.prettyTextFormat(this.extractCSS("class", pointOfCursorFocus));
    this.tooltip.innerHTML = this.txtToDisplay;

    //formatTooltipText(ss.cssRules[1].cssText);
    //pp(document.querySelector("#content3").getAttribute("style"));
  }

  editCSS() {}
}

const th = new MouseTooltip();
