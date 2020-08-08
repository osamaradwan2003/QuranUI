ui(function(){function e(e,s,t,i,a,l){if(e=ui(e),i=i||"",l=l||"beforeend",a&&Array.isArray(a))for(let s=0;s<a.length;s++)a[s]==i?e.html("<option selected value="+a[s]+">"+a[s]+"</option>",l):e.html("<option value="+a[s]+">"+a[s]+"</option>",l);else for(let a=s;a<=t;a++)a==i?e.html("<option selected value="+a+">"+a+"</option>",l):e.html("<option value="+a+">"+a+"</option>",l)}ui("[placeholder]").on("focus",function(){ui(this).siblings(".inp_lab").css({top:"-8px",right:"2%"})}).on("blur",function(){""==ui(this).val().trim()&&(ui(this).siblings(".inp_lab")[0].style.removeProperty("top"),ui(this).siblings(".inp_lab")[0].style.removeProperty("right"))}),ui(".close_pop_up").on("click",function(){let e=ui(this).parents(".pop_up");print(e),e.removeClass("open_pop").addClass("close_pop"),ui("body").css("overflow","auto")},!0),ui("[data-o-pop]").on("click",function(){let e=ui(this);ui("#"+e.attr("data-o-pop")).removeClass("close_pop").addClass("open_pop"),ui("body").css("overflow","hidden")},!0),ui("[data-o-p-f-p]").on("click",function(e){e.stopPropagation();let s=ui(this),t=ui("#"+s.attr("data-o-p-f-p"));s.parents(".pop_up").removeClass("open_pop").addClass("close_pop").delay(10),t.addClass("open_pop").removeClass("close_pop"),ui("body").css("overflow","hidden")},!0,!0),ui("body, html:not(.pop_up)").on("keydown",function(e){e.stopPropagation(),27==e.keyCode&&ui(".pop_up").removeClass("open_pop").addClass("close_pop")},void 0,!0),e("#crslyear",1920,(new Date).getFullYear()+1,2003,void 0,"afterbegin"),e("#crslday",1,32,4,void 0,"beforeend");let s=["يناير","فبراير","مارس","إبريل","مايو","يونيو","يوليه","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];function t(e,s,t){let i=ui(e.ele)||"",a=e.message,l=new RegExp(e.exp),o=e.makeExp,r=ui(e.showMessageEle),n=e.emptyMessage,p=e.succsess,c=i.css("border-color");if(o&&isFunc(o))return o.call(i,e,c),void(s&&i.css("border-color",t));""==i.val().trim()?(r.html(n).show(500),i.attr("data-valid","false"),s&&i.css("border-color",t)):l.test(i.val())?p&&isFunc(p)&&(i.attr("data-valid","true"),s&&i.css("border-color",c),p.call(i,e,c)):(s&&i.css("border-color",t),i.attr("data-valid","false"),r.html(a).show(500))}function i(e){let s=ui(this);"crfname"==s.attr("name")?t({ele:s,showMessageEle:s.siblings(".err_tip"),exp:/(\w).{2,}/gm,message:"يجب أن يكون الاسم الأول مابين 3 الى 16 حرف",emptyMessage:"من فضلك ادخل الاسم الاول",succsess:function(e){e.showMessageEle.hide(500),valid=!0}},!1,"#ee4238"):"crlsname"==s.attr("name")?t({ele:s,showMessageEle:s.siblings(".err_tip"),emptyMessage:"من فضلك ادخل اسم العائلة",exp:/(\w).{2,}/gm,message:"يجب أن يكون إسم العائلة مابين 3 الى 32 حرف",succsess:function(e,s,t){valid=!0,e.showMessageEle.hide(500)}},!1,"#ee4238"):"email"==s.attr("type")?t({ele:s,showMessageEle:s.siblings(".err_tip"),exp:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,emptyMessage:"أدخل البريد الإلكتروني",message:"هذا البريد غير صحيح",succsess:function(e){valid=!0,e.showMessageEle.hide(500)}},!1,"#ee4238"):"password"==s.attr("type")&&t({ele:s,showMessageEle:s.siblings(".err_tip"),emptyMessage:"أدخل كلمة المرور",exp:/(\w).{7,}/gm,message:"يجب ان تكون كلمة السر اكبر من 8 احرف",succsess:function(e){valid=!0,e.showMessageEle.hide(500)}},!1,"#ee4238")}function a(){let e=ui(this);"crslday"==e.attr("id")?t({ele:e,showMessageEle:e.parent().siblings(".err_tip"),emptyMessage:"الرجاء ادخال يوم الميلاد",message:"هذا اليوم غير صحيح",exp:/\b(0?[1-9]|[12][0-9]|3[01])\b/,succsess:function(e){e.showMessageEle.hide(200)}}):"crslmonth"==e.attr("id")?t({ele:e,showMessageEle:e.parent().siblings(".err_tip"),emptyMessage:"الرجاء ادخال شهر الميلاد",message:"هذا الشهر غير صحيح",makeExp:function(e){print(this),this.attr("data-valid","false"),""==this.val().trim()?e.showMessageEle.html(e.emptyMessage).show(500):!this.val()in s?e.showMessageEle.html(e.message).show(500):e.succsess.call(e.ele,e)},succsess:function(e){this.attr("data-valid","true"),e.showMessageEle.hide(200)}}):"crslyear"==e.attr("id")&&t({ele:e,showMessageEle:e.parent().siblings(".err_tip"),emptyMessage:"الرجاء ادخال سنة الميلاد",message:"هذه السنة غير صحيحة",makeExp:function(e){window.se=this,this.attr("data-valid","false"),""==this.val().trim()?e.showMessageEle.html(e.emptyMessage).show(500):this.val()<1900||this.val()>(new Date).getFullYear()?e.showMessageEle.html(e.message).show(500):parseInt((new Date).getFullYear()-this.val())<6?(e.message="يجب ان يكون العمر اكبر من 6 سنوات",e.showMessageEle.html(e.message).show(500)):e.succsess.call(e.ele,e)},succsess:function(e){this.attr("data-valid","true"),e.showMessageEle.hide(200)}})}e("#crslmonth",void 0,void 0,"مايو",s,"beforeend"),ui("input[type='checkbox']").on("click, checked",function(){if("polccr"==ui(this).attr("name"))if(1!=this.checked){let e=ui(this);e.attr("data-valid","false"),e.siblings(".err_tip").html("يجب الموافقة على سياسة الخصوصية").show(500)}else{let e=ui(this);e.siblings(".err_tip").hide(400),e.attr("data-valid","true")}}),document.querySelectorAll("input[name='gender']").forEach(e=>{e.addEventListener("click",function(){ui(this).attr("data-valid","true"),ui(this).parents(".gen_f").children(".err_tip").hide(200)})}),ui("form select").on("change",a),ui("input").on("input blur",i),ui("form").on("submit",function(e){e.preventDefault();let s=[];ui(this).children("input, select").each(function(e){if(i.call(this),a.call(this),"polccr"==ui(this).attr("name"))if(1!=this.checked){let e=ui(this);e.attr("data-valid","false"),e.siblings(".err_tip").html("يجب الموافقة على سياسة الخصوصية").show(500)}else{let e=ui(this);e.siblings(".err_tip").hide(400),e.attr("data-valid","true")}else"gender"==ui(this).attr("name")&&(1!=this.checked?(ui(this).attr("data-valid","false"),ui(this).parents(".gen_f").children(".err_tip").html("الرجاء اختيار الجنس").show(500)):(ui(this).attr("data-valid","true"),ui(this).parents(".gen_f").children(".err_tip").hide(200)));s.push(ui(this).attr("data-valid"))}),-1==s.indexOf("false")&&this.submit()})});