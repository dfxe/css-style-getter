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

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  add(item) {
    let addedNode = new LinkedNode(item);
    let currentNode = null;
    if (this.head === null) {
      this.head = addedNode;
    } else {
      currentNode = this.head;
      while (currentNode.next) {
        currentNode = currentNode.next;
      }
      currentNode.next = addedNode;
    }
  }

  removeElement(item) {
    let mouseTooltip = this.head;
    let previous = null;

    while (mouseTooltip !== null) {
      if (mouseTooltip.item === item) {
        if (previous === null) {
          this.head = mouseTooltip.next;
        } else {
          previous.next = mouseTooltip.next;
        }
        this.size--;
        return mouseTooltip.item;
      }

      previous = mouseTooltip;
      mouseTooltip = mouseTooltip.next;
    }

    return "Nothing to remove";
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

  foundInString = (expr, nStr) => {
    return nStr.match(expr) !== null;
  };

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
      } else if (tempArr[index+1] === "}") {
        tempArr[index + 1] = "<b><br><br>";
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

  editCSS() {}
}

class MouseTooltipControl {
  constructor() {
    [this.cX, this.cY] = [0, 0];
    this.mouseTooltip;
    this.mtLL = new LinkedList();
    document.addEventListener("keydown", (e) => {
      //doesn't work, lockTooltip var is not being accessed properly
      if (e.defaultPrevented) {
        return;
      }
      switch (e.code) {
        case "KeyC":
          this.mouseTooltip.lockTooltip = true;
          this.createMouseTooltip();
          break;
        case "KeyS":
          //control switch to stack
          this.mouseTooltip.toggleLockTooltip();
          break;
        default:
          break;
      }
    });

    document.addEventListener("mousemove", (e) => {
      this.cX = e.pageX;
      this.cY = e.pageY;
    });
  }

  copyFX(byObject) {
    byObject.tooltip.style.backgroundColor = "#c8e6c9";
    byObject.tooltipHeader.innerText = "CSS now on clipboard.";
    byObject.tooltipBody.innerText = "";
  }

  copyFN() {
    navigator.clipboard.writeText(this.mouseTooltip.txtToDisplay);
  }

  createMouseTooltip() {
    this.mouseTooltip = new MouseTooltip();
    this.mtLL.add(this.mouseTooltip);
    //pp(this.mtStack.printStack())

    const followTooltip = (e) => {
      if (this.mouseTooltip.isLocked() === false) {
        this.mouseTooltip.tooltip.style.left = e.pageX + "px";
        this.mouseTooltip.tooltip.style.top = e.pageY + "px";
        this.mouseTooltip.cursorX = this.cX;
        this.mouseTooltip.cursorY = this.cY;
      }
    };

    const clickToCopy = () => {
      if (this.mouseTooltip.isLocked() === false) {
        this.copyFN();

        this.copyFX(this.mouseTooltip);

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
    };

    const clickToControl = () =>{
      if(document.elementFromPoint(this.cX, this.cY).className==="ctts"){
        this.mouseTooltip.tooltip = document.elementFromPoint(this.cX, this.cY);
      }
    };

    document.addEventListener("mousemove", followTooltip);

    document.addEventListener("mousedown", clickToCopy);
    document.addEventListener("mousedown", clickToControl);

    setInterval(() => {
      if (this.mouseTooltip.isLocked() === false) {
        this.mouseTooltip.displayCSSData();
      }
    }, 300);

    //TODO element still exists in js runtime (this is bad)
    this.mouseTooltip.tooltipDeleteButton.addEventListener("click", () => {
      document.removeEventListener("mousemove", followTooltip);

      document.removeEventListener("mousedown", clickToCopy);
      TooltipUtils.destroyTooltip(
        document.elementFromPoint(this.cX, this.cY).parentElement.id
      );
    });
  }
}

const th = new MouseTooltipControl();
th.createMouseTooltip();
