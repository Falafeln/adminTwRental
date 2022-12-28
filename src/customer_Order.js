var userName = localStorage.getItem("username_storage");
var password = localStorage.getItem("password_storage");

var count=0;

/*Listan ska kunna sorteras baserat på alla egenskaper och filtreras på antal hyrtillfälen. */

   function filter(){
// Declare variables
var input, filter, table, tr, td, i, txtValue;
input = document.getElementById("myInput");
filter = input.value.toUpperCase();
table = document.getElementById("customerTable");
tr = table.getElementsByTagName("tr");

// Loop through all table rows, and hide those who don't match the search query
for (i = 0; i < tr.length; i++) {
  td = tr[i].getElementsByTagName("td")[3];
  if (td) {
    txtValue = td.textContent || td.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

   }
//sort
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("customerTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
   
   async function buildTableCustomer() {
    // Make the AJAX request to retrieve the customer data
    const customerArray = await $.ajax({
      url: "http://localhost:9090/api/v1/customers",
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Basic " + btoa(userName + ":" + password),
      },
    });
  
    // Build the table using the customer data
    var customerTable = $('#customerTableBody');
    customerTable.html("");
  
    var customerTableHead = $('#customerTableHead');
    customerTableHead.html("");
    var tableRow = $('<tr></tr>');   
    tableRow.append('<th onclick="sortTable(0)">User id</th>');
    tableRow.append('<th onclick="sortTable(1)">First name</th>');
    tableRow.append('<th onclick="sortTable(2)">Last name</th>');
    tableRow.append('<th onclick="sortTable(3)">Amount of orders</th>');
    
    customerTableHead.append(tableRow);

    for(var i = 0; i < customerArray.length; i++){
    
      // Check if any elements with the cust_id class exist in the table
    if ($('#cust_id').length > 0) {
      console.log("är jag här");
      count++;
      console.log(count);
      // If elements with the cust_id class exist, check if the current customer ID is already present in the table
      if (count>(customerArray[i].cust_id)) {
        // If the customer ID is already present in the table, skip this iteration
        console.log("kommer jag hit dp");
        continue;
      }
    }
   
      tableRow = $('<tr class="customerTableRow"> >/tr>');
      customerTable.append(tableRow);
  
      var tableCell = $('<td class="customerTableCell" id="cust_id"> </td>');
      tableCell.html(customerArray[i].cust_id);
      tableRow.append(tableCell);
  
      tableCell = $('<td class="customerTableCell" id="firstname"> </td>');
tableCell.html(customerArray[i].first_name);
tableRow.append(tableCell);

tableCell = $('<td class="customerTableCell" id="user"> </td>');
tableCell.html(customerArray[i].last_name);
tableRow.append(tableCell);

// Create a cell element for the amount of orders and append it to the row
tableCell = $('<td class="customerTableCell" id="bookingAmount"></td>');
// Call the ordercount function to retrieve the number of orders for this customer
const amount = await ordercount(customerArray[i].cust_id);
tableCell.html(amount);
tableRow.append(tableCell); 

}
}

/* A function that counts the number of orders*/

async function ordercount(cust_id){
  /* Using the customer id, retrieve all of their orders
  then check the length of the list and output it
  */
  const response = await $.ajax({
    url: "http://localhost:9090/api/v1/booking/myorders",
    method: "GET",
    headers:{
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "",
      "Authorization": "Basic " + btoa(userName + ":" + password),
      "cust_id": cust_id,
    },
  });
  return response.length;
}




        
    /**
     *  •Avboka order PUT /api/v1/cancelorder
     * */    

    function cancel(id){
       $.ajax({
              url: "http://localhost:9090/api/v1/booking/cancelorder",
              method: "PUT",
              headers:{
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Authorization": "Basic " + btoa(userName + ":" + password),
                 "booking_id": id
              },
              success: function(){
                 console.log("Order is canceled");
                 $('#main').load("/src/customer_Order.html");
              
              }
      
      });

    }
        
/**
 *  Get ALL  ORDERS
 */

getOrders = async function(){
       $.ajax({
           url: "http://localhost:9090/api/v1/booking/allactiveorders",
           method: "GET",
           headers:{
               "Content-Type": "application/json",
               "Access-Control-Allow-Origin": "*",
               "Authorization": "Basic " + btoa(userName + ":" + password),
              
           },
           success: function(bookingArray){
               buildTable(bookingArray);
           
           }
   
   });
   }
   
   
   buildTable = function(bookings){

       
       bookingTable = $ ('#bookingTableBody');
       bookingTable.html("");
   
       bookingTableHead =$('#bookingTableHead');
       bookingTableHead.html("");
       tableRow =$(`   
           <th>Booking id</th>
           <th>Customer id</th>
           <th>Car ID</th>
           <th>Rent date</th>
           <th>Return date</th>
           <th>Cancel order </th>
          
         `);
         bookingTableHead.append(tableRow);
       for(var i = 0; i<bookings.length; i++){
           tableRow = $(`<tr class ='bookingTableRow'> >/tr>`);
           bookingTable.append(tableRow);
   
   
           tableCell = $(`<td class='bookingTableCell' id='booking_id'> </td>`);
           tableCell.html(bookings[i].booking_id);
           tableRow.append(tableCell);

           tableCell = $(`<td class='bookingTableCell' id='user'> </td>`);
           tableCell.html(bookings[i].customer.cust_id);
           tableRow.append(tableCell);

           tableCell = $(`<td class='bookingTableCell' id='car'> </td>`);
           tableCell.html(bookings[i].car.car_id);
           tableRow.append(tableCell);
           
           tableCell = $(`<td class='bookingTableCell' id='rent_date'> </td>`);
           tableCell.html(bookings[i].rent_date);
           tableRow.append(tableCell);
   
           tableCell = $(`<td class='bookingTableCell' id='return_date'> </td>`);
           tableCell.html(bookings[i].return_date);
           tableRow.append(tableCell);
   
           tableCell = $(`<td class='bookingTableCell'> <button onclick="cancel(${bookings[i].booking_id})">Cancel</button></td>`);
           tableRow.append(tableCell);
   
   
         
       }
  
   }
   

   window.onload = buildTableCustomer();
  window.onload = getOrders();