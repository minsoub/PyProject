var json;
var pro_json;
var from_ajax_data;
var menu, menu2;
var container, options, editor;
var bomMode;        // 1 : bom, 2 : process(공정)
var isCompleted = false;


// 공정관리 페이지가 로딩될 때 호출 되는 메소드
// 공정관리 JSON 데이터 로드
function process_read_json_getdata()
{
    bom_mng_get_data(2);      // part_mng.js - 그룹데이터 load
    //process_mng_get_data(); // part_mng.js - 공정관리 데이터 load
    bomMode = 2;
}

// AJAX를 통해서 BOM 데이터가 있는지 체크한다.
// 없으면 샘플 데이터를 출력해서 사용자가 추가 및 수정할 수 있도록 한다.
function read_json_getdata()
{
    bom_mng_get_data(1);     // part_mng.js => 1: 그룹, 2 : 공정
    bomMode = 1;
}
// 부품관리 초기 세업
function firstInit(data)
{
    console.log("firstInit called...." + data);
    if (data == "") {
        from_ajax_data = read_json();
    }else {
        from_ajax_data = data;
    }
    json=from_ajax_data;
	populate_json();
	make_contextmenu();
	//make_tech_var_menu();

    if (bomMode == 1)
    {
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
	    editor = new JSONEditor(container, options, json);
	}
}

// 공정관리 데이터 세팅
function firstProcessInit(data)
{
    console.log("firstProcessInit called...." + JSON.stringify(data));
    if (data == "") {   // 데이터가 존재하지 않으므로 임시 데이터를 생성한다.
        from_ajax_data = read_process_json();
    }else {
        from_ajax_data = data;
    }
    pro_json=from_ajax_data;
	populate_json();
	make_contextmenu();
	make_tech_var_menu();

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
	editor = new JSONEditor(container, options, pro_json);
}

function json_init()
{
	from_ajax_data = read_json();	  // make all ts for each excelRange
	json=from_ajax_data;
	populate_json();
	make_contextmenu();
	//make_tech_var_menu();

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
	editor = new JSONEditor(container, options, json);

	json_editor_update();
	drawGroup(this);
}
function json_editor_update(){
    if (bomMode == 1)
    {
        data = json;
    }else {
        data = pro_json;
    }
	var div = document.getElementById('jsoneditor');
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}
	var editor = new JSONEditor(container, options, data);
}
$(window).load(function() {
     console.log("Time until everything loaded: ", Date.now()-timerStart);
});

// +,- toggle button
$(document).on('click', '.fa', function(e) {
	$(this).closest('li').children('ul').slideToggle();
	$(this).toggleClass('fa-plus-circle fa-minus-circle');
	e.stopPropagation();  //  This prevents the click event from bubbling up, causing the parent to also toggle the children beneath them
});

//	editable : select all string
$(document).on('click', '.editable', function() {
	var range, selection;
	if (window.getSelection && document.createRange) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(this);
		selection.removeAllRanges();
		selection.addRange(range);
	} else if (document.selection && document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(this);
		range.select();
	}
});

function make_contextmenu(){
    //http://swisnl.github.io/jQuery-contextMenu/
	is_tech_menu=false;
	menu={};
	for (var i = 0; i < json.partsGroups.length; i++) {
		var cur_el=json.partsGroups[i];
		var folder={};
		folder['name']=cur_el.name+'('+cur_el.l_id+')';
		var items={};
		for (var j = 0; j <cur_el.parts.length; j++){
			var cur_ef=cur_el.parts[j];
			var item={};
			item['name']=cur_ef.name+'('+cur_ef.f_id+')';
			items[cur_el.name+'('+cur_el.l_id+')'+'/'+cur_ef.name+'('+cur_ef.f_id+')']=item;
		}
		folder['items']=items;
		menu['fold'+cur_el.l_id]=folder;
	}
	menu['sep1']='---------';
	menu['fold_deselect']={name: "deselect"};
}

function populate_json(){
	//populate_general();
	//update_all_ts('partsGroups');
	populate_energy_form();
	//update_all_ts('techLevels');
	//alert(isCompleted);
	if (bomMode == 2 && isCompleted == true)
	{
	    //alert("populate_json load");
	    populate_technology();
	}
	//populate_variable();
	//populate_contraint_short_type1();
	//populate_contraint_type1();
	//populate_contraint_type2();
	//populate_contraint_type3();
}

// 부품관리 폼을 생성한다.
function populate_energy_form(){
// make energy form table

	//if (!json.partsGroups[json.partsGroups.length-1].isDemand){
	//	alert(' energy level : demand must locate at the last energy level');
	//	return;
	//}
	$("#tree_for_el_ef>li").remove();
	var tree_for_el_ef = $('#tree_for_el_ef');
	var cur_f_id=1;
	for (var i = 0; i < json.partsGroups.length; i++) {
		var arr_l_id=i;
		var el=json.partsGroups[i];
		el.l_id=(i+1);
		var el_li=$('<li/>').addClass('partsGroups');
		var elAddRemoveButton;
		//if (arr_l_id<(json.partsGroups.length-1)){
			elAddRemoveButton='<span class="aligh_button">'
								+'<input type="button" value="Add" class="el_button el_after" onclick="add_el_after(this)">'
								+'<input type="button" value="Remove" class="el_button" onclick="remove_el(this)">'
							+'</span>';
		//}else elAddRemoveButton='';
		el_li.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i>'
							+'</span><span contenteditable data-type="name" class="name editable">'+el.name+'</span>'
							+'<span class="label">l_id</span><span class="id">'+el.l_id+'</span>'
							+elAddRemoveButton);
		var el_ul=$('<ul/>');

		for (var j = 0; j <el.parts.length; j++){
			var ef=el.parts[j];
			var arr_f_id=j;
			ef.f_id=cur_f_id++;
			var ef_li=$('<li/>').addClass('ef');

			var ef_html=get_html_ef(el,ef);
			if (el.hasOwnProperty('isDemand')){
				ef_li.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i>'+ef_html);
				var demand_ul=$('<ul/>');
				var demand_li=$('<li/>').addClass('demand');
				var tableString='<table class="histCap" width=80%>';
				var firstRow='<tr><td align="left"></td><td>year</td>';
				var ts=[], secondRow;
				if (ef.demand.hasOwnProperty('ts')){
						ts=ef.demand.ts.split(',');
						secondRow='<tr><td align="left">'
							+'<span contenteditable data-type="demandRange"  class="excelRange editable">'+ef.demand.excelRange.toUpperCase() +'</span></td><td>demand</td>';
				}else{
					for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
						ts.push(ef.demand);
					}
					secondRow='<tr><td align="left">'
							+'<span contenteditable data-type="demandRange"  class="excelRange editable">'+ef.demand+'</span></td><td>demand</td>';
				}

				for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
					firstRow += '<td style="border: 1px solid black;">' + (t+json.general.fyear) + '</td>';
					/*if (ts.length<=i){
						secondRow += '<td style="border: 1px solid black;">' + ts[ts.length-1] + '</td>';
					}else */
					secondRow += '<td style="border: 1px solid black;">' + ts[t] + '</td>';
				}
				firstRow+='</tr>';
				secondRow+='</tr>';
				tableString+=firstRow+secondRow+'</table>';
				demand_li.append('').html(tableString);
				demand_ul.append(demand_li);
				ef_li.append(demand_ul);
			}else{
				ef_li.append('').html(ef_html);
			}
			el_ul.append(ef_li);
		}
		el_li.append(el_ul);
		tree_for_el_ef.append(el_li);
	};
}

function get_html_ef(el,ef){
	var hasLoadRegion=ef.hasLoadRegion? '<input type="checkbox" class="hasLoadRegion" checked/>' : '<input type="checkbox" class="hasLoadRegion"/>';
	var eq=ef.eq? '<input type="checkbox" class="eq" checked/>' : '<input type="checkbox" class="eq"/>';
	var removeButton=(el.parts.length==1)?removeButton='disabled="disabled"':'';
	var ef_html='<span contenteditable data-type="name" class="name editable">'+ef.name+'</span>'
				+'<span class="label">f_id</span><span data-type="id" class="id">'+ef.f_id+'</span>'
				+'<span class="aligh_check">'
					+'<span class="label">load region</span>'+hasLoadRegion
					+'<span class="label">eq</span>'+eq
				+'</span>'
				+'<span class="aligh_button">'
					+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_ef_after(this)">'
					+'<input type="button" '+removeButton+' value="Remove" class="ef_button" onclick="remove_ef(this)">'
				+'</span>';
							//'<input type="button" disabled="disabled" value="Remove" class="ef_button"  onclick="remove_ef(this)">'

	return ef_html;
}

$(document).on('click', '#tree_for_el_ef .hasLoadRegion, #tree_for_el_ef .eq', function () {
	var arr_l_id=parseInt($(this).closest('.partsGroups').find('.id').html())-1;
	//console.log($(this).closest('.partsGroups').find('.id').html());
	var arr_f_id=-1;
	var f_id=parseInt($(this).closest('.ef').find('.id').html());
	for (var i=0;i<json.partsGroups[arr_l_id].parts.length;i++){
		var cur_f_id=json.partsGroups[arr_l_id].parts[i].f_id;
		if (cur_f_id==f_id){
			arr_f_id=i;
			break;
		}
	}
	if (arr_f_id<0){alert('f_id not found in l_id=' +(arr_l_id+1)+ ', f_id='+f_id); return;}

	var col_id=$(this).attr('class');

	if (col_id=='hasLoadRegion' || col_id=='eq'){
		var cur_state=json.partsGroups[arr_l_id].parts[arr_f_id][col_id];
		if (cur_state){
			$(this).prop('checked', false);
			json.partsGroups[arr_l_id].parts[arr_f_id][col_id]=false;
		}else{
			$(this).prop('checked', true);
			json.partsGroups[arr_l_id].parts[arr_f_id][col_id]=true;
		}
	}
//	json_editor_update();

});


$(document).on('focus', '#tree_for_el_ef [contenteditable],#tree_for_tech [contenteditable],'
						+'#tree_for_variable [contenteditable]', function() {
	contents=$(this).text();
});
$(document).on('blur', '#tree_for_el_ef [contenteditable],#tree_for_tech [contenteditable],'
						+ '#tree_for_variable [contenteditable]', function() {
	var dataType=$(this).data('type');
	var isTech=$(this).closest('#tree_for_tech').length?true:false;

	var arr_l_id=parseInt($(this).closest('.partsGroups').find('.id').html())-1;
	if (dataType=='name' || dataType=='demandRange'){
		if ($(this).text()=='' || $(this).text().toUpperCase() ==contents.toUpperCase()){
			$(this).text(contents);
			return;
		}
	}
	if($(this).closest('li').hasClass('var')){
		var is_ts=$(this).closest('li.var').find('.is_ts_var').is(':checked');
		var years=json.general.lyear-json.general.fyear+1;
		var eq = (is_ts)?$(this).text()+'^t, t=1,2,\\cdots,'+years:$(this).text();
		el=$(this).closest('li').find('.math').get(0);
		katex.render(eq,el);
		return;
	}


	if (!isTech){
		if ($(this).closest('li').hasClass('partsGroups')){
			json.partsGroups[arr_l_id][dataType]=$(this).text();
			changed_el_ef("change_el_name",arr_l_id, -1);
			make_contextmenu();
			//json_editor_update();
			return;
		}
		if ($(this).closest('li').hasClass('ef') || $(this).closest('li').hasClass('demand')){
			var  f_id=parseInt($(this).closest('.ef').find('.id').html());
			for (var i=0;i<json.partsGroups[arr_l_id].parts.length;i++){
				var cur_f_id=json.partsGroups[arr_l_id].parts[i].f_id;
				if (cur_f_id==f_id){
					arr_f_id=i;
					break;
				}
			}
			if (dataType=="demandRange"){
				if (isNaN($(this).text())){
					var ts=getExcelRange($(this).text()).split(',');
					var cur_td=$(this).closest('td').next().next();

					var i=0;
					while($(cur_td).is('td')){
						if (ts.length<=i){
							$(cur_td).text(ts[ts.length-1]);
						}else{
							$(cur_td).text(ts[i]);
						}
						i++;
						cur_td=$(cur_td).next();
					}
					json.partsGroups[arr_l_id].parts[arr_f_id].demand['excelRange']=$(this).text();
					json.partsGroups[arr_l_id].parts[arr_f_id].demand['ts']=ts.toString();
				}else {
					json.partsGroups[arr_l_id].parts[arr_f_id].demand=$(this).text();
					var cur_td=$(this).closest('td').next().next();

					var i=0;
					while($(cur_td).is('td')){
						$(cur_td).text($(this).text());
						i++;
						cur_td=$(cur_td).next();
					}
				}
			}else {
				json.partsGroups[arr_l_id].parts[arr_f_id][dataType]=$(this).text();
				changed_el_ef("change_ef_name",arr_l_id, arr_f_id);
				make_contextmenu();
			}
			//json_editor_update();
			return;
		}
	}

	if ($(this).closest('li').hasClass('techLevelLi')){
		pro_json.processGroups[arr_l_id][dataType]=$(this).text();
		//json_editor_update();
		return;
	}
	if ($(this).closest('li').hasClass('techLi') || $(this).closest('li').hasClass('capacityLi')
		|| $(this).closest('li').hasClass('investmentCostLi') || $(this).closest('li').hasClass('fixedCostLi') || $(this).closest('li').hasClass('varCostLi')
		|| $(this).closest('li').hasClass('otherInputLi') || $(this).closest('li').hasClass('mainOutputLi') || $(this).closest('li').hasClass('otherOutputLi')
		|| $(this).closest('li').hasClass('histCapLi')
		|| $(this).closest('li').hasClass('histCapYearRange') || $(this).closest('li').hasClass('histCapCapRange')){
		var t_id=parseInt($(this).closest('.techLi').find('.id').html());
		console.log("t_id : " + t_id);
		var arr_t_id;
		for (var i=0;i<pro_json.processGroups[arr_l_id].techs.length;i++){
				var cur_t_id=pro_json.processGroups[arr_l_id].techs[i].t_id;
				console.log("cur_t_id : " + cur_t_id);
				if (cur_t_id==t_id){
					arr_t_id=i;
					break;
				}
		}
		console.log("arr_t_id : " + arr_t_id);
		if (dataType=='name'){
			pro_json.processGroups[arr_l_id].techs[arr_t_id][dataType]=$(this).text();
			//alert(pro_json.processGroups[arr_l_id].techs[arr_t_id][dataType]);
			//json_editor_update();
			return;
		}
		// Hour time setup
		if (dataType == 'value'){
		    console.log("arr_t_id : " + arr_t_id);
		    str = JSON.stringify(pro_json);
		    console.log(str);
		    //console.log("value : " + pro_json.processGroups.techs[arr_t_id]);

			pro_json.processGroups[arr_l_id].techs[arr_t_id][dataType]=$(this).text();
			//json_editor_update();
			return;
		}

		if (dataType=="invCostRange" || dataType=="fixedCostRange" || dataType=='varCostRange'
			|| dataType=='histCapYearRange' || dataType=='histCapCapRange'){
			var cur_td=$(this).closest('td').next().next();
			if ($(this).text()==''){
				while($(cur_td).is('td')){
					$(cur_td).text('');
					cur_td=$(cur_td).next();
				}
			}else{
				var ts_string=getExcelRange($(this).text());
				var ts=ts_string.split(',');
				if(!(dataType=='histCapYearRange' || dataType=='histCapCapRange')){
					var i=0;
					while($(cur_td).is('td')){
						if (ts.length<=i){
							$(cur_td).text(ts[ts.length-1]);
						}else{
							$(cur_td).text(ts[i]);
						}
						i++;
						cur_td=$(cur_td).next();
					}
				}else{
					var table=$(this).closest('table');
					if (dataType=='histCapYearRange'){
						$(table).find('tr').remove();
						var	firstRow='<tr><td><span contenteditable data-type="histCapYearRange" class="excelRange editable cost">'
											+$(this).text()+'</span></td><td>year</td>';
						var secondRow='<tr><td>'
								+'<span contenteditable data-type="histCapCapRange" class="excelRange editable cost"></span></td><td>historic capacity</td>';

						for (var k=0;k<ts.length;k++){
							firstRow += '<td style="border: 1px solid black;">' + ts[k] + '</td>';
							secondRow += '<td style="border: 1px solid black;"></td>';
						}
						firstRow+='</tr>';
						secondRow+='</tr>';
						table.append(firstRow);
						table.append(secondRow);
						alert('input the next "capacity excelRange"');
					}else{
						var i=0;
						while($(cur_td).is('td')){
							if (ts.length<=i){
								$(cur_td).text(ts[ts.length-1]);
							}else{
								$(cur_td).text(ts[i]);
							}
							i++;
							cur_td=$(cur_td).next();
						}
					}
				}
			}
		}else if(dataType=="inputValueRange" || dataType=="outputValueRange"){
			var a_id=parseInt($(this).closest('.activityLi').find('.id').html())-1;
			var cur_td=$(this).closest('td').next().next();
			var otherInput_id,output_id;
			if (dataType=="inputValueRange"){
				otherInput_id=parseInt($(this).closest('.otherInputLi').find('.id').html())-1;
			}else{
				if ($(this).closest('li').hasClass('otherOutputLi')){
					output_id=parseInt($(this).closest('.otherOutputLi').find('.id').html())-1;
				}else{
					output_id=0;
				}
			}
			if ($(this).text()==''){
				var i=0;
				while($(cur_td).is('td')){
					$(cur_td).text('');
					i++;
					cur_td=$(cur_td).next();
				}
			}else{
				var ts=getExcelRange($(this).text()).split(',');

				var i=0;
				while($(cur_td).is('td')){
					if (ts.length<=i){
						$(cur_td).text(ts[ts.length-1]);
					}else{
						$(cur_td).text(ts[i]);
					}
					i++;
					cur_td=$(cur_td).next();
				}
			}
		}
		else pro_json.processGroups[arr_l_id].techs[arr_t_id][dataType]=$(this).text();
		//json_editor_update();
		return;
	}
});