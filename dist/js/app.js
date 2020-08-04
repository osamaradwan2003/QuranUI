/*jshint esversion: 6 */

ui(function () {
  //toggle placeholder attr

  ui("[placeholder]")
    .on("focus", function () {

      let ele = ui(this),
        label = ele.siblings(".inp_lab");
      label.css({
        top: "-8px",
        right: "2%",
      });
    })
    .on("blur", function () {
      if (ui(this).val().trim() == "") {
        ui(this).siblings(".inp_lab")[0].style.removeProperty("top");
        ui(this).siblings(".inp_lab")[0].style.removeProperty("right");
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
  }, true);

  ui("[data-o-p-f-p]").on("click", function (e) {
    e.stopPropagation();
    let ele = ui(this),
      target = ui("#" + ele.attr("data-o-p-f-p"));
    ele.parents(".pop_up").removeClass("open_pop").addClass("close_pop").delay(10);
    target.addClass("open_pop").removeClass("close_pop");
    ui("body").css("overflow", "hidden");
  }, true, true);

  //close popup in press esc
  ui("body, html:not(.pop_up)").on("keydown", function (e) {
    e.stopPropagation();
    if (e.keyCode == 27) ui(".pop_up").removeClass("open_pop").addClass("close_pop");

  }, undefined, true);

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
          ele.html("<option selected value=" + arr[i] + ">" + arr[i] + "</option>", pos);
        } else {
          ele.html("<option value=" + arr[i] + ">" + arr[i] + "</option>", pos);
        }
      }
    } else {
      for (let i = start; i <= end; i++) {
        if (i == selectedVal) {
          ele.html("<option selected value=" + i + ">" + i + "</option>", pos);
        } else {
          ele.html("<option value=" + i + ">" + i + "</option>", pos);
        }
      }
    }
  }

  make_option_nums("#crslyear", 1920, new Date().getFullYear(), 2003, undefined, "afterbegin");
  make_option_nums("#crslday", 1, 31, 4, undefined,
    "beforeend");
  let months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  make_option_nums("#crslmonth", undefined, undefined, "مايو", months, "beforeend");


  //from validator
  /**
   * 
   * @param {object} obj 
   */
  function make_validator(obj, cbc, ecbc) {
    let ele = ui(obj.ele) || "",
      message = obj.message,
      exp = new RegExp(obj.exp),
      func_exp = obj.makeExp,
      showMessageEle = ui(obj.showMessageEle),
      emptyInpMessage = obj.emptyMessage,
      success_func = obj.succsess,
      borderClor = ele.css("border-color");
    if (func_exp && isFunc(func_exp)) {
      func_exp.call(ele, obj, borderClor);
      if (cbc) ele.css("border-color", ecbc);
      return;
    }
    if (ele.val().trim() == "") {
      showMessageEle.html(emptyInpMessage).show(500);
      ele.attr("data-valid", "false");
      if (cbc) ele.css("border-color", ecbc);
    } else if (!exp.test(ele.val())) {
      if (cbc) ele.css("border-color", ecbc);
      ele.attr("data-valid", "false");
      showMessageEle.html(message).show(500);
    } else {
      if (success_func && isFunc(success_func)) {
        ele.attr("data-valid", "true");
        if (cbc) ele.css("border-color", borderClor);
        success_func.call(ele, obj, borderClor);
      }
    }

  }

  function insert_valid(e) {
    let inp = ui(this);

    if (inp.attr("name") == "crfname") {
      make_validator({
        ele: inp,
        showMessageEle: inp.siblings(".err_tip"),
        exp: /(\w).{2,}/gm,
        message: "يجب أن يكون الاسم الأول مابين 3 الى 16 حرف",
        emptyMessage: "من فضلك ادخل الاسم الاول",
        succsess: function (obj) {
          obj.showMessageEle.hide(500);
          valid = true;
        },
      }, false, "#ee4238");
    } else if (inp.attr("name") == "crlsname") {
      make_validator({
        ele: inp,
        showMessageEle: inp.siblings(".err_tip"),
        emptyMessage: "من فضلك ادخل اسم العائلة",
        exp: /(\w).{2,}/gm,
        message: "يجب أن يكون إسم العائلة مابين 3 الى 32 حرف",
        succsess: function (obj, e, brc) {
          valid = true;
          obj.showMessageEle.hide(500);
        },
      }, false, "#ee4238");
    } else if (inp.attr("type") == "email") {
      make_validator({
        ele: inp,
        showMessageEle: inp.siblings(".err_tip"),
        exp: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        emptyMessage: "أدخل البريد الإلكتروني",
        message: "هذا البريد غير صحيح",
        succsess: function (obj) {
          valid = true;
          obj.showMessageEle.hide(500);
        },
      }, false, "#ee4238");
    } else if (inp.attr("type") == "password") {
      make_validator({
        ele: inp,
        showMessageEle: inp.siblings(".err_tip"),
        emptyMessage: "أدخل كلمة المرور",
        exp: /(\w).{7,}/gm,
        message: "يجب ان تكون كلمة السر اكبر من 8 احرف",
        succsess: function (obj) {
          valid = true;
          obj.showMessageEle.hide(500);
        },
      }, false, "#ee4238");
    }
  }

  ui("input[type='checkbox']").on("click", function () {
    if (ui(this).attr("name") == "polccr") {
      if (this.checked != true) {
        let c = ui(this);
        c.attr("data-valid", "false");
        c.siblings(".err_tip").html("يجب الموافقة على سياسة الخصوصية").show(500);
      } else {
        let c = ui(this);
        c.siblings(".err_tip").hide(400);
        c.attr("data-valid", "true");
      }
    }
  });

  ui("input").on("input blur", insert_valid);

  ui("form").on("submit", function (e) {
    e.preventDefault();
    let valid = [];
    ui(this).children("input").each(function (e) {
      insert_valid.apply(this);
      if (ui(this).attr("name") == "polccr") {
        if (this.checked != true) {
          let c = ui(this);
          c.attr("data-valid", "false");
          c.siblings(".err_tip").html("يجب الموافقة على سياسة الخصوصية").show(500);
        } else {
          let c = ui(this);
          c.siblings(".err_tip").hide(400);
          c.attr("data-valid", "true");
        }
      }
      valid.push(ui(this).attr("data-valid"));
    });
    if (valid.indexOf("false") == -1) {
      this.submit();
    }
  });

});
//# sourceMappingURL=app.js.map
