const BASE_URL = 'http://127.0.0.1:8000/';
console.log(JSON.parse(devices))
function load_users(){
    var users = JSON.parse(devices)
    for(var user in users){
        user = users[user]
        
         if (user.status == "inactive"){
             $( ".list-group" ).append( `<div class="row mt-1 ml-1 mr-1 mb-1 border-bottom  pt-1 pb-1">
                                             <div class="col-md-3">
                                                 ${user.username}
                                             </div>
                                             <div class="col-md-3">
                                                 ${user.status}
                                             </div>
                                             <div class="col-md-3">
                                                 <button class="btn btn-primary" onclick="active_user(${user.id});">Activate</button>
                                             </div>
                                             <div class="col-md-3">
                                                 <button class="btn btn-danger" onclick="active_user(${user.id});">Delete</button>
                                             </div>
                                         </div>` );
                     }
         else if(user.status == "active"){
             $( ".list-group" ).append( `<div class="row ml-1 mr-1 mt-1 mb-1 border-bottom pt-1 pb-1">
                                             <div class="col-md-3">
                                                 ${user.username}
                                             </div>
                                             <div class="col-md-3">
                                                 ${user.status}
                                             </div>
                                             <div class="col-md-3">
                                                 <button class="btn btn-secondary" onclick="active_user(${user.id});">Deactivate</button>
                                             </div>
                                             <div class="col-md-3">
                                                 <button class="btn btn-danger" onclick="active_user(${user.id});">Delete</button>
                                             </div>
                                         </div>` );
                     }
         }
         
}
load_users()



function active_user(id) {

    $.ajax({
        url: `${BASE_URL}api/devices/${id}/activate`,
        type: 'put',
        //data: fd,
        headers: {'Authorization': 'token 23fe479b3bb49c5a1cc8bb409330b06060430af9'},
        contentType: false,
        processData: false,
        success: function(response){
    
            if(response != 0){
               console.log(response);
               
            }
            else{
                console.log(response);
            }
        },
    });


};


function inactive_user(id) {

    $.ajax({
        url: `http://localhost:8000/api/devices/${id}/activate`,
        type: 'put',
        //data: fd,
        headers: {'Authorization': 'token 23fe479b3bb49c5a1cc8bb409330b06060430af9'},
        contentType: false,
        processData: false,
        success: function(response){
    
            if(response != 0){
               console.log(response);
               
            }
            else{
                console.log(response);
            }
        },
    });


};

    
