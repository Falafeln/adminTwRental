
var userName = localStorage.getItem("username_storage");
var password = localStorage.getItem("password_storage");
var car = localStorage.getItem("car");

console.log("kollar om den finns" + car);

/**
 * Get car by id
 */
getCarByID = async() => {
console.log("inne i getCar");

    await fetch ("http://localhost:9090/api/v1/getCarID", {
        method: 'GET',
        headers: {
        Authorization: "Basic " + btoa(userName + ":" + password),
        accept:  "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "carId":car
        }
    }).then(
       async (res)=>{
        console.log("lyckades");
            console.log(res);
            const result = await res.json();
            console.log(result);
          carUpdateForm(result);
            
        }
    ).catch(
        (res)=>{
            console.log("misslyckades");
            console.log(res);
        }
    )


}


/**
 * Form car
 */
function carUpdateForm(cars){


    console.log(cars);
    document.getElementById("carUpdatingForm").innerHTML =
    `
    <form id="formOrder">
        <label for="car_id">Car ID</label>
        <input type="text" id="car_id" name="car_id" value="${car}" readonly="readonly" />

        <label for="name">Name</label>
        <input type="text" id="name" name="name" value="${cars.name}" />
        <label for="model">Model</label>
        <input type="text" id="model" name="model" value="${cars.model}" />
    
        <label for="cost_per_day">Cost Day</label>
        <input type="number" id="cost_per_day" name="cost" value="${cars.cost_per_day}" oninput="this.value = Math.round(this.value);"/>
    
        <label for="seats">Seats</label>
        <input type="number" id="seats" name="seats" value="${cars.seats}" oninput="this.value = Math.round(this.value);"/>
    
        <label for="transmission">Transmission</label>
        <input type="text" id="transmission" name="transmission" value="${cars.transmission}"  />
    
        <label for="ac">AC</label>
        <input type="text" id="ac" name="ac" value="${cars.ac}"  />
     
        
        </form>
  <button onclick="updatingCarButton()">Complete changes</button>
    `
    
    
    }




    /**
 * Button to complete changes
 */
function updatingCarButton(){

console.log("kommer vi hit till att knappen klickas?");

if(document.getElementById("ac").value.toLowerCase()=="true" || (document.getElementById("ac").value.toLowerCase()=="false")) {
console.log("true or false is correct");
  // Only ASCII character in that range allowed
             updateCar();
             localStorage.removeItem('car');
             localStorage.removeItem('cost-bool');
             localStorage.removeItem('seats-bool');   
            complete();
}

else{
    console.log("felaktigt värde");
    document.getElementById("wrong").innerHTML = `<p>Wrong input on AC, you can only write true and false</p>`
}


   

}

/**
 * 
 * Uppdatera bil
 */


    updateCar = async function(){

 
       

        $.ajax({
            url: "http://localhost:9090/api/v1/updatecar/",
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Basic " + btoa(userName + ":" + password),
                "id":localStorage.getItem('car'),
                "model":document.getElementById("model").value  , 
                "cost": document.getElementById("cost_per_day").value ,
                "seats":  document.getElementById("seats").value ,
                 "transmission": document.getElementById("transmission").value ,
                "ac":document.getElementById("ac").value , 
                "name":document.getElementById("name").value 
    
               
            },
            success: function(car){
             
               console.log(car);
               console.log("wey");
            
            }
    
    });
    }





    /**
 * 

 */
function complete(){
    $('#main').load("/src/cars.html");
    console.log("COMPLETE")
}

window.onload = getCarByID();