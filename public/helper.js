let background_dark_yellow = "rgba(196, 196, 61, 95)";


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