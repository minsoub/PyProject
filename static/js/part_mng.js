// 부품그룹관리 저장
$(document).on("click", "#saveJsonForm", function (e) {
		e.preventDefault();

		// update_all_tech_io_f_id();
		//update_var();

		save_json($("#pro_id").val(), '/process/process_partsGroups_save','',0,'', 'save');
		json_editor_update();
		//alert( "File saved : " + modelJsonFileName );
});

// 부품그룹관리 삭제
$(document).on("click", "#deleteJsonForm", function (e) {
		e.preventDefault();

		// update_all_tech_io_f_id();
		//update_var();

		save_json($("#pro_id").val(), '/process/process_partsGroups_delete','',0,'', 'del');
		//json_editor_update();
});

function update_var(){
	json.variables.length=0;
	var v_id=1;
	$('#tree_for_variable').find('li.var').each(function(){
		var cur_var={};
		cur_var.name=$(this).find('.name').eq(0).html();
		cur_var.teXeq=$(this).find('.teXeq').eq(0).html();
		cur_var.is_ts=$(this).find('input[name=is_ts_var]').is(':checked');
		cur_var.v_id=v_id++;
		json.variables.push(cur_var);
	});
}

// 공정관리 데이터를 데이터베이스에서 로드한다.
// 데이터베이스에 존재하지 않을 경우 임시 데이터를 생성해서 출력한다.
function process_mng_get_data()
{
   var result;
   isCompleted = false;
     $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/process/process_getData",
        data: {pro_id: $("#pro_id").val(), bom_id: json._id["$oid"]},
		dataType: 'json',
        success: function(data) {
		   str = JSON.stringify(data);
		   //str = str.substring(1, str.length-1);
		   console.log("process_mng_get_data str : " + str);
		   data=JSON.parse(str);
		   if (data['msg'] == 'None')
		   {
		       $("#deleteProcess").hide();
		       console.log("data not found : " + data);
               result =  "";
               isCompleted = true;
               firstProcessInit(result);
		   }else {
		       $("#deleteProcess").show();
		       str = str.substring(1, str.length-1);
		       data=JSON.parse(str);
		       console.log("data found : " + data);
		       result = data;
		       isCompleted = true;
		       firstProcessInit(result);
		   }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "Data Saved  msg : " + result );
	    //alert("작업을 완료하였습니다!!!");
	    //return result;
    });
}

// 그룹관리 데이터 load
function bom_mng_get_data(mode)
{
    var result;
    isCompleted = false;
     $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/process/process_group_getdata",
        data: {pro_id: $("#pro_id").val()},
		dataType: 'json',
        success: function(data) {
		   str = JSON.stringify(data);
		   //str = str.substring(1, str.length-1);
		   console.log("str : " + str);
		   data=JSON.parse(str);
		   if (data['msg'] == 'None')
		   {
		       $("#deleteJsonForm").hide();
		       console.log("data not found : " + data);
               result =  "";
               firstInit(result);

		   }else {
		       $("#deleteJsonForm").show();
		       str = str.substring(1, str.length-1);
		       data=JSON.parse(str);
		       console.log("data found : " + data);
		       result = data;
               firstInit(result);
		       if (mode == 2)
		       {
		            process_mng_get_data(); // 공정 데이터 조회
		       }
		   }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "Data Saved  msg : " + result );
	    //alert("작업을 완료하였습니다!!!");
	    //return result;
    });
}

// 공정관리 정보를 데이터베이스에 저장한다.
// mode : 1(save), 2(delete)
function process_save_json(mode)
{
    if (mode == "1") {
        pUrl = "/process/process_save";
    }else {
        pUrl = "/process/process_delete";
    }

    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: pUrl,
        data: { data: JSON.stringify(pro_json)},
		dataType: 'json',
        success: function(data) {
		    //console.log('success',data);
		    //json=data;
		    if (mode == '1') {
		        str = JSON.stringify(data);
		        str = str.substring(1, str.length-1);       // TODO: [ ] => 제거해야 됨 (몽고DB에서 붙어서 나옴)
		        console.log("str : " + str);
		        pro_json=JSON.parse(str);
		        console.log(json);
		        alert("작업을 완료하였습니다!!!");
		        // delete button show
                $("#deleteProcess").show();
                // pro_json reload 수행(신규 등록시 키가 존재한다.(oid)
                bom_mng_get_data(2);; // AJAX recall
            }else {     // 삭제 수행
                str = JSON.stringify(data);
                pro_json = JSON.parse(str);
                alert(pro_json['msg']);
                $("#deleteProcess").hide();
                bom_mng_get_data(2);;        // 데이터를 삭제했으므로 초기화 작업을 수행해야 한다.
            }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "Data Saved  msg : " + json );
	    //alert("작업을 완료하였습니다!!!");
    });
}
// 파트그룹 정보를 데이터베이스에 저장한다.
function save_json(pro_id, url_loc,menu1,f_id1,newRange1, mode){
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: url_loc,
        data: { data: JSON.stringify(json), pro_id: pro_id},
		dataType: 'json',
        success: function(data) {
		    //console.log('success',data);
		    //json=data;
		    if (mode == 'save') {
		        str = JSON.stringify(data);
		        str = str.substring(1, str.length-1);
		        console.log("str : " + str);
		        json=JSON.parse(str);
		        console.log(json);
		        alert("작업을 완료하였습니다!!!");
		        // delete button show
                $("#deleteJsonForm").show();
            }else {
                str = JSON.stringify(data);
                json = JSON.parse(str);
                alert(json['msg']);
                $("#deleteJsonForm").hide();
                json_init();
            }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "Data Saved  msg : " + json );
	    //alert("작업을 완료하였습니다!!!");
    });
}