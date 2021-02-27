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
    let current = this.head;
    let previous = null;

    while (current !== null) {
      if (current.item === item) {
        if (previous === null) {
          this.head = current.next;
        } else {
          previous.next = current.next;
        }
        this.size--;
        return current.item;
      }

      previous = current;
      current = current.next;
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

  lockTooltipToggle() {
    this.lockTooltip = !this.lockTooltip;
  }

  foundInString = (expr, nStr) => {
    return nStr.match(expr) !== null;
  };

  extractCSS(attributesToCheck, elementToView) {
    //needs to include "tagName" check
    if (
      
      elementToView === null ||
      elementToView === "undefined"
    ) {
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

  prettyTextFormat(nStr) {
    //adds return character
    let nuStr = nStr;

    const endLn = /; /gm;
    const propertyBegin = / { /gm;
    const propertyEnd = /}/gm;
    nuStr = nuStr.replace(endLn, ";\n");
    nuStr = nuStr.replace(propertyBegin, " {\n");
    nuStr = nuStr.replace(propertyEnd, "}\n");
    return nuStr;
  }

  prettyTextFormatEmphasis(nStr) {
    let nuArr = [...nStr];
    for (let index = 0; index < nuArr.length; index++) {
      if (nuArr[index] === ":" || nuArr[index] === "{") {
        nuArr[index + 1] = "</b>";
      } else if (nuArr[index] === "}") {
        nuArr[index + 1] = "<b>";
      }
    }
    nuArr.unshift("<b>");
    return nuArr.join("");
  }

  displayCSSData() {
    this.txtToDisplay = "";
    this.txtHtmHeader = "";

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
      this.prettyTextFormat(this.extractCSS(TooltipUtils.legalInput, pointOfCursorFocus));

    this.tooltipHeader.innerText = pointOfCursorFocus.tagName.toLocaleLowerCase() + "\n";
    this.tooltipBody.innerHTML = this.prettyTextFormatEmphasis(
      this.prettyTextFormat(this.extractCSS(TooltipUtils.legalInput, pointOfCursorFocus))
    );
  }

  editCSS() {}
}

class MouseTooltipControl {
  constructor() {
    [this.cX, this.cY] = [0, 0];
    this.current;
    this.mtLL = new LinkedList();
    document.addEventListener("keydown", (e) => {
      //doesn't work, lockTooltip var is not being accessed properly
      if (e.defaultPrevented) {
        return;
      }
      switch (e.code) {
        case "KeyC":
          this.current.lockTooltip = true;
          this.createMouseTooltip();
          break;
        case "KeyS":
          //control switch to stack
          this.current.lockTooltipToggle();
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

  createMouseTooltip() {
    this.current = new MouseTooltip();
    this.mtLL.add(this.current);
    //pp(this.mtStack.printStack())

    const followTooltip = (e) => {
      if (this.current.lockTooltip === false) {
        this.current.tooltip.style.left = e.pageX + "px";
        this.current.tooltip.style.top = e.pageY + "px";
        this.current.cursorX = this.cX;
        this.current.cursorY = this.cY;
      }
    };

    const clickToCopy = (e) => {
      if (this.current.lockTooltip === false) {
        navigator.clipboard.writeText(this.current.txtToDisplay);
        this.current.tooltip.style.backgroundColor = "#c8e6c9";
        this.current.tooltipHeader.innerText = "CSS now on clipboard.";
        this.current.tooltipBody.innerText = "";
        const timerez = (duration, fxObject) => {
          let seconds = duration;
          setInterval(function () {
            fxObject.style.backgroundColor = "#D6ED17FF";
            if (seconds-- < 0) {
              return;
            }
          }, 1000);
        };

        timerez(1, this.current.tooltip);
        clearInterval(timerez);
      }
    };

    document.addEventListener("mousemove", followTooltip);

    document.addEventListener("mousedown", clickToCopy);

    setInterval(() => {
      if (this.current.lockTooltip === false) {
        this.current.displayCSSData();
      }
    }, 300);

    //TODO element still exists in js runtime (this is bad)
    //to remove an e listener, an external function needs be developed.
    //lambdas don't work
    this.current.tooltipDeleteButton.addEventListener("click", () => {
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
