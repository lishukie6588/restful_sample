let box_width = "80%";
let box_height = "80vh";
let status_string;

$(document).ready(function(){

    // debug
    // if ($(".main_container").data("status") == 0) {
    //     //status_message = "normal login";
    // }
    // if ($(".main_container").data("status") == -1) {
    //     status_string = "Invalid username or password.";
    // }
    // if ($(".main_container").data("status") == -2) {
    //     status_string = "Username has already been taken.";
    // }
    // if ($(".main_container").data("status") == -3) {
    //     status_string = "You have logged out successfully.";
    // }

    /*
    let test_char = "san diego";
    let splitted = test_char.split(",");
    console.log(splitted[0]);
    */


    /*    
   $.ajax({
    url: "https://api.weatherbit.io/v2.0/history/daily?city=toronto&country=ca&start_date=2020-11-21&end_date=2020-11-22&key=54ca63d4a7474c57a1879b3c4f71291b",
    async: false,
    success: function(result){
        console.log(result);
        //forecast["data"] = result["data"];
        //for (let day in result["data"]) {
        //    historic[result["data"][day]["datetime"]] = result["data"][day];
            //console.log(result["data"][day]);
        //}
  }});
  
  */

    console.log("reached load");
    let car_result = createResult();
    car_result.toggle();
    //create_account_div.toggle();
    let create_car_div = createCar();
    $(".main_container").append(car_result);
    $(".main_container").append(create_car_div);



});

function createCar() {
 
    let create_div = $("<div></div>");
    create_div.css({"font-size": "25%", "background": "rgba(109,189,181,0.5)", "width": box_height, "height": box_height,
                    "position": "absolute", "top": "10vh", "bottom": "10vh"
                });
    create_div.attr("id", "create_div");
   
    const center_div = createCenterDiv();

    let title_div = $("<div></div>");
    title_div.css({"width": "50%", "height": "auto", "height": "auto", 
                     "margin-left": "25%", "margin-bottom": "0%",
                    "text-align": "center"
                    });
    title_name = $("<div></div>");
    title_name.css({"width": "100%", "height": "auto", "text-align": "center", "font-size": "700%", "font-style": "italic", "font-family": "Arial"}); 
    title_name.append("CAR SPECIFICATIONS:");
    //slogan = $("<div></div>");
    //slogan.css({"width": "100%", "height": "auto", "text-align": "center", "font-size": "500%", "font-family": "Arial", "font-style": "italic"});
    //slogan.append("Any time, any where");
    title_div.append(title_name);
    //title_div.append(slogan);

    let form_div = createFormDiv();

    // let input_car_type = createInputDiv();
    // input_car_type.attr({type: "text", id: "car_type", name: "car_type", placeholder: "car type", required : "true"});
    // form_div.append(input_car_type);

    createLabel("types:", form_div);
    const car_types = ["electric", "2 wheels", "sports"];
    let input_car_type = createSelect(car_types);
    input_car_type.attr({id: "car_type", name: "car_type", required : "true"});
    form_div.append(input_car_type);

    createLabel("turbo:", form_div);
    let input_car_turbo = createSelect(["yes", "no"]);
    input_car_turbo.attr({type: "text", id: "car_turbo", name: "car_turbo",  required : "true"});
    form_div.append(input_car_turbo);

    createLabel("fog lights:", form_div);
    let input_car_fog_lights = createSelect(["yes", "no"]);
    input_car_fog_lights.attr({type: "text", id: "car_fog_lights", name: "car_fog_lights", required : "true"});
    form_div.append(input_car_fog_lights);

    createLabel("heated seats:", form_div);
    let input_car_heated_seats = createSelect(["yes", "no"]);
    input_car_heated_seats.attr({type: "text", id: "car_heated_seats", name: "car_heated_seats", required : "true"});
    form_div.append(input_car_heated_seats);

    createLabel("car autopilot:", form_div);
    let input_car_autopilot = createSelect(["yes", "no"]);
    input_car_autopilot.attr({type: "text", id: "car_autopilot", name: "car_autopilot",  required : "true"});
    form_div.append(input_car_autopilot);

    createLabel("sports exhaust:", form_div);
    let input_car_sports_exhaust = createSelect(["yes", "no"]);
    input_car_sports_exhaust.attr({type: "text", id: "car_sports_exhaust", name: "mileage", required : "true"});
    form_div.append(input_car_sports_exhaust);

    // input_city.autocomplete({
    //     source: function(request, response) {
            
            
    //         $.ajax({
    //             url: "https://api.teleport.org/api/cities/?search=" + request.term,
    //             //url: "https://api.teleport.org/api/cities/?search=" + request.term,
    //             success: function( data ) {
    //               response( data["_embedded"]["city:search-results"][0]["matching_alternate_names"][0]);
    //             }
    //         });
            
            
    //     }
    // });

    // input_country.autocomplete({
    //     source: function(request, response) {
            
            
    //         $.ajax({
        
    //             url: "https://restcountries.eu/rest/v2/name/" + request.term,
    //             success: function( data ) {
                
    //               let name_array = data[0]['name'].split(' ');
    //               //console.log(name_array);
    //               let result_name = "";
    //               for (let x = 0; x < name_array.length; x++) {
    //                     if (x === 2) {
    //                         break;
    //                     }
    //                     //console.log(x);
    //                     //console.log(name_array[x]);
    //                     if (x != 0) {
    //                         result_name = result_name.concat(" ");    
    //                     }
    //                     result_name = result_name.concat(name_array[x]);

    //                     //console.log(result_name);
    //               }
    //               //console.log(result_name);
    //               let list = [result_name];
    //               //let list = [data[0]['name']];
    //               response(list);
    //             }
    //         });
            
            
    //     }
    // });
    
    let buttons_div = createButtonsDiv();
    // //let login = createButton("LOGIN", "right");
    // //buttons_div.append(login);
    // let back = createButton("BACK", "left");
    // buttons_div.append(back);
    let create = createButton("GET CAR", "right");
    buttons_div.append(create);

    // back.click(function() {

    //     $("#login_div").animate(
    //         {width: box_width, height: box_height},
    //         100
    //     )
    //     $("#create_div").animate(
    //         {width: "0%", height: "0vh"},
    //         100
    //     )
    // })
    
    create.click(function() {

        console.log("clicked");
        
        //console.log(input_username.val());
        if (input_car_type.val() == "" || input_car_turbo.val() == "" || input_car_fog_lights.val() == "" || 
            input_car_heated_seats.val() == "" || input_car_autopilot.val() == "" || input_car_sports_exhaust.val() == "") {
            alert("Please fill in all the fields!");
        }
        else {
        
        $.ajax({
            url: "/get_car",
            async: true,
            type: 'GET', 
            data: {car_type: input_car_type.val(), car_turbo: input_car_turbo.val(), car_fog_lights: input_car_fog_lights.val(), car_heated_seats: input_car_heated_seats.val(), car_autopilot: input_car_autopilot.val(), car_sports_exhaust: input_car_sports_exhaust.val()},
            success: function(result){
                console.log("CALLBACK of GET RESTFUL SAMPLE AJAX")
                console.log(result);


                $("#json_results").html(result);
                $("#create_div").toggle();
                $("#results_div").toggle();
                
                // if (result === "creation_error") {
                //     console.log(" *********************************error: username taken");
                //     window.location.href="login?status=-2";

                // }
                // else {
                //     window.location.href="/calendar";
                // }
                
            }     
        });
        }  
    })

    center_div.append(title_div);
    center_div.append(form_div);
    center_div.append(buttons_div);
    create_div.append(center_div);

    return create_div;

}

function createLabel(label, parent) {

    // const new_label = $("<label></label>");
    // new_label.attr("for", id);
    // new_label.html(label);
    // new_label.css({"background": "rgba(109,189,181,0.75)", "border": "0p%",
    // "text-align": "left", "margin-left": "25%", "margin-top": "0.5%", "margin-bottom": "0.5%",
    // "width": "25%", "height": "auto", "border": "none", "float": "left" });
    // parent.append(new_label);
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
    // let create = createButton("CREATE ACCOUNT", "left");
    // buttons_div.append(create);
    
    // create.click(function() {

    //     $("#login_div").animate(
    //         {width: "0%", height: "0vh"},
    //         100
    //     )
    //     $("#create_div").animate(
    //         {width: box_width, height: box_height},
    //         100
    //     )
    // })

    login.click(function() {

        $("#create_div").toggle();
        $("#results_div").toggle();

    })

    // center_div.append(title_div);
    // center_div.append(status_message);
    // center_div.append(form_div);
    center_div.append(title_div);
    center_div.append(json_results_div);
    center_div.append(buttons_div);
    login_div.append(center_div);

    return login_div;
};

function addHover(element, on_css, off_css) {

    //let old_css = element.attr("style");
    $(element).hover(function() {
        $(this).css(on_css);
    },
    function() {
        $(this).css(off_css);
    });
}

