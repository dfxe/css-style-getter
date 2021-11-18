"use strict";

const pp = (item) => {
  console.log(item);
};

class LinkedNode {
  constructor(item) {
    this.item = item;
    this.next = null;
  }
}

class TooltipUtils {
  static idNum = 0;
  static lastTooltipId = "";
  static lockTooltip = false;
  static legalInput = ["id", "class"];

  static idsList = [];

  static instantiateTooltip() {
    const tt = document.createElement("div"),
      ttInteriorHeader = document.createElement("div"),
      ttInteriorBody = document.createElement("div"),
      ttDeleteBtn = document.createElement("button");

    //tooltip whole
    this.lastTooltipId = "ctts" + this.idNum.toString();
    this.idsList.push(this.lastTooltipId);
    this.idNum++;
    tt.id = this.lastTooltipId;
    tt.className = "ctts";

    ttInteriorHeader.className = "tt-interior-header";
    ttInteriorHeader.innerHTML = "body";

    ttInteriorBody.className = "tt-interior-body";
    ttInteriorBody.innerHTML = "body";

    ttDeleteBtn.className = "tt-delete-btn";
    ttDeleteBtn.innerHTML = "X";

    document.body.appendChild(tt);

    tt.appendChild(ttDeleteBtn);
    tt.appendChild(ttInteriorHeader);

    tt.appendChild(ttInteriorBody);
    return [
      document.getElementById(this.lastTooltipId),
      ttInteriorHeader,
      ttInteriorBody,
      ttDeleteBtn,
    ];
  }

  static destroyTooltip(tooltipID) {
    document.getElementById(tooltipID).remove();
  }
}

class MouseTooltip {
  constructor() {
    this.lockTooltip = TooltipUtils.lockTooltip;
    [this.cursorX, this.cursorY] = [0, 0];

    [
      this.tooltip,
      this.tooltipHeader,
      this.tooltipBody,
      this.tooltipDeleteButton,
    ] = TooltipUtils.instantiateTooltip();

    this.txtHtmHeader = "";
    this.txtToDisplay = "";
  }

  toggleLockTooltip() {
    this.lockTooltip = !this.lockTooltip;
  }

  isLocked() {
    return this.lockTooltip;
  }

  foundInString(expr, nStr) {
    return nStr.match(expr) !== null;
  }

  extractCSS(attributesToCheck, elementToView) {
    //needs to include "tagName" check
    if (elementToView === null || elementToView === "undefined") {
      return "";
    }
    let outputTxt = "";
    for (const it of attributesToCheck) {
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

    return outputTxt;
  }

  prettyTextFormat(textToParse) {
    //adds return character
    let nuStr = textToParse;

    const endLn = /; /gm;
    const propertyBegin = / { /gm;
    const propertyEnd = /}/gm;
    nuStr = nuStr.replace(endLn, ";\n");
    nuStr = nuStr.replace(propertyBegin, " {\n");
    nuStr = nuStr.replace(propertyEnd, "}\n");
    return nuStr;
  }

  prettyTextFormatEmphasis(textToParse) {
    let tempArr = [...textToParse];
    for (let index = 0; index < tempArr.length; index++) {
      if (tempArr[index] === "{") {
        tempArr[index + 1] = "</b><br>";
      } else if (tempArr[index + 1] === "}") {
        tempArr[index + 1] = "<b><br>}";
      }
    }
    tempArr.unshift("<b>");
    return tempArr.join("");
  }

  displayCSSData() {
    this.txtToDisplay = "";
    this.txtHtmHeader = "";

    let pointOfCursorFocus = document.elementFromPoint(
      this.cursorX,
      this.cursorY
    );
    //TODO extract from elemets that do not have stylesheet written by user

    /*if (typeof pointOfCursorFocus.attributes[0] !== undefined) {
      pp(
        pointOfCursorFocus.attributes[0].name +
          "=" +
          pointOfCursorFocus.attributes[0].value +
          "\n"
      );
    }*/

    this.txtToDisplay =
      pointOfCursorFocus.tagName.toLocaleLowerCase() +
      "\n" +
      this.prettyTextFormat(
        this.extractCSS(TooltipUtils.legalInput, pointOfCursorFocus)
      );

    this.tooltipHeader.innerText =
      pointOfCursorFocus.tagName.toLocaleLowerCase() + "\n";
    this.tooltipBody.innerHTML = this.prettyTextFormatEmphasis(
      this.prettyTextFormat(
        this.extractCSS(TooltipUtils.legalInput, pointOfCursorFocus)
      )
    );
  }

  separateTextValues(text) {
    let tempArr = [...text];
    for (let index = 0; index < tempArr.length; index++) {
      const element = array[index];
    }
  }

  editCSS() {
    //TODO be able to edit css directly from tooltip
  }
}

class MouseAttributes {
  constructor(tooltipInstance, mousePositiontReference) {
    this.mouseTooltip = tooltipInstance;
    [this.cX, this.cY] = [0, 0];
    this.sleeps = false;

    document.addEventListener("mousemove", (e) => {
      e.preventDefault();
      this.cX = e.pageX;
      this.cY = e.pageY;
    });
  }

  isSleeping() {
    return this.sleeps;
  }

  getPoint() {
    return [this.cX, this.cY];
  }

  followTooltip = (e) => {
    if (!this.isSleeping()) {
      if (this.mouseTooltip.isLocked() === false) {
        this.mouseTooltip.tooltip.style.left = e.pageX + "px";
        this.mouseTooltip.tooltip.style.top = e.pageY + "px";
        this.mouseTooltip.cursorX = this.cX;
        this.mouseTooltip.cursorY = this.cY;
      }
    }
  };

  clickToCopy = () => {
    if (!this.isSleeping()) {
      if (this.mouseTooltip.isLocked() === false) {
        const copyFX = (byObject) => {
          byObject.tooltip.style.backgroundColor = "#c8e6c9";
          byObject.tooltipHeader.innerText = "CSS now on clipboard.";
          byObject.tooltipBody.innerText = "";
        };

        const copyFN = () => {
          navigator.clipboard.writeText(this.mouseTooltip.txtToDisplay);
        };

        copyFN();

        copyFX(this.mouseTooltip);

        const revertTooltipToStyleDefault = (duration, fxObject) => {
          let seconds = duration;
          setInterval(function () {
            fxObject.style.backgroundColor = "#D6ED17FF";
            if (seconds-- < 0) {
              return;
            }
          }, 1000);
        };

        revertTooltipToStyleDefault(1, this.mouseTooltip.tooltip);
        clearInterval(revertTooltipToStyleDefault);
      }
    }
  };

  clickToControl = () => {
    if (!this.isSleeping()) {
      if (document.elementFromPoint(this.cX, this.cY).className === "ctts") {
        //this.mouseTooltip.tooltip.id = "";
        //
        this.mouseTooltip.tooltip = document.elementFromPoint(this.cX, this.cY);
        this.mouseTooltip.lockTooltip = false;
        //this.mouseTooltip.tooltip.id = "selected-ctts";
      }
    }
  };

  clickToRemove() {
    if (!this.isSleeping()) {
      this.mouseTooltip.tooltipDeleteButton.addEventListener("click", () => {
        document.removeEventListener("mousemove", this.followTooltip);
        document.removeEventListener("mousedown", this.clickToControl);
        document.removeEventListener("mousedown", this.clickToCopy);

        TooltipUtils.destroyTooltip(
          document.elementFromPoint(this.cX, this.cY).parentElement.id
        );
      });
    }
  }

  setDefaultMouseAttributes() {
    document.addEventListener("mousemove", this.followTooltip);

    document.addEventListener("mousedown", this.clickToCopy);
    document.addEventListener("mousedown", this.clickToControl);

    this.clickToRemove();

    setInterval(() => {
      //here previous not current mousetooltip
      if (this.mouseTooltip.isLocked() === false) {
        this.mouseTooltip.displayCSSData();
      }
    }, 300);
  }
}

class MouseTooltipFactory {
  constructor() {
    this.mouseTooltip;

    document.addEventListener("keydown", (e) => {
      //doesn't work, lockTooltip var is not being accessed properly
      if (e.defaultPrevented) {
        return;
      }
      switch (e.code) {
        case "KeyC":
          this.mouseTooltip.lockTooltip = true;
          this.makeMouseTooltip();
          break;
        case "KeyS":
          //control switch to stack
          this.mouseTooltip.toggleLockTooltip();
          break;
        default:
          break;
      }
    });
  }

  makeMouseTooltip() {
    if (this.mouseTooltip !== null && this.mouseTooltip !== undefined) {
      this.mouseTooltip.lockTooltip = true;
    }

    this.mouseTooltip = new MouseTooltip();

    new MouseAttributes(this.mouseTooltip).setDefaultMouseAttributes();
  }
}

const th = new MouseTooltipFactory();
th.makeMouseTooltip();
