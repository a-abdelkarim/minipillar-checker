const BASE_URL = 'http://127.0.0.1:8000/';
console.log(JSON.parse(devices))
function load_users(){
    var users = JSON.parse(devices)
    for(var user in users){
        user = users[user]
        
         if (user.status == "inactive"){
             $( ".list-group" ).append( `<div class="row user mt-1 ml-1 mr-1 mb-1 border-bottom  pt-1 pb-1">
                                             <div class="col-md-3">
                                                 ${user.username}
                                             </div>
                                             <div class="col-md-3">
                                                 ${user.status}
                                             </div>
                                             <div class="col-md-3">
                                                <form action="${user.id}/activate" method="POST">
                                                 <button class="btn btn-primary" >Activate</button>
                                                 </form>
                                             </div>
                                             <div class="col-md-3">
                                                 <button class="btn btn-danger" onclick="active_user(${user.id});">Delete</button>
                                             </div>
                                         </div>` );
                     }
         else if(user.status == "active"){
             $( ".list-group" ).append( `<div class="row user ml-1 mr-1 mt-1 mb-1 border-bottom pt-1 pb-1">
                                             <div class="col-md-3">
                                                 ${user.username}
                                             </div>
                                             <div class="col-md-3">
                                                 ${user.status}
                                             </div>
                                             <div class="col-md-3">
                                             <form action="${user.id}/deactivate" method="POST">
                                                 <button class="btn btn-secondary">Deactivate</button>
                                            </form>
                                             </div>
                                             <div class="col-md-3">
                                                 <button class="btn btn-danger" onclick="active_user(${user.id});">Delete</button>
                                             </div>
                                         </div>` );
                     }
         }
         
}
load_users()



    
