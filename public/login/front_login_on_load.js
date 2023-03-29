let box_width = "80%";
let box_height = "80vh";
let status_string;

$(document).ready(function(){


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


    let buttons_div = createButtonsDiv();
    let create = createButton("GET CAR", "right");
    buttons_div.append(create);
    
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

    });

    center_div.append(title_div);
    center_div.append(json_results_div);
    center_div.append(buttons_div);
    login_div.append(center_div);

    return login_div;
};

