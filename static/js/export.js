function export_data(){
    $.ajax({
        url: 'http://localhost:8000/api/minipillar/records',
        type: 'get',
        //data: fd,
        headers: {'Authorization': 'token 23fe479b3bb49c5a1cc8bb409330b06060430af9'},
        contentType: false,
        processData: false,
        success: function(response){
    
            if(response != 0){
               //console.log(response);
               //console.log(response.meta.featureCollection)
               var geojson = response.meta.featureCollection;
               console.log(geojson);
               
            }
            else{
                console.log(response);
            }
        },
    });
}


