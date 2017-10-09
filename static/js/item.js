var item_json;      // 부품 재고관리 JSON 데이터
var item_project_id = undefined;   // 부품 재고관리 프로젝트 아이디

// 재고관리 저장
$(document).on("click", "#saveItemForm", function (e) {
		e.preventDefault();
		// validation check

		update_all_item();  // HTML 데이터를 JSON 데이터로 생성
		console.log("save item : " + JSON.stringify(item_json));

		save_item_json('/bom/bom_item_save','',0,'', 'save');
		//json_editor_update();
		//alert( "File saved : " + modelJsonFileName );
});

// 재고관리 삭제
$(document).on("click", "#deleteItemForm", function (e) {
		e.preventDefault();
        if(confirm("데이터를 삭제하시겠습니까?"))
        {
            update_all_item();  // HTML 데이터를 JSON 데이터로 생성
		    save_item_json('/bom/bom_item_save','',0,'', 'del');
		}
		//json_editor_update();
});

$(document).on("click", "#selectProjectItemBtn", function (e) {
	e.preventDefault();

    // 프로젝트를 선택했는지 확인한다.
    if ($("#project_id").val() == "")
    {
        // 데이터를 선택하지 않았다면 출력 된 데이터를 초기화한다.
        items_clear();
        item_project_id = undefined;
    }else {
        // 선택된 프로젝트 아이디로 재고 데이터를 조회한다.
        item_project_id = $("#project_id").val();
        read_json_item_getdata();
    }
});
// 화면에 출력된 데이터를 초기화 한다.
function items_clear()
{
    $("#tree_for_tech_item>li").remove();
    item_json = undefined;
}
// 재고관리 정보를 데이터베이스에 저장한다.
function save_item_json(url_loc,menu1,f_id1,newRange1, mode){
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: url_loc,
        data: { data: JSON.stringify(item_json), mode: mode},
		dataType: 'json',
        success: function(data) {
		    //console.log('success',data);
		    //json=data;
		    if (mode == 'save') {
		        str = JSON.stringify(data);
		        str = str.substring(1, str.length-1);
		        console.log("str : " + str);
		        item_json=JSON.parse(str);
		        console.log(item_json);
		        alert("작업을 완료하였습니다!!!");
		        // delete button show
                $("#deleteItemForm").show();
            }else {
                str = JSON.stringify(data);
                item_json = JSON.parse(str);
                alert(item_json['msg']);
                $("#deleteItemForm").hide();
            }
            item_mng_get_data();    // 부품 재고관리 Load
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "Data Saved  msg : " + json );
	    //alert("작업을 완료하였습니다!!!");
    });
}

// 부품 재고관리 데이터를 로드하다.
// 선택된 프로젝트 아이디를 사용해서 재고 데이터를 조회한다.
function read_json_item_getdata()
{
    if (item_project_id != undefined)
    {
        item_mng_get_data();
    }else {
        project_list_ajax_get_data();   // common.js

    }
}
// 프로젝트 콤보박스 데이터를 세팅한다.
function setItemProjectComboInit(data)
{
    console.log("return data : " + data);
    $("#selectProjectList>").remove();

    $("#selectProjectList").append(data);
}

// 부품 재고관리 데이터베이스에서 데이터를 가져온다.
// AJAX를 통해서 데이터를 로드한다.
function item_mng_get_data(mode)
{
    var result;
    isCompleted = false;
     $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/bom/item_getData",
        data: {pro_id: item_project_id},
		dataType: 'json',
        success: function(data) {
		   str = JSON.stringify(data);
		   //str = str.substring(1, str.length-1);
		   console.log("str : " + str);
		   data=JSON.parse(str);
		   if (data['msg'] == 'None')
		   {
		       $("#deleteItemForm").hide();
		       console.log("data not found : " + data);
               result =  "";
		   }else {
		       $("#deleteItemForm").show();
		       str = str.substring(1, str.length-1);
		       data=JSON.parse(str);
		       console.log("data found : " + data);
		       result = data;
		   }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
	    if (result == "") {
	        alert("아이템 데이터가 존재하지 않습니다!!!");
	        firstItemInit(result);   // 빈데이터 항목 생성
	    } else {
	        console.log( "item_mng_get_data loaded  msg : " + result );
            firstItemInit(result);
	    }
    });
}

// AJAX를 통해서 넣어온 JSON 데이터를 처리한다.
// 데이터가 없는 경우 data 변수의 값은 빈 값이 설정된다.
// 빈 값으로 넘어온 경우 샘플 JSON 데이터를 생성한다.
function firstItemInit(data)
{
    console.log("firstItemInit called...." + data);
    if (data == "") {
        from_ajax_data = read_item_json(item_project_id);  // TODO: jsonform.js 참조
    }else {
        from_ajax_data = data;
    }
    // console.log(JSON.stringify(data));
    item_json=from_ajax_data;
	item_populate_json();

	// Json editor setting
	container = document.getElementById('jsoneditor');
	options = {
	    mode: 'tree',
	    modes: ['code', 'form', 'text', 'tree', 'view'],
	    onError: function (err) {
	        alert(err.toString());
        },
	    onModeChange: function (newMode, oldMode) {
		    console.log('Mode switched from', oldMode, 'to', newMode);
	    }
	};
	editor = new JSONEditor(container, options, item_json);
	console.log("called firstinit : " + JSON.stringify(item_json));
	item_json_editor_update();
}

function item_json_editor_update(){
	var div = document.getElementById('jsoneditor');
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}
	var editor = new JSONEditor(container, options, item_json);
}

// 재고관리 데이터 출력
// load된 JSON 데이터를 HTML로 변환해서 화면에 출력한다.
// 그룹 타이틀은 한번만 나올 수 있도록 출력한다.
function item_populate_json()
{
    console.log("item_populate_json called");
	$("#tree_for_tech_item>li").remove();
	var tree_for_tech = $('#tree_for_tech_item');
	var cur_t_id=1;

	// 부품 그룹 타이틀
	var techLevelTitleLi=$('<li style="margin-bottom:5px;" />').addClass('techLevelLi');
	    techLevelTitleLi.addClass('partsGroups');
		techLevelTitleLi.append('').html('<span class="bullet">&nbsp;&nbsp;&nbsp;</span>'
					+'<span class="group_name_title">부품그룹명</span>'
					+'<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
					+'<span class="group_code_title">부품그룹코드</span>'
					+'<span>&nbsp;&nbsp;</span>'
					);
    tree_for_tech.append(techLevelTitleLi);

	for (var i = 0; i < item_json.partsGroups.length; i++) {
		var arr_tl_id=i;
		var tl=item_json.partsGroups[i];
		tl.tl_id=(i+1);

		var techLevelLi=$('<li/>').addClass('techLevelLi');
		techLevelLi.addClass('partsGroups');

		if (item_json.partsGroups.length!=1){
			tlAddRemoveButton='<span class="aligh_button">'
				+'<input type="button" value="Add" class="el_button el_after" onclick="add_item_act_tech_tl(this)">'
				+'<input type="button" value="Remove" class="el_button" onclick="remove_io_act_tech_tl(this)">'
				+'</span>';
		}else {
		    tlAddRemoveButton='<span class="aligh_button">'
				+'<input type="button" value="Add" class="el_button el_after" onclick="add_item_act_tech_tl(this)">'
				+'<input type="button" value="Remove" class="el_button" onclick="remove_io_act_tech_tl(this)" disabled>'
				+'</span>';
		}
		techLevelLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
							+'<span contenteditable data-type="name" class="name editable">'+tl.name+'</span>'
							+'<span>&nbsp;&nbsp;</span>'
							+'<span contenteditable data-type="code" class="code editable">'+tl.code+'</span>'
							+'<span>&nbsp;&nbsp;</span>'
							+tlAddRemoveButton);
        // 부품 타이틀
		var techUl=$('<ul/>').addClass('techUl');
        var techTitleLi=$('<li style="margin-bottom:5px;" />').addClass('techTitleLi');
            techTitleLi.addClass('ef');
            techTitleLi.append('').html('<span class="bullet">&nbsp;&nbsp;&nbsp;</span>'
						+'<span  class="p_name_title ">부품명</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span  class="p_code_title ">부품코드</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span  class="unit_title ">단위</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span  class="ksk_title ">규격</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span class="qty_title ">재고수량</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span class="aligh_button">'
						+' '
                        +'</span>');
        techUl.append(techTitleLi);

		for (var j = 0; j <tl.parts.length; j++){
			var tech=tl.parts[j];
			var arr_t_id=j;
			tech.t_id=cur_t_id;
			// 부품
			var techRemoveButton=(tl.parts.length==1)?techRemoveButton='disabled="disabled"':'';
			var techLi=$('<li style="margin-bottom:20px;" />').addClass('techLi');
				techLi.addClass('ef')
				techLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
						+'<span contenteditable data-type="p_name" class="p_name editable">'+tech.p_name+'</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span contenteditable data-type="p_code" class="p_code editable">'+tech.p_code+'</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span contenteditable data-type="unit" class="unit editable">'+tech.unit+'</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span contenteditable data-type="ksk" class="ksk editable">'+tech.ksk+'</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span data-type="qty" class="qty editable">'+tech.qty+'</span>'
						+'<span>&nbsp;&nbsp;</span>'
						+'<span class="aligh_button">'
						+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_item_act_tech_tl(this)">'
						+'<input type="button"' +techRemoveButton+ 'value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
						+'</span>');

            // 재고량
			var inputUl=$('<ul/>').addClass('inputUl');
			var inputLi=$('<li style="margin-bottom:5px;" />').addClass('inputLi');
			var act_name='입고('+tl.name+'@'+tl.parts[j].p_name+')';
			$(inputLi).css('margin-top','5px');
			inputLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
						+'<span class="label actLabel" style="font-size:12px">'+act_name+'</span>'
						+'<span class="label">&nbsp;</span>'
						+'<span class="aligh_button">'
						+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_item_act_tech_tl(this)">'
						+'</span>');

			var ioUl=$('<ul/>').addClass('ioUl');
            var act = tl.parts[j];
            // input
			if (act.inputs.length>0){
				for (var l=0;l<act.inputs.length;l++){
					var mainInputLi;
					mainInputLi=$('<li/>').addClass('mainInputLi');

				    var i_id=1, otherInputRemove='';
					var mainInputValue='',otherBullet='';
					if (l>0){
						otherInputRemove='<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">';
					}
					mainInputLi.append('').html(
					         '<span class="mymargin"><span contenteditable data-type="date" class="date editable">'+act.inputs[l].date+'</span>'
							+'<span class="label">&nbsp;</span>'
							+'<span contenteditable data-type="input_qty" class="qty editable">'+act.inputs[l].qty+'</span>'
							+'</span>'
							+'<span class="aligh_button">'
							+otherInputRemove
					    	+'</span>');
					ioUl.append(mainInputLi);
				} // for end
			}else{
				var i_id=1;
				var mainInputLi=$('<li/>').addClass('mainInputLi');
				mainInputLi.append('').html(
				     '<span class="mymargin"><span contenteditable data-type="value" class="date editable">&nbsp;</span>'
					+'<span class="label">&nbsp;</span>'
					+'<span contenteditable data-type="input_qty" class="qty editable">&nbsp;</span></span>'
				);
				ioUl.append(mainInputLi);
			}
			inputLi.append(ioUl);
			inputUl.append(inputLi);


			// ouptput
			var outputUl=$('<ul/>').addClass('outputUl');
			var outputLi=$('<li style="margin-bottom:5px;" />').addClass('outputLi');
			var act_name='출고('+tl.name+'@'+tl.parts[j].p_name+')';
			$(outputLi).css('margin-top','5px');
			outputLi.append('').html(
			             '<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
						+'<span class="label actLabel" style="font-size:12px">'+act_name+'</span>'
						+'<span class="label">&nbsp;</span></span>'
						+'<span class="aligh_button">'
						+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_item_act_tech_tl(this)">'
						+'</span>'
			);

            var ouUl=$('<ul/>').addClass('ouUl');
			if (act.outputs.length>0){
				for (var l=0;l<act.outputs.length;l++){
					var mainOutputLi;
					mainOutputLi=$('<li/>').addClass('mainOutputLi');

				    var i_id=1, otherInputRemove='';
					if (l>0){
						otherInputRemove='<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">';
					}
					mainOutputLi.append('').html(
					         '<span class="mymargin"><span contenteditable data-type="date" class="date editable">'+act.outputs[l].date+'</span>'
							+'<span class="label">&nbsp;</span>'
							+'<span contenteditable data-type="output_qty" class="qty editable">'+act.outputs[l].qty+'</span>'
							+'</span>'
							+'<span class="aligh_button">'
					   		+otherInputRemove
					    	+'</span>'
					);
					ouUl.append(mainOutputLi);
				} // for end
			}else{
				var i_id=1;
				var mainOutputLi=$('<li/>').addClass('mainOutputLi');
				mainOutputLi.append('').html(
				     '<span class="mymargin"><span contenteditable data-type="date" class="date editable"></span>'
					+'<span class="label">&nbsp;</span>'
					+'<span contenteditable data-type="output_qty" class="qty editable"></span>'
					+'</span>'
				);
				ouUl.append(mainOutputLi);
			}
			outputLi.append(ouUl);
			outputUl.append(outputLi);

			// adjust - 재고조정
			var adjustUl=$('<ul/>').addClass('adjustUl');
			var adjustLi=$('<li style="margin-bottom:5px;" />').addClass('adjustLi');
			var act_name='재고조정('+tl.name+'@'+tl.parts[j].p_name+')';
			$(adjustLi).css('margin-top','5px');
			adjustLi.append('').html(
			             '<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
						+'<span class="label actLabel" style="font-size:12px">'+act_name+'</span>'
						+'<span class="label">&nbsp;</span></span>'
						+'<span class="aligh_button">'
						+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_item_act_tech_tl(this)">'
						+'</span>'
			);

            var auUl=$('<ul/>').addClass('auUl');
			if (act.adjusts.length>0){
				for (var l=0;l<act.adjusts.length;l++){
					var mainAdjustLi;
					mainAdjustLi=$('<li/>').addClass('mainAdjustLi');

				    var i_id=1, otherInputRemove='';
					if (l>0){
						otherInputRemove='<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">';
					}
					mainAdjustLi.append('').html(
					         '<span class="mymargin"><span contenteditable data-type="date" class="date editable">'+act.adjusts[l].date+'</span>'
							+'<span class="label">&nbsp;</span>'
							+'<span contenteditable data-type="output_qty" class="qty editable">'+act.adjusts[l].qty+'</span>'
							+'</span>'
							+'<span class="aligh_button">'
					   		+otherInputRemove
					    	+'</span>'
					);
					auUl.append(mainAdjustLi);
				} // for end
			}else{
				var i_id=1;
				var mainAdjustLi=$('<li/>').addClass('mainAdjustLi');
				mainAdjustLi.append('').html(
				     '<span class="mymargin"><span contenteditable data-type="date" class="date editable"></span>'
					+'<span class="label">&nbsp;</span>'
					+'<span contenteditable data-type="output_qty" class="qty editable"></span>'
					+'</span>'
				);
				auUl.append(mainAdjustLi);
			}
			adjustLi.append(auUl);
			adjustUl.append(adjustLi);

			techLi.append(inputUl);
		    techLi.append(outputUl);
            techLi.append(adjustUl);
            techUl.append(techLi);
		}
		techLevelLi.append(techUl);
		tree_for_tech.append(techLevelLi);
	}
}

// 부품재고관리에서 각 Add 버튼에 대한 제어를 수행한다.
// 부품재고관리 Add
function add_item_act_tech_tl(btn){
	var cur=$(btn).closest('li');

	if ($(cur).hasClass('mainInputLi') || $(cur).hasClass('otherInputLi')
		|| $(cur).hasClass('mainOutputLi') || $(cur).hasClass('otherOutputLi')){
		var is_input, name, id_name;
		if ($(cur).hasClass('mainInputLi') || $(cur).hasClass('otherInputLi')){
			is_input=true;
			name='other input';
			id_name='i_id';
		}else{
			is_false=true;
			name='other output';
			id_name='o_id';
		}
		var cur_id=$(cur).find('.id').eq(0).html();
		var otherInputLi;
		if (is_input) otherInputLi=$('<li/>').addClass('otherInputLi');
		else otherInputLi=$('<li/>').addClass('otherOutputLi');
		var inputText='<span class="mylabel">'+name+'</span>';
		otherInputLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
							+inputText
							+'<span class="mymargin"><span class="select_menu context-menu-one btn btn-neutral">'
							+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
							+'<span class="label">H:</span><span contenteditable data-type="value" class="value editable">1.0</span>'
							+'<span class="label">'+id_name+'</span><span class="id">'+cur_id+'</span>'
							+'<span class="aligh_button">'
								+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
								+'<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
							+'</span>');
		$(cur).after(otherInputLi);

		if (is_input){
			$(cur).nextAll('.otherInputLi').each(function(){
				var id=parseInt($(this).find('.id').eq(0).text());
				$(this).find('.id').eq(0).text(id+1);
			});
		}else{
			$(cur).nextAll('.otherOutputLi').each(function(){
				var id=parseInt($(this).find('.id').eq(0).text());
				$(this).find('.id').eq(0).text(id+1);
			});
		}

		$('.context-menu-one').contextMenu(true);

	}else if ($(cur).hasClass('activityLi')){
		cur.clone().insertAfter(cur);
		$(cur).next().find('.otherInputLi').remove();
		$(cur).next().find('.otherOutputLi').remove();
		if ($(cur).closest('.techLi').find('.activityLi').length==2){
			$(cur).closest('.techLi').find('.activityLi').find('[value=Remove]').removeAttr('disabled');
			$(cur).closest('.techLi').find('.activityLi').find('.actLabel').each(function(){
				$(this).html('activity<span contenteditable data-type="name" class="name editable"></span>');
			});
		}
		$(cur).nextAll('.activityLi').each(function(){
			var id=parseInt($(this).find('.id').eq(0).text());
			$(this).find('.id').eq(0).text(id+1);
		});

	}else if ($(cur).hasClass('inputLi')) {
	    // var cur=$(btn).closest('li');
	    console.log("inputLi called...");
	    console.log(cur);
	    var ul_cursor = $(cur).find('.mainInputLi').last().closest('li');
	    console.log(ul_cursor);

		var mainInputLi=$('<li/>').addClass('mainInputLi');
		mainInputLi.append('').html(
		     '<span class="mymargin"><span contenteditable data-type="date" class="date editable"></span>'
			+'<span class="label">&nbsp;</span>'
			+'<span contenteditable data-type="input_qty" class="qty editable"></span>'
			+'</span>'
			+'<span class="aligh_button">'
			+'<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
			+'</span>'
		);
		$(ul_cursor).after(mainInputLi);
	}else if ($(cur).hasClass('outputLi')) {
	    console.log("outputLi called...");
	    console.log(cur);
	    var ul_cursor = $(cur).find('.mainOutputLi').last().closest('li');
	    console.log(ul_cursor);

		var mainOutputLi=$('<li/>').addClass('mainOutputLi');
		mainOutputLi.append('').html(
		     '<span class="mymargin"><span contenteditable data-type="date" class="date editable"></span>'
			+'<span class="label">&nbsp;</span>'
			+'<span contenteditable data-type="output_qty" class="qty editable"></span>'
			+'</span>'
			+'<span class="aligh_button">'
			+'<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
			+'</span>'
		);
		$(ul_cursor).after(mainOutputLi);
	}else if ($(cur).hasClass('adjustLi')) {
	    console.log("adjustLi called...");
	    console.log(cur);
	    var ul_cursor = $(cur).find('.mainAdjustLi').last().closest('li');
	    console.log(ul_cursor);

		var mainAdjustLi=$('<li/>').addClass('mainAdjustLi');
		mainAdjustLi.append('').html(
		     '<span class="mymargin"><span contenteditable data-type="date" class="date editable"></span>'
			+'<span class="label">&nbsp;</span>'
			+'<span contenteditable data-type="output_qty" class="qty editable"></span>'
			+'</span>'
			+'<span class="aligh_button">'
			+'<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
			+'</span>'
		);
		$(ul_cursor).after(mainAdjustLi);
	}else if ($(cur).hasClass('techLi')){       // 아이템 등록
		cur.clone().insertAfter(cur);

		$(cur).closest('.techLi').nextAll('.techLi').each(function(){
            $(this).find('[value=Remove]').removeAttr('disabled');
            // console.log("found");
		});

		$(cur).next().find('.mainInputLi').not(':first').remove();
        $(cur).next().find('.mainOutputLi').not(':first').remove();
        $(cur).next().find('.mainAdjustLi').not(':first').remove();

        cu = $(cur).next().closest('.techLi');
        $(cu).find('.p_name').eq(0).text("");
        $(cu).find('.p_code').eq(0).text("");
        $(cu).find('.unit').eq(0).text("");
        $(cu).find('.ksk').eq(0).text("");
        $(cu).find('.qty').eq(0).text("0");

        cu1 = $(cur).next().find('.mainInputLi').closest('.mainInputLi');
        $(cu1).find('.qty').eq(0).text("0");
        $(cu1).find('.date').eq(0).text("");

        cu2 = $(cur).next().find('.mainOutputLi').closest('.mainOutputLi');
        $(cu2).find('.qty').eq(0).text("0");
        $(cu2).find('.date').eq(0).text("");

        cu3 = $(cur).next().find('.mainAdjustLi').closest('.mainAdjustLi');
        $(cu3).find('.qty').eq(0).text("0");
        $(cu3).find('.date').eq(0).text("");

	}else if ($(cur).hasClass('techLevelLi')){  // 그룹품목 Add
		cur.clone().insertAfter(cur);
		$(cur).next().find('.techLi').not(':first').next().remove();
		console.log("length : " + $(cur).closest('.techLevelLi').length);

		//if ($(cur).closest('.techLevelLi').length==2){
			$(cur).next().closest('.techLevelLi').find('[value=Remove]').removeAttr('disabled');
		//}

		$(cur).next().find('li.techLi').find('[value=Remove]').eq(0).attr('disabled','disabled');

		// 항목 아이템 값을 초기화한다.
        c = $(cur).next().closest('.techLevelLi');
        $(c).find('.name').eq(0).text("");
        $(c).find('.code').eq(0).text("");

        cu = $(cur).next().find('.techLi').closest('.techLi');
        $(cu).find('.p_name').eq(0).text("");
        $(cu).find('.p_code').eq(0).text("");
        $(cu).find('.unit').eq(0).text("");
        $(cu).find('.ksk').eq(0).text("");
        $(cu).find('.qty').eq(0).text("0");

        $(cur).next().find('.mainInputLi').not(':first').remove();
        $(cur).next().find('.mainOutputLi').not(':first').remove();
        $(cur).next().find('.mainAdjustLi').not(':first').remove();

        cu1 = $(cur).next().find('.mainInputLi').closest('.mainInputLi');
        $(cu1).find('.qty').eq(0).text("0");
        $(cu1).find('.date').eq(0).text("");

        cu2 = $(cur).next().find('.mainOutputLi').closest('.mainOutputLi');
        $(cu2).find('.qty').eq(0).text("0");
        $(cu2).find('.date').eq(0).text("");

        cu3 = $(cur).next().find('.mainAdjustLi').closest('.mainAdjustLi');
        $(cu3).find('.qty').eq(0).text("0");
        $(cu3).find('.date').eq(0).text("");
	}
}

// HTML에 등록된 데이터를 JSON 데이터로 생성한다.
// item_project_id 가 존재하는지 체크해야 한다.
function update_all_item(){

    if (item_project_id == undefined)
    {
        alert("프로젝트 아이디가 존재하지 않습니다!!!");
        return;
    }
    //var projectId = item_project_id;  // item_json.projectId;
    var _id = item_json._id;
    console.log("[update_all_item debug] _id = "+_id);
    if (_id == "")
    {
        _id = "";
    }
	item_json.partsGroups.length=0;
	item_json.projectId = item_project_id;
	item_json._id = _id;

	var tls=[], tl={}, parts=[], part={};

	$('#tree_for_tech_item').find('li.techLevelLi').next().each(function(){
		tl={};
		tl.name=$(this).find('.name').eq(0).html();
		tl.code=$(this).find('.code').eq(0).html();
		console.log("tl.name : " + tl.name)
		parts=[];
		$(this).find('li.techLi').not('li.techTitleLi').each(function(){
			part={}, capacity={};

			part.p_name=$(this).find('.p_name').eq(0).html();
			part.p_code=$(this).find('.p_code').eq(0).html();
			part.unit=$(this).find('.unit').eq(0).html();
			part.ksk=$(this).find('.ksk').eq(0).html();
			part.qty=parseInt($(this).find('.qty').eq(0).html());
			part.hasLoadRegion=$(this).find('.hasLoadRegion').eq(0).html();
			part.eq=$(this).find('.eq').eq(0).html();

            console.log("part p_name : " + part.p_name);
			inputs=[];
			$(this).find('li.mainInputLi').each(function(){
				act={};
				if ($(this).find('.date').eq(0).html()){
					act.date=$(this).find('.date').eq(0).html();
				}else {
				    act.date="";
				}
				if ($(this).find('.qty').eq(0).html()){
					act.qty=parseInt($(this).find('.qty').eq(0).html());
				}else {
				    act.qty = 0;
				}
				inputs.push(act);
			});
			part.inputs = inputs;
			outputs=[];
			$(this).find('li.mainOutputLi').each(function(){
				act={};
				if ($(this).find('.date').eq(0).html()){
					act.date=$(this).find('.date').eq(0).html();
				}else {
				    act.date="";
				}
				if ($(this).find('.qty').eq(0).html()){
					act.qty=parseInt($(this).find('.qty').eq(0).html());
				}else {
				    act.qty = 0;
				}
				outputs.push(act);
			});
            part.outputs = outputs;
			adjusts=[];
			$(this).find('li.mainAdjustLi').each(function(){
				act={};
				if ($(this).find('.date').eq(0).html()){
					act.date=$(this).find('.date').eq(0).html();
				}else {
				    act.date = "";
				}
				if ($(this).find('.qty').eq(0).html()){
					act.qty=parseInt($(this).find('.qty').eq(0).html());
				}else {
				    act.qty = 0;
				}
				adjusts.push(act);
			});
            part.adjusts = adjusts;

            parts.push(part);
		});
		tl.parts=parts;
		tls.push(tl);
	});
	item_json.partsGroups=tls;
}

// 입력 가능한 항목에서 데이터를 입력했을 때 처리하는 메소드
$(document).on('blur', '#tree_for_tech_item [contenteditable]', function() {
	var dataType=$(this).data('type');
	if (dataType == 'input_qty' || dataType == 'output_qty') {
	    //mainInputLi
	    //var cur = $(this).find('.mainInputLi').first().closest('li');
	    var total = 0;
	    var qty = 0;
	    $(this).closest('.techLi').find('.mainInputLi').each(function(){
	        //console.log("input found........");
	        if ($(this).find('.qty').eq(0).text())
	        {
			    qty = parseInt($(this).find('.qty').eq(0).text());
			    //console.log("int quty : " + qty);
			    total = total + qty;
			}
		});
	    $(this).closest('.techLi').find('.mainOutputLi').each(function(){
	        if ($(this).find('.qty').eq(0).text())
	        {
			    qty = parseInt($(this).find('.qty').eq(0).text());
			    //console.log("out quty : " + qty);
			    total = total - qty;
			}
		});
	    $(this).closest('.techLi').find('.mainAdjustLi').each(function(){
	        if ($(this).find('.qty').eq(0).text())
	        {
			    qty = parseInt($(this).find('.qty').eq(0).text());
			    //console.log("out quty : " + qty);
			    total = total + qty;
			}
		});
		console.log("total : " + total);
		// update
        $(this).closest('.techLi').find('.qty').eq(0).text(total);
    }
    return;
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSON 데이터를 받아서 입출고표 화면을 출력한다.
// MongoDB에서 JSON 데이터 조회 후 HTML 페이지에서 바로 사용시
// safe를 사용해야 한다.
function read_json_view_print(result)
{
    if (item_project_id == undefined)
    {
        project_list_ajax_get_data();
    }else {
        if (result != "")
        {
            var str = JSON.stringify(result);
	        str = str.substring(1, str.length-1);
	        console.log("str : " + str);
	        item_json=JSON.parse(str);

            make_bom_view_print($("#from").val(), $("#to").val());  // 입출고표 화면을 생성해서 출력한다.
	    }
	}
}

// 입출고표 화면을 생성한다.
function make_bom_view_print(from, to)
{
    console.log("make_bom_view_print called");
	$("#tree_for_tech_item> #view").remove();
	$("#tree_for_tech_item>ul").remove();
    var table=$("#tree_for_tech_item").closest('#tree_for_tech_item');
    console.log(table);

	for (var i = 0; i < item_json.partsGroups.length; i++) {
	    var tl=item_json.partsGroups[i];

	    for (var j = 0; j <tl.parts.length; j++){
	        var arr = [];
            var act = tl.parts[j];
            // input
			if (act.inputs.length>0){
				for (var l=0;l<act.inputs.length;l++){
				    if (from == "")
				    {
				        var obj = {};
				        obj.date = act.inputs[l].date;
				        obj.qty  = act.inputs[l].qty;
				        obj.mode = 1;
				        arr.push(obj);
				    }else {
				        if (from <= act.inputs[l].date && to >= act.inputs[l].date)
				        {
				            var obj = {};
				            obj.date = act.inputs[l].date;
				            obj.qty  = act.inputs[l].qty;
				            obj.mode = 1;
				            arr.push(obj);
				        }
				    }
				    //console.log("obj1 date : "+ obj.date);
				}
			}
			// output
			if (act.outputs.length>0){

			    for (var l=0; l<act.outputs.length; l++){
			        if (from == "")
				    {
			            var obj = {};
			            obj.date = act.outputs[l].date;
			            obj.qty = act.outputs[l].qty;
			            obj.mode = 2;
			            arr.push(obj);
			        }else {
			            if (from <= act.outputs[l].date && to >= act.outputs[l].date)
				        {
			                var obj = {};
			                obj.date = act.outputs[l].date;
			                obj.qty = act.outputs[l].qty;
			                obj.mode = 2;
			                arr.push(obj);
				        }
			        }
			        //console.log("obj2 date : "+ obj.date);
			    }
			}
			// adjust
			if (act.adjusts.length>0){

			    for (var l=0; l<act.adjusts.length; l++){
			        if (from == "")
				    {
			            var obj = {};
			            obj.date = act.adjusts[l].date;
			            obj.qty = act.adjusts[l].qty;
			            obj.mode = 3;
			            arr.push(obj);
			        }else {
			            if (from <= act.adjusts[l].date && to >= act.adjusts[l].date)
			            {
			                var obj = {};
			                obj.date = act.adjusts[l].date;
			                obj.qty = act.adjusts[l].qty;
			                obj.mode = 3;
			                arr.push(obj);
			            }
			        }
			        //console.log("obj3 date : "+ obj.date);
			    }
			}
	        // 날짜별 정렬
	        var sort_arr = bouble_sort(arr);

            // 날짜별 세팅 데이터
            var row_arr = date_setup_get_array(sort_arr);

            // 테이블 데이터 생성
            var table_data = table_make_data(row_arr);

            var techUI=$('<ul/>').addClass('techUl');
            // var techLi=$('<li style="margin-bottom:20px;" />').addClass('techLi');
			var mainOutputLi=$('<li style="margin-bottom:20px;" />').addClass('mainOutputLi');
			mainOutputLi.append('').html(
			     '<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span><span class="mymargin">'
			    +'<span data-type="name" class="bom_name">'+tl.name+' >> ['+act.p_name+']'+'</span>'
				+'</span>'
			);

            var tableUI=$('<ul/>').addClass('tableUI');
            var techLi=$('<li style="margin-bottom:20px;" />').addClass('techLi');
            techLi.append(table_data);
            tableUI.append(techLi);

			mainOutputLi.append(tableUI);
			techUI.append(mainOutputLi);
            //techUI.append(table_data);

            $(table).append(techUI);
            //$(table).append(table_data);
            //table.append('').html(tr_data);
            console.log(table_data);
	    }
	}
}

function bouble_sort(arr)
{
	for (y=0; y<arr.length; y++) {
	    for (k=1; k<arr.length -1; k++) {
	        if(arr[k].date <= arr[k-1].date) {
                temp = arr[k-1];
                arr[k-1] = arr[k];
                arr[k] = temp;
	        }
	    }
	}
	return arr;
}

function date_setup_get_array(arr)
{
	// tr 데이터 생성
	var row_arr = [];
	var row_obj = {};
	var prev_dt = "";
    var total = 0;
	for (i=0; i<arr.length; i++)
	{
	    console.log(arr[i].date);
	    if (prev_dt == "") {
	        prev_dt = arr[i].date;
	    }else {
	        if (prev_dt != arr[i].date) {
	        	if (row_obj.input_qty != undefined)
	            {
	                total = total + parseInt(row_obj.input_qty);
	            }
	            if (row_obj.output_qty != undefined)
	            {
	                total = total - row_obj.output_qty;
	            }
	            if (row_obj.adjust_qty != undefined)
	            {
	                total = total + row_obj.adjust_qty;
	            }
	            row_obj.total = total;

	            row_arr.push(row_obj);
	            row_obj = {};
	            prev_dt = arr[i].date;
	        }
	    }
	    if (arr[i].mode == 1) {
	        row_obj.input_date = arr[i].date;
	        row_obj.input_qty = arr[i].qty;
	    }else if(arr[i].mode == 2) {
	        row_obj.output_date = arr[i].date;
	        row_obj.output_qty = arr[i].qty;
	    }else if(arr[i].mode == 3) {
	        row_obj.adjust_date = arr[i].date;
	        row_obj.adjust_qty = arr[i].qty;
	    }
	    if (i == (arr.length-1)) {
	        if (row_obj.input_qty != undefined)
	        {
	            total = total + parseInt(row_obj.input_qty);
	        }
	        if (row_obj.output_qty != undefined)
	        {
	            total = total - row_obj.output_qty;
	        }
	        if (row_obj.adjust_qty != undefined)
	        {
	            total = total + row_obj.adjust_qty;
	        }
	        row_obj.total = total;
	        row_arr.push(row_obj);
	    }
	}
	return row_arr;
}

function table_make_data(row_arr)
{
	var tr_data = "";
	tr_data = tr_data + "<table class='bom_view'><thead><tr><th colspan=2 class='bom_th'>입력</th><th colspan=2 class='bom_th'>출력</th>";
    tr_data = tr_data + "<th colspan=2 class='bom_th'>조정</th><th class='bom_th'>재고량</th></tr></thead>";
    tr_data = tr_data + "<tbody>";
	for (i=0; i<row_arr.length; i++) {
	    tr_data = tr_data + "<tr  class='work_tr'>";
	    if (row_arr[i].input_date != undefined) {
	        tr_data = tr_data + "<td class='bom_td1'>"+row_arr[i].input_date+"</td>";
	    }else {
	        tr_data = tr_data + "<td class='bom_td1'>&nbsp;</td>";
	    }
	    if (row_arr[i].input_qty != undefined) {
	        tr_data = tr_data + "<td class='bom_td2'>"+row_arr[i].input_qty+"</td>";
	    }else {
	        tr_data = tr_data + "<td class='bom_td1'>&nbsp;</td>";
	    }
	    if (row_arr[i].output_date != undefined) {
	        tr_data = tr_data + "<td class='bom_td1'>"+row_arr[i].output_date+"</td>";
	    }else {
	        tr_data = tr_data + "<td class='bom_td1'>&nbsp;</td>";
	    }
	    if (row_arr[i].output_qty != undefined) {
	        tr_data = tr_data + "<td class='bom_td2'>"+row_arr[i].output_qty+"</td>";
	    }else {
	        tr_data = tr_data + "<td class='bom_td1'>&nbsp;</td>";
	    }
	    if (row_arr[i].adjust_date != undefined) {
	        tr_data = tr_data + "<td class='bom_td1'>"+row_arr[i].adjust_date+"</td>";
	    }else {
	        tr_data = tr_data + "<td class='bom_td1'>&nbsp;</td>";
	    }
	    if (row_arr[i].adjust_qty != undefined) {
	        tr_data = tr_data + "<td class='bom_td2'>"+row_arr[i].adjust_qty+"</td>";
	    }else {
	        tr_data = tr_data + "<td class='bom_td1'>&nbsp;</td>";
	    }
	    tr_data = tr_data + "<td class='bom_td2'>"+row_arr[i].total+"</td>";
	    tr_data = tr_data + "</tr>";
	}
	tr_data = tr_data + "</tbody></table>";

	return tr_data;
}

$(document).on("click", "#searchItemViewResultForm", function (e) {
		e.preventDefault();
		//alert("t1");
		if ($("#project_id").val() == "") {
		    alert("프로젝트명을 선택하세요!!!");
		    return;
		}else {
		    item_project_id = $("#project_id").val();
		   // alert(item_project_id);
		}
        //make_bom_view_print($("#from").val(), $("#to").val());
        item_view_get_data("");
});

function item_view_get_data(mode)
{
    var result;
    isCompleted = false;
     $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/bom/item_getData",
        data: {pro_id: item_project_id},
		dataType: 'json',
        success: function(data) {
		   str = JSON.stringify(data);
		   //str = str.substring(1, str.length-1);
		   console.log("str : " + str);
		   data=JSON.parse(str);
		   if (data['msg'] == 'None')
		   {
		       console.log("data not found : " + data);
               result =  "";
		   }else {
		       //str = str.substring(1, str.length-1);
		       data=JSON.parse(str);
		       console.log("data found : " + data);
		       result = data;
		   }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
	    if (result == "") {
	        alert("아이템 데이터가 존재하지 않습니다!!!");
	    } else {
	        console.log( "item_mng_get_data loaded  msg : " + result );
            read_json_view_print(result);

	    }
    });
}