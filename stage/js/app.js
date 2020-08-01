/*jshint esversion: 6 */

ui(function () {
  //toggle placeholder attr

  ui("[placeholder]")
    .on("focus", function () {
      let ele = ui(this),
        label = ele.siblings(".inp_lap");
      label.css({
        top: "-8px",
        right: "2%",
      });
    })
    .on("blur", function () {
      if (ui(this).val().trim() == "") {
        ui(this).siblings(".inp_lap")[0].style.removeProperty("top");
        ui(this).siblings(".inp_lap")[0].style.removeProperty("right");
      }
    });

  ui(".close_pop_up").on(
    "click",
    function () {
      let ele = ui(this),
        target = ele.parents(".pop_up");
      target.removeClass("open_pop").addClass("close_pop");
      ui("body").css("overflow", "auto");
    },
    true
  );

  ui("[data-o-pop]").on("click", function () {
    let ele = ui(this),
      target = ui("#" + ele.attr("data-o-pop"));
    target.removeClass("close_pop").addClass("open_pop");
    ui("body").css("overflow", "hidden");
  });

  ui("[data-o-p-f-p]").on("click", function () {
    print(this);
    let ele = ui(this),
      target = ui("#" + ele.attr("data-o-p-f-p"));
    ele.parents(".pop_up").removeClass("open_pop").addClass("close_pop").delay(10);
    target.addClass("open_pop").removeClass("close_pop");
    ui("body").css("overflow", "hidden");
  });

  //funtion to make select option from nums or array

  /**
   * 
   * @param {Element | string} ele 
   * @param {number} start 
   * @param {number} end 
   * @param {Array} arr 
   */
  function make_option_nums(ele, start, end, selectedVal, arr, pos) {
    ele = ui(ele);
    selectedVal = selectedVal || "";
    pos = pos || "beforeend";
    if (arr && Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == selectedVal) {
          ele.html("<option selected val=" + arr[i] + ">" + arr[i] + "</option>", pos);
        } else {
          ele.html("<option val=" + arr[i] + ">" + arr[i] + "</option>", pos);
        }
      }
    } else {
      for (let i = start; i <= end; i++) {
        if (i == selectedVal) {
          ele.html("<option selected val=" + i + ">" + i + "</option>", pos);
        } else {
          ele.html("<option val=" + i + ">" + i + "</option>", pos);
        }
      }
    }
  }

  make_option_nums("#crslyear", 1920, new Date().getFullYear(), 2003, undefined, "afterbegin");
  make_option_nums("#crslday", 1, 31, 4, undefined,
    "beforeend");
  let months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  make_option_nums("#crslmonth", undefined, undefined, "مايو", months, "beforeend");

});