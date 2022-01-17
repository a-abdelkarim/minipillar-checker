// -------------------------------------------------------------------------------//
// upload selected file from Procedure Modal -------------------------------------//
function importFilePorcedure(){
    // upload file function
    var fd = new FormData();
    var files = $('#import_procedure_file')[0].files[0];
    fd.append('image', files);
    // if(fd.size == 0) {
    //         alert("no file selected");
    //         return;
    // }
    console.log("fd: "+fd[0]);
    console.log("files: "+files);

    $.ajax({
        url: 'http://localhost:8000/api/minipillar/1/update',
        type: 'put',
        data: fd,
        headers: {'Authorization': 'token 58d172e97a3da66478f15761f000ac221fb26fbc'},
        contentType: false,
        processData: false,
        success: function(response){

            if(response != 0){
               alert('file uploaded');
            }
            else{
                alert('file not uploaded');
            }
        },
    });
    // $.ajax({
    //     url: 'http://localhost:8000/api/minipillar/records',
    //     type: 'get',
    //     // data: fd,
    //     headers: {'Authorization': 'token 23fe479b3bb49c5a1cc8bb409330b06060430af9'},
    //     contentType: false,
    //     processData: false,
    //     success: function(response){

    //         if(response != 0){
    //            console.log(response);
    //         }
    //         else{
    //             console.log(response);
    //         }
    //     },
    // });
    
    // clear form after uploading
    clearProcedureModal();
}
// ezzat start 
// -------------------------------------------------------------------------------//
// Clear selected file from Procedure Modal --------------------------------------//
function clearProcedureModal(){
    document.getElementById("import_procedure_file").value=null; 
}


//------------Push data to server side & get GMl files ///
function  requestImportPDF()
{
    // get token to send the file --Removed to work with current token
   // getAdminToken();
    //Get File in from 
    var fd = new FormData();
    var pdfFile = $('#sel_pdf_file').prop('files')[0] ;
    if(pdfFile == null){
        alert("select file first");
        return;
    }
    fd.append('image', pdfFile);
   
   // console.log(adminToken);                             
    $.ajax({
        url: 'http://192.168.1.77:8000/api/fir/pdf_file/upload',
        type: 'post',
        data: fd,
        headers: {'Authorization': 'token 4a34d312662f6099bdb77e226579485d2e623fdf'},
        contentType: false,
        processData: false,
        success: function(response){
            if(response != 0){
                // get length of a json object "arcs", "circles", "poly_circle", "polygons"
            //    console.log(Object.keys(response[1]).length);
                
                // get each element size in a json response 
            //    console.log(response[1]);
                var obj = $('#response_AIP').text(  "circles: " + response[1].circles.length + "\n"
                                        + "arcs: "+ response[1].arcs.length + "\n"  
                                        // + "poly_circle: "+ response[1].poly_circle.length + "\n"  
                                        + "polygons: "+ response[1].polygons.length + "\n");
                obj.html(obj.html().replace(/\n/g,'<br/>'));
                // catch json features
                json_features = response[1] ;
                
                // catch gml features
                gml_features = response[0] ;


/*
                // print json polygons or circles or arcs or poly_circle
               // console.log("####################### JSON ##############################")
               // console.log(JSON.stringify(json_features['polygons'][0]));
                //Loop  Polygon features array and show count
                for(var i = 0; i< response[1].polygons.length; i++){
                    var importedObject = json_features['polygons'][i];
                    addGeoJsonToMap(importedObject) ;
                }
                
                //Loop  cricles features array and show count
                console.log("test circles: "+response[1].circles.length);
                for(var i = 0; i< response[1].circles.length; i++){
                    var importedObject = response[1].circles[i];
                    addGeoJsonToMap(importedObject) ;
                }
                
                //Loop  arcs features array and show count
                console.log("test arcs: "+response[1].arcs.length);
                for(var i = 0; i< response[1].arcs.length; i++){
                    var importedObject = response[1].arcs[i];
                    addGeoJsonToMap(importedObject) ;
                }
				
                */
				json_features = response[2] ;
                /*
				res_string = JSON.stringify(json_features) ;
				res_string1 = res_string.replace('"{', "{");
				res_string2 = res_string1.replace('}"', "}");
				res_string3 = res_string2.replace("'{", "{");
				res_string4 = res_string3.replace("}'", "}");
				
				res_string5 = res_string4.replace("'", '"');
				console.log(res_string5);
				json_features =JSON.parse( res_string5) ; 
				console.log(json_features);
                */
				addGeoJsonToMap(json_features) ;
				
				
                // //Loop  poly_circle features array and show count
                // for(var i = 0; i< response[0].poly_circle.length; i++){
                //     var importedObject = json_features['poly_circle'][i];
                //     addGeoJsonToMap(importedObject) ;
                // }
                
                // print gml polygons or circles or arcs
              //  console.log("####################### GML ##############################")
              //  console.log(JSON.stringify(gml_features['polygons']));

                
                
            }
            else{
                console.log('PDF file not uploaded');
            }
        },error: function(xhr, status, error) {
            console.log("PDF import error:"+ error);
        }
    });

}

