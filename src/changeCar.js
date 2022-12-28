var booking = localStorage.getItem('booking');


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
    carTable = $ ('#carTableBodyP');
    carTable.html("");

    carTableHead =$('#carTableHeadP');
    carTableHead.html("");
    tableRow =$(`  
    <th>Model</th>
     <th>Name</th>
     <th>Cost per Day</th>
     <th>Seats</th>
      <th>Transmission</th>
      <th>AC</th>
      <th>Car id</th>
      <th> .</th>
      `);
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

        tableCell = $(`<td class='carTableCell'> <button onclick="swap(${cars[i].car_id})">Pick</button></td>`);
        
        tableRow.append(tableCell);
  
        }
      
}

function swap(id){
    console.log(id);
  
        $.ajax({
            url: "http://localhost:9090/api/v1/booking/updateorderCar/",
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Basic " + btoa(userName + ":" + password),
                "booking_id": booking,
                "carId": id 
               
            },
            success: function(){
               /**
                * delete sker här istället
                */

               $.ajax({
                url: "http://localhost:9090/api/v1/deletecar/",
                method: "DELETE",
                headers:{
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Authorization": "Basic " + btoa(userName + ":" + password),
                  "id": localStorage.getItem('carDelete')
                 
              },
              success: function(){
                  console.log("Car is deleted");
                  $('#main').load("/src/cars.html");
              
              }
           
           });
            
            }
    
    });
  

}

window.onload = getAvailableCars();