$(function(){
    $('#minknapp').click(function(){
        $('#main').load("/src/index.html");
     
    });
});

$(function(){
    $('#minknapp1').click(function(){
        $('#main').load("/src/cars.html");
     
    });
});



$(function(){
    $('#minknapp3').click(function(){
        $('#main').load("/src/admin.html");
     
    });
});

$(function(){
    $('#minknapp2').click(function(){
        $('#main').load("/src/customer_order.html");
     
    });
});

$(function(){
    $('#minknapp4').click(function(){
        $('#main').load("/src/login.html");
     
    });
});

$(function(){
    $('#logout').click(function(){
       loggedOutUser();
     
    });
});

  
function loggedInUser(){
    var hyper = document.getElementById("hyper");
    hyper.value ='my value';
    hyper.innerHTML=
    `
    <li><button id="minknapp1" class="navButton">Cars</button></li>
    <li><button id="minknapp2" class="navButton">Customers & Orders</button></li>
    <li><button id="minknapp3" class="navButton" value="my value">${localStorage.getItem("username_storage")}</button></li>
    <li><button id="logout" class="navButton">Log out</button></li>
    `

    ;
} 

function loggedOutUser(){

    localStorage.clear();

    var hyper = document.getElementById("hyper");
    hyper.value ='my value';
    hyper.innerHTML=
    `
    <li><button id="minknapp4" class="navButton" value="my value">Login</button></li>
    
    `
    window.location.reload();
    ;


}

$(function(){
    $('#submitLogin').click(function(){
        
        console.log("hej");  
        var userName = document.getElementById('userName').value;
        var password = document.getElementById('password').value;
        
        $.ajax({
            url: "http://localhost:9090/api/v1/login/admin",
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Basic " + btoa(userName + ":" + password)
               
            },
                success: function(){
                    localStorage.setItem('username_storage',userName);
                    localStorage.setItem('password_storage',password);
                    loggedInUser();
                    getUserByUserName();
                    $('#main').load("/src/admin.html");
            },
                error: function(){
                    alert("WRONG USERNAME OR PASSWORD!");
            }
            
        })
    });
});

/**
 * Funktion för att få user_id från username som sedan ska sparas i storage
 */

getUserByUserName = async() => {

    console.log("hej");

    await fetch ("http://localhost:9090/api/v1/findAdminWithUsername", {
        method: 'GET',
        headers: {
        accept:  "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Basic " + btoa(localStorage.getItem('username_storage') + ":" + localStorage.getItem('password_storage')),
        "username":localStorage.getItem('username_storage')
        }
    }).then(
       async (res)=>{
            console.log(res);
            const result = await res.json();
            console.log(result.admin_id);
            localStorage.setItem('admin_id', result.admin_id)
       
            
        }
    ).catch(
        (res)=>{
            console.log(res);
        }
    )


}


