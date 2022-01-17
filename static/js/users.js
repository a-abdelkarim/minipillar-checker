$.ajax({
    url: 'http://localhost:8000/api/devices/records',
    type: 'get',
    //data: fd,
    headers: {'Authorization': 'token 23fe479b3bb49c5a1cc8bb409330b06060430af9'},
    contentType: false,
    processData: false,
    success: function(response){

        if(response != 0){
           console.log(response);
           //console.log(response.meta.featureCollection)
           items = response.items;
           for(const item in items){
               user = items[item]
               
                if (user.status == "inactive"){
                    $( ".list-group" ).append( `<li class="list-group-item"  user_id=${user.device}'>user: ${user.username} ${user.status}  <button class="btn btn-primary" type="button" onclick="active_user(${user.id});">Active</button> </li>` );
                            }
                else if(user.status == "active"){
                    $( ".list-group" ).append( `<li class="list-group-item"  user_id=${user.device}'>user: ${user.username} ${user.status}  <button class="btn btn-secondary" type="button" onclick="active_user(${user.id});">Inactive</button> </li>` );
                            }
                }
                
                    
        }
        else{
            console.log(response);
        }
    },
});


function active_user(id) {

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

    
