"use strict";

const pp = (item) => {
  console.log(item);
};

class MouseTooltip {
  constructor() {
    this.lockTooltip = true;
    [this.cursorX, this.cursorY] = [0, 0];
    this.allAttr = window.getComputedStyle(document.body);

    this.tooltip = document.getElementById("ctooltip");
    this.copyText = "";

    this.txtHtmHeader = "";
    this.txtToDisplay = "";

    document.addEventListener("mousemove", (e) => {
      if (this.lockTooltip) {
        this.tooltip.style.left = e.pageX + "px";
        this.tooltip.style.top = e.pageY + "px";
        this.cursorX = e.pageX;
        this.cursorY = e.pageY;
      }
    });

    document.addEventListener("mousedown", (e) => {
      //TODO, how to copy???

      //pp(document.elementFromPoint(this.cursorX,this.cursorY));

      navigator.clipboard.writeText(this.txtToDisplay);

      this.tooltip.style.backgroundColor = "#c8e6c9";
      document.getElementById("ctooltip").innerHTML = "copied";
      const timerez = (duration) => {
        let seconds = duration;
        setInterval(function () {
          //seconds = parseInt(timer % 60, 10);

          //seconds = seconds < 10 ? "0" + seconds : seconds;

          document.getElementById("ctooltip").style.backgroundColor =
            "lightgray";

          if (--seconds < 0) {
            return;
          }
        }, 1000);
      };

      timerez(1);
    });
  }

  tooltipFollow() {
    //
  }

  extractCSS() {
    //let x = document.elementFromPoint(this.cursorX,this.cursorY).attributes;
    //for(let i of x)
    //    pp(i);
  }

  displayCSSData_test() {
    this.txtToDisplay = "";
    this.txtHtmHeader = "";
    const matchS = (expr, nStr) => {
      return nStr.match(expr) !== null;
    };

    const prettyTxtFormat = (nStr) => {
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

    let ss = document.styleSheets[0];

    let i = 0;
    let pointOfCursorFocus = document
    .elementFromPoint(this.cursorX, this.cursorY);
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

    
    if (typeof pointOfCursorFocus.attributes[0] !== 'undefined'){
      
      pp(pointOfCursorFocus.attributes[0].name + "=" +pointOfCursorFocus.attributes[0].value+"\n");
    }

    if (
      pointOfCursorFocus
        .getAttribute("class")
    ) {
      for (i = 0; i < ss.cssRules.length; i++) {
        if (
          matchS(
            pointOfCursorFocus
              .getAttribute("class"),
            ss.cssRules[i].cssText
          )
        )
          this.txtToDisplay += prettyTxtFormat(ss.cssRules[i].cssText);
      }
    } else {
      this.txtToDisplay = "";
    }

    if (
      pointOfCursorFocus.getAttribute("id")
    ) {
      for (i = 0; i < ss.cssRules.length; i++) {
        if (
          matchS(
            pointOfCursorFocus
              .getAttribute("id"),
            ss.cssRules[i].cssText
          )
        )
          this.txtToDisplay += prettyTxtFormat(ss.cssRules[i].cssText);
      }
    }

    this.tooltip.innerHTML = this.txtToDisplay;

    //formatTooltipText(ss.cssRules[1].cssText);
    //pp(document.querySelector("#content3").getAttribute("style"));
  }

  cssk() {
    //found it !!!
    //pp(ss.cssRules[2].cssText);
    const matchS = (expr, nStr) => {
      return nStr.match(expr) !== null;
    };

    pp(matchS("nova", "#nova"));
  }

  toggleLockTooltip() {
    this.lockTooltip = !this.lockTooltip;
  }

  editCSS() {}
}

const th = new MouseTooltip();

//th.extractCSS();

setInterval(() => {
  th.displayCSSData_test();
  //th.cssk();
}, 300);
