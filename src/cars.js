
var userName = localStorage.getItem("username_storage");
var password = localStorage.getItem("password_storage");
/****
 *              •Lägga till fordon POST /api/v1/addcar 
 * 
 *   
 * Lägg till fordon: 

        När användaren lägger till ett nytt fordon ska det kunna fylla i egenskaper för fordonet i ett formulär. 

 * */
function addCar(){
  document.getElementById("addCarDiv").innerHTML =
  `
  <form id="formOrder">
   
      <label for="name">Name</label>
      <input type="text" id="name" name="name" value="" />
      <label for="model">Model</label>
      <input type="text" id="model" name="model" value="" />
  
      <label for="cost_per_day">Cost Day</label>
      <input type="number" id="cost_per_day" name="cost" value="" oninput="this.value = Math.round(this.value);"/>
  <br>
      <label for="seats">Seats</label>
      <input type="number" id="seats" name="seats" value="" oninput="this.value = Math.round(this.value);"/>
  <br>
      <label for="transmission">Transmission</label>
      <input type="text" id="transmission" name="transmission" value=""  />
  
      <label for="ac">AC</label>
      <input type="text" id="ac" name="ac" value=""  />
   
      
      </form>
<button onclick="updatingCarButton()">Add new car to database</button>
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

  $.ajax({
    url: "http://localhost:9090/api/v1/addcar",
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Basic " + btoa(userName + ":" + password),
      "model":document.getElementById("model").value  , 
      "cost": document.getElementById("cost_per_day").value ,
      "seats":  document.getElementById("seats").value ,
       "transmission": document.getElementById("transmission").value ,
      "ac":document.getElementById("ac").value , 
      "name":document.getElementById("name").value 
     
  },
  success: function(){
      console.log("Car is created");
      $('#main').load("/src/cars.html");
  
  }

});
           
    }
    
    else{
        console.log("felaktigt värde");
        document.getElementById("wrong").innerHTML = `<p>Wrong input on AC, you can only write true and false</p>`
    }
    
    
       
    
    }

/****
 *              •Ta bort fordon DELETE /api/v1/deletecar
 * 
 *   Ta bort fordon: 

        När användare vill ta bort ett fordon ska den få en kontrollfråga för att bekräfta att den ska tas bort. 
       
 * */

function deleteCar(id){

  
  if(confirm("Do you really want to delete car with car_id" + id + "?")){
    console.log("hej");
    deleteOrderedCar(id);
   if(localStorage.getItem('exist')=='true'){
    console.log("är jag här?");
    $('#main').load("/src/changeCar.html");
   }
   else{
    confirmDelete(id);
   }

}
}

confirmDelete = async function(id){
  $.ajax({
     url: "http://localhost:9090/api/v1/deletecar/",
     method: "DELETE",
     headers:{
       "Content-Type": "application/json",
       "Access-Control-Allow-Origin": "*",
       "Authorization": "Basic " + btoa(userName + ":" + password),
       "id": id
      
   },
   success: function(){
       console.log("Car is deleted");
       $('#main').load("/src/cars.html");
   
   }

});
}


 /**
 * Om fordonet finns med i en aktuell uthyrning ska den kunden få ett nytt fordon av samma typ. 
 */

 function deleteOrderedCar(id){
console.log("inne i denna");
 
    $.ajax({
        url: "http://localhost:9090/api/v1/booking/allactiveorders",
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic " + btoa(userName+ ":" + password)
           
        },
        success: function(bookingArray){
         
          console.log("vi sätter att den är falsk")
          var existing = 'false';
          localStorage.setItem('exist', existing);
           for(i=0; i<bookingArray.length; i++){
            console.log("Tjea")
            if(bookingArray[i].car.car_id===id){
              
              console.log("Vi säger att exist är true");
              existing = 'true';
              localStorage.setItem('booking', bookingArray[i].booking_id);
              localStorage.setItem('exist', existing);
            localStorage.setItem('carDelete', id);
              console.log(localStorage.getItem('exist'));
              console.log("b");
              
            }
           }
        
        }

});
}
 

/****
 *              •Uppdaterafordon PUT /api/v1/updatecar 
 * 
 * 
 * 
 * 
 *       Uppdatera fordon: Användare kan uppdatera fordonet i en specialiserad vy som kan vara samma som lägg till fordon.
 * */


function updatingCar(id){

localStorage.setItem('car', id);
console.log(localStorage.getItem('car') + " finns med");
/**
 * Lägger in en div/laddar main som gör att man kan uppdatera bilen
 */
$('#main').load("/src/updateCar.html");



}





/***
 * Lista bilar: */
/**
 * Show all Cars
 */

getCars = async function(){
    $.ajax({
        url: "http://localhost:9090/api/v1/getCar",
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic " + btoa(userName + ":" + password)
           
        },
        success: function(carArray){
            buildTable(carArray);
        
        }

});
}


buildTable = function(cars){
    carTable = $ ('#carTableBody');
    carTable.html("");

  carTableHead =$('#carTableHead');
    carTableHead.html("");
    var tableRow = $('<tr></tr>');   
    tableRow.append('<th onclick="sortTable(0)">Model</th>'); 
    tableRow.append('<th onclick="sortTable(1)">Name</th>');
    tableRow.append('<th onclick="sortTable(2)">Cost per Day</th>'); 
    tableRow.append('<th onclick="sortTable(3)">Seats</th>');
    tableRow.append('<th onclick="sortTable(4)">Transmission</th>') ;
    tableRow.append('<th onclick="sortTable(5)">AC</th>') 
    tableRow.append('<th onclick="sortTable(6)">Car id</th>') ;
    tableRow.append('<th> .</th>');
     tableRow.append('<th> .</th>');
   
      carTableHead.append(tableRow);
   
    for(var i = 0; i<cars.length; i++){
        tableRow = $(`<tr class ='carTableRow'> >/tr>`);
        carTable.append(tableRow);

        tableCell = $(`<td class='carTableCell' id='model'> </td>`);
        tableCell.html(cars[i].model);
        tableRow.append(tableCell);
        
        tableCell = $(`<td class='carTableCell' id='name'> </td>`);
        tableCell.html(cars[i].name);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='cost_per_day'> </td>`);
        tableCell.html(cars[i].cost_per_day);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='seats'> </td>`);
        tableCell.html(cars[i].seats);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='transmission'> </td>`);
        tableCell.html(cars[i].transmission);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='ac'> </td>`);
        tableCell.html(cars[i].ac);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='carId'> </td>`);
        tableCell.html(cars[i].car_id);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='update'> </td>`);
        tableCell.html(`<button onclick="updatingCar(${cars[i].car_id})">UPDATE</button>`);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='delete'> </td>`);
        tableCell.html(`<button onclick="deleteCar(${cars[i].car_id})">DELETE</button>`);
        tableRow.append(tableCell);


    }

}

$(function(){
    $('#showAllCars').click(function(){

      getCars();


      document.getElementById("carHead").innerHTML =
    `
    <h4 class="carheader"> All Cars </h4>
    
    `
     
    });
})
        



/*Visa en lista med tillgängliga bilar.  */

getAvailableCars = async function(){
 
    $.ajax({
        url: "http://localhost:9090/api/v1/booking/cars",
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic " + btoa(userName+ ":" + password)
           
        },
        success: function(carArray){
            buildAvailableTable(carArray);
        
        }

});
}



buildAvailableTable = function(cars){
    carTable = $ ('#carTableBody');
    carTable.html("");


  carTableHead =$('#carTableHead');
    carTableHead.html("");
    var tableRow = $('<tr></tr>');   
    tableRow.append('<th onclick="sortTable(0)">Model</th>'); 
    tableRow.append('<th onclick="sortTable(1)">Name</th>');
    tableRow.append('<th onclick="sortTable(2)">Cost per Day</th>'); 
    tableRow.append('<th onclick="sortTable(3)">Seats</th>');
    tableRow.append('<th onclick="sortTable(4)">Transmission</th>') ;
    tableRow.append('<th onclick="sortTable(5)">AC</th>') 
    tableRow.append('<th onclick="sortTable(6)">Car id</th>') ;

      carTableHead.append(tableRow);
   
    for(var i = 0; i<cars.length; i++){

        
        
        tableRow = $(`<tr class ='carTableRow'> >/tr>`);
        carTable.append(tableRow);


        tableCell = $(`<td class='carTableCell' id='model'> </td>`);
        tableCell.html(cars[i].model);
        tableRow.append(tableCell);
        
        tableCell = $(`<td class='carTableCell' id='name'> </td>`);
        tableCell.html(cars[i].name);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='cost_per_day'> </td>`);
        tableCell.html(cars[i].cost_per_day);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='seats'> </td>`);
        tableCell.html(cars[i].seats);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='transmission'> </td>`);
        tableCell.html(cars[i].transmission);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='ac'> </td>`);
        tableCell.html(cars[i].ac);
        tableRow.append(tableCell);

        tableCell = $(`<td class='carTableCell' id='carId'> </td>`);
        tableCell.html(cars[i].car_id);
        tableRow.append(tableCell);

        
        
        tableRow.append(tableCell);
  
        }
        
}


$(function(){
    $('#showAvailableCars').click(function(){
        console.log(localStorage.getItem("username_storage"));
        getAvailableCars();
     

      document.getElementById("carHead").innerHTML =
    `
    <h4 class="carheader"> Available Cars </h4>
    
    `
     
    });
});




 
 /**
 * Sort table, den verkar nu tro min andra rad är header vilket blir lite fel. 
 * Fixa om tid finns
 */
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

 
 
        /* 
 * På en rad ska bas-information om bilen finnas samt en knapp där användaren kan välja bilen och komma vidare till uppdatering av bilen. 
Raden ska också innehålla knappar för att ta bort fordonet. 
 * 
 * 
 * 
 */









    