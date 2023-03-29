// let background_dark_yellow = "rgba(196, 196, 61, 95)";


function createDiv(width, height, float, id) {

    let div = $("<div></div");
    div.css({"width": width, "height": height, "float": float});
    div.attr("id", id);
    return div;
}


function closeAnimate(element_selector) {

    $(element_selector).animate(
        {width: "0%", height: "0%"},
        100
    )
}


function openAnimate(element_selector, element_width_num, element_height_num) {
    $(element_selector).animate(
        {width: `${element_width_num}` + "%", height: `${element_height_num}` + "%"},
        100
    )
}

function createInputDiv () {

    let input = $("<input/>");
    input.css({"background": "rgba(109,189,181,0.75)", "border": "0p%",
    "text-align": "center", "margin-left": "25%", "margin-top": "0.5%", "margin-bottom": "0.5%",
    "width": "50%", "height": "auto", "border": "none"         
    });

    return input; 

}

function createFormDiv() {
    let form_div = $("<div></div>");
    form_div.css({"background": "", "width": "100%", "height": "auto", "font-size": "500%", "margin-top": "0%", "margin-bottom": "0%"});
    return form_div;

}

function createButtonsDiv() {

    let buttons_div = $("<div></div>");
    buttons_div.css({"background": "", "width": "50%", "height": "10%", "font-size": "250%", "margin-top": "0.5%", "margin-bottom": "0.5%"});
    return buttons_div;
}


function createButton(label, float) {

    let button = $("<div></div>");
    button.css({"position": "relative", "width": "auto", "height": "auto", "background": "rgba(214, 192, 133, 0.7)", "float": float});
    button.append("<b>" + label + "</b>");
    addHover(button, {"background": "rgba(214, 192, 133, 1)"}, {"background": button.css("background")});
    return button;
}


function createCenterDiv() {

    let center_div = $("<div></div>");
    center_div.css({"background": "", "width": "100%", "height": "72%",
                    "position": "absolute", "top": "28%", "bottom": "0%", "left": "0%"
                });
    return center_div;
}

function getDateString(year, month, date) {
    let return_string = year + "-";
    let month_string;
    let date_string;
    if (month < 10) {
        month_string = "0" + month + "-";
    }
    else {
        month_string = month + "-";
    }
    if (date < 10) {
        date_string = "0" + date;
    }
    else {
        date_string = date;
    }
    return_string += month_string;
    return_string += date_string;
    return return_string;
}


function createLabel(label, parent) {

    const label_car_type = $("<div></div>");
   label_car_type.css({"width": "100%", "text-align": "center"});
   label_car_type.attr("testing", "123");
   label_car_type.html(label);
   parent.append(label_car_type);


}

function createInputDiv () {

   let input = $("<input/>");
   input.css({"background": "rgba(109,189,181,0.75)", "border": "0p%",
   "text-align": "right", "margin-left": "25%", "margin-top": "0.5%", "margin-bottom": "0.5%",
   "width": "25%", "height": "auto", "border": "none"         
   });

   return input; 

}

function createSelect (selections) {

   let select = $("<select/>");
   select.css({"background": "rgba(109,189,181,0.75)", "border": "0p%",
   "text-align": "center", "margin-left": "10%", "margin-top": "0.5%", "margin-bottom": "0.5%",
   "width": "80%", "height": "auto", "border": "none"         
   });
   for (let i = 0; i < selections.length; i++) {
       const option = $("<option/>");
       option.html(selections[i]);
       select.append(option);
   }
   return select; 

}

function createFormDiv() {
   let form_div = $("<div></div>");
   form_div.css({"background": "", "width": "100%", "height": "auto", "font-size": "500%", "margin-top": "0%", "margin-bottom": "0%"});
   return form_div;

}

function createButtonsDiv() {

   let buttons_div = $("<div></div>");
   buttons_div.css({"background": "", "width": "50%", "height": "15%", "font-size": "200%", "margin-top": "0.5%", "margin-bottom": "0.5%"});
   return buttons_div;
}


function createButton(label, float) {

   let button = $("<div></div>");
   button.css({"position": "relative", "width": "100%", "height": "100%", "background": "rgba(214, 192, 133, 0.7)", "float": float, "font-size": "30px", "text-align": "center"});
   button.append("<b>" + label + "</b>");
   addHover(button, {"background": "rgba(214, 192, 133, 1)"}, {"background": button.css("background")});
   return button;
}


function createCenterDiv() {

   let center_div = $("<div></div>");
   center_div.css({"background": "", "width": "100%", "height": "72%",
                   "position": "absolute", "top": "28%", "bottom": "0%", "left": "0%"
               });
   return center_div;
}


function createResult() {
   let login_div = $("<div></div>");
   login_div.css({"font-size": "25%", "background": "rgba(109,189,181,0.5)", "width": box_width, "height": box_height,
                   "position": "absolute", "top": "10vh", "bottom": "10vh", "left": "10%", "right": "10%"
               });
   login_div.attr("id", "results_div");

   const center_div = createCenterDiv();

   const title_div = $("<div></div>");
   title_div.css({"background": "", "width": "100%", "height": "auto", "font-size": "500%", "margin-top": "0%", "margin-bottom": "0%", "font-weight": "bold", "text-align": "center"});
   title_div.append("RETURNED CAR");
   let json_results_div = $("<div></div>");
   json_results_div.css({"background": "", "width": "80%", "height": "50%", "font-size": "600%", "margin-top": "0%", "margin-bottom": "0%", "word-wrap": "break-word"});
   json_results_div.attr("id", "json_results");


   let buttons_div = createButtonsDiv();
   let login = createButton("CREATE ANOTHER CAR", "right");
   buttons_div.append(login);


   login.click(function() {

       $("#create_div").toggle();
       $("#results_div").toggle();

   })

   center_div.append(title_div);
   center_div.append(json_results_div);
   center_div.append(buttons_div);
   login_div.append(center_div);

   return login_div;
};

function addHover(element, on_css, off_css) {

   $(element).hover(function() {
       $(this).css(on_css);
   },
   function() {
       $(this).css(off_css);
   });
}

function createLabel(label, parent) {

    const label_car_type = $("<div></div>");
   label_car_type.css({"width": "100%", "text-align": "center"});
   label_car_type.attr("testing", "123");
   label_car_type.html(label);
   parent.append(label_car_type);


}

function createInputDiv () {

   let input = $("<input/>");
   input.css({"background": "rgba(109,189,181,0.75)", "border": "0p%",
   "text-align": "right", "margin-left": "25%", "margin-top": "0.5%", "margin-bottom": "0.5%",
   "width": "25%", "height": "auto", "border": "none"         
   });

   return input; 

}

function createSelect (selections) {

   let select = $("<select/>");
   select.css({"background": "rgba(109,189,181,0.75)", "border": "0p%",
   "text-align": "center", "margin-left": "10%", "margin-top": "0.5%", "margin-bottom": "0.5%",
   "width": "80%", "height": "auto", "border": "none"         
   });
   for (let i = 0; i < selections.length; i++) {
       const option = $("<option/>");
       option.html(selections[i]);
       select.append(option);
   }
   return select; 

}

function createFormDiv() {
   let form_div = $("<div></div>");
   form_div.css({"background": "", "width": "100%", "height": "auto", "font-size": "500%", "margin-top": "0%", "margin-bottom": "0%"});
   return form_div;

}

function createButtonsDiv() {

   let buttons_div = $("<div></div>");
   buttons_div.css({"background": "", "width": "50%", "height": "10%", "font-size": "250%", "margin-top": "0.5%", "margin-bottom": "0.5%"});
   return buttons_div;
}


function createButton(label, float) {

   let button = $("<div></div>");
   button.css({"position": "relative", "width": "100%", "height": "100%", "background": "rgba(214, 192, 133, 0.7)", "float": float, "font-size": "30px", "text-align": "center"});
   button.append("<b>" + label + "</b>");
   addHover(button, {"background": "rgba(214, 192, 133, 1)"}, {"background": button.css("background")});
   return button;
}


function createCenterDiv() {

   let center_div = $("<div></div>");
   center_div.css({"background": "", "width": "100%", "height": "72%",
                   "position": "absolute", "top": "28%", "bottom": "0%", "left": "0%"
               });
   return center_div;
}
