var json, lp;  // main variable for json file
var from_ajax_data;  // main variable for json file
var menu, menu2;
var container,options, editor;
var localhost='cat.ks.ac.kr/RES4';

$(document).ready(function (e) {
	console.log("Time until DOMready: ", Date.now()-timerStart);

	$('body').scrollspy({ target: '#navbar-example' });

  	var sd = document.getElementById('modelJsonFileName').value;
    var jsonFileName='json/' + sd;

	var urlname='http://'+localhost+'/php_process/read_json_file.php?menu=firstReadJson&jsonFileName=json/'+sd;
	read_json(urlname);	  // make all ts for each excelRange 
	json=from_ajax_data;
	populate_json();

	make_contextmenu();
	make_tech_var_menu();
	container = document.getElementById('jsoneditor');

	options = {
		mode: 'tree',
		modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
		onError: function (err) {
		alert(err.toString());
    },
		onModeChange: function (newMode, oldMode) {
			console.log('Mode switched from', oldMode, 'to', newMode);	  
		}
	};
	editor = new JSONEditor(container, options, json);
	/*	var m = new CalcJS();
	m.calc({ 'compAprice': '23' });
	m.calc({ 'compBprice': '11' });
	m.calc({ 'shoploss': '11' });
	m.calc({ 'prodloss': '(shoploss + 1 ) / 4' });
	m.calc({ 'sellprice': '(compAprice + compBprice + prodloss ^ 2) * 1.6',
			'retailprice': '(sellprice + ( 2 * shoploss)) * 1.1'});
	console.log(m.variables.retailprice);	*/
});
$(window).load(function() {
                 console.log("Time until everything loaded: ", Date.now()-timerStart);
});


function read_json(urlname){
//	alert('ready: ' + jsonFileName);
    $.ajax({
		type: "GET",
        async: false,
		url: urlname, 
        dataType: "json",
        success: function(data) {
	        from_ajax_data=data;
         //   console.log(data);
			//alert(jsonFileName + " read success");
        },
	    error: function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	    }
    }).done(function(msg){
		//alert(jsonFileName + " read OK!: ");
    });
}


$(document).on("submit", "#saveJsonForm", function (e) {
//$('#saveJsonForm').submit(function(e) {
		e.preventDefault();
		
		update_all_tech_io_f_id();	
		update_var();
		
		var modelJsonFileName = document.getElementById("modelJsonFileName").value;	
		save_json(modelJsonFileName,'http://'+localhost+'/php_process/general_save_json.php','',0,'');	
		//json.general.modelJsonFileName=modelJsonFileName;
		json_editor_update();
		alert( "File saved : " + modelJsonFileName );
});

$(document).on('click', '.fa', function(e) {
//$('.fa').click(function (e) {
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

function json_editor_update(){
	var div = document.getElementById('jsoneditor');
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}	
	var editor = new JSONEditor(container, options, json);	
}

function general_change(btn){
	var cur_name=$(btn).attr('name');
	var val=$(btn).val();
	var prev=json.general[cur_name];
    if (val==''){
        $(btn).val(prev);
    }else{
		if (cur_name=="drate"){
			json.general[cur_name]=parseFloat(val);
		}else if(cur_name=="fyear" || cur_name=="lyear"){
			json.general[cur_name]=parseInt(val);
		}else{  // excelFileName, sheetName
			json.general[cur_name]=val;
		} 
	}
	//json_editor_update();
}

//$('#changedInputFile').on("change", function(){ 
$(document).on('change', '#changedInputFile', function() {
    var input = $(this),
    numFiles = input.get(0).files ? input.get(0).files.length : 1,
    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    $('#jsonFileName').val(label);
	var urlname='http://'+localhost+'/php_process/read_json_file.php?menu=firstReadJson&jsonFileName=json/'+label;
	read_json(urlname);
	json=from_ajax_data;
	populate_json();	
	//json.general.modelJsonFileName=label;
	document.getElementById("modelJsonFileName").value=label; 
	//json_editor_update();	
});

function save_json(modelJsonFileName,url_loc,menu1,f_id1,newRange1){
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError  
		cache:false,
        async: false,
        url: url_loc,
        data: { data: JSON.stringify(json), fileName: 'json/'+ modelJsonFileName, menu:menu1, f_id:f_id1, newRange:newRange1},
//        data: { data: JSON.stringify(json_obj), fileName: 'model1.json' },
		dataType: 'json',
        success: function(data) {		 
		  //console.log('success',data); 
		  json=data;
		 // json=JSON.parse(data);
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "Data Saved: " + modelJsonFileName + " msg : " + msg );
	//	alert("Data Saved: " + modelJsonFileName + " msg : " + msg);
    });	
}
function populate_json(){	
	populate_general();
	update_all_ts('energyLevels');
	populate_energy_form();
	update_all_ts('techLevels');
	populate_technology();
	populate_variable();
	populate_contraint_short_type1();
	populate_contraint_type1();
	populate_contraint_type2();
	populate_contraint_type3();
}

function populate_general(){
	document.getElementById("drate").value=json.general.drate;
	document.getElementById("fyear").value=json.general.fyear;
	document.getElementById("lyear").value=json.general.lyear;	
	document.getElementById("excelFileName").value=json.general.excelFileName;	
	document.getElementById("sheetName").value=json.general.sheetName;	
	//document.getElementById("autoDraw").checked=json.RESdraw.autoDraw;
	$("#lpObjUl").find('li').remove();
	$("#lpConstraintLi").find('li').remove();
	var eq="\\displaystyle\\ \\min z= \\mathbf{cx}"
//	+"z= \\sum_{i\\in I} \\sum_{t\\in T} {I_i^t y_i^t}"
			//+"+\\sum_{i\\in I} \\sum_{t\\in T} {F_i^t y_i^t}"
			//+"+\\sum_{i\\in I} \\sum_{t\\in T} \\frac{V_i^t}{e_i^t} x_i^t"
//			+"+\\sum_{i\\in I_m} \\sum_{t\\in T} \\frac{V_i^t}{e_i^t} x_i^t"
//+"+\\sum_{i\\in I\\setminus I_m} \\sum_{(i,a) \\in A_i}  \\sum_{t\\in T} \\frac{V_{(i,a)}^t}{e_{(i,a)}^t} x_{(i,a)}^t"
	var el=$("#lpObjUl").closest('.ef').find('.math').get(0);
	katex.render(eq,el);
	eq="\\displaystyle\\ \\mathbf{Ax} \\geq \\mathbf{b},  \\mathbf{x} \\geq \\mathbf{0}";
	el=$("#lpConstraintLi").find('.math').get(0);
	katex.render(eq,el);
	
}

function get_html_ef(el,ef){
	var hasLoadRegion=ef.hasLoadRegion? '<input type="checkbox" class="hasLoadRegion" checked/>' : '<input type="checkbox" class="hasLoadRegion"/>';
	var eq=ef.eq? '<input type="checkbox" class="eq" checked/>' : '<input type="checkbox" class="eq"/>';
	var removeButton=(el.energyForms.length==1)?removeButton='disabled="disabled"':'';
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
function populate_energy_form(){
// make energy form table	

	if (!json.energyLevels[json.energyLevels.length-1].isDemand){
		alert(' energy level : demand must locate at the last energy level');
		return;
	}
	$("#tree_for_el_ef>li").remove();
	var tree_for_el_ef = $('#tree_for_el_ef');
	var cur_f_id=1;
	for (var i = 0; i < json.energyLevels.length; i++) {
		var arr_l_id=i;
		var el=json.energyLevels[i];
		el.l_id=(i+1);
		var el_li=$('<li/>').addClass('energyLevels');
		var elAddRemoveButton;
		if (arr_l_id<(json.energyLevels.length-1)){
			elAddRemoveButton='<span class="aligh_button">'
								+'<input type="button" value="Add" class="el_button el_after" onclick="add_el_after(this)">'
								+'<input type="button" value="Remove" class="el_button" onclick="remove_el(this)">'
							+'</span>';			
		}else elAddRemoveButton='';
		el_li.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i>'
							+'</span><span contenteditable data-type="name" class="name editable">'+el.name+'</span>'
							+'<span class="label">l_id</span><span class="id">'+el.l_id+'</span>'
							+elAddRemoveButton);
		var el_ul=$('<ul/>');

		for (var j = 0; j <el.energyForms.length; j++){
			var ef=el.energyForms[j];
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


$(document).on('click', '#tree_for_el_ef .hasLoadRegion, #tree_for_el_ef .eq', function () {
	var arr_l_id=parseInt($(this).closest('.energyLevels').find('.id').html())-1;
	//console.log($(this).closest('.energyLevels').find('.id').html());
	var arr_f_id=-1;
	var f_id=parseInt($(this).closest('.ef').find('.id').html());
	for (var i=0;i<json.energyLevels[arr_l_id].energyForms.length;i++){
		var cur_f_id=json.energyLevels[arr_l_id].energyForms[i].f_id;
		if (cur_f_id==f_id){
			arr_f_id=i;
			break;
		}
	}
	if (arr_f_id<0){alert('f_id not found in l_id=' +(arr_l_id+1)+ ', f_id='+f_id); return;}
	
	var col_id=$(this).attr('class');

	if (col_id=='hasLoadRegion' || col_id=='eq'){
		var cur_state=json.energyLevels[arr_l_id].energyForms[arr_f_id][col_id];
		if (cur_state){
			$(this).prop('checked', false);
			json.energyLevels[arr_l_id].energyForms[arr_f_id][col_id]=false;
		}else{
			$(this).prop('checked', true);
			json.energyLevels[arr_l_id].energyForms[arr_f_id][col_id]=true;
		}		
	}
//	json_editor_update();

});

$(document).on('click', '#tree_for_variable input[name=is_ts_var]', function () {
		var eq=$(this).closest('li').find('.teXeq').text();
		var is_ts=$(this).is(':checked');
		var years=json.general.lyear-json.general.fyear+1;
		var eq = (is_ts)?eq+'^t, t\\in T':eq;
		//$(this).closest('li').find('.teXeq').text(eq);
		el=$(this).closest('li').find('.math').get(0);
		katex.render(eq,el);
	update_var_title_TeX();
});

$(document).on('change', 'input[type=radio][name=activityOrCapacity],input[type=radio][name=ioRadio]', function(){
	var isSolution=$(this).closest('.el').is("#solutionTopLi"); 
	if (isSolution) return;

	var el,eq;
	var is_exist_act=false;
	var isActivity=($(this).closest('ul').find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
	var isForInput=($(this).closest('ul').find('input[name=ioRadio]:checked').val()=='input')?true:false;
	var isType1=$(this).closest('.el').is("#type1_constaintLi"); 
	var isType3=$(this).closest('.el').is("#type3_constaintLi"); 
	
	if (isActivity){
		if (isForInput){
			if (isType1)	eq="\\displaystyle\\ \\sum_{i\\in I'}{a_i^t x_i^t \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";							
			else if (!isType3)	eq="\\displaystyle\\ \\sum_{i\\in I'}\\sum_{s=1}^t {a_i^s x_i^s \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";
			else eq="\\displaystyle\\ \\sum_{i \\in I'} \\sum_{s \\in S_i} {a_{(i,s)}^t x_i^{t+s} \\leq b^t} ,  S_i \\subseteq T\\cup\\{0,-1,\\cdots,\\}, I'\\subseteq I, t \\in T ";
		}else{
			if (isType1)	eq="\\displaystyle\\ \\sum_{i\\in I'}{a_i^t \\left(\\frac{1}{e_i^t} x_i^t\\right) \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";			
			else  if (!isType3)		eq="\\displaystyle\\ \\sum_{i\\in I'}\\sum_{s=1}^t {a_i^s \\left(\\frac{1}{e_i^s} x_i^s\\right)  \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";
			else eq="\\displaystyle\\ \\sum_{i \\in I'} \\sum_{s \\in S_i} {a_{(i,s)}^t \\left(\\frac{1}{e_{i}^{t+s}} x_i^{t+s}\\right) \\leq b^t} ,  S_i \\subseteq T\\cup\\{0,-1,\\cdots,\\}, I'\\subseteq I, t \\in T ";
		}
		$(this).closest('ul').find('input[type=radio][name=ioRadio]').attr("disabled",false); 
	}else{		
		if (isType1)	eq="\\displaystyle\\ \\sum_{i\\in I'}{a_i^t y_i^t \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";
		else  if (!isType3)	eq="\\displaystyle\\ \\sum_{i\\in I'}\\sum_{s=1}^t {a_i^s y_i^s \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";
			else eq="\\displaystyle\\ \\sum_{i \\in I'} \\sum_{s \\in S_i} {a_{(i,s)}^t y_i^{t+s} \\leq b^t} ,  S_i \\subseteq T\\cup\\{0,-1,\\cdots,\\}, I'\\subseteq I, t \\in T ";
		$(this).closest('ul').find('input[type=radio][name=ioRadio]').attr("disabled",true); 
	}	 
	el=$(this).closest('.el').find('.titleTexEq').get(0);
	katex.render(eq,el);
	
	$(this).closest('ul').find('table').find('tr').not(':first').not(':last').each(function(){
		var techVarName=$(this).find('td:first').text();
		var S_t;
		var initValue;
		if (isType3){
			initValue=$(this).find('td:eq(4)').text();
			S_t=parseInt($(this).find('td:eq(2)').text());
			//if (initValue) S_t0=parseInt(initValue.split(':')[0]);
		}
		var teXeq0='';
		var teXeq='';
		var temp=techVarName.split('/');
		var var_teXeq, var_sub, var_name, var_is_ts;
		if (isType3 && temp[0]=='variable'){	
			var temp1=temp[1].split('(');
			var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
			var_teXeq=json.variables[v_arr_id].teXeq;
			if (var_teXeq.indexOf('_')!=-1) var_name=var_teXeq.split('_')[0];
			else var_name=var_teXeq;
			if (var_teXeq.indexOf('_')!=-1) var_sub=var_teXeq.split('_')[1];			
			var_is_ts=json.variables[v_arr_id].is_ts;
		}

		if (temp.length==1 || temp[0]=='variable'){ // for technology or variable
			var temp1=techVarName.split('(');
			var t_id;
			if (temp[0]!='variable') t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
			if (temp[0]=='variable'){
				if (isType3){
					if (var_is_ts){
						teXeq0='';	
						if (S_t==0){
							teXeq='<span class="math equation">d_{('+(v_arr_id+1)+','+S_t+')}^t' +var_name+'_'+var_sub+'^t</span>';	
						}else if (S_t>0) teXeq='<span class="math equation">d_{('+(v_arr_id+1)+','+S_t+')}^t'+var_name+'_'+var_sub+'^{t+'+S_t+'}</span>';	
						else{
							teXeq='<span class="math equation">d_{('+(v_arr_id+1)+','+S_t+')}^t'+var_name+'_'+var_sub+'^{t'+S_t+'}</span>';	
							teXeq0='<span class="math equation">'+var_name+'_'+var_sub+'^{'+(S_t+1)+'}=</span>';	
						}
					}else{
						$(this).find('td:eq(4)').text(''); 
						$(this).find('td:eq(2)').text(''); 
						$(this).find('td:eq(1)').text(''); 
						initValue='';
						teXeq='<span class="math equation">d_'+(v_arr_id+1)+'^t' +var_teXeq+'</span>';	
					}					
				}
			}else{			
				if (isActivity){
					if (isForInput){
						if (isType1) teXeq='<span class="math equation">a_'+t_id+'^t x_'+t_id+'^t</span>';	
						else  if (!isType3) teXeq='<span class="math equation">\\sum_{s=1}^t a_'+t_id+'^s x_'+t_id+'^s</span>';	
						else{ 
								teXeq0='<span class="math equation">x_'+t_id+'^{'+(S_t+1)+'}=</span>';	
								if (S_t==0){
									teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t x_'+t_id+'^t</span>';	
								}else if (S_t>0) teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t x_'+t_id+'^{t+'+S_t+'}</span>';	
								else teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t x_'+t_id+'^{t'+S_t+'}</span>';
						}
					}else{
						if (isType1) teXeq='<span class="math equation">a_'+t_id+'^t((1/e_'+t_id+'^t) x_'+t_id+'^t)</span>';	
						else  if (!isType3) teXeq='<span class="math equation">\\sum_{s=1}^t a_'+t_id+'^s ((1/e_'+t_id+'^s) x_'+t_id+'^s)</span>';	
						else {
								teXeq0='';	
								if (S_t==0){
									teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t ((1/e_'+t_id+'^t) x_'+t_id+'^t)</span>';	
								}else if (S_t>0) teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t ((1/e_'+t_id+'^{t+'+S_t+'}) x_'+t_id+'^{t+'+S_t+'})</span>';	
								else{
									teXeq0='<span class="math eq0 equation">x_'+t_id+'^{'+(S_t+1)+'}=</span>';	
									teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t ((1/e_'+t_id+'^{t'+S_t+'}) x_'+t_id+'^{t'+S_t+'})</span>';
								}	
						}
					}									
				}else{
					if (isType1) teXeq='<span class="math equation">a_'+t_id+'^t y_'+t_id+'^t</span>';
					else  if (!isType3) teXeq='<span class="math equation">\\sum_{s=1}^t a_'+t_id+'^s y_'+t_id+'^s</span>';
					else {
							teXeq0='';	
							if (S_t==0){
								teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t y_'+t_id+'^t</span>';	
							}else if (S_t>0) teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t y_'+t_id+'^{t+'+S_t+'}</span>';	
							else{
								teXeq='<span class="math equation">a_{('+t_id+','+S_t+')}^t y_'+t_id+'^{t'+S_t+'}</span>';
								teXeq0='<span class="math equation">y_'+t_id+'^{'+(S_t+1)+'}=</span>';	
							}												
					}
				}
			}
		}
		
		if (temp.length>1 && temp[0]!='variable'){  // for activity
			var temp1=temp[0].split('(');
			is_exist_act=true;
			var t_id, a_id;
			if (temp[0]!='variable'){
				t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
				temp1=temp[1].split('(');
				a_id=parseInt(temp1[1].substr(0,temp1[1].length-1));				
			}
			if (isActivity){
				if (isForInput){
					if (isType1) {
						if(temp[0]!='variable')	teXeq='<span class="math equation">a_{('+t_id+','+a_id+')}^t x_{('+t_id+','+a_id+')}^t</span>';	
					}else  if (!isType3) {
						if(temp[0]!='variable')  teXeq='<span class="math equation">\\sum_{s=1}^t a_{('+t_id+','+a_id+')}^s x_{('+t_id+','+a_id+')}^s</span>';
					}else {
							teXeq0='';	
							if (S_t==0){
								teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t x_{('+t_id+','+a_id+')}^t</span>';	
							}else if (S_t>0) teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t x_{('+t_id+','+a_id+')}^{t'+S_t+'}</span>';	
							else{
								teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t x_{('+t_id+','+a_id+')}^{t'+S_t+'}</span>';	
								teXeq0='<span class="math eq0 equation">x_{('+t_id+','+a_id+')}^{'+(S_t+1)+'}=</span>';	
							}								
					}
				}else{
					if (isType1) {
						if(temp[0]!='variable') teXeq='<span class="math equation"> a_{('+t_id+','+a_id+')}^t (1/e_{('+t_id+','+a_id+')}^t) x_{('+t_id+','+a_id+')}^t</span>';	
					}else  if (!isType3){
						if(temp[0]!='variable') 	
							teXeq='<span class="math equation">\\sum_{s=1}^t a_{('+t_id+','+a_id+')}^s ((1/e_{('+t_id+','+a_id+')}^s) x_{('+t_id+','+a_id+')}^s)</span>';	
					}else {
							teXeq0='';	
							if (S_t==0){
								teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t ((1/e_{('+t_id+','+a_id+')}^t) x_{('+t_id+','+a_id+')}^t)</span>';	
							}else if (S_t>0) teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t ((1/e_'+t_id+'^{t+'+S_t+'}) x_'+t_id+'^{t+'+S_t+'})</span>';	
							else{
								teXeq0='<span class="math eq0 equation">x_{('+t_id+','+a_id+')}^{'+(S_t+1)+'}=</span>';	
								teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t ((1/e_{('+t_id+','+a_id+')}^{t'+S_t+'}) x_{('+t_id+','+a_id+')}^{t'+S_t+'})</span>';	
							}
					}
				}									
			}else{
				if (isType1) {
					if(temp[0]!='variable')	teXeq='<span class="math equation">a_{('+t_id+','+a_id+')}^t y_{('+t_id+','+a_id+')}^t</span>';
				}else  if (!isType3 ) {
					if(temp[0]!='variable') teXeq='<span class="math equation">\\sum_{s=1}^t a_{('+t_id+','+a_id+')}^s y_{('+t_id+','+a_id+')}^s</span>';
				}else {
						teXeq0='';	
						if (S_t==0){
							teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t y_{('+t_id+','+a_id+')}^t</span>';	
						}else if (S_t>0) teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t y_'+t_id+'^{t+'+S_t+'}</span>';	
						else{
							teXeq0='<span class="math eq0 equation">y_{('+t_id+','+a_id+')}^{'+(S_t+1)+'}=</span>';	
							teXeq='<span class="math equation">a_{(('+t_id+','+a_id+'),'+S_t+')}^t y_{('+t_id+','+a_id+')}^{t'+S_t+'}</span>';	
						}
				}
			} 
		}
		if (!isType3) {
			if(temp[0]!='variable'){
				$(this).find('td:eq(1)').html(teXeq);
				eq=$(this).find('td:eq(1)').find('.math').text();
			//	$(this).find('td:eq(1)').find('.math').attr('style','display:inline;');
				el=$(this).find('td:eq(1)').get(0);	
				katex.render(eq,el);
			}
		}else{
				if (initValue)	$(this).find('td:eq(3)').html(teXeq0);					
				else $(this).find('td:eq(3)').html('');	
				eq=$(this).find('td:eq(3)').find('.math').text();
				el=$(this).find('td:eq(3)').get(0);	
				katex.render(eq,el);		
				$(this).find('td:eq(5)').html(teXeq);
				eq=$(this).find('td:eq(5)').find('.math').text();
				el=$(this).find('td:eq(5)').get(0);		
				katex.render(eq,el);
		}			
	});
	
	if (this.name=='activityOrCapacity' && is_exist_act) {
		//$(this).closest('form').find('.context-menu-two').trigger('click');		
	}

});

function update_solution(this_sol,techArray){
	var isActivity=(this_sol.closest('ul').find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
	var isForInput=(this_sol.closest('ul').find('input[name=ioRadio]:checked').val()=='input')?true:false;
	var isAllCap=(this_sol.closest('ul').find('input[name=capType]:checked').val()=='allCap')?true:false;
	if (isActivity){
		this_sol.closest('ul').find('input[type=radio][name=ioRadio]').attr("disabled",false); 
		this_sol.closest('ul').find('input[type=radio][name=capType]').attr("disabled",true);
	}else{
		this_sol.closest('ul').find('input[type=radio][name=ioRadio]').attr("disabled",true); 
		this_sol.closest('ul').find('input[type=radio][name=capType]').attr("disabled",false);
	}

	var table=this_sol.closest('ul').find('table');
	$(table).find("tr:gt(0)").remove();
	var row='';
	for (var j=0;j<techArray.length;j++){
		row+='<tr><td style="min-width:140px;" class="techVarName">';
		var temp=techArray[j].split('/');
		if (temp[0]=='variable'){
			var temp1=temp[1].split('(');
			var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
			if (json.variables[v_arr_id].is_ts) row+=techArray[j]+'</td><td><span class="math equation">'+json.variables[v_arr_id].teXeq+'^t</span></td>';
			else row+=techArray[j]+'</td><td><span class="math equation">'+json.variables[v_arr_id].teXeq+'</span></td>';
			if (json.variables[v_arr_id].hasOwnProperty('sol')){
				if (json.variables[v_arr_id].is_ts){
					for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						row+='<td style="border: 1px solid black;">'+json.variables[v_arr_id].sol[k]+'</td>';
					}						
				}else{
					for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						if (k==0) row+='<td style="border: 1px solid black;">'+json.variables[v_arr_id].sol+'</td>';
						else  row+='<td style="border: 1px solid black;"></td>';
					}
				}
			}else{
				for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
					row+='<td style="border: 1px solid black;"></td>';
				}					
			}
		}else{		
			var t_id, a_id, arr_tl_id, arr_t_id;
			var temp1=temp[0].split('(');
			t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
				
			var cur_tech;
			for (var ii=0;ii<json.techLevels.length;ii++){
				var tl=json.techLevels[ii];
				if (t_id<=tl.techs[tl.techs.length-1].t_id){
					arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-t_id)-1;
					cur_tech=tl.techs[arr_t_id];
					ii=json.techLevels.length;
					break;
				}
			}
			
			
			if (isActivity){
				var a, a_id;
				if (temp.length==1) a=0;
				else{
					var temp1=temp[0].split('(');
					temp1=temp[1].split('(');
					a=parseInt(temp1[1].substr(0,temp1[1].length-1))-1;
					a_id=a+1;
				} 
				
				if (isForInput){
					if (temp.length==1) row+=techArray[j]+'</td><td><span class="math equation">x_'+t_id+'^t</span></td>';	
					else row+=techArray[j]+'</td><td><span class="math equation">x_{('+t_id+','+a_id+')}^t</span></td>';
					if (cur_tech.activities[a].sol_x!=null){
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.activities[a].sol_x[k]*1000)/1000)+'</td>';
						}						
					}else{
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							row+='<td style="border: 1px solid black;"></td>';
						}							
					}
				}else{
					var has_ts=false;
					var ts;
					if (cur_tech.activities[a].outputs[0].value.hasOwnProperty('ts')){
						has_ts=true;
						ts=cur_tech.activities[a].outputs[0].value.ts.split(',');
					}else ts=cur_tech.activities[a].outputs[0].value;
					
					if (temp.length==1) row+=techArray[j]+'</td><td><span class="math equation">e_'+t_id+'^t x_'+t_id+'^t</span></td>';	
					else row+=techArray[j]+'</td><td><span class="math equation">e_{('+t_id+','+a_id+')}^t x_{('+t_id+','+a_id+')}^t</span></td>';	
					for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						if (has_ts){
							if (cur_tech.activities[a].sol_x!=null)
								row+='<td style="border: 1px solid black;">'+(Math.floor((parseFloat(ts[k])*cur_tech.activities[a].sol_x[k])*1000)/1000)+'</td>';
							else row+='<td style="border: 1px solid black;"></td>';
						}else{
							if (cur_tech.activities[a].sol_x!=null)
								row+='<td style="border: 1px solid black;">'+(Math.floor((parseFloat(ts)*cur_tech.activities[a].sol_x[k])*1000)/1000)+'</td>';
							else row+='<td style="border: 1px solid black;"></td>';
						}
					}
				}									
			}else{
				if (isAllCap){
					row+=techArray[j]+'</td><td><span class="math equation">Y_'+t_id+'^t</span></td>';
					if (cur_tech.hasOwnProperty('sol_y') && cur_tech.sol_y!=null){
						if (cur_tech.capacity.hasOwnProperty('H')){
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								if (cur_tech.sol_y!=null)
									if (k<cur_tech.capacity.H.length)	
										row+='<td style="border: 1px solid black;">'+(Math.floor((cur_tech.sol_y[k]+cur_tech.capacity.H[k])*1000)/1000)+'</td>';
									else row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.sol_y[k]*1000)/1000)+'</td>';
								else
									if (k<cur_tech.capacity.H.length)	
										row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.capacity.H[k]*1000)/1000)+'</td>';
									else row+='<td style="border: 1px solid black;"></td>';
							}								
						}else{
							if (cur_tech.sol_y!=null)
								for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
									row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.sol_y[k]*1000)/1000)+'</td>';
								}												
							else
								for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
									row+='<td style="border: 1px solid black;"></td>';
								}												
						}
					}else{
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							row+='<td style="border: 1px solid black;"></td>';
						}											
					}						
				}else{
					row+=techArray[j]+'</td><td><span class="math equation">y_'+t_id+'^t</span></td>';
					if (cur_tech.hasOwnProperty('sol_y') && cur_tech.sol_y!=null){
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.sol_y[k]*1000)/1000)+'</td>';
						}				
					}else{
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							row+='<td style="border: 1px solid black;"></td>';
						}											
					}
				}
			}
		}
		row+='</tr>';					
	}
	
	$(table).append(row);	
	$(table).find('tr').not(':first').each(function(){
		var eq=$(this).find('.math').text();
		var el=$(this).find('.math').get(0);
		katex.render(eq,el);				
	});	
		
	
}
$(document).on('change', '#solutionTopLi input[type=radio][name=activityOrCapacity],' 
							+ '#solutionTopLi input[type=radio][name=ioRadio], #solutionTopLi input[type=radio][name=capType]', function(){
	

	var table=$(this).closest('ul').find('table');
	
	var techArray=[];
	$(table).find('tr').not(':first').each(function(){
		techArray.push($(this).find('td:first').text());
	});
	
	update_solution($(this),techArray);
	
});

function getExcelRange(excelRange){
	if (isNaN(excelRange)){
		var newRange=excelRange;
		var url_loc='http://'+localhost+'/php_process/get_ts.php?'
					+'&excelFileName='+json.general.excelFileName+'&sheetName='+json.general.sheetName+'&newRange='+newRange;
		read_json(url_loc);
		//json.energyLevels[arr_l_id].energyForms[arr_f_id].demand['ts']=from_ajax_data;
		//console.log(from_ajax_data);
		/*if (sizeof($ts)==1){
			for ($i=0; $i<$yearRange ;$i++)
				array_push($ts,$cur);
		}*/
		if (from_ajax_data.indexOf(',')==-1){
			var temp='';
			for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){ 
				if (t<(json.general.lyear-json.general.fyear)) temp+=from_ajax_data+',';
				else temp+=from_ajax_data;
			}
			from_ajax_data=temp;
		}		
	}else{
			var temp='';
			for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){ 
				if (t<(json.general.lyear-json.general.fyear)) temp+=excelRange+',';
				else temp+=from_ajax_data;
			}
			from_ajax_data=temp;		
	}

	return from_ajax_data;
}
$(document).on('focus', '#tree_for_el_ef [contenteditable],#tree_for_tech [contenteditable],'
						+'#tree_for_variable [contenteditable]', function() {
	contents=$(this).text();
});
$(document).on('blur', '#tree_for_el_ef [contenteditable],#tree_for_tech [contenteditable],'
						+ '#tree_for_variable [contenteditable]', function() {
	var dataType=$(this).data('type');
	var isTech=$(this).closest('#tree_for_tech').length?true:false;

	var arr_l_id=parseInt($(this).closest('.energyLevels').find('.id').html())-1;	
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
		if ($(this).closest('li').hasClass('energyLevels')){
			json.energyLevels[arr_l_id][dataType]=$(this).text();	
			changed_el_ef("change_el_name",arr_l_id, -1);
			make_contextmenu();
			//json_editor_update();
			return;
		}
		if ($(this).closest('li').hasClass('ef') || $(this).closest('li').hasClass('demand')){
			var  f_id=parseInt($(this).closest('.ef').find('.id').html());
			for (var i=0;i<json.energyLevels[arr_l_id].energyForms.length;i++){
				var cur_f_id=json.energyLevels[arr_l_id].energyForms[i].f_id;
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
					json.energyLevels[arr_l_id].energyForms[arr_f_id].demand['excelRange']=$(this).text();
					json.energyLevels[arr_l_id].energyForms[arr_f_id].demand['ts']=ts.toString();			
				}else {
					json.energyLevels[arr_l_id].energyForms[arr_f_id].demand=$(this).text();
					var cur_td=$(this).closest('td').next().next();
					
					var i=0;
					while($(cur_td).is('td')){
						$(cur_td).text($(this).text());
						i++;
						cur_td=$(cur_td).next();
					}				
				}
			}else {
				json.energyLevels[arr_l_id].energyForms[arr_f_id][dataType]=$(this).text();						
				changed_el_ef("change_ef_name",arr_l_id, arr_f_id);
				make_contextmenu();
			}				
			//json_editor_update();
			return;
		}		
	}
	
	if ($(this).closest('li').hasClass('techLevelLi')){
		json.techLevels[arr_l_id][dataType]=$(this).text();
		//json_editor_update();
		return;
	}
	if ($(this).closest('li').hasClass('techLi') || $(this).closest('li').hasClass('capacityLi')
		|| $(this).closest('li').hasClass('investmentCostLi') || $(this).closest('li').hasClass('fixedCostLi') || $(this).closest('li').hasClass('varCostLi')
		|| $(this).closest('li').hasClass('otherInputLi') || $(this).closest('li').hasClass('mainOutputLi') || $(this).closest('li').hasClass('otherOutputLi')
		|| $(this).closest('li').hasClass('histCapLi')
		|| $(this).closest('li').hasClass('histCapYearRange') || $(this).closest('li').hasClass('histCapCapRange')){
		var t_id=parseInt($(this).closest('.techLi').find('.id').html());
		var arr_t_id;
		for (var i=0;i<json.techLevels[arr_l_id].techs.length;i++){
				var cur_t_id=json.techLevels[arr_l_id].techs[i].t_id;
				if (cur_t_id==t_id){
					arr_t_id=i;
					break;
				}
		}
		if (dataType=='name'){
			json.techLevels[arr_l_id].techs[arr_t_id][dataType]=$(this).text();
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
		else json.techLevels[arr_l_id].techs[arr_t_id][dataType]=$(this).text();			
		//json_editor_update();
		return;		
	}
});
function validateRange(coordinate) {
    // A little input validation
	var cells=[];	
	var addr=[];
	if (coordinate.indexOf(":")>=0){
		cells=coordinate.split(':');		
	}else{
		cells.push(coordinate);
	}
	var first=second=false;
	for(var i=0;i<cells.length;i++){
		if (typeof cells[i] != "string" || !cells[i].length) 
			return false;
    // Find the first occurrence of a digit
		var startIndex = cells[i].search(/[\d+]/);
    // The column is the part from the beginning up until the first digit
		var column = cells[i].substring(0, startIndex).toUpperCase();
		addr.push(column);
    // The row is the remainder of the string
		var row = parseInt(cells[i].substring(startIndex), 10);
		addr.push(row);
    // The column is sortable alphabetically so we can check its range,
    // and the row is numeric so we can check it's range as well
		if (i==0 && (column >= "A"   && row >= 1) && (column <= "XFD" && row <= 1048576)){
			first=true;
			if (cells.length==1){
				return true;
			}			
		}
		if (i==1 && (column >= "A"   && row >= 1) && (column <= "XFD" && row <= 1048576))
			second=true;
		
	}
	if (first && second) return addr;
	else  return [];
}

function add_ef_after(btn) {
	var arr_l_id=parseInt($(btn).closest('.energyLevels').find('.id').html())-1;		
	var arr_f_id=-1;
	var f_id=parseInt($(btn).closest('.ef').find('.id').html());
	for (var i=0;i<json.energyLevels[arr_l_id].energyForms.length;i++){
			var cur_f_id=json.energyLevels[arr_l_id].energyForms[i].f_id;
			if (cur_f_id==f_id){
				arr_f_id=i;
				break;
			}
	}
	var PrevNoOfenergyForms=json.energyLevels[arr_l_id].energyForms.length;
	json.energyLevels[arr_l_id].energyForms.splice(arr_f_id,0,json.energyLevels[arr_l_id].energyForms[arr_f_id]);
	json=JSON.parse(JSON.stringify(json));  // make copy_by_value !!!!

	var cur_el_li=$(btn).closest('.energyLevels');
	var cur_ef_li=$(btn).closest('.ef');
	$(btn).closest('.ef').clone().insertAfter(cur_ef_li);
	if (PrevNoOfenergyForms==1){
		$(cur_el_li).find('.ef').find('[value=Remove]').removeAttr('disabled');
	}

	//f_id update
	for (var i=arr_l_id;i<json.energyLevels.length;i++){
		var cur_el=json.energyLevels[i];
		if (i==arr_l_id){
			if (cur_el.energyForms.length==2){
				$(cur_el_li).find('.ef').find('[value=Remove]').removeAttr('disabled');
			}
			for (var j = (arr_f_id+1); j <cur_el.energyForms.length; j++){
				cur_ef_li=$(cur_ef_li).next();
				cur_el.energyForms[j].f_id++;
				$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
			}			
		}else{
			for (var j = 0; j <cur_el.energyForms.length; j++){
				cur_el.energyForms[j].f_id++;
				$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
				if (j!=(cur_el.energyForms.length-1)){
					cur_ef_li=$(cur_ef_li).next();					
				}
			}							
		}
		cur_el_li=$(cur_el_li).next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}		
	
	changed_el_ef("add_ef",arr_l_id,arr_f_id);
	make_contextmenu();		
	//json_editor_update();

}
function remove_ef(btn) {
	var arr_l_id=parseInt($(btn).closest('.energyLevels').find('.id').html())-1;		
	var arr_f_id=-1;
	var f_id=parseInt($(btn).closest('.ef').find('.id').html());
	for (var i=0;i<json.energyLevels[arr_l_id].energyForms.length;i++){
			var cur_f_id=json.energyLevels[arr_l_id].energyForms[i].f_id;
			if (cur_f_id==f_id){
				arr_f_id=i;
				break;
			}
	}
	var cur_el=json.energyLevels[arr_l_id];
	
	cur_el.energyForms.splice(arr_f_id,1);
	
	var cur_el_li=$(btn).closest('.energyLevels');
	var cur_ef_li=$(btn).closest('.ef');


	if (arr_l_id==(json.energyLevels.length-1)){  // for demand level
		if (arr_f_id<cur_el.energyForms.length){
			cur_ef_li=$(btn).closest('.ef').next();
			for (var j = arr_f_id; j <cur_el.energyForms.length; j++){
				cur_el.energyForms[j].f_id--;
				$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
				if (j!=(cur_el.energyForms.length-1)){
					cur_ef_li=$(cur_ef_li).next();					
				}
			}
		}
		$(btn).closest('.ef').remove();
		if (cur_el.energyForms.length==1){
			$(cur_el_li).find('.ef').find('[value=Remove]').attr('disabled','disabled');
		}
		return;
	}

	if (cur_el.energyForms.length==1){
		$(cur_el_li).find('.ef').find('[value=Remove]').attr('disabled','disabled');
	}
	
	if (arr_f_id==(cur_el.energyForms.length)){
		cur_el_li=$(cur_el_li).next();
		cur_ef_li=$(cur_el_li).find('.ef');
		arr_l_id++;
		arr_f_id=0;
	}else{
		cur_ef_li=$(btn).closest('.ef').next();
	}
	$(btn).closest('.ef').remove();
	
	for (var i=arr_l_id;i<json.energyLevels.length;i++){
		var cur_el=json.energyLevels[i];
		if (i==arr_l_id){
			for (var j = arr_f_id; j <cur_el.energyForms.length; j++){
				cur_el.energyForms[j].f_id--;
				$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
				if (j!=(cur_el.energyForms.length-1)){
					cur_ef_li=$(cur_ef_li).next();					
				}
			}			
		}else{
			for (var j = 0; j <cur_el.energyForms.length; j++){
				cur_el.energyForms[j].f_id--;
				$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
				if (j!=(cur_el.energyForms.length-1)){
					cur_ef_li=$(cur_ef_li).next();					
				}
			}							
		}

		cur_el_li=$(cur_ef_li).closest('.energyLevels').next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}			
	
	changed_el_ef("remove_ef",arr_l_id,arr_f_id);
	make_contextmenu();	
	//json_editor_update();

}
function add_el_after(btn){
	var arr_l_id=parseInt($(btn).closest('.energyLevels').find('.id').html())-1;		
	var cur_el_li=$(btn).closest('.energyLevels');
	var cur_ef_li;

	json.energyLevels.splice(arr_l_id,0,json.energyLevels[arr_l_id]);
	json=JSON.parse(JSON.stringify(json));  // make copy_by_value !!!!
	var prev_el=json.energyLevels[arr_l_id];
	var cur_el=json.energyLevels[arr_l_id+1];
	cur_el.energyForms.splice(1,cur_el.energyForms.length-1);

	$(btn).closest('.energyLevels').clone().insertAfter(cur_el_li);

	cur_el_li=$(btn).closest('.energyLevels').next();
	var cur_ef=cur_el.energyForms[0];
	cur_ef.f_id+=prev_el.energyForms.length;
	var first_ef_li=$(cur_el_li).find('.ef');
	cur_el.l_id++;
	$(cur_el_li).find('.id').html(cur_el.l_id);
	$(first_ef_li).find('.id').html(cur_ef.f_id);
	$(first_ef_li).find('[value=Remove]').attr('disabled','disabled');
	
	if (prev_el.energyForms.length>1){
		cur_ef_li=$(first_ef_li).next();
		for (var j = 1; j <prev_el.energyForms.length; j++){			
			$(first_ef_li).next().remove();
			if (j!=(prev_el.energyForms.length-1)){
				cur_ef_li=$(first_ef_li).next();			
			}
		}
	}
	
	cur_el_li=$(cur_el_li).next();
	cur_ef_li=$(cur_el_li).find('.ef');

	for (var i=(arr_l_id+2);i<json.energyLevels.length;i++){		
		cur_el=json.energyLevels[i];
		cur_el.l_id++;
		$(cur_el_li).find('.id').html(cur_el.l_id);
		for (var j = 0; j <cur_el.energyForms.length; j++){
			cur_el.energyForms[j].f_id++;
			$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
			if (j!=(cur_el.energyForms.length-1)){
				cur_ef_li=$(cur_ef_li).next();			
			}
		}							
		cur_el_li=$(cur_el_li).next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}
 
	changed_el_ef("add_el",arr_l_id+2,0);
	make_contextmenu();	
	//json_editor_update();

	return;
	
}
function remove_el(btn) {
	var arr_l_id=parseInt($(btn).closest('.energyLevels').find('.id').html())-1;		
	var no_of_ef=json.energyLevels[arr_l_id].energyForms.length;
//	var last_f_id=json.energyLevels[arr_l_id].energyForms[no_of_ef-1].f_id;
	var cur_el_li=$(btn).closest('.energyLevels').next();
	var cur_ef_li=$(cur_el_li).find('.ef');
	
	json.energyLevels.splice(arr_l_id,1);
	$(btn).closest('.energyLevels').remove();

	//json update : l_id and f_id;	
	for (var i = arr_l_id; i < json.energyLevels.length; i++) {
		var cur_el=json.energyLevels[i];
		--cur_el.l_id;
		$(cur_el_li).find('.id').html(cur_el.l_id);
		if ((i+1)!=cur_el.l_id){
			alert('l_id error');
		}
		for (var j = 0; j <cur_el.energyForms.length; j++){
			cur_el.energyForms[j].f_id-=no_of_ef;
			$(cur_ef_li).find('.id').html(cur_el.energyForms[j].f_id);
			if (j!=(cur_el.energyForms.length-1)){
				cur_ef_li=$(cur_ef_li).next();					
			}
		}							
		cur_el_li=$(cur_ef_li).closest('.energyLevels').next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}

	changed_el_ef("remove_el",arr_l_id,no_of_ef);
	make_contextmenu();	
	//json_editor_update();
}
function changed_el_ef(menu,arr_l_id, arr_f_id){
	var el_name, el_id, ef_name, ef_id;
	switch(menu){
		case "change_el_name" : 
			var new_el_name=json.energyLevels[arr_l_id].name;
			$("#tree_for_tech .context-menu-one").each(function(){
				if ($(this).text()){
					var matches = $(this).text().split('(');
					var temp=matches[1].split(')');
					el_name=matches[0];
					el_id=parseInt(temp[0])-1;
					ef_name=temp[1].substring(1,temp[1].length);
					ef_id=parseInt(matches[2].substring(0, matches[2].length-1))-1;
					if (arr_l_id==el_id){
						var new_dd=new_el_name+'('+(el_id+1)+')'+'/'+ef_name+'('+(ef_id+1)+')';
						$(this).html(new_dd+'<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');	
					}
				}
			});
			break;
		case "change_ef_name" : 
			var new_ef_name=json.energyLevels[arr_l_id].energyForms[arr_f_id].name;
			$("#tree_for_tech .context-menu-one").each(function(){
				if ($(this).text()){
					var matches = $(this).text().split('(');
					var temp=matches[1].split(')');
					el_name=matches[0];
					el_id=parseInt(temp[0])-1;
					ef_name=temp[1].substring(1,temp[1].length);
					ef_id=parseInt(matches[2].substring(0, matches[2].length-1))-1;
					if (arr_f_id==ef_id){
						var new_dd=el_name+'('+(el_id+1)+')'+'/'+new_ef_name+'('+(ef_id+1)+')';
						$(this).html(new_dd+'<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');	
					}
				}
			});
			break;
		case "add_ef" : 
			var f_id=json.energyLevels[arr_l_id].energyForms[arr_f_id].f_id;
			$('#tree_for_tech').find('ul.ioUl .context-menu-one').each(function(){
				if ($(this).text()){
				  //  console.log('ttt='+$(this).text());
					var matches = $(this).text().split('(');
					var temp=matches[1].split(')');
					el_name=matches[0];
					el_id=parseInt(temp[0])-1;
					ef_name=temp[1].substring(1,temp[1].length);
					ef_id=parseInt(matches[2].substring(0, matches[2].length-1))-1;
					if ((f_id-1)<ef_id){
						var new_dd=el_name+'('+(el_id+1)+')'+'/'+ef_name+'('+(ef_id+2)+')';
						$(this).html(new_dd+'<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');	
					}
				}
			});
			break;
		case "remove_ef" :
			var f_id=json.energyLevels[arr_l_id].energyForms[arr_f_id].f_id;
			$("#tree_for_tech .context-menu-one").each(function(){
				var regExp = /\(([^)]+)\)/g;
				if ($(this).text()){
					var temp=$(this).text().split('/');
					var ef_name=temp[1].split('(');
					var matches = $(this).text().match(regExp);
					for (var i = 0; i < matches.length; i++) {
						var str = matches[i];
						matches[i]=parseInt(str.substring(1, str.length - 1));
						//console.log(str.substring(1, str.length - 1));
					}

					if (f_id<matches[1]){
							var new_dd=temp[0]+'/'+ef_name[0]+'('+(matches[1]-1)+')';
							$(this).html(new_dd+'<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');								
					}
					if (f_id==matches[1]){
						$(this).html('<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');

						var thisIO=$(this).closest('li');
						if (!$(thisIO).hasClass('mainInputLi')){
							var tl=$(this).closest('li.techLevelLi');
							var tl_id=parseInt($(tl).find('.id').html());
							var tech=$(this).closest('li.techLi'); 
							var t_id=parseInt($(tech).find('.id').html());
							var act=$(this).closest('li.activityLi'); 
							var a_id=parseInt($(act).find('.id').html());
							var ioUl=$(this).closest('ul.ioUl'); 
							var i_id, o_id;
								
							if ($(thisIO).hasClass('otherInputLi')){
								i_id=parseInt($(thisIO).find('.id').html());
								$(thisIO).nextAll('.otherInputLi').each(function(){
										var cur=parseInt($(this).find('.id').html());
										$(this).find('.id').html(cur-1);
								});
								$(thisIO).remove();
							}else if ($(thisIO).hasClass('mainOutputLi')){
								o_id=parseInt($(thisIO).find('.id').html());
								
								console.log("Time until table: ", Date.now()-timerStart);
								var start=Date.now()-timerStart;
								var table=$(thisIO).find('table tr');							
								table.remove();
								var firstRow='<tr><td>excel range</td><td>year</td>';							
								var secondRow='<tr><td>'
											+'<span contenteditable data-type="outputValueRange" class="excelRange editable cost">'
											+'</span></td><td>value</td>';									
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
									secondRow += '<td style="border: 1px solid black;"></td>';
								}	
								firstRow+='</tr>';
								secondRow+='</tr>';
								table.append(firstRow);								
								table.append(secondRow);								
								

								var end=Date.now()-timerStart;
								console.log("Time after table row delete: ", end-start);
							}else if ($(thisIO).hasClass('otherOutputLi')){
								o_id=parseInt($(thisIO).find('.id').html());
								$(thisIO).nextAll('.otherOutputLi').each(function(){
										var cur=parseInt($(this).find('.id').html());
										$(this).find('.id').html(cur-1);
								});
								$(thisIO).remove();
							}
							
						}
					}
				}


			});
			break;
		case "add_el" :
			var l_id=arr_l_id;
			var f_id=json.energyLevels[arr_l_id].energyForms[arr_f_id].f_id-1;
			$("#tree_for_tech .context-menu-one").each(function(){
				var regExp = /\(([^)]+)\)/g;
				if ($(this).text()){
					var temp=$(this).text().split('/');
					var el_name=temp[0].split('(');
					var ef_name=temp[1].split('(');
					var matches = $(this).text().match(regExp);
					for (var i = 0; i < matches.length; i++) {
						var str = matches[i];
						matches[i]=parseInt(str.substring(1, str.length - 1));
					//	console.log(str.substring(1, str.length - 1));
					}
					if (l_id<=(matches[0]) && f_id<=matches[1]){
						var new_dd=el_name[0] +'('+(matches[0]+1)+')/'+ef_name[0]+'('+(matches[1]+1)+')';
						$(this).html(new_dd+'<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');	
					}
				}
			});
			break;
		case "remove_el" :
			var no_of_ef=arr_f_id;
			var l_id=arr_l_id+1;
			$("#tree_for_tech .context-menu-one").each(function(){
				var regExp = /\(([^)]+)\)/g;
				if ($(this).text()){
					var temp=$(this).text().split('/');
					var el_name=temp[0].split('(');
					var ef_name=temp[1].split('(');
					var matches = $(this).text().match(regExp);
					for (var i = 0; i < matches.length; i++) {
						var str = matches[i];
						matches[i]=parseInt(str.substring(1, str.length - 1));
						//console.log(str.substring(1, str.length - 1));
					}
					if (l_id==matches[0]){
						$(this).html('<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');	

						var thisIO=$(this).closest('li');
						if (!$(thisIO).hasClass('mainInputLi')){
							var tl=$(this).closest('li.techLevelLi');
							var tl_id=parseInt($(tl).find('.id').html());
							var tech=$(this).closest('li.techLi'); 
							var t_id=parseInt($(tech).find('.id').html());
							var act=$(this).closest('li.activityLi'); 
							var a_id=parseInt($(act).find('.id').html());
							var ioUl=$(this).closest('ul.ioUl'); 
							var i_id, o_id;
								
							if ($(thisIO).hasClass('otherInputLi')){
								i_id=parseInt($(thisIO).find('.id').html());
								$(thisIO).nextAll('.otherInputLi').each(function(){
										var cur=parseInt($(this).find('.id').html());
										$(this).find('.id').html(cur-1);
								});
								$(thisIO).remove();
							}else if ($(thisIO).hasClass('mainOutputLi')){
								o_id=parseInt($(thisIO).find('.id').html());
								// delete table value
								var start=Date.now()-timerStart;
								var table=$(thisIO).find('table tr');							
								table.remove();
								var firstRow='<tr><td>excel range</td><td>year</td>';							
								var secondRow='<tr><td>'
											+'<span contenteditable data-type="outputValueRange" class="excelRange editable cost">'
											+'</span></td><td>value</td>';									
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
									secondRow += '<td style="border: 1px solid black;"></td>';
								}	
								firstRow+='</tr>';
								secondRow+='</tr>';
								table.append(firstRow);								
								table.append(secondRow);								
							}else if ($(thisIO).hasClass('otherOutputLi')){
								o_id=parseInt($(thisIO).find('.id').html());
								$(thisIO).nextAll('.otherOutputLi').each(function(){
										var cur=parseInt($(this).find('.id').html());
										$(this).find('.id').html(cur-1);
								});
								$(thisIO).remove();
							}
						}

					}
					if (l_id<matches[0]){
						var new_dd=el_name[0] +'('+(matches[0]-1)+')/'+ef_name[0]+'('+(matches[1]-no_of_ef)+')';
						$(this).html(new_dd+'<i class=\"fa fa-caret-square-o-right\" style=\"font-size: 12px;\"></i>');	

					}
				}
				
				
				
			});
			break;
		
	}
}

$(function() { // context-menu
    $.contextMenu({
        selector: '.context-menu-one', 
		trigger: 'left',
		build: function($trigger, e) {
        // this callback is executed every time the menu is to be shown
        // its results are destroyed every time the menu is hidden
        // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            return {
                callback: function(key, options) {
					if (key=='fold_deselect'){key='';} 
					$(this).parent().children(':first-child').html(key+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i>');
                },
                items: menu
            };
		}
    });

    $('.context-menu-one').on('click', function(e){
		var $this = $(this);
		// store a callback on the trigger
		var _offset = $this.offset(),
			position = {
				x: _offset.left + 10, 
				y: _offset.top + 10
			}
    // open the contextMenu asynchronously
    //  setTimeout(function(){ $this.contextMenu(position); }, 1000);	
   })    
   
	var prev=[];   
	$.contextMenu({
        selector: '.context-menu-two',
		trigger: 'left',
		build: function($trigger, e) {
        // this callback is executed every time the menu is to be shown
        // its results are destroyed every time the menu is hidden
        // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            return {
                callback: function(key, options) {
                },
                items: menu2
            }
		},
		events: {
			show : function(options){   //"cut": {name: "Disabled", icon: "cut", disabled: true}
				var selected=[];
				var is_short_type1=false;
				if ($(this).closest('li.constraint').hasClass("short_type1")){
					is_short_type1=true;	
				}
				var isActivity;
				if (is_short_type1){
					var short_label=$(this).closest('li.constraint').find('.label').text().split('/')[0];
					isActivity=(short_label=='activity')?true:false;
				}else{
					isActivity=($(this).closest('li.constraint').find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
				}
				var isSolution=$(this).closest('li').parent().is('#solutionUl');

				var rows;
				if(is_short_type1 || isSolution) rows=$(this).closest('li.constraint').find('table tbody').find('tr').not(':first');
				else rows=$(this).closest('li.constraint').find('table tbody').find('tr').not(':first').not(':last');
				$(rows).each(function(){
				//	console.log($(this).find('td:first').text());
					var name=$(this).find('td:first').text();
					var temp=name.split('/');
					
					if (temp[0]=='variable'){
						if (selected.indexOf(temp[1])==-1) selected.push(temp[1]);
					}else if (selected.indexOf(name)==-1) selected.push(name);
					if (rows.length==selected.length)
						return false;
				});
				
				var first_act_tech_name=[];
				$.each(options.inputs, function (key) {
					if (selected.indexOf($(this)[0].name)!=-1){
						$(this)[0].selected=true;						
					};

					$(this)[0].disabled=false;
					var name=key.split('/');
					if (name.length>2){
						is_first_act++;
						if(isActivity){
							if (is_first_act==1){
								first_act_tech_name.push($(this)[0].$node[0].previousSibling.innerText);
							}
						}else{
							$(this)[0].selected=false;	
							$(this)[0].disabled=true;
						}							
					}else{
						is_first_act=0;
					}
				});
				if (isActivity){
					$.each(options.inputs, function (key) {
						if (first_act_tech_name.indexOf($(this)[0].name)!=-1){
							$(this)[0].selected=false;	
							$(this)[0].disabled=true;							
						}
					});
				}
				prev=selected;
			},
			hide : function(options){	
				var selected=[]; //$(".bar:first").is("#foo"); 
				var is_short_type1=($(this).closest('li.constraint').hasClass("short_type1"))?true:false;
				$.each(this.data().contextMenu.inputs, function (key){
					if ($(this)[0].selected){
						var temp=key.split('/');
						if (temp[0]=='variable') 
							selected.push(key);
						else selected.push($(this)[0].name);						
					}
				});
				
				var is_the_same=true;
				if (selected.length==prev.length){
					for (i=0;i<selected.length;i++){
						var temp=selected[i].split('/');
						if (temp[0]=='variable'){
							if (temp[1]!=prev[i]){
								is_the_same=false;
								break;
							}
						}else if (selected[i]!=prev[i]){
							is_the_same=false;
							break;
						}
					}
					if (is_the_same) 
						return;   // prev and selected are the same
				}
				
				
				var table=$(this).closest('li.constraint').find('table tbody');
				if (is_short_type1){
				//	prev=JSON.stringify(prev);
					var rows=$(this).closest('li.constraint').find('table tbody').find('tr').not(':first');
					$(rows).each(function(){
						var cur_row_name=$(this).find('td:first').text();
						if (selected.indexOf(cur_row_name)==-1){
							$(this).remove();
							var temp=cur_row_name.split('/');							
							var index;
							if (temp[0]=='variable')	index=prev.indexOf(temp[1]);
							else index=prev.indexOf(cur_row_name);
							prev.splice(index,1);
						}						
					});
					for (var i=0;i<selected.length;i++){
						var temp=selected[i].split('/');
						var cur_name;
						var cur_tech={};
						if (temp[0]=='variable'){
							cur_name=temp[1];
							var temp1=temp[1].split('(')[1];
							var dummy_id=parseInt(temp1.split(')')[0])-1;
							if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
							else cur_tech.is_ts=false;
						}else cur_name=selected[i];
						if (prev.indexOf(cur_name)==-1){
							var tr;
							if (cur_tech.hasOwnProperty('is_ts') && !cur_tech.is_ts){
								tr=	'<tr><td align="left"  style="border-right:1px solid black;" class="techVarName">'+selected[i]+'</td>'
											+'<td><span contenteditable class="excelRange"></span></td>'
											+'<td style="border-right:1px solid black;"><input name="addToLP" style="margin-left:1px;" type="checkbox"></td>'
											+'<td><span contenteditable class="excelRange"></span></td>'
											+'<td style="border-right:1px solid black;"><input name="addToLP" style="margin-left:1px;" type="checkbox"></td>'
											+'<td></td>'
											+'<td><span contenteditable class="excelRange"></span></td>'
											+'<td><input name="addToLP" style="margin-left:1px;" type="checkbox"></td>'
									+'</tr>';
							}else{ 
								tr=	'<tr><td align="left"  style="border-right:1px solid black;" class="techVarName">'+selected[i]+'</td>'
											+'<td><span contenteditable class="excelRange"></span></td>'
											+'<td style="border-right:1px solid black;"><input name="addToLP" style="margin-left:1px;" type="checkbox"></td>'
											+'<td><span contenteditable class="excelRange"></span></td>'
											+'<td style="border-right:1px solid black;"><input name="addToLP" style="margin-left:1px;" type="checkbox"></td>'
											+'<td><span contenteditable class="excelMatrixRange"></span></td>'
											+'<td><span contenteditable class="excelMatrixRange"></span></td>'
											+'<td><input name="addToLP" style="margin-left:1px;" type="checkbox"></td>'
									+'</tr>';
							}
							if (i){
								var cur_row = $(table).find('tr:eq('+(i)+')');
								$(cur_row).after(tr);								
							}else{
								$(table).find('tr:first').after(tr);
							}
						}						
					}
					return;
				}
				
				$(this).closest('li.constraint').find('input[name=addToLP]').prop('checked',false);
				$(this).closest('li.constraint').find('.excelMatrixRange').text('');
				
				var isActivity=($(this).closest('li.constraint').find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
				var isForInput=($(this).closest('li.constraint').find('input[name=ioRadio]:checked').val()=='input')?true:false;
				var isType3=$(this).closest('li').parent().is('#type3_constaintUl');
				var isSolution=$(this).closest('li').parent().is('#solutionUl');
				
				if (isSolution){
					update_solution($(this),selected);
					return;
				} 
				//$(this).closest('li.constraint').find('.excelMatrixRange').text('');
				if 	(!isType3){
					$(table).find("tr:gt(0)").remove();
					var row='';
					for (var i=0;i<selected.length;i++){
						row+='<tr><td style="min-width:140px;" class="techVarName">';
						var temp=selected[i].split('/');
						if (temp[0]=='variable'){
							var temp1=temp[1].split('(');
							var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
							if (json.variables[v_arr_id].is_ts) row+=selected[i]+'</td><td><span class="math equation">d_'+(v_arr_id+1)+'^t'+json.variables[v_arr_id].teXeq+'^t</span></td>';
							else row+=selected[i]+'</td><td><span class="math equation">d_'+(v_arr_id+1)+'^t'+json.variables[v_arr_id].teXeq+'</span></td>';						
						} 
						else{
							row+=selected[i]+'</td>';
							if (temp.length==1){
								var temp1=selected[i].split('(');
								var t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
								if (isActivity){
									if (isForInput){
										row+=temp[1]+'</td><td><span class="math equation">x_'+t_id+'^t</span></td>';	
									}else{
										row+=temp[1]+'</td><td><span class="math equation">e_'+t_id+'^t x_'+t_id+'^t</span></td>';	
									}									
								}else row+=temp[1]+'</td><td><span class="math equation">y_'+t_id+'^t</span></td>';							
							}else{
								var temp1=temp[0].split('(');
								var t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
								temp1=temp[1].split('(');
								var a_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
								if (isActivity){
									if (isForInput){
										row+=temp[1]+'</td><td><span class="math equation">x_{('+t_id+','+a_id+')}^t</span></td>';		
									}else{
										row+=temp[1]+'</td><td><span class="math equation">e_{('+t_id+','+a_id+')}^t x_{('+t_id+','+a_id+')}^t</span></td>';	
									}								
								}else row+=temp[1]+'</td><td><span class="math equation">y_{('+t_id+','+a_id+')}^t</span></td>';	
							}
						} 
						for (j=0;j<(json.general.lyear-json.general.fyear+1);j++){
							row+='<td style="border: 1px solid black;"></td>';
						}
						row+='</tr>';					
					}
					row+='<tr><td style="min-width:120px;">';
					row+='RHS</td><td><span class="math equation">b^t</span></td>';	
					for (j=0;j<(json.general.lyear-json.general.fyear+1);j++){
						row+='<td style="border: 1px solid black;"></td>';
					}
					row+='</tr>';					
					$(table).append(row);	
					$(this).closest('form').find('table').find('tr').not(':first').each(function(){
						var eq=$(this).find('.math').text();
						var el=$(this).find('.math').get(0);
						katex.render(eq,el);				
					});
					$(this).closest('form').find('input[type=radio][name=activityOrCapacity]').trigger('change');
					return;
				} 
				
				//for isType3
				$(table).find('tr').not(':first').not(':last').each(function(){
					var cur_row_name=$(this).find('td:first').text();
					if (selected.indexOf(cur_row_name)==-1){
						$(this).remove();
						var temp=cur_row_name.split('/');
						var index;
						if (temp[0]=='variable') index=prev.indexOf(temp[1]);
						else index=prev.indexOf(selected[i]);
						if (index!=-1) prev.splice(index,1);
					}						
				});
				
				var prev_names=[];
				for (var i=0;i<selected.length;i++){
					var first_row=$(table).find('tr').eq(1).clone();
					prev_names.push(selected[i]);

					var temp=selected[i].split('/');					
					if (temp[0]=='variable'){						
						if (prev.indexOf(temp[1])!=-1) continue;
					}else{
						if (prev.indexOf(selected[i])!=-1) continue;						
					}

					var row_id=1;
					$(table).find('tr').not(':first').not(':last').each(function(){
						var name=$(this).find('td:first').text();
						if (prev_names.indexOf(name)==-1) return;
						row_id++;
					});
					var prev_tr=$(table).find('tr').eq(row_id-1);
					$(prev_tr).after(first_row);
					var cur_tr=$(prev_tr).next();
					$(cur_tr).find('td:first').text(selected[i]);
					$(cur_tr).find('.noOfS_i').text('1');
					$(cur_tr).find('.S_i').text('0');
					$(cur_tr).find('.initVarValue').text('');
					
				}
				$(this).closest('form').find('input[type=radio][name=activityOrCapacity]').trigger('change');
			}
		}
    });
	
    $('.context-menu-two').on('click', function(e){
		var $this = $(this);
		// store a callback on the trigger
		var _offset = $this.offset(),
			position = {
				x: _offset.left + 10, 
				y: _offset.top + 10
			}
    // open the contextMenu asynchronously
    //  setTimeout(function(){ $this.contextMenu(position); }, 1000);	
   });
   
});
function make_contextmenu(){
//http://swisnl.github.io/jQuery-contextMenu/ 	
	is_tech_menu=false;	
	menu={};
	for (var i = 0; i < json.energyLevels.length; i++) {
		var cur_el=json.energyLevels[i];
		var folder={};
		folder['name']=cur_el.name+'('+cur_el.l_id+')';
		var items={};
		for (var j = 0; j <cur_el.energyForms.length; j++){
			var cur_ef=cur_el.energyForms[j];
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
function make_tech_var_menu(){
//http://swisnl.github.io/jQuery-contextMenu/ 
//	selected_tech=[];
	menu2={};
	for (var i = 0; i < json.techLevels.length; i++) {
		var cur_tl=json.techLevels[i];
		var folder={};
		folder['name']=cur_tl.name+'('+cur_tl.tl_id+')';
		var items={};
		for (var j = 0; j <cur_tl.techs.length; j++){
			var cur_tech=cur_tl.techs[j];
			
			var sub_folder={},items0={};
			if (cur_tech.activities.length>1){
				sub_folder['name']=cur_tech.name+'('+cur_tech.t_id+')';
			} 
			for (k=0;k<cur_tech.activities.length; k++){
				var item={};				
				if (cur_tech.activities.length==1){
					item['name']=cur_tech.name+'('+cur_tech.t_id+')';					
					item['type']='checkbox';
					var key=cur_tl.name+'('+cur_tl.tl_id+')'+'/'+cur_tech.name+'('+cur_tech.t_id+')'+'_'+j;
					item['selected']=false;
					item['callback']=function(){ return false; };  //Keeping the Menu open 
					var events={};
					events['click']=function(e) { 
					    var $input = $(this);
						var $item = $input.closest('li');
						var data = $item.data();
						if ($(this).is(':checked')){
							data.contextMenu.inputs[data.contextMenuKey].selected=true;					
						}else{
							data.contextMenu.inputs[data.contextMenuKey].selected=false;					
						}
					};
					item['events']=events;
					items[key]=item;
				}else{
					if (k==0){
						item['name']=cur_tech.name+'('+cur_tech.t_id+')';					
						item['type']='checkbox';
						var key=cur_tl.name+'('+cur_tl.tl_id+')'+'/'+cur_tech.name+'('+cur_tech.t_id+')'+'_'+j;
						item['selected']=false;
						item['callback']=function(){ return false; };  //Keeping the Menu open 
						var events={};
						events['click']=function(e) { 
						    var $input = $(this);
							var $item = $input.closest('li');
							var data = $item.data();
							if ($(this).is(':checked')){
								data.contextMenu.inputs[data.contextMenuKey].selected=true;					
							}else{
								data.contextMenu.inputs[data.contextMenuKey].selected=false;					
							}
						};
						item['events']=events;
						items0[key]=item;						
					}
					
					var cur_act=cur_tech.activities[k];
					var item={};				
					item['name']=cur_tech.name+'('+cur_tech.t_id+')/'+cur_act.name+'('+(k+1)+')';					
					item['type']='checkbox';
					var key=cur_tl.name+'('+cur_tl.tl_id+')'+'/'+cur_tech.name+'('+cur_tech.t_id+')'+'_'+j
								+'/'+cur_act.name+'('+(k+1)+')';
					item['selected']=false;
					item['callback']=function(){ return false; };  //Keeping the Menu open 
					var events={};
					events['click']=function(e) { 
					    var $input = $(this);
						var $item = $input.closest('li');
						var data = $item.data();
						if ($(this).is(':checked')){
							data.contextMenu.inputs[data.contextMenuKey].selected=true;					
						}else{
							data.contextMenu.inputs[data.contextMenuKey].selected=false;					
						}
					};
					item['events']=events;
					items0[key]=item;
				}
			}
			if (cur_tech.activities.length>1){
				sub_folder['items']=items0;
				items['fold'+cur_tl.tl_id+'_'+cur_tech.t_id]=sub_folder;				
			} 
		}
		folder['items']=items;
		menu2['fold'+cur_tl.tl_id]=folder;
	}
	menu2['sep1']='---------';

	var folder={};
	folder['name']='variables';	
	var items={};
	for (var i = 0; i < json.variables.length; i++){
		var item={};		
		var cur_var=json.variables[i];
		item['name']=cur_var.name+'('+(i+1)+')';					
		item['type']='checkbox';
		var key='variable/'+cur_var.name+'('+(i+1)+')';
		item['selected']=false;
		item['callback']=function(){ return false; };  //Keeping the Menu open 
		var events={};
		events['click']=function(e) { 
		    var $input = $(this);
			var $item = $input.closest('li');
			var data = $item.data();
			if ($(this).is(':checked')){
				data.contextMenu.inputs[data.contextMenuKey].selected=true;					
			}else{
				data.contextMenu.inputs[data.contextMenuKey].selected=false;					
			}
		};
		item['events']=events;
		items[key]=item;
	}
	folder['items']=items;
	menu2['fold_variable']=folder;
}

function emptyCheck(obj) {
    var boolValue = true;
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop) && typeof obj[prop] === 'object'){
                boolValue = emptyCheck(obj[prop]);
				if (boolValue==false) return false;
            }else{
                return false;
            }
        }
    return boolValue; //returns an empty object
}

function update_all_ts(target){
	var start=Date.now()-timerStart;
    $.ajax
    ({
        type: "POST",
 		cache:false,
        async: false,
   //     url: url_loc,
        url: 'http://'+localhost+'/php_process/get_all_ts.php',
        data: { data: JSON.stringify(json), excelFileName:json.general.excelFileName, sheetName:json.general.sheetName,target:target},
//        data: { data: JSON.stringify(json_obj), fileName: 'model1.json' },
		dataType: 'json',
        success: function(data) {		 
		  json=data;
	//	  JSON.stringify(json.techLevels);
		 // json=JSON.parse(data);
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        console.log( "update_all_tech_ts done,  msg : " + msg );
	//	alert("Data Saved: " + modelJsonFileName + " msg : " + msg);
    });	
	
	var end=Date.now()-timerStart;
	console.log("Time after update_all_ts for json."+ target+": ", end-start);
}


function populate_technology(){

	$("#tree_for_tech>li").remove();
	var tree_for_tech = $('#tree_for_tech');
	var cur_t_id=1;
	for (var i = 0; i < json.techLevels.length; i++) {
		var arr_tl_id=i;
		var tl=json.techLevels[i];
		tl.tl_id=(i+1);
		var techLevelLi=$('<li/>').addClass('techLevelLi');
		techLevelLi.addClass('energyLevels')
		if (json.techLevels.length!=1){
			tlAddRemoveButton='<span class="aligh_button">'
								+'<input type="button" value="Add" class="el_button el_after" onclick="add_io_act_tech_tl(this)">'
								+'<input type="button" value="Remove" class="el_button" onclick="remove_io_act_tech_tl(this)">'
							+'</span>';			
		}else tlAddRemoveButton='<input type="button" value="Add" class="tl_button tl_after" onclick="add_io_act_tech_tl(this)">';
		techLevelLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
							+'<span contenteditable data-type="name" class="name editable">'+tl.name+'</span>'
							+'<span class="label">tl_id</span><span class="id">'+tl.tl_id+'</span>'
							+tlAddRemoveButton);							
							
							
		var techUl=$('<ul/>').addClass('techUl');
		for (var j = 0; j <tl.techs.length; j++){
			var tech=tl.techs[j];
			var arr_t_id=j;
			tech.t_id=cur_t_id;
			var techRemoveButton=(tl.techs.length==1)?techRemoveButton='disabled="disabled"':'';
			var techLi=$('<li style="margin-bottom:20px;" />').addClass('techLi');
				techLi.addClass('ef')
				techLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
						+'<span contenteditable data-type="name" class="name editable">'+tech.name+'</span>'
						+'<span class="label">t_id</span><span class="id">'+cur_t_id+'</span>'
						+'<span class="aligh_button">'
							+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
							+'<input type="button"' +techRemoveButton+ 'value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
						+'</span>');
				var capacityUl=$('<ul/>').addClass('capacityUl');
				var capacityLi=$('<li style="margin-bottom:10px;" />').addClass('capacityLi');
					$(capacityLi).css('margin-top','5px');
					var fyear='', lyear='', availiability='',lifetime='';
					if (tech.capacity.hasOwnProperty('fyear')){
						fyear=tech.capacity.fyear;
					}
					if (tech.capacity.hasOwnProperty('lyear')){
						lyear=tech.capacity.lyear;
					}
					if (tech.capacity.hasOwnProperty('availiability')){
						availiability=tech.capacity.availiability;
					}
					if (tech.capacity.hasOwnProperty('lifetime')){
						lifetime=tech.capacity.lifetime;
					}
					
					var capacityEmpty=emptyCheck(tech.capacity);
					var faType;
					if (capacityEmpty){
						faType='fa-plus-circle';
					}else  faType='fa-minus-circle';
					capacityLi.append('').html('<span class="bullet"><i class="fa ' +faType+ '" style="color:green"></i></span>'
									+'<span class="label" style="font-size:15px">capacity</span><br>'
									+'<span class="label"  style="margin-left:40px;">first year</span> <span contenteditable class="fyear year editable">'+fyear+'</span>'
									+'<span class="label">last year</span> <span contenteditable  class="lyear year editable">'+lyear+'</span>'
									+'<span class="label">plant factor[0,1]</span> <span contenteditable  class="availiability year editable">'+availiability+'</span>'
									+'<span class="label">lifetime</span> <span contenteditable  class="lifetime year editable">'+lifetime+'</span>');
					var investmentCostUl=$('<ul/>').addClass('investmentCostUl');
					var investmentCostLi=$('<li/>').addClass('demand');
					investmentCostLi.addClass('investmentCostLi');
					$(investmentCostLi).css('margin-top','5px');
					
					var investCostEmpty=(tech.capacity.inv_cost>0 || tech.capacity.inv_cost.hasOwnProperty('excelRange')  )?false:true;
					if (investCostEmpty){
						faType='fa-plus-circle';
					}else  faType='fa-minus-circle';
					investmentCostLi.append('').html('<span class="bullet"><i class="fa ' +faType+ '" style="color:green"></i></span>'
											+'<span class="label" style="font-size:15px">investment cost</span>');
						var investmentCostTableUl=$('<ul/>').addClass('investmentCostTableUl');						
							var tableString='<table class="histCap" width=80%>';
							var firstRow='<tr><td></td><td>year</td>';							
							var secondRow='';
							if (tech.capacity.inv_cost.hasOwnProperty('excelRange'))
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="invCostRange" class="excelRange editable cost">'+tech.capacity.inv_cost.excelRange +'</span></td><td>cost</td>';
							else if (tech.capacity.inv_cost!=0){
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="invCostRange" class="excelRange editable cost">'+tech.capacity.inv_cost+'</span></td><td>cost</td>';
							}
							else{
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="invCostRange" class="excelRange editable cost"></span></td><td>cost</td>';
							}
							for (var k=0;k<=(json.general.lyear-json.general.fyear);k++)
								firstRow += '<td style="border: 1px solid black;">' + (k+json.general.fyear) + '</td>';
							if (tech.capacity.inv_cost.hasOwnProperty('excelRange')){
								var ts=tech.capacity.inv_cost.ts.split(',');
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									if (ts.length<=i){
										secondRow += '<td style="border: 1px solid black;">' + ts[ts.length-1] + '</td>';
									}else secondRow += '<td style="border: 1px solid black;">' + ts[k] + '</td>';
								}
							}else if (typeof(tech.capacity.inv_cost)=='object'){							
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									secondRow += '<td style="border: 1px solid black;"></td>';
								}								
							}else{
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									secondRow += '<td style="border: 1px solid black;">'+tech.capacity.inv_cost+'</td>';
								}								
							}
							firstRow+='</tr>';
							secondRow+='</tr>';
							tableString+=firstRow+secondRow+'</table>';

						investmentCostTableUl.append('').html(tableString);						
						investmentCostLi.append(investmentCostTableUl);
					investmentCostUl.append(investmentCostLi);
					if(investCostEmpty) $(investmentCostTableUl).hide();
					capacityLi.append(investmentCostUl);
						
					var fixedCostUl=$('<ul/>').addClass('fixedCostUl');
					var fixedCostLi=$('<li/>').addClass('demand');
					fixedCostLi.addClass('fixedCostLi');
					$(fixedCostLi).css('margin-top','5px');
					
					//var fixedCostEmpty=emptyCheck(tech.capacity.fixed_cost);
					var fixedCostEmpty=(tech.capacity.fixed_cost>0 || tech.capacity.fixed_cost.hasOwnProperty('excelRange')  )?false:true;
					if (fixedCostEmpty){
						faType='fa-plus-circle';
					}else  faType='fa-minus-circle';
					fixedCostLi.append('').html('<span class="bullet"><i class="fa ' +faType+ '" style="color:green"></i></span>'
											+'<span class="label" style="font-size:15px">fixed cost</span>');
						var fixedCostTableUl=$('<ul/>').addClass('fixedCostTableUl');						
							tableString='<table class="histCap" width=80%>';
							firstRow='<tr><td></td><td>year</td>';							
							secondRow='';
							
							if (tech.capacity.fixed_cost.hasOwnProperty('excelRange'))
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="fixedCostRange" class="excelRange editable cost">'+tech.capacity.fixed_cost.excelRange +'</span></td><td>cost</td>';
							else if (tech.capacity.fixed_cost!=0){
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="fixedCostRange" class="excelRange editable cost">'+tech.capacity.fixed_cost+'</span></td><td>cost</td>';
							}
							else{
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="fixedCostRange" class="excelRange editable cost"></span></td><td>cost</td>';
							}
							for (var k=0;k<=(json.general.lyear-json.general.fyear);k++)
								firstRow += '<td style="border: 1px solid black;">' + (k+json.general.fyear) + '</td>';
							if (tech.capacity.fixed_cost.hasOwnProperty('excelRange')){
								var ts=tech.capacity.fixed_cost.ts.split(',');
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									if (ts.length<=i){
										secondRow += '<td style="border: 1px solid black;">' + ts[ts.length-1] + '</td>';
									}else secondRow += '<td style="border: 1px solid black;">' + ts[k] + '</td>';
								}
							}else if (typeof(tech.capacity.fixed_cost)=='object'){							
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									secondRow += '<td style="border: 1px solid black;"></td>';
								}								
							}else{
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									secondRow += '<td style="border: 1px solid black;">'+tech.capacity.fixed_cost+'</td>';
								}								
							}


							
							/*if (tech.capacity.fixed_cost.hasOwnProperty('excelRange'))
								secondRow='<tr><td>'
										+'<span contenteditable data-type="fixedCostRange" class="excelRange editable cost">'+tech.capacity.fixed_cost.excelRange +'</span></td><td>cost</td>';
							else{
								secondRow='<tr><td>'
										+'<span contenteditable data-type="fixedCostRange" class="excelRange editable cost"></span></td><td>cost</td>';
							}
							for (var k=0;k<=(json.general.lyear-json.general.fyear);k++)
								firstRow += '<td style="border: 1px solid black;">' + (k+json.general.fyear) + '</td>';
							if (tech.capacity.fixed_cost.hasOwnProperty('excelRange')){
								var ts=tech.capacity.fixed_cost.ts.split(',');
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									if (ts.length<=i){
										secondRow += '<td style="border: 1px solid black;">' + ts[ts.length-1] + '</td>';
									}else secondRow += '<td style="border: 1px solid black;">' + ts[k] + '</td>';
								}								
							}else{
								for (var k=0;k<=(json.general.lyear-json.general.fyear);k++){
									secondRow += '<td style="border: 1px solid black;"></td>';
								}								
							}*/
							
							
							
							firstRow+='</tr>';
							secondRow+='</tr>';
							tableString+=firstRow+secondRow+'</table>';
						fixedCostTableUl.append('').html(tableString);
						fixedCostLi.append(fixedCostTableUl);

					fixedCostUl.append(fixedCostLi);
					if(fixedCostEmpty) $(fixedCostTableUl).hide();
					capacityLi.append(fixedCostUl);

					var histCapUl=$('<ul/>').addClass('histCapUl');
					var histCapLi=$('<li/>').addClass('demand');
					histCapLi.addClass('histCapLi');
					$(histCapLi).css('margin-top','5px');
					var histCapEmpty=emptyCheck(tech.capacity.historic);
					if (histCapEmpty){
						faType='fa-plus-circle';
					}else  faType='fa-minus-circle';
					histCapLi.append('').html('<span class="bullet"><i class="fa ' +faType+ '" style="color:green"></i></span>'
											+'<span class="label" style="font-size:15px">historic capacity</span>');
						var histCapTableUl=$('<ul/>').addClass('histCapTableUl');						
							tableString='<table class="histCap" width=80%>';
							firstRow='';							
							secondRow='';
							if (tech.capacity.historic.year.hasOwnProperty('excelRange')){
								firstRow='<tr><td>'
										+'<span contenteditable data-type="histCapYearRange" class="excelMatrixRange editable cost">'+tech.capacity.historic.year.excelRange 
										+'</span></td><td>year</td>';
								secondRow='<tr><td>'
										+'<span contenteditable data-type="histCapCapRange" class="excelMatrixRange editable cost">'+tech.capacity.historic.cap.excelRange 
										+'</span></td><td>historic capacity</td>';
								yearArray=tech.capacity.historic.year.ts.split(',');
								capArray=tech.capacity.historic.cap.ts.split(',');
								for (var k=0;k<yearArray.length;k++){
									firstRow += '<td style="border: 1px solid black;">' + yearArray[k] + '</td>';
									secondRow += '<td style="border: 1px solid black;">' + capArray[k] + '</td>';
								}
							}else{
								firstRow='<tr><td>'
										+'<span contenteditable data-type="histCapRange" class="excelMatrixRange editable cost"></span></td><td>year</td>';
								secondRow='<tr><td>'
										+'<span contenteditable data-type="histCapRange" class="excelMatrixRange editable cost"></span></td><td>capacity</td>';
								for (var k=0;k<10;k++){
									firstRow += '<td style="border: 1px solid black;"></td>';
									secondRow += '<td style="border: 1px solid black;"></td>';
								}
							}
							firstRow+='</tr>';
							secondRow+='</tr>';
							tableString+=firstRow+secondRow+'</table>';
						histCapTableUl.append('').html(tableString);
						histCapLi.append(histCapTableUl);

					histCapUl.append(histCapLi);
					if(histCapEmpty) $(histCapTableUl).hide();
					capacityLi.append(histCapUl);					
					
					if(capacityEmpty){
						$(investmentCostUl).hide();
						$(fixedCostUl).hide();
						$(histCapUl).hide();
					} 
					
					capacityUl.append(capacityLi);
					
					
			var activityUl=$('<ul/>').addClass('activityUl');
			for (var k=0;k<tech.activities.length;k++){
				var act=tech.activities[k];
				var activityLi=$('<li style="margin-bottom:5px;" />').addClass('activityLi');
				var act_name='activity';
				if (act.hasOwnProperty('name')){
					act_name='activity<span contenteditable data-type="name" class="name editable">'+act.name+'</span>'
				}else if (tech.activities.length>=2){
					act_name='activity<span contenteditable data-type="name" class="name editable"></span>'
				}
				var removeButton=(tech.activities.length==1)?removeButton='disabled="disabled"':'';
					$(activityLi).css('margin-top','5px');
					activityLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
									+'<span class="label actLabel" style="font-size:15px">'+act_name+'</span>'
									+'<span class="label">a_id</span><span class="id">'+(k+1)+'</span>'
									+'<span class="aligh_button">'
										+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
										+'<input type="button" '+removeButton+' value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
									+'</span>');	
					var ioUl=$('<ul/>').addClass('ioUl');
					
					
					//var varCostUl=$('<ul/>').addClass('varCostUl');
					var varCostLi=$('<li style="margin-bottom:5px;" />').addClass('demand');
					varCostLi.addClass('varCostLi');
					$(varCostLi).css('margin-top','5px');
//					var varCostEmpty=emptyCheck(act.var_cost);
					var varCostEmpty=(act.var_cost>0 || act.var_cost.hasOwnProperty('excelRange')  )?false:true;
					if (varCostEmpty){
						faType='fa-plus-circle';
					}else  faType='fa-minus-circle';
					varCostLi.append('').html('<span class="bullet"><i class="fa ' +faType+ '" style="color:green"></i></span>'
											+'<span class="label" style="font-size:15px">variable cost</span>');
						var varCostTableUl=$('<ul/>').addClass('varCostTableUl');						
							tableString='<table class="histCap" width=80%>';
							firstRow='<tr><td></td><td>year</td>';							
							secondRow='';
							
							
							if (act.var_cost.hasOwnProperty('excelRange'))
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="varCostRange" class="excelRange editable cost">'+act.var_cost.excelRange +'</span></td><td>cost</td>';
							else if (act.var_cost!=0){
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="varCostRange" class="excelRange editable cost">'+act.var_cost+'</span></td><td>cost</td>';
							}
							else{
								secondRow='<tr><td>'
										+'<span contenteditable  data-type="varCostRange" class="excelRange editable cost"></span></td><td>cost</td>';
							}
							for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++)
								firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
							if (act.var_cost.hasOwnProperty('excelRange')){
								var ts=act.var_cost.ts.split(',');
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									if (ts.length<=i){
										secondRow += '<td style="border: 1px solid black;">' + ts[ts.length-1] + '</td>';
									}else secondRow += '<td style="border: 1px solid black;">' + ts[k] + '</td>';
								}
							}else if (typeof(act.var_cost)=='object'){							
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									secondRow += '<td style="border: 1px solid black;"></td>';
								}								
							}else{
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									secondRow += '<td style="border: 1px solid black;">'+act.var_cost+'</td>';
								}								
							}

							
							/*if (act.var_cost.hasOwnProperty('excelRange'))
								secondRow='<tr><td>'
										+'<span contenteditable data-type="varCostRange" class="excelRange editable cost">'+act.var_cost.excelRange +'</span></td><td>cost</td>';
							else{
								secondRow='<tr><td>'
										+'<span contenteditable data-type="varCostRange" class="excelRange editable cost"></span></td><td>cost</td>';
							}
							for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++)
								firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
							if (act.var_cost.hasOwnProperty('excelRange')){
								var ts=act.var_cost.ts.split(',');
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									if (ts.length<=i){
										secondRow += '<td style="border: 1px solid black;">' + ts[ts.length-1] + '</td>';
									}else secondRow += '<td style="border: 1px solid black;">' + ts[kk] + '</td>';
								}								
							}else{
								for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
									secondRow += '<td style="border: 1px solid black;"></td>';
								}								
							}*/
							
							
							
							firstRow+='</tr>';
							secondRow+='</tr>';
							tableString+=firstRow+secondRow+'</table>';
						varCostTableUl.append('').html(tableString);
					   if(varCostEmpty) $(varCostTableUl).hide();
						varCostLi.append(varCostTableUl);

					ioUl.append(varCostLi);
					//capacityLi.append(varCostUl);
					
					
					if (act.inputs.length>0){ 
						for (var l=0;l<act.inputs.length;l++){
							var mainInputLi;
							if (l>0) mainInputLi=$('<li style="margin-top:5px;"/>').addClass('otherInputLi');
							else mainInputLi=$('<li/>').addClass('mainInputLi');
							var f_id_text='', found=false;
							if (act.inputs.length>0 && act.inputs[0].hasOwnProperty('f_id')){
								for (var ii = 0; ii < json.energyLevels.length; ii++) {
									for (var jj = 0; jj <json.energyLevels[ii].energyForms.length; jj++){
										if (json.energyLevels[ii].energyForms[jj].f_id== act.inputs[l].f_id){
											f_id_text=json.energyLevels[ii].name+'('+json.energyLevels[ii].l_id+')'
											+'/'+json.energyLevels[ii].energyForms[jj].name	+'('+json.energyLevels[ii].energyForms[jj].f_id+')';
											found=true;	break;
										}
									}
									if (found) break;
								}						
							}
							var i_id=1, otherInputRemove='';
							var inputText='<span class="mylabel" style="color:green;font-size:14px;">main input</span>';
							var mainInputValue='',otherBullet='';
							if (l>0){
								otherInputRemove='<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">';	
								inputText='<span class="mylabel">other input</span>';
								otherBullet='<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>';
								i_id=l+1;
							}else {i_id=1; mainInputValue='<span class="value">1.0</span>';}
							mainInputLi.append('').html(otherBullet+inputText
												+'<span class="mymargin"><span data-type="inputMenu" class="select_menu context-menu-one btn btn-neutral">'
												+f_id_text
													+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
													+mainInputValue+'<span class="label">i_id</span><span class="id">'+i_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
													+otherInputRemove
												+'</span>');
							
							if (l>0){
									var costTableUl=$('<ul/>').addClass('costTableUl');						
							      //  console.log('pp='+tech.name);
									var excel='';
									if (act.inputs[l].value.hasOwnProperty('excelRange')) excel=act.inputs[l].value.excelRange;
									else if (act.inputs[l].value>0) excel=act.inputs[l].value;
									
									var tableString='<table class="histCap" width=80%>';
										var firstRow='<tr><td></td><td>year</td>';							
										var secondRow='<tr><td>'
													+'<span contenteditable data-type="inputValueRange" class="excelRange editable cost">'
													+excel+'</span></td><td>value</td>';									
										var ts;
										if (act.inputs[l].value.hasOwnProperty('excelRange')) ts=act.inputs[l].value.ts.split(',');
										for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
											firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
											if (act.inputs[l].value.hasOwnProperty('excelRange')) secondRow += '<td style="border: 1px solid black;">' + ts[kk] + '</td>';
											else if (act.inputs[l].value!=0) secondRow += '<td style="border: 1px solid black;">' + act.inputs[l].value + '</td>';
										}	
										firstRow+='</tr>';
										secondRow+='</tr>';
										tableString+=firstRow+secondRow+'</table>';
									costTableUl.append('').html(tableString);
									
								mainInputLi.append(costTableUl);
								ioUl.append(mainInputLi);	
							}else ioUl.append(mainInputLi);						
						}
					}else{
							var i_id=1;
							var mainInputLi=$('<li/>').addClass('mainInputLi');
							mainInputLi.append('').html('<span class="mylabel" style="color:green;font-size:14px;">main input</span>'
												+'<span class="mymargin"><span  data-type="inputMenu" class="select_menu context-menu-one btn btn-neutral">'
													+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
												+'<span class="value">1.0</span></span><span class="label">i_id</span><span class="id">'+i_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="io_button io_after" onclick="add_io_act_tech_tl(this)">'
												+'</span>');
							ioUl.append(mainInputLi);	
					}
					
					if (act.outputs.length>0){ 
						for (var l=0;l<act.outputs.length;l++){
							var mainOutputLi;
							if (l>0) mainOutputLi=$('<li style="margin-top:5px;"/>').addClass('otherOutputLi');
							else mainOutputLi=$('<li  style="margin-top:10px;"/>').addClass('mainOutputLi');
							var f_id_text='', found=false;
							if (act.outputs[0].hasOwnProperty('f_id')){
								for (var ii = 0; ii < json.energyLevels.length; ii++) {
									for (var jj = 0; jj <json.energyLevels[ii].energyForms.length; jj++){
										if (json.energyLevels[ii].energyForms[jj].f_id== act.outputs[l].f_id){
											f_id_text=json.energyLevels[ii].name+'('+json.energyLevels[ii].l_id+')'
											+'/'+json.energyLevels[ii].energyForms[jj].name+'('+json.energyLevels[ii].energyForms[jj].f_id+')';
											found=true;	break;
										}
									}
									if (found) break;
								}
						
							}
							var o_id, otherOutputRemove='', outputText='<span class="mylabel" style="color:green;font-size:14px;">main output</span>';
							if (l>0){
								otherOutputRemove='<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">';	
								outputText='<span class="mylabel">other output</span>';
								o_id=l+1;
							}else {outputText='<span class="mylabel" style="color:green;font-size:14px;">main output</span>'; o_id=1;}
							mainOutputLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
												+outputText
												+'<span class="mymargin"><span class="select_menu context-menu-one btn btn-neutral">'
												+f_id_text+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
												+'<span class="label">o_id</span><span class="id">'+o_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
													+otherOutputRemove
												+'</span>');
							
							       // console.log('tt='+tech.name);
									var costTableUl=$('<ul/>').addClass('costTableUl');		
										var excel='';
										if (act.outputs[l].value.hasOwnProperty('excelRange')) excel=act.outputs[l].value.excelRange;
										else if (act.outputs[l].value>0) excel=act.outputs[l].value;
										var tableString='<table class="histCap" width=80%>';
										var firstRow='<tr><td></td><td>year</td>';							
										var secondRow='<tr><td>'
													+'<span contenteditable data-type="outputValueRange" class="excelRange editable cost">'
													+ excel +'</span></td><td>value</td>';									
										var ts;
										if (act.outputs[l].value.hasOwnProperty('excelRange')) ts=act.outputs[l].value.ts.split(',');
										for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
											firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
											if (act.outputs[l].value.hasOwnProperty('excelRange')) secondRow += '<td style="border: 1px solid black;">' + ts[kk] + '</td>';
											else if (act.outputs[l].value!=0) secondRow += '<td style="border: 1px solid black;">' + act.outputs[l].value + '</td>';
										}	
										firstRow+='</tr>';
										secondRow+='</tr>';
										tableString+=firstRow+secondRow+'</table>';
									costTableUl.append('').html(tableString);
									
								mainOutputLi.append(costTableUl);
								ioUl.append(mainOutputLi);	
												
						}
					}else{
							var mainOutputLi=$('<li/>').addClass('mainOutputLi');
							var outputText='<span class="mylabel" style="color:green;font-size:14px;">main output</span>';
							mainOutputLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
												+outputText
												+'<span class="mymargin"><span class="select_menu context-menu-one btn btn-neutral">'
												+f_id_text
													+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
												+'<span class="label">o_id</span><span class="id">'+o_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
												+'</span>');
							
									var costTableUl=$('<ul/>').addClass('costTableUl');						
										var tableString='<table class="histCap" width=80%>';
										var firstRow='<tr><td></td><td>year</td>';							
										var secondRow='<tr><td>'
													+'<span contenteditable data-type="outputValueRange" class="excelRange editable cost">'
													+'</span></td><td>value</td>';									
										for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
											firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
											secondRow += '<td style="border: 1px solid black;"></td>';
										}	
										firstRow+='</tr>';
										secondRow+='</tr>';
										tableString+=firstRow+secondRow+'</table>';
									costTableUl.append('').html(tableString);
									
								mainOutputLi.append(costTableUl);
								ioUl.append(mainOutputLi);	
					}
					
					
				activityLi.append(ioUl);
				activityUl.append(activityLi);				
			}		
					
					
			techLi.append(capacityUl);
			techLi.append(activityUl);			
			techUl.append(techLi);
			
			cur_t_id++;
		}
		techLevelLi.append(techUl);
		tree_for_tech.append(techLevelLi);
	}
}
function add_io_act_tech_tl(btn){	
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
							+'<span class="label">'+id_name+'</span><span class="id">'+cur_id+'</span>'
							+'<span class="aligh_button">'
								+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
								+'<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'	
							+'</span>');
		
		var costTableUl=$('<ul/>').addClass('costTableUl');						
			var tableString='<table class="histCap" width=80%>';
			var firstRow='<tr><td></td><td>year</td>';							
			var secondRow='<tr><td>'
						+'<span contenteditable data-type="inputValueRange" class="excelRange editable cost">'
						+'</span></td><td>value</td>';									
			for (var kk=0;kk<=(json.general.lyear-json.general.fyear);kk++){
				firstRow += '<td style="border: 1px solid black;">' + (kk+json.general.fyear) + '</td>';
				secondRow += '<td style="border: 1px solid black;"></td>';
			}	
			firstRow+='</tr>';
			secondRow+='</tr>';
			tableString+=firstRow+secondRow+'</table>';
		costTableUl.append('').html(tableString);
		
		otherInputLi.append(costTableUl);
		
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
	}else if ($(cur).hasClass('techLi')){
		cur.clone().insertAfter(cur);
		$(cur).next().find('.otherInputLi').remove();
		$(cur).next().find('.otherOutputLi').remove();		
		if ($(cur).closest('.techLi').length==2){
			$(cur).closest('.techLi').find('[value=Remove]').removeAttr('disabled');
		}

		$(cur).nextAll('.techLi').each(function(){			
			var id=parseInt($(this).find('.id').eq(0).text());
			$(this).find('.id').eq(0).text(id+1); 
		});	
		$(cur).closest('li.techLevelLi').nextAll('li.techLevelLi').each(function(){
			$(this).find('li.techLi').each(function(){
				var id=parseInt($(this).find('.id').eq(0).text());
				$(this).find('.id').eq(0).text(id+1);
			});		
		});	
		
	}else if ($(cur).hasClass('techLevelLi')){
		cur.clone().insertAfter(cur);
		$(cur).next().find('.techLi').not(':first').remove();
		$(cur).next().find('.otherInputLi').remove();
		$(cur).next().find('.otherOutputLi').remove();		
		if ($(cur).closest('.techLevelLi').length==2){
			$(cur).closest('.techLevelLi').find('[value=Remove]').removeAttr('disabled');
		}
		
		$(cur).next().find('li.techLi').find('[value=Remove]').eq(0).attr('disabled','disabled');	

		var last_id=parseInt($(cur).find('li.techLi').last().find('.id').eq(0).text());
		var is_first=true;
		$(cur).closest('li.techLevelLi').nextAll('li.techLevelLi').each(function(){
			var id=parseInt($(this).find('.id').eq(0).text());
			$(this).find('.id').eq(0).text(id+1);
			$(this).find('li.techLi').each(function(){
				var id=parseInt($(this).find('.id').eq(0).text());
				if (is_first){
					$(this).find('.id').eq(0).text(last_id+1);
					is_first=false;
				}else $(this).find('.id').eq(0).text(id+1);
			});		
		});	
		
	}  


}
function remove_io_act_tech_tl(btn){
	var cur=$(btn).closest('li');

	if ($(cur).hasClass('otherInputLi')){
		$(cur).nextAll('.otherInputLi').each(function(){
			var id=parseInt($(this).find('.id').html());
			$(this).find('.id').html(id-1);
		});
	}else if ($(cur).hasClass('otherOutputLi')){
		$(cur).nextAll('.otherOutputLi').each(function(){
			var id=parseInt($(this).find('.id').html());
			$(this).find('.id').html(id-1);
		});
	}else if ($(cur).hasClass('activityLi')){
		$(cur).nextAll('.activityLi').each(function(){
			var id=parseInt($(this).find('.id').eq(0).html());
			$(this).find('.id').eq(0).html(id-1);
		});
		if ($(cur).closest('li.techLi').find('.activityLi').length==2){
			$(cur).closest('li.techLi').find('.activityLi').each(function(){
				$(this).find('[value=Remove]').eq(0).attr('disabled','disabled');			
			});
			$(cur).closest('li.techLi').find('.activityLi').find('.actLabel').each(function(){
				$(this).html('activity');
			});
		}
	}else if ($(cur).hasClass('techLi')){
		$(cur).nextAll('.techLi').each(function(){
			var id=parseInt($(this).find('.id').eq(0).html());
			$(this).find('.id').eq(0).html(id-1);
		});
		var after_tl=$(btn).closest('li.techLevelLi').nextAll('li.techLevelLi');
		$(after_tl).each(function(){
			$(this).find('li.techLi').each(function(){
				var id=parseInt($(this).find('.id').eq(0).html());
				$(this).find('.id').eq(0).html(id-1);
			});		
		});		
		if ($(cur).closest('li.techLevelLi').find('.techLi').length==2){
			$(cur).closest('li.techLevelLi').find('.techLi').each(function(){
				$(this).find('[value=Remove]').eq(0).attr('disabled','disabled');			
			});
		}
	}else if ($(cur).hasClass('techLevelLi')){
		var no_of_tech=$(cur).find('.techLi').length;
		$(cur).nextAll('.techLevelLi').each(function(){
			var tl_id=parseInt($(this).find('.id').eq(0).html());
			$(this).find('.id').eq(0).html(tl_id-1);
			$(this).find('li.techLi').each(function(){
				var t_id=parseInt($(this).find('.id').eq(0).html());
				$(this).find('.id').eq(0).html(t_id-no_of_tech);
			});		
		});
		if ($('#tree_for_tech').find('li.techLevelLi').length==2){
			$('#tree_for_tech').find('.techLevelLi').each(function(){
				$(this).find('[value=Remove]').eq(0).attr('disabled','disabled');			
			});
		}		
	}
	$(cur).remove();	
}
function update_all_tech_io_f_id(){
	
	json.techLevels.length=0;
	var tls=[], tl={}, techs=[], tech={},
	    capacity={}, inv={}, fix={}, hist={}, year={}, cap={},
		acts=[], act={}, var_c={}, inps=[], inp={}, outs=[], out={}, val={};
	

	$('#tree_for_tech').find('li.techLevelLi').each(function(){
		tl={}; 
		tl.name=$(this).find('.name').eq(0).html();
		tl.tl_id=parseInt($(this).find('.id').eq(0).html());
		
		techs=[];
		$(this).find('li.techLi').each(function(){
			tech={}, capacity={}; 
			
			tech.name=$(this).find('.name').eq(0).html();
			tech.t_id=parseInt($(this).find('.id').eq(0).html());
			
			if ($(this).find('.fyear').eq(0).text())
				capacity.fyear=parseInt($(this).find('.fyear').eq(0).text());
			if ($(this).find('.lyear').eq(0).text())
				capacity.lyear=parseInt($(this).find('.lyear').eq(0).text());
			if ($(this).find('.availiability').eq(0).text())
				capacity.availiability=parseFloat($(this).find('.availiability').eq(0).text());
			if ($(this).find('.lifetime').eq(0).text())
				capacity.lifetime=parseInt($(this).find('.lifetime').eq(0).text());
			
			inv={}; fix={}; hist={}; year={}; cap={};
			var invRange=$(this).find('li.investmentCostLi').find('.excelRange').eq(0).text();
			if (invRange){
				if (isNaN(invRange)) inv.excelRange=invRange;
				else inv=invRange;
			}
			capacity.inv_cost=inv;		
			var fixRange=$(this).find('li.fixedCostLi').find('.excelRange').eq(0).text();
			if (fixRange){
				if (isNaN(fixRange)) fix.excelRange=fixRange;
				else fix=fixRange;
			}
			capacity.fixed_cost=fix;		
			var histYearRange=$(this).find('li.histCapLi').find('.excelMatrixRange').eq(0).text();
			var histCapRange=$(this).find('li.histCapLi').find('.excelMatrixRange').eq(1).text();
			if (histYearRange) year.excelRange=histYearRange;
			hist.year=year;
			if (histCapRange) cap.excelRange=histCapRange;
			hist.cap=cap;
			capacity.historic=hist;
			tech.capacity=capacity;
		
			acts=[];
			$(this).find('li.activityLi').each(function(){
				act={}; var_c={}; outs=[];	
				if ($(this).find('.name').eq(0).html()){
					act.name=$(this).find('.name').eq(0).html();					
				}
				var varRange=$(this).find('li.varCostLi').find('.excelRange').eq(0).text();
				if (varRange){
					if (isNaN(varRange)) var_c.excelRange=varRange;
					else var_c=varRange;
				}	
				act.var_cost=var_c;
				
				inps=[];
				var menu, f_id, full_name;
				var main_input_exist=false;
				if ($(this).find('li.mainInputLi').find('.context-menu-one').eq(0).text()){
					inp={};
					inp.is_main=true;	
					full_name=$(this).find('li.mainInputLi').find('.context-menu-one').eq(0).text();
					menu=full_name.split('(');
					inp.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
					inp.comment=full_name;
					inps.push(inp);
					main_input_exist=true;
				}
				
				if (main_input_exist){
					$(this).find('li.otherInputLi').each(function(){
						if ($(this).find('.context-menu-one').eq(0).text()){
							inp={}; val={};
							var cur=$(this).find('.excelRange').text();
							full_name=$(this).find('.context-menu-one').eq(0).text();
							menu=full_name.split('(');
							inp.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
							if ($(this).find('.excelRange').text()){							
								if (isNaN(cur)){
									val.excelRange=cur;
									inp.value=val;
								}else inp.value=cur;	
								//inp.comment=full_name;
								inps.push(inp);
							}
						}
					});
				}
				act.inputs=inps;

				outs=[];
				var main_output_exist=false;
				if ($(this).find('li.mainOutputLi').find('.context-menu-one').eq(0).text()){
					out={};val={};
					var cur=$(this).find('li.mainOutputLi').find('.excelRange').text();
					out.is_main=true;				
					full_name=$(this).find('li.mainOutputLi').find('.context-menu-one').eq(0).text();
					menu=full_name.split('(');
					out.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
					out.comment=full_name;
					if (cur){
						if (isNaN(cur)){
							val.excelRange=$(this).find('li.mainOutputLi').find('.excelRange').text();
							out.value=val;
						}else out.value=cur;						
						outs.push(out);
						main_output_exist=true;
					}else{
							alert('main output not found : tl_id='+(tls.length+1)+', t_id='+tech.t_id
									+', a_id='+(acts.length+1)+', o_id=1');
									no_error=false;
								return;						
					}
				}
				//$(this).closest('.techLi').find('.name').eq(0).text()
				if (main_output_exist){
					$(this).find('li.otherOutputLi').each(function(){
						if ($(this).find('.context-menu-one').eq(0).text()){
							out={}; val={};
							var cur=$(this).find('.excelRange').text();
							full_name=$(this).find('.context-menu-one').eq(0).text();
							menu=full_name.split('(');
							out.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
							out.comment=full_name;
							if (cur){
								if (isNaN(cur)){
									val.excelRange=$(this).find('li.mainOutputLi').find('.excelRange').text();
									out.value=val;
								}else out.value=cur;						
								outs.push(out);
							}
							
						}
					});
				}
				act.outputs=outs;
				acts.push(act);				
			});
			tech.activities=acts;
			techs.push(tech);
		});
		tl.techs=techs;
		tls.push(tl);
	});
	json.techLevels=tls;

}

function update_P_C_K(){
	var arr=[];
	for (var i = 0; i < json.energyLevels.length; i++) {
		var el=json.energyLevels[i];
			for (var j = 0; j <el.energyForms.length; j++){
				var ef=el.energyForms[j];
				ef.P=[];
				ef.C=[];
				var cur=[];
				cur.push(i);
				cur.push(j);
				arr.push(cur);
			}	
	}
	
	for (var i = 0; i < json.techLevels.length; i++) {
		var tl=json.techLevels[i];
		for (var j = 0; j <tl.techs.length; j++){
			var tech=tl.techs[j];
			var t_name=tech.name;
			var t_id=tech.t_id;
			for (var a=0;a<tech.activities.length;a++){
				var act=tech.activities[a];
				if (act.hasOwnProperty('name')){
					t_name=tech.name;
					t_name+='/'+act.name;
				}
				for (var io=0;io<act.inputs.length;io++){
					var f_id=act.inputs[io].f_id;
					var el=arr[f_id-1][0];
					var ef=arr[f_id-1][1];
					var cur={};
					cur.name=t_name;
					cur.t_id=t_id;
					if (tech.activities.length>1) cur.a_id=a+1;
					if (act.inputs[io].hasOwnProperty('is_main')){
						var temp=[];
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							temp.push(1);
						}
						cur.ts=temp.join(',');
					}else{
						if (act.inputs[io].value.hasOwnProperty('ts')) cur.ts=act.inputs[io].value.ts;
						else{
							var temp=[];
							for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
								temp.push(act.inputs[io].value);
							}
							cur.ts=temp.join(',');
						}							
					}
					if (el<json.energyLevels.length-1){
						json.energyLevels[el].energyForms[ef].C.push(cur);						
					}
				}
				for (var io=0;io<act.outputs.length;io++){
					var f_id=act.outputs[io].f_id;
					var el=arr[f_id-1][0];
					var ef=arr[f_id-1][1];
					var cur={};
					cur.name=t_name;
					cur.t_id=t_id;
					if (tech.activities.length>1) cur.a_id=a+1;
					if (act.outputs[io].value.hasOwnProperty('ts')){
						cur.ts=act.outputs[io].value.ts;
					}else{
						var temp=[];
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							temp.push(act.outputs[io].value);
						}
						cur.ts=temp.join(',');												
					}
					json.energyLevels[el].energyForms[ef].P.push(cur);
				}
			}
		}
	}
	
}
function save_tech(btn){
	update_all_tech_io_f_id();
	update_all_ts('techLevels');
	update_P_C_K();
	make_tech_var_menu();
	json_editor_update();
}

function update_var_title_TeX(){
	var varTex1='(D^t= \\{', varTex2='D= \\{';
	var no_not_ts=no_ts=0;
	$('#tree_for_variable').find('li').each(function(){
		var cur=$(this).find('.teXeq').text();
		var is_ts=$(this).find('input[name=is_ts_var]').is(':checked');
		if (is_ts){
			varTex1+=cur+'^{t}' + ','; no_ts++;
		}else{
			varTex2+=cur + ','; no_not_ts++;
		}
	});
	if (no_ts)	varTex1=varTex1.substr(0, varTex1.length-1)+'\\}, ';
	else varTex1='(D^t= \\{ \\}, ';
	if (no_not_ts) varTex2=varTex2.substr(0, varTex2.length-1)+'\\})';
	else varTex2='D= \\{ \\})';
	var el=$('#tree_for_variable').parent().find('.math').get(0);
	katex.render(varTex1+varTex2,el);		
}
function populate_variable(){
	$("#tree_for_variable>li").not(':first').remove();
	
	$('#tree_for_variable').find('li.var').find('[value=Remove]').attr('disabled','disabled');
	if (json.variables.length==0) return;
	
	var years=json.general.lyear-json.general.fyear+1;
	var cur=$('#tree_for_variable').find('li.var');
	for (var i = 0; i < json.variables.length; i++) {
		if (i){
			$(cur).clone().insertAfter(cur);
			cur=$(cur).next();
		}				
		$(cur).find('.name').text(json.variables[i].name);
		$(cur).find('.teXeq').text(json.variables[i].teXeq);
		$(cur).find('.id').text(i+1);
		if (json.variables[i].is_ts){
			$(cur).find('input[name=is_ts_var]').prop('checked', true);
		}else $(cur).find('input[name=is_ts_var]').prop('checked', false);
		eq=json.variables[i].teXeq;
		if (json.variables[i].is_ts){
			mathtext=eq+'^{t}, t \\in T';
		}else{
			mathtext=eq;
		}
		el=$(cur).find('.math').get(0);
		katex.render(mathtext,el);		
	}
	
	if (json.variables.length>1){
		$('#tree_for_variable').find('li.var').find('[value=Remove]').removeAttr('disabled');
	}	
	update_var_title_TeX();
}
function remove_var(btn){
	var cur=$(btn).closest('li.var').next('li');
	while ($(cur).length){
		var cur_id=parseInt($(cur).find('.id').eq(0).text());
		$(cur).find('.id').eq(0).text(cur_id-1);
		 cur=$(cur).next('li');		
	};
	$(btn).closest('li.var').remove();
	if ($('#tree_for_variable').find('li.var').length==1)
		$('#tree_for_variable').find('li.var').find('[value=Remove]').attr('disabled','disabled');
	update_var_title_TeX();
}
function add_var(btn){
	var cur=$(btn).closest('li.var');
	$(cur).clone().insertAfter(cur);

	var cur=$(cur).next('li');
//		el=$(this).closest('li').find('.math').get(0);
	//	katex.render(eq,el);
	while ($(cur).length){
		var cur_id=parseInt($(cur).find('.id').eq(0).text());
		$(cur).find('.id').eq(0).text(cur_id+1);
		 cur=$(cur).next('li');		
	};
	if ($('#tree_for_variable').find('li.var').length==2){
		$('#tree_for_variable').find('li.var').find('[value=Remove]').removeAttr('disabled');		
	}
	update_var_title_TeX();

}
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
function save_var(btn){
//$('#saveJsonForm').submit(function(e) {
	update_var();
	make_tech_var_menu();
	json_editor_update();
}

$(document).on('focus', '#type1_constaintLi .excelMatrixRange, #type2_constaintLi .excelMatrixRange, #type3_constaintLi .excelMatrixRange', function() {
	contents=$(this).text();
});
$(document).on('blur',  '#type1_constaintLi .excelMatrixRange, #type2_constaintLi .excelMatrixRange, #type3_constaintLi .excelMatrixRange', function() {
	var dataType=$(this).data('type');	
	if ($(this).text()==''){
		$(this).text(contents);
		return;
	}	
	
	//if (dataType!="excelMatrixRange") return;
	
	var addr=validateRange($(this).text());
	if (addr.length==0){ alert('matrix excel range error'); return;}
	
	var matrix=$(this).closest('ul').find('table').find('tr').not(':first');
	if ($(matrix).length!=(addr[3]-addr[1]+1)){ alert('Matrix excel range error'); return;}

	var isType3=$(this).closest('.el').is("#type3_constaintLi"); 
	if (!isType3){
		var techs=[], eqs=[];
		$(this).closest('ul').find('table').find('tr').not(':first').each(function(){
			techs.push($(this).find('td:first').text());
			eqs.push($(this).find('td:eq(1)').html());
		});

		var ts_string=getExcelRange($(this).text().toUpperCase());
		var ts=ts_string.split(',');
		
		var table=$(this).closest('ul').find('table');
		$(table).find("tr:gt(0)").remove();
		var row='';
		var k=0;
		for (var i=0;i<techs.length;i++){
			row+='<tr><td style="min-width:120px;">';
			row+=techs[i]+'</td><td><span class="math equation">'+eqs[i]+'</span></td>';		
			for (var j=0;j<(json.general.lyear-json.general.fyear+1);j++){
				row+='<td style="border: 1px solid black;">'+ts[k++]+'</td>';
			}
			row+='</tr>';					
		}
		$(table).append(row);
	}else{
		var total_row=[];
		$(this).closest('form').find('table').find('tr').not(':first').each(function(){
			var cur_row=[];
			
			$(this).find('td:lt(6)').each(function(){
				cur_row.push($(this)[0].outerHTML);
			});
			total_row.push(cur_row);
		});

		var ts_string=getExcelRange($(this).text().toUpperCase());
		var ts=ts_string.split(',');
		
		var table=$(this).closest('form').find('table');
		$(table).find("tr:gt(0)").remove();
		var row='';
		var k=0;
		for (var i=0;i<total_row.length;i++){
			row+='<tr>';
			for (var j=0;j<total_row[i].length;j++){
				row+=total_row[i][j];
			}
			for (var j=0;j<(json.general.lyear-json.general.fyear+1);j++){
				row+='<td style="border: 1px solid black;">'+ts[k++]+'</td>';
			}
			row+='</tr>';					
		}
		$(table).append(row);		
	}
});
$(document).on('focus', '#type3_constaintLi .noOfS_i, #type3_constaintLi .S_i, #type3_constaintLi .initVarValue', function() {
	contents=$(this).text();
});
$(document).on('blur',  '#type3_constaintLi .noOfS_i, #type3_constaintLi .S_i, #type3_constaintLi .initVarValue', function() {
	if ($(this).hasClass('noOfS_i')){
		if (contents==$(this).text()) return;
		else{
			if (!$.isNumeric($(this).text())){alert('number error'); return;}
			$(this).closest('li.constraint').find('input[name=addToLP]').prop('checked',false);
			$(this).closest('li.constraint').find('.excelMatrixRange').text('');
			
			var prev=parseInt(contents);			
			var cur=parseInt($(this).text());
			var row=$(this).closest('tr');
			if (prev>cur){
				for (var i=0;i<(cur-1);i++)	row=$(row).next();
				for (var i=0;i<(prev-cur);i++){
					$(row).next().remove();
				}
			}else{
				for (var i=0;i<(prev-1);i++) row=$(row).next();
				for (var i=0;i<(cur-prev);i++){
					$(row).clone().insertAfter(row);
					row=$(row).next();
					$(row).find('td:eq(1)').html('');
					var id=parseInt($(row).prev().find('.S_i').text());
					$(row).find('.S_i').text(id+1);					
					$(row).find('.initVarValue').text();					
				}				
			}
		}
	}else if ($(this).hasClass('S_i')){
		if (contents==$(this).text()) return;
		else{
			if (!$.isNumeric($(this).text())){alert('number error'); return;}
			var cur_S_i=parseInt($(this).text());
			if (cur_S_i>=0){
				$(this).closest('td').next().next().html('<span contenteditable   style="display:inline;" class="initVarValue editable cost"></span>');
			}
		}
	}
	$(this).closest('form').find('input[type=radio][name=activityOrCapacity]').trigger('change');			

});

function populate_contraint_type1(){
	$("#type1_constaintUl>li").not(':first').remove();
	var eq="\\displaystyle\\ \\sum_{i\\in I'}{a_i^t x_i^t \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";			
	var el=$('#type1_constaintLi').find('.titleTexEq').get(0);
	katex.render(eq,el);
	
	var curType1=$('#type1_constaintUl').find('li.constraint');;
	for (var i=0;i<json.constraints.type1.length;i++){
		if (i){
			$(curType1).clone().insertAfter(curType1);
			curType1=$(curType1).next('li');
		}				

		var cur=json.constraints.type1[i];
		var isActivity;
		var isForInput;
		$(curType1).find('.name').text(json.constraints.type1[i].name);
		$(curType1).find('.id').text(i+1);
//		$(curType1).find('form').attr('id','c1_id'+(i+1));
		
		if (json.constraints.type1[i].addToLP){
			$(curType1).find('input[name=addToLP]').prop('checked', true);
		}else $(curType1).find('input[name=addToLP]').prop('checked', false);
		
		if (json.constraints.type1[i].is_act){
			$(curType1).find('input[name=activityOrCapacity]').filter('[value=activity]').prop('checked', true);
			isActivity=true;
			$(curType1).find('input[type=radio][name=ioRadio]').attr("disabled",false); 
		}else{
			$(curType1).find('input[type=radio][name=activityOrCapacity]').filter('[value=capacity]').prop('checked', true);
			isActivity=false;
			$(curType1).find('input[type=radio][name=ioRadio]').attr("disabled",true); 
		}
		if(json.constraints.type1[i].hasOwnProperty('is_input')){
			if (json.constraints.type1[i].is_input){
				$(curType1).find('input[name=ioRadio]').filter('[value=input]').prop('checked', true);
				isForInput=true;
			}else{
				$(curType1).find('input[name=ioRadio]').filter('[value=output]').prop('checked', true);
				isForInput=false;
			}			
		}
		if (json.constraints.type1[i].eqType=="le")
			$(curType1).find('input[name=eqType]').filter('[value=le]').prop('checked', true);
		else if (json.constraints.type1[i].eqType=="eq")
			$(curType1).find('input[name=eqType]').filter('[value=eq]').prop('checked', true);
		else $(curType1).find('input[name=eqType]').filter('[value=ge]').prop('checked', true);
		
		$(curType1).find('.excelMatrixRange').text(json.constraints.type1[i].excelMatrixRange);

		var curForm=$(curType1).find('form');//$('#c1_id'+(i+1));
		var table=$(curForm).find('table');
		$(table).find("tr:gt(0)").remove();
		var row='';
		for (var j=0;j<cur.techs.length;j++){
			row+='<tr><td style="min-width:140px;" class="techVarName">';
			var temp=cur.techs[j].name.split('/');
			if (temp[0]=='variable'){
				var temp1=temp[1].split('(');
				var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
				if (json.variables[v_arr_id].is_ts) row+=cur.techs[j].name+'</td><td><span class="math equation">d_'+(v_arr_id+1)+'^t'+json.variables[v_arr_id].teXeq+'^t</span></td>';
				else row+=cur.techs[j].name+'</td><td><span class="math equation">d_'+(v_arr_id+1)+'^t'+json.variables[v_arr_id].teXeq+'</span></td>';						
			} 
			else{
				if (temp.length==1){
					var temp1=cur.techs[j].name.split('(');
					var t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					if (isActivity){
						if (isForInput){
							row+=cur.techs[j].name+'</td><td><span class="math equation">a_'+t_id+'^t x_'+t_id+'^t</span></td>';	
						}else{
							row+=cur.techs[j].name+'</td><td><span class="math equation">a_'+t_id+'^t ((1/e_'+t_id+'^t) x_'+t_id+'^t)</span></td>';	
						}									
					}else row+=cur.techs[j].name+'</td><td><span class="math equation">a_'+t_id+'^t y_'+t_id+'^t</span></td>';							
				}else{
					var temp1=temp[0].split('(');
					var t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					temp1=temp[1].split('(');
					var a_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					if (isActivity){
						if (isForInput){
							row+=cur.techs[j].name+'</td><td><span class="math equation">a_{('+t_id+','+a_id+')}^t x_{('+t_id+','+a_id+')}^t</span></td>';		
						}else{
							row+=cur.techs[j].name+'</td><td><span class="math equation">a_{('+t_id+','+a_id+')}^t((1/e_{('+t_id+','+a_id+')}^t) x_{('+t_id+','+a_id+')}^t)</span></td>';	
						}								
					}else row+=cur.techs[j].name+'</td><td><span class="math equation">a_{('+t_id+','+a_id+')}^t y_{('+t_id+','+a_id+')}^t</span></td>';	
				}
			} 
			for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
				row+='<td style="border: 1px solid black;"></td>';
			}
			row+='</tr>';					
		}
		row+='<tr><td style="min-width:120px;">';
		row+='RHS</td><td><span class="math equation">b^t</span></td>';	
		for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
			row+='<td style="border: 1px solid black;"></td>';
		}
		row+='</tr>';					
		$(table).append(row);	
		$(table).find('tr').not(':first').each(function(){
				var eq=$(this).find('.math').text();
				var el=$(this).find('.math').get(0);
				katex.render(eq,el);				
		});	
		
		$(curType1).find('.excelMatrixRange').trigger('blur');
	}
}
function populate_contraint_type2(){
	$("#type2_constaintUl>li").remove();
	var eq="\\displaystyle\\ \\sum_{i\\in I'} \\sum_{s=1}^t {a_i^s x_i^s \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T";			
	var el=$('#type2_constaintLi').find('.titleTexEq').get(0);
	katex.render(eq,el);

	var from_type1=$("#type1_constaintUl>li").eq(0);
	var cur_type_ul=$("#type2_constaintUl");
	from_type1.clone().appendTo($(cur_type_ul));
	
	var curType2=$('#type2_constaintUl').find('li.constraint');
	curType2.find('.label').text('c2_id');
	for (var i=0;i<json.constraints.type2.length;i++){
		if (i){
			$(curType2).clone().insertAfter(curType2);
			curType2=$(curType2).next('li');
		}				

		var cur=json.constraints.type2[i];
		var isActivity;
		var isForInput;
		$(curType2).find('.name').text(json.constraints.type2[i].name);
		$(curType2).find('.id').text(i+1);
//		$(curType2).find('form').attr('id','c2_id'+(i+1));
		
		if (json.constraints.type2[i].addToLP){
			$(curType2).find('input[name=addToLP]').prop('checked', true);
		}else $(curType2).find('input[name=addToLP]').prop('checked', false);
		
		if (json.constraints.type2[i].is_act){
			$(curType2).find('input[name=activityOrCapacity]').filter('[value=activity]').prop('checked', true);
			isActivity=true;
			$(curType2).find('input[type=radio][name=ioRadio]').attr("disabled",false); 
		}else{
			$(curType2).find('input[type=radio][name=activityOrCapacity]').filter('[value=capacity]').prop('checked', true);
			isActivity=false;
			$(curType2).find('input[type=radio][name=ioRadio]').attr("disabled",true); 
		}
		if(json.constraints.type2[i].hasOwnProperty('is_input')){
			if (json.constraints.type2[i].is_input){
				$(curType2).find('input[name=ioRadio]').filter('[value=input]').prop('checked', true);
				isForInput=true;
			}else{
				$(curType2).find('input[name=ioRadio]').filter('[value=output]').prop('checked', true);
				isForInput=false;
			}			
		}
		if (json.constraints.type2[i].eqType=="le")
			$(curType2).find('input[name=eqType]').filter('[value=le]').prop('checked', true);
		else if (json.constraints.type2[i].eqType=="eq")
			$(curType2).find('input[name=eqType]').filter('[value=eq]').prop('checked', true);
		else $(curType2).find('input[name=eqType]').filter('[value=ge]').prop('checked', true);
		
		$(curType2).find('.excelMatrixRange').text(json.constraints.type2[i].excelMatrixRange);

		var curForm=$(curType2).find('form');//$('#c2_id'+(i+1));
		var table=$(curForm).find('table');
		$(table).find("tr:gt(0)").remove();
		var row='';
		for (var j=0;j<cur.techs.length;j++){
			row+='<tr><td style="min-width:140px;" class="techVarName">';
			var temp=cur.techs[j].name.split('/');
			if (temp[0]=='variable'){
				var temp1=temp[1].split('(');
				var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
				if (json.variables[v_arr_id].is_ts) row+=cur.techs[j].name+'</td><td><span class="math equation">d_'+(v_arr_id+1)+'^t'+json.variables[v_arr_id].teXeq+'^t </span></td>';
				else row+=cur.techs[j].name+'</td><td><span class="math equation">d_'+(v_arr_id+1)+'^t'+json.variables[v_arr_id].teXeq+'</span></td>';						
			} 
			else{
				if (temp.length==1){
					var temp1=cur.techs[j].name.split('(');
					var t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					if (isActivity){
						if (isForInput){
							row+=cur.techs[j].name+'</td><td><span class="math equation">\\sum_{s=1}^t a_'+t_id+'^s x_'+t_id+'^s</span></td>';	
						}else{
							row+=cur.techs[j].name+'</td><td><span class="math equation">\\sum_{s=1}^t a_'+t_id+'^s((1/e_'+t_id+'^s) x_'+t_id+'^s)</span></td>';	
						}									
					}else row+=cur.techs[j].name+'</td><td><span class="math equation">\\sum_{s=1}^t a_'+t_id+'^s y_'+t_id+'^s</span></td>';							
				}else{
					var temp1=temp[0].split('(');
					var t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					temp1=temp[1].split('(');
					var a_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					if (isActivity){
						if (isForInput){
							row+=cur.techs[j].name+'</td><td><span class="math equation">\\sum_{s=1}^t a_{('+t_id+','+a_id+')}^s x_{('+t_id+','+a_id+')}^s</span></td>';		
						}else{
							row+=cur.techs[j].name+'</td><td><span class="math equation">\\sum_{s=1}^t a_{('+t_id+','+a_id+')}^s((1/e_{('+t_id+','+a_id+')}^s) x_{('+t_id+','+a_id+')}^s)</span></td>';	
						}								
					}else row+=cur.techs[j].name+'</td><td><span class="math equation">\\sum_{s=1}^t a_{('+t_id+','+a_id+')}^s y_{('+t_id+','+a_id+')}^s</span></td>';	
				}
			} 
			for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
				row+='<td style="border: 1px solid black;"></td>';
			}
			row+='</tr>';					
		}
		row+='<tr><td style="min-width:120px;">';
		row+='RHS</td><td><span class="math equation">b^t</span></td>';	
		for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
			row+='<td style="border: 1px solid black;"></td>';
		}
		row+='</tr>';					
		$(table).append(row);	
		$(table).find('tr').not(':first').each(function(){
				var eq=$(this).find('.math').text();
				var el=$(this).find('.math').get(0);
				katex.render(eq,el);				
		});	
		
		$(curType2).find('.excelMatrixRange').trigger('blur');
		
		
	}

}
function populate_contraint_type3(){
	$("#type3_constaintUl>li").not(':first').remove();
	var eq="\\displaystyle\\ \\sum_{i \\in I'} \\sum_{s \\in S_i} {a_{(i,s)}^t x_i^{t+s} \\leq b^t} ,  S_i \\subseteq T\\cup\\{0,-1,\\cdots,\\}, I'\\subseteq I, t \\in T ";

	var el=$('#type3_constaintLi').find('.titleTexEq').get(0);
	katex.render(eq,el);
	
	var curType3=$('#type3_constaintUl').find('li.constraint');;
	for (var i=0;i<json.constraints.type3.length;i++){
		if (i){
			$(curType3).clone().insertAfter(curType3);
			curType3=$(curType3).next('li');
		}				

		var cur=json.constraints.type3[i];
		var isActivity;
		var isForInput;
		$(curType3).find('.name').text(json.constraints.type3[i].name);
		$(curType3).find('.id').text(i+1);
		//$(curType3).find('form').attr('id','c1_id'+(i+1));
		
		if (json.constraints.type3[i].addToLP){
			$(curType3).find('input[name=addToLP]').prop('checked', true);
		}else $(curType3).find('input[name=addToLP]').prop('checked', false);
		
		if (json.constraints.type3[i].is_act){
			$(curType3).find('input[name=activityOrCapacity]').filter('[value=activity]').prop('checked', true);
			isActivity=true;
			$(curType3).find('input[type=radio][name=ioRadio]').attr("disabled",false); 
		}else{
			$(curType3).find('input[type=radio][name=activityOrCapacity]').filter('[value=capacity]').prop('checked', true);
			isActivity=false;
			$(curType3).find('input[type=radio][name=ioRadio]').attr("disabled",true); 
		}
		if(json.constraints.type3[i].hasOwnProperty('is_input')){
			if (json.constraints.type3[i].is_input){
				$(curType3).find('input[name=ioRadio]').filter('[value=input]').prop('checked', true);
				isForInput=true;
			}else{
				$(curType3).find('input[name=ioRadio]').filter('[value=output]').prop('checked', true);
				isForInput=false;
			}			
		}
		if (json.constraints.type3[i].eqType=="le")
			$(curType3).find('input[name=eqType]').filter('[value=le]').prop('checked', true);
		else if (json.constraints.type3[i].eqType=="eq")
			$(curType3).find('input[name=eqType]').filter('[value=eq]').prop('checked', true);
		else $(curType3).find('input[name=eqType]').filter('[value=ge]').prop('checked', true);
		
		$(curType3).find('.excelMatrixRange').text(json.constraints.type3[i].excelMatrixRange);

		var curForm=$(curType3).find('form');
		var table=$(curForm).find('table');
		$(table).find("tr:gt(0)").remove();
		var row='';
		for (var j=0;j<cur.techs.length;j++){
			for (var k=0;k<cur.techs[j].S_is.length;k++){
				row+='<tr><td style="min-width:140px;" class="techVarName">'+cur.techs[j].name+'</td>';
				var cur_S_i=cur.techs[j].S_is[k];
				if (k==0) row+='<td><span contenteditable class="noOfS_i editable cost">'+cur.techs[j].S_is.length+'</span></td>';
				else row+='<td></td>';
				row+= '<td><span contenteditable class="S_i editable cost">'+cur_S_i.S_i+'</span></td>';

				var temp=cur.techs[j].name.split('/');
				if (cur_S_i.hasOwnProperty('init') && cur_S_i.S_i<0){
					row+= '<td style="min-width:30px;max-width:50px;"><span  style="display:inline;" class="math equation">'+'x_5^{0}='+'</span></td>';
					row+= '<td><span contenteditable   style="display:inline;" class="initVarValue editable cost">'+cur_S_i.init+'</span></td>';
					row+='<td><span class="math equation">t</span></td>';
				}else{
					row+= '<td style="min-width:30px;max-width:50px;"></td>';
					row+= '<td><span contenteditable   style="display:inline;" class="initVarValue editable cost"></span></td>';					
					row+='<td><span class="math equation">t</span></td>';
				}				
				for (kk=0;kk<(json.general.lyear-json.general.fyear+1);kk++){
					row+='<td style="border: 1px solid black;"></td>';
				}
				row+='</tr>';					
			}
		}
		row+='<tr><td style="min-width:120px;">RHS</td>'
			+'<td></td>'
			+'<td></td>'
			+'<td style="min-width:30px;max-width:50px;"></td>'
			+'<td></td>'
			+'<td><span class="math equation">b^t</span></td>';	
		for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
			row+='<td style="border: 1px solid black;"></td>';
		}
		row+='</tr>';					
		$(table).append(row);	
		eq=$(table).find('tr:last').find('td:eq(5)').find('.math').text();
		el=$(table).find('tr:last').find('td:eq(5)').get(0);		
		katex.render(eq,el);
		if (i==0){
			eq=$(table).find('tr:first').find('td:eq(1)').find('.math').text();
			el=$(table).find('tr:first').find('td:eq(1)').get(0);		
			katex.render(eq,el);
			eq=$(table).find('tr:first').find('td:eq(2)').find('.math').text();
			el=$(table).find('tr:first').find('td:eq(2)').get(0);		
			katex.render(eq,el);			
		}
		
		$(curType3).find('.excelMatrixRange').trigger('blur');
		$(table).closest('form').find('input[type=radio][name=activityOrCapacity]').trigger('change');
	
	}

}
function populate_contraint_short_type1(){
	$("#short_type1_constaintUl>li").not(':first').remove();
	var curType1=$('#short_type1_constaintUl').find('li.constraint');;

	for(i=0;i<json.constraints.short_type1.length;i++){
		var cur=json.constraints.short_type1[i];
		if (i){
			$(curType1).clone().insertAfter(curType1);
			curType1=$(curType1).next('li');
		}				
		
		$(curType1).find('.label').text(cur.name);
		var eql,equ,eqeq;
		if (i==0){
			eql="\\displaystyle (l_i^t \\leq x_i^t, \\text{for } \\,  t \\in T)";
			equ="\\displaystyle (x_i^t \\leq u_i^t,  \\, \\text{for } \\, t\\in T)";
			eqeq="\\displaystyle (x_i^t= b_i^t,  \\, \\text{for } \\,  t\\in T' \\subseteq T)";
		}
		if (i==1){
			eql="\\displaystyle (l_i^t \\leq (1/e_i^t) x_i^t, \\text{for } \\,  t \\in T)";
			equ="\\displaystyle ((1/e_i^t) x_i^t \\leq u_i^t,  \\, \\text{for } \\, t\\in T)";
			eqeq="\\displaystyle ((1/e_i^t) x_i^t= b_i^t,  \\, \\text{for } \\,  t\\in T' \\subseteq T)";
		}
		if (i==2){
			eql="\\displaystyle (l_i^t \\leq y_i^t, \\text{for } \\,  t \\in T)";
			equ="\\displaystyle (y_i^t \\leq u_i^t,  \\, \\text{for } \\, t\\in T)";
			eqeq="\\displaystyle (y_i^t= b_i^t,  \\, \\text{for } \\,  t\\in T' \\subseteq T)";
		}
		var el=$(curType1).find('.lbound').get(0);
		katex.render(eql,el);			
		el=$(curType1).find('.ubound').get(0);
		katex.render(equ,el);			
		el=$(curType1).find('.eqbound').get(0);
		katex.render(eqeq,el);			
		
		var table=$(curType1).find('table');
		$(table).find("tr:gt(1)").remove();
		var row='';
		for (var j=0;j<cur.techs.length;j++){
			var cur_var=cur.techs[j];
			var lower='', upper='';
			if (cur_var.lower.hasOwnProperty('excelRange')) lower=cur_var.lower.excelRange;
			if (cur_var.lower.hasOwnProperty('value')) lower=cur_var.lower.value;
			if (cur_var.upper.hasOwnProperty('excelRange')) upper=cur_var.upper.excelRange;
			if (cur_var.upper.hasOwnProperty('value')) upper=cur_var.upper.value;
			
			var temp=cur_var.name.split('/');
			var cur_tech={};
			if (temp[0]=='variable'){
				var temp1=temp[1].split('(')[1];
				var dummy_id=parseInt(temp1.split(')')[0])-1;
				if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
				else cur_tech.is_ts=false;
			}
			if (cur_tech.hasOwnProperty('is_ts') && !cur_tech.is_ts){
				var vv;
				if (cur_var.equal.RHS.hasOwnProperty('ts')) vv=cur_var.equal.RHS.ts.split(',')[0];
				else vv=cur_var.equal.RHS.value;
				row+='<tr><td align="left" class="techVarName" style="border-right:1px solid black;">'+cur_var.name+'</td>'
					+'<td><span class="excelRange" contenteditable>'+lower+'</span></td>'
					+'<td style="border-right:1px solid black;"><input name="addToLP_lb" class="lbBox" style="margin-left:1px;" type="checkbox"></td>'
					+'<td><span class="excelRange" contenteditable>'+upper+'</span></td>'
					+'<td style="border-right:1px solid black;"><input name="addToLP_ub" class="ubBox" style="margin-left:1px;" type="checkbox"></td>'
					+'<td></td>'
					+'<td><span class="excelRange" contenteditable>'+vv+'</span></td>'
					+'<td><input name="addToLP_eq" class="eqBox" style="margin-left:1px;" type="checkbox"></td>'
				+'</tr>';							
			}else{
				row+='<tr><td align="left" class="techVarName" style="border-right:1px solid black;">'+cur_var.name+'</td>'
					+'<td><span class="excelRange" contenteditable>'+lower+'</span></td>'
					+'<td style="border-right:1px solid black;"><input name="addToLP_lb" class="lbBox" style="margin-left:1px;" type="checkbox"></td>'
					+'<td><span class="excelRange" contenteditable>'+upper+'</span></td>'
					+'<td style="border-right:1px solid black;"><input name="addToLP_ub" class="ubBox" style="margin-left:1px;" type="checkbox"></td>'
					+'<td><span class="excelMatrixRange" contenteditable>'+cur_var.equal.years.excelRange+'</span></td>'
					+'<td><span class="excelMatrixRange" contenteditable>'+cur_var.equal.RHS.excelRange+'</span></td>'
					+'<td><input name="addToLP_eq" class="eqBox" style="margin-left:1px;" type="checkbox"></td>'
				+'</tr>';
			}
				
				
				
		}
		//row+='</tr>';					
		$(table).append(row);	
		cur_row=$(table).find('tr').eq(2); 
		var techVarName=$(cur_row).find('td:first').text();
		for (var j=0;j<cur.techs.length;j++){
			var cur_var=cur.techs[j];
			if (cur_var.lower.addToLP){
				$(cur_row).find('input[name=addToLP_lb]').prop('checked', true);
			}
			if (cur_var.upper.addToLP){
				$(cur_row).find('input[name=addToLP_ub]').prop('checked', true);
			}
			if (cur_var.equal.addToLP){
				$(cur_row).find('input[name=addToLP_eq]').prop('checked', true);
			}
			cur_row=$(cur_row).next();
		}
		
	}
}

function remove_type1(btn){  // for type 1, 2, 3
	var cur=$(btn).closest('li.constraint').next('li');
	while ($(cur).length){
		var cur_id=parseInt($(cur).find('.id').eq(0).text());
		$(cur).find('.id').eq(0).text(cur_id-1);
		//$(cur).find('form').attr('id','c1_id'+(cur_id-1));
		 cur=$(cur).next('li');		
	};
	$(btn).closest('li.constraint').remove();
	if ($('#type1_constaintUl').find('li.constraint').length==1)
		$('#type1_constaintUl').find('li.constraint').find('[value=Remove]').attr('disabled','disabled');
	if ($('#type2_constaintUl').find('li.constraint').length==1)
		$('#type2_constaintUl').find('li.constraint').find('[value=Remove]').attr('disabled','disabled');
	if ($('#type3_constaintUl').find('li.constraint').length==1)
		$('#type3_constaintUl').find('li.constraint').find('[value=Remove]').attr('disabled','disabled');
}
function add_type1(btn){   // for type 1, 2, 3
	var cur=$(btn).closest('li.constraint');
	$(cur).clone().insertAfter(cur);

	var cur=$(cur).next('li');
	while ($(cur).length){
		var cur_id=parseInt($(cur).find('.id').eq(0).text());
		$(cur).find('.id').eq(0).text(cur_id+1);
	//	$(cur).find('form').attr('id','c1_id'+(cur_id+1));
		 cur=$(cur).next('li');		
	};
	if ($('#type1_constaintUl').find('li.constraint').length==2)
		$('#type1_constaintUl').find('li.constraint').find('[value=Remove]').removeAttr('disabled');		
	if ($('#type2_constaintUl').find('li.constraint').length==2)
		$('#type2_constaintUl').find('li.constraint').find('[value=Remove]').removeAttr('disabled');		
	if ($('#type3_constaintUl').find('li.constraint').length==2)
		$('#type3_constaintUl').find('li.constraint').find('[value=Remove]').removeAttr('disabled');		
}
function update_type1(){	
	json.constraints.type1.length=0;
	var c1_id=1;
	$('#type1_constaintUl').find('li.constraint').each(function(){
		var cur_type1={}; 
		cur_type1.name=$(this).find('.name').eq(0).html();
		cur_type1.is_act=($(this).find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
		if (cur_type1.is_act) cur_type1.is_input=($(this).find('input[name=ioRadio]:checked').val()=='input')?true:false;
		cur_type1.addToLP=$(this).find('input[name=addToLP]').is(':checked');
		cur_type1.eqType=$(this).find('input[name=eqType]:checked').val();
		cur_type1.excelMatrixRange=$(this).find('.excelMatrixRange').text();
		cur_type1.c1_id=c1_id++;
		techs=[];
		$(this).find('table tr').not(':first').not(':last').each(function(){
			var tech={};
			tech.name=$(this).find('td:first').text();
			techs.push(tech);
		});
		cur_type1.techs=techs;		
		json.constraints.type1.push(cur_type1);
	});	
}
function update_type2(){	
	json.constraints.type2.length=0;
	var c2_id=1;
	$('#type2_constaintUl').find('li.constraint').each(function(){
		var cur_type2={}; 
		cur_type2.name=$(this).find('.name').eq(0).html();
		cur_type2.is_act=($(this).find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
		if (cur_type2.is_act) cur_type2.is_input=($(this).find('input[name=ioRadio]:checked').val()=='input')?true:false;
		cur_type2.addToLP=$(this).find('input[name=addToLP]').is(':checked');
		cur_type2.eqType=$(this).find('input[name=eqType]:checked').val();
		cur_type2.excelMatrixRange=$(this).find('.excelMatrixRange').text();
		cur_type2.c2_id=c2_id++;
		techs=[];
		$(this).find('table tr').not(':first').not(':last').each(function(){
			var tech={};
			tech.name=$(this).find('td:first').text();
			techs.push(tech);
		});
		cur_type2.techs=techs;		
		json.constraints.type2.push(cur_type2);
	});	
}
function update_type3(){	
	json.constraints.type3.length=0;
	var c3_id=1;
	$('#type3_constaintUl').find('li.constraint').each(function(){
		var cur_type3={}; 
		cur_type3.name=$(this).find('.name').eq(0).html();
		cur_type3.is_act=($(this).find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
		if (cur_type3.is_act) cur_type3.is_input=($(this).find('input[name=ioRadio]:checked').val()=='input')?true:false;
		cur_type3.addToLP=$(this).find('input[name=addToLP]').is(':checked');
		cur_type3.eqType=$(this).find('input[name=eqType]:checked').val();
		cur_type3.excelMatrixRange=$(this).find('.excelMatrixRange').text();
		cur_type3.c3_id=c3_id++;
		techs=[];
		var S_is=[], is_start=true, no_S_i, tech={};
		$(this).find('table tr').not(':first').not(':last').each(function(){
			var cur_S_i={};
			tech.name=$(this).find('td:first').text();
			cur_S_i.S_i=parseInt($(this).find('td:eq(2)').find('span').text());
			if ($(this).find('td:eq(4)').find('span').text()!=''){
				cur_S_i.init=parseFloat($(this).find('td:eq(4)').find('span').text());
			}
			S_is.push(cur_S_i);
			
			if ($(this).find('td:eq(1)').text()){
				no_S_i=parseInt($(this).find('td:eq(1)').find('span').text());
				if (no_S_i==1){
					tech.S_is=S_is;
					techs.push(tech);
					S_is=[];
					tech={};
					return true;   // for continue와 같다.  return false는 for의 break와 같음
				}
			}

			no_S_i--;
			if (no_S_i==0){					
				tech.S_is=S_is;
				techs.push(tech);
				S_is=[];
				tech={};
			}
		});
		cur_type3.techs=techs;		
		json.constraints.type3.push(cur_type3);
	});	
}
function update_short_type1(){	
	json.constraints.short_type1.length=0;
	$('#short_type1_constaintUl').find('li.constraint').each(function(){
		var short_type1={}; 
		short_type1.name=$(this).find('.label').eq(0).text();
		var table=$(this).find('table');
		var techs=[];
		$(table).find('tr:gt(1)').each(function(){
			var tech={};
			tech.name=$(this).find('td:first').text();
			var lower={};
			var cur=$(this).find('td:eq(1)').text();
			if (cur){
				if (isNaN(cur))	lower.excelRange=cur;					
				else lower.value=cur;
				lower.addToLP=$(this).find('input').eq(0).is(':checked');				
			}
			tech.lower=lower;
			var upper={};
			cur=$(this).find('td:eq(3)').text();
			if (cur){
				if (isNaN(cur))	upper.excelRange=cur;					
				else upper.value=cur;
				upper.addToLP=$(this).find('input').eq(1).is(':checked');				
			}
			tech.upper=upper;
			
			var equal={}, years={}, RHS={};
			
			if ($(this).find('td:eq(5)').text()){
				years.excelRange=$(this).find('td:eq(5)').text();
				RHS.excelRange=$(this).find('td:eq(6)').text();
				equal.addToLP=$(this).find('input').eq(2).is(':checked');				
				equal.years=years;	
			}else{
				if ($.isNumeric($(this).find('td:eq(6)').text())){
					RHS.value=$(this).find('td:eq(6)').text();					
				}else RHS.excelRange=$(this).find('td:eq(6)').text();					
				equal.addToLP=$(this).find('input').eq(2).is(':checked');													
			}
			equal.RHS=RHS;			
			tech.equal=equal;
			techs.push(tech);
		});
		short_type1.techs=techs;		
		json.constraints.short_type1.push(short_type1);
	});	
}
function save_const(btn){
	update_short_type1();
	update_type1();
	update_type2();
	update_type3();
	update_all_ts('constraints');
	json_editor_update();
}

function generate_lp_treeviewer(btn){
	$("#lpObjUl").find('li').remove();

	var eq, el;
	
	var lpObjUl = $('#lpObjUl');
	lp='';
	lp+='\\Problem name: ' + $('#modelJsonFileName').val() + '\nMinimize';
	
	var inv_eq, fix_eq, var1_eq1, var2_eq;
	var inv_cost_li=$('<li/>').addClass('render_math');
	$(inv_cost_li).addClass('unrendered');
	inv_cost_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'Investment cost : <span class="math">\\displaystyle\\ \\sum_{i\\in I} \\sum_{t\\in T} {I_i^t y_i^t}</span>');
	var inv_ul=$('<ul/>');

	var fix_cost_li=$('<li/>').addClass('render_math');
	$(fix_cost_li).addClass('unrendered');
	fix_cost_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'Fixed cost : <span class="math">\\displaystyle\\ \\sum_{i\\in I} \\sum_{t\\in T} {F_i^t y_i^t}</span>');
	var fix_ul=$('<ul/>');

	var var_cost_li=$('<li/>').addClass('render_math');
	$(var_cost_li).addClass('unrendered');
	var_cost_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'Variable cost : <span class="math">\\displaystyle\\ '
									+'\\sum_{i\\in I_m} \\sum_{t\\in T} \\frac{V_i^t}{e_i^t} x_i^t'
									+'+\\sum_{i\\in I\\setminus I_m} \\sum_{(i,a) \\in A_i}  \\sum_{t\\in T} \\frac{V_{(i,a)}^t}{e_{(i,a)}^t} x_{(i,a)}^t'
									+'</span>');
									
									
	var var_ul=$('<ul/>');
	var INV='\nINV: ', FIX='\n\nFIX : ', VAR='\n\nVAR: ';
	var subINV='', subFIX='', subVAR='';
	var inv_exist=false,fix_exist=false,var_exist=false;
	for (var i = 0; i < json.techLevels.length; i++) {
		var tl=json.techLevels[i];
		for (var j = 0; j <tl.techs.length; j++){
			var tech=tl.techs[j];			
			if (tech.capacity.inv_cost.hasOwnProperty('ts') || tech.capacity.inv_cost>0 ){
				var inv_li=$('<li/>');
				var inv_ts;
				if (tech.capacity.inv_cost.hasOwnProperty('ts')) inv_ts=tech.capacity.inv_cost.ts.split(',');
//				inv_eq="<span class='math'> \\begin{array}{ll} i="+tech.t_id+": & ";				
				inv_exist=true;
				inv_eq="<span class='mymath'>i</span>="+tech.t_id+": ";
				subINV +='\nINV('+tech.t_id+'): ';
				INV += ' + INV('+tech.t_id+')';
				for (var k=0;k<(json.general.lyear-json.general.fyear+1);k++){
					//if (k) inv_eq+= '+'+ Math.floor(parseFloat(inv_ts[k])) +'y_{'+tech.t_id+'}^{'+(k+1)+'}';
					if (k){
						if (tech.capacity.inv_cost.hasOwnProperty('ts')) 
							inv_eq+= '+'+ Math.floor(parseFloat(inv_ts[k])*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
						else inv_eq+= '+'+ Math.floor(tech.capacity.inv_cost*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
					}
					else{
						if (tech.capacity.inv_cost.hasOwnProperty('ts')) 
							inv_eq+= Math.floor(parseFloat(inv_ts[k])*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
						else inv_eq+= Math.floor(tech.capacity.inv_cost*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
					} 
					if (tech.capacity.inv_cost.hasOwnProperty('ts')) subINV+= ' + ' + Math.floor(parseFloat(inv_ts[k])*1000)/1000 + ' y_'+tech.t_id+'@'+(k+1);
					else  subINV+= ' + ' + Math.floor(tech.capacity.inv_cost*1000)/1000 + ' y_'+tech.t_id+'@'+(k+1);
					if (k && ((k+1)%10)==0){
						if (k!=(json.general.lyear-json.general.fyear))inv_eq += '<br><span style="margin-left:3em;"></span>';
						subINV+= '\n\t';
					} 
				}
				//inv_eq+= '\\end{array}</span>';
				subINV +='\n\t - INV('+tech.t_id+') = 0';
				inv_li.append('').html(inv_eq);
				inv_ul.append(inv_li);
			}
			
			if (tech.capacity.fixed_cost.hasOwnProperty('ts') || tech.capacity.fixed_cost>0 ){
				var fix_li=$('<li/>');
				var fix_ts;
				if (tech.capacity.fixed_cost.hasOwnProperty('ts')) fix_ts=tech.capacity.fixed_cost.ts.split(',');
				fix_eq="<span class='mymath'>i</span>="+tech.t_id+": ";					
				fix_exist=true;
				subFIX +='\nFIX('+tech.t_id+'): ';
				FIX += ' + FIX('+tech.t_id+')';
				for (var k=0;k<(json.general.lyear-json.general.fyear+1);k++){
					if (k){
						if (tech.capacity.fixed_cost.hasOwnProperty('ts')) 
							fix_eq+= '+'+ Math.floor(parseFloat(fix_ts[k])*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
						else fix_eq+= '+'+ Math.floor(tech.capacity.fixed_cost*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
					}
					else{
						if (tech.capacity.fixed_cost.hasOwnProperty('ts')) 
							fix_eq+= Math.floor(parseFloat(fix_ts[k])*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
						else fix_eq+= Math.floor(tech.capacity.fixed_cost*1000)/1000 +'<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
					} 
					if (tech.capacity.fixed_cost.hasOwnProperty('ts')) subFIX+= ' + ' + Math.floor(parseFloat(fix_ts[k])*1000)/1000 + ' y_'+tech.t_id+'@'+(k+1);
					else  subFIX+= ' + ' + Math.floor(tech.capacity.fixed_cost*1000)/1000 + ' y_'+tech.t_id+'@'+(k+1);
					if (k && ((k+1)%10)==0){
						if (k!=(json.general.lyear-json.general.fyear)) fix_eq += '<br><span style="margin-left:3em;"></span>';
						subFIX+= '\n\t';
					} 

				}
				//fix_eq+= '\\end{array}</span>';
				subFIX +='\n\t - FIX('+tech.t_id+') = 0';
				fix_li.append('').html(fix_eq);
				fix_ul.append(fix_li);
			}
			
			for (var a=0;a<tech.activities.length;a++){
				var act=tech.activities[a];
				if (act.var_cost.hasOwnProperty('ts') || act.var_cost>0 ){
					var var_li=$('<li/>');
					var var_ts;
					if (act.var_cost.hasOwnProperty('ts')) var_ts=act.var_cost.ts.split(',');
					if (tech.activities.length==1) var_eq="<span class='mymath'>i</span>="+tech.t_id+": ";										
					else var_eq="(<span class='mymath'>i,a</span>)=("+tech.t_id+","+(a+1)+"): ";	
					var_exist=true;
					if (tech.activities.length==1) {
						subVAR +='\nVAR('+tech.t_id+'): ';
						VAR += ' + VAR('+tech.t_id+')';						
					}else{
						subVAR +='\nVAR('+tech.t_id+','+(a+1)+'): ';
						VAR += ' + VAR('+tech.t_id+','+(a+1)+')';												
					} 

					for (var k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						if (k){
							if (tech.activities.length==1){
								if (act.var_cost.hasOwnProperty('ts')) 
									var_eq+= '+'+ Math.floor(parseFloat(var_ts[k])*1000)/1000 +'<span class="mymath">x</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
								else var_eq+= '+'+ Math.floor(act.var_cost*1000)/1000 +'<span class="mymath">x</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
							}else{
								if (act.var_cost.hasOwnProperty('ts')) 
									var_eq+= '+'+  Math.floor(parseFloat(var_ts[k])*1000)/1000 +'<span class="mymath">x</span><sub>('+tech.t_id+','+(a+1)+')</sub><sup>'+(k+1)+'</sup>';	
								else var_eq+= '+'+ Math.floor(act.var_cost*1000)/1000  +'<span class="mymath">x</span><sub>('+tech.t_id+','+(a+1)+')</sub><sup>'+(k+1)+'</sup>';	
							} 
						}
						else{
							if (tech.activities.length==1){
								if (act.var_cost.hasOwnProperty('ts')) 
									var_eq+= Math.floor(parseFloat(var_ts[k])*1000)/1000 +'<span class="mymath">x</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
								else var_eq+= Math.floor(act.var_cost*1000)/1000 +'<span class="mymath">x</span><sub>'+tech.t_id+'</sub><sup>'+(k+1)+'</sup>';
							}else{
								if (act.var_cost.hasOwnProperty('ts')) 
									var_eq+= Math.floor(parseFloat(var_ts[k])*1000)/1000 + '<span class="mymath">x</span><sub>('+tech.t_id+','+(a+1)+')</sub><sup>'+(k+1)+'</sup>';	
								else var_eq+= Math.floor(act.var_cost*1000)/1000  +'<span class="mymath">x</span><sub>('+tech.t_id+','+(a+1)+')</sub><sup>'+(k+1)+'</sup>';	
							} 
						} 
						if (act.var_cost.hasOwnProperty('ts')){
							if (tech.activities.length==1) {
								subVAR+= ' + ' + Math.floor(parseFloat(var_ts[k])*1000)/1000 + ' x_'+tech.t_id+'@'+(k+1);
							}else{
								subVAR+= ' + ' + Math.floor(parseFloat(var_ts[k])*1000)/1000 + ' x_('+tech.t_id+','+(a+1)+')@'+(k+1);
							} 							
						}else{
							if (tech.activities.length==1) {
								subVAR+= ' + ' + Math.floor(act.var_cost*1000)/1000 + ' x_'+tech.t_id+'@'+(k+1);
							}else{
								subVAR+= ' + ' + Math.floor(act.var_cost*1000)/1000 + ' x_('+tech.t_id+','+(a+1)+')@'+(k+1);
							} 						
						}
						if (k && ((k+1)%10)==0){
							if (k!=(json.general.lyear-json.general.fyear)) var_eq += '<br><span style="margin-left:3em;"></span>';
							subVAR+= '\n\t';
						} 

					}
					//var_eq+= '\\end{array}</span>';
					if (tech.activities.length==1) subVAR +='\n\t - VAR('+tech.t_id+') = 0';
					else  subVAR +='\n\t - VAR('+tech.t_id+','+(a+1)+') = 0';
					var_li.append('').html(var_eq);
					var_ul.append(var_li);
				}
			}
		}
	};	
	lp+='\nobjective: z \n\nSubject To\n\ncosts:';
	if (inv_exist) lp += ' + INV';
	if (fix_exist) lp += ' + FIX';
	if (var_exist) lp += ' + VAR';
	lp += ' -z = 0\n'
	if (inv_exist) lp += INV + ' - INV = 0' + subINV;
	if (fix_exist) lp += FIX + ' - FIX = 0' + subFIX;
	if (var_exist) lp += VAR + ' - VAR = 0' + subVAR;
	
	inv_cost_li.append(inv_ul);
	fix_cost_li.append(fix_ul);
	var_cost_li.append(var_ul);
	lpObjUl.append(inv_cost_li);
	lpObjUl.append(fix_cost_li);
	lpObjUl.append(var_cost_li);
	$(inv_ul).hide();
	$(fix_ul).hide();
	$(var_ul).hide();

	$('#lpObjUl>li').each(function(){
		eq=$(this).find('.math').eq(0).text();
		el=$(this).find('.math').get(0);
		katex.render(eq,el);
	});
	
	var start=Date.now()-timerStart;		
	generate_constraint();
	generate_type123()
	generate_short_type1();
	generate_bounds();
	var end=Date.now()-timerStart;
	console.log("Time after update cap constraint equation : "+ (end-start));
//Bounds End
	var start=Date.now()-timerStart;		
	$('#lpConstraintUl').find('.math').each(function(){
		eq=$(this).text();
		el=$(this).get(0);
		katex.render(eq,el);
	});
	var end=Date.now()-timerStart;
	console.log("Time after update constraint : "+ (end-start));
	
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError  
		cache:false,
        async: false,
    //    url: url_loc,
        url: 'http://'+localhost+'/php_process/save_lp.php',
        data: { data: lp, fileName: $('#modelJsonFileName').val() + '.lp'},
//        data: { data: JSON.stringify(json_obj), fileName: 'model1.json' },
		dataType: 'text',
        success: function(data) {		 
		 // console.log('success',data); 
		//  json=data;
		 // json=JSON.parse(data);
		 alert('lp saved in :' +'RES3/lp/'+ $('#modelJsonFileName').val() + '.lp' );
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
        //console.log( "Data Saved: " + modelJsonFileName + " msg : " + msg );
	//	alert("Data Saved: " + modelJsonFileName + " msg : " + msg);
    });	
	
}
function generate_constraint(){
//	var arr=[{name:"Capacity Constraint", eq:}, ];
	var start=Date.now()-timerStart;		
	$("#lpConstraintUl").find('li').remove();
	var cap_main_li=$('<li/>').addClass('main_li');
	cap_main_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'<span style="font-size:15px;margin-left:10px" class="const_name">Capacity : </span>'
									+'<span class="math"> \\displaystyle e_i^t \\leq \\sum_{s=\\max\\{1,t-l_i+1 \\}} y_i^s + H_i^t, i\\in I, t\\in T</span>');

	var cap_ul=$('<ul/>');

	lp+='\n';
	for (var i = 0; i < json.techLevels.length; i++) {
		var tl=json.techLevels[i];
		for (var j = 0; j <tl.techs.length; j++){
			var tech=tl.techs[j];			
			if (tech.capacity.inv_cost.hasOwnProperty('ts') || tech.capacity.fixed_cost.hasOwnProperty('ts')
				  || (tech.capacity.inv_cost!=0) || (tech.capacity.fixed_cost!=0)){
				var i_li=$('<li/>').addClass('i_li');
				var i_ul=$('<ul/>').addClass('i_ul');

				var cap_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'<span class="math"> \\displaystyle  i='+tech.t_id+': ';
				var lifetime;
				if (tech.capacity.hasOwnProperty('lifetime')) lifetime=tech.capacity.lifetime;
				else lifetime=30;
				
				var H=[];
				if (tech.capacity.hasOwnProperty('H')) delete tech.capacity.H;
				if (tech.capacity.historic.year.hasOwnProperty('ts')){
					var years=tech.capacity.historic.year.ts.split(',');
					var hist_cap=tech.capacity.historic.cap.ts.split(',');
					
					for (t=0;t<(lifetime-1);t++){
						var cur_H=0;
						var cur_year=t+json.general.fyear;
						for (tt=0;tt<years.length;tt++){
							if (cur_year<(parseInt(years[tt])+lifetime)){
								cur_H+=parseFloat(hist_cap[tt]);
							}						
						}
						H.push(cur_H);
					}
					tech.capacity.H=H;
				}
				
				lp+='\n';	
				for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
					var t_i_li=$('<li/>').addClass('t_i_li');
					var cur_t_i_li='<span class="mymath">t</span>='+(t+1)+' : ';
					var cur_cap_lp='\ncapacity('+tech.t_id+','+(t+1)+'):';				
					for (var a=0;a<tech.activities.length;a++){
						var act=tech.activities[a];
						if (act.outputs[0].value.hasOwnProperty('ts') || act.outputs[0].value!=0){
							var eff_ts;
							if (act.outputs[0].value.hasOwnProperty('ts'))
								if (act.outputs[0].value.ts.indexOf(',')>-1) eff_ts=act.outputs[0].value.ts.split(',');
							var val;
							if (act.outputs[0].value.hasOwnProperty('ts')){
								if (act.outputs[0].value.ts.indexOf(',')>-1) val=Math.floor(parseFloat(eff_ts[t])*1000)/1000;
								else val=Math.floor(parseFloat(act.outputs[0].value.ts)*1000)/1000;								
							}else  val=Math.floor(parseFloat(act.outputs[0].value)*1000)/1000;
							
							if (tech.activities.length==1){
								//cur_t_i_li+= parseFloat(eff_ts[t]) + "x_{"+tech.t_id+"}^{"+(t+1)+"}";
								cur_t_i_li+= val +'<span class="mymath"> x</span><sub>'+tech.t_id+'</sub><sup>'+(t+1)+'</sup>';
								cur_cap_lp+= ' + ' + val +' x_'+tech.t_id+'@'+(t+1);
							}else{
								//if (a==0) cur_t_i_li+=parseFloat(eff_ts[t])+"x_{("+tech.t_id+","+(a+1)+")}^{"+(t+1)+"}";
								//else cur_t_i_li+=" + "+parseFloat(eff_ts[t])+"x_{("+tech.t_id+","+(a+1)+")}^{"+(t+1)+"}";								
								if (a==0) cur_t_i_li+= val +'<span class="mymath"> x</span><sub>('+tech.t_id+','+(a+1)+')</sub><sup>'+(t+1)+'</sup>';
								else cur_t_i_li+=" + "+ val +'<span class="mymath"> x</span><sub>('+tech.t_id+','+(a+1)+')</sub><sup>'+(t+1)+'</sup>';		
								cur_cap_lp+= ' + ' + val +' x_('+tech.t_id+','+(a+1)+')@'+(t+1);								
							}
						}
					}
					cur_t_i_li+= " &le; " ;
					for (s=Math.max(0,t-lifetime+1);s<=t;s++){
						//if (s==Math.max(0,t-lifetime+1)) cur_t_i_li += 'y_{' +tech.t_id+ '}^{'+(s+1)+'}';
						//else cur_t_i_li += '+y_{' +tech.t_id+ '}^{'+(s+1)+'}';
						if (s==Math.max(0,t-lifetime+1)) cur_t_i_li += '<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(s+1)+'</sup>';
						else cur_t_i_li += '+<span class="mymath">y</span><sub>'+tech.t_id+'</sub><sup>'+(s+1)+'</sup>';
						cur_cap_lp += ' - y_'+tech.t_id+'@'+(s+1);
					}
					if (H.length>t && H[t]){
						cur_t_i_li+= '+ ' + H[t];
						cur_cap_lp += ' <= ' + H[t];						
					}else{  
						cur_t_i_li+='';
						cur_cap_lp += ' <= 0';						
					}
					t_i_li.append('').html(cur_t_i_li);
					i_ul.append(t_i_li);
					lp+=cur_cap_lp;
				}

				for (var a=0;a<tech.activities.length;a++){
					var act=tech.activities[a];
					if (act.outputs[0].value.hasOwnProperty('ts')){
						if (tech.activities.length==1){
							cap_eq+= "e_{"+tech.t_id+"}^t x_{"+tech.t_id+"}^t";	
						}else{
							if (a==0) cap_eq+="e_{("+tech.t_id+","+(a+1)+")}^t x_{("+tech.t_id+","+(a+1)+")}^t";	
							else cap_eq+=" + e_{("+tech.t_id+","+(a+1)+")}^t x_{("+tech.t_id+","+(a+1)+")}^t";								
						}
					}
				}
				
				cap_eq+= ' \\leq \\sum_{s=\\max\\{1,t-'+lifetime+ '+1\\}} y_{' +tech.t_id+ '}^s  + H_i^t, \\ t \\in T</span>';
				i_li.append('').html(cap_eq);
				i_li.append(i_ul);				
				$(i_ul).hide();
				cap_ul.append(i_li);
			}
		}
	};	
	cap_main_li.append(cap_ul);
	$(cap_ul).hide();
	$("#lpConstraintUl").append(cap_main_li);

/*	$('#lpConstraintUl>li').each(function(){
		eq=$(this).find('.math').eq(0).text();
		el=$(this).find('.math').get(0);
		katex.render(eq,el);
	});
	var end=Date.now()-timerStart;
	console.log("Time after update constraint : "+ (end-start));*/

	
	
	var flow_main_li=$('<li/>').addClass('main_li');
	flow_main_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'<span style="font-size:15px;margin-left:10px" class="const_name">Flow Conservation / Demand : </span>'
									+'<span class="math"> \\displaystyle \\sum_{i\\in P_j} p_i^t(j) x_i^t \\geq \\sum_{i\\in C_j} c_i^t(j) x_i^t, j \\in J, \\quad ' 
									+'\\sum_{i\\in P_j} p_i^t(j) x_i^t \\geq \\color{red}{D_j^t}, \\quad j \\in J_K, t\\in T </span>');

	var flow_ul=$('<ul/>');
	lp+='\n';	
	
	for (var i = 0; i < json.energyLevels.length; i++) {
		var el=json.energyLevels[i];
		for (var j = 0; j <el.energyForms.length; j++){
			var ef=el.energyForms[j];
			if (ef.P.length>0 || ef.C.length>0){				
				var i_li=$('<li/>').addClass('i_li');
				var i_ul=$('<ul/>').addClass('i_ul');
				var flow_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'<span class="math"> j='+ef.f_id+' : ';// \\displaystyle \\sum_{i\\in P_'+ef.f_id+'} p_i^t('+ef.f_id+') x_i^t \\leq \\sum_{i\\in C_'+ef.f_id+'} c_i^t('+ef.f_id+') x_i^t </span>';
				var is_first=true;
				for (var io=0;io<ef.P.length;io++){
					var prod=ef.P[io];						
					if (prod.hasOwnProperty('a_id')){
						if (is_first){
							flow_eq += 'p_{('+prod.t_id +','+prod.a_id+')}^t('+ef.f_id+') x_{('+prod.t_id +','+prod.a_id+')}^t';
							is_first=false;
						}else flow_eq += ' + p_{('+prod.t_id +','+prod.a_id+')}^t('+ef.f_id+') x_{('+prod.t_id +','+prod.a_id+')}^t';
					}else{
						if (is_first){
							flow_eq += 'p_'+prod.t_id + '^t('+ef.f_id+') x_'+prod.t_id + '^t';
							is_first=false;
						}else flow_eq += ' + p_'+prod.t_id + '^t('+ef.f_id+') x_'+prod.t_id + '^t';							
					}
				}
				if (ef.eq){
					flow_eq += ' = ';
				}else flow_eq += ' \\geq ';
				
				is_first=true;
				for (var io=0;io<ef.C.length;io++){
					var cons=ef.C[io];						
					if (cons.hasOwnProperty('a_id')){
						if (is_first){
							flow_eq += 'c_{('+cons.t_id +','+cons.a_id+')}^t('+ef.f_id+') x_{('+cons.t_id +','+cons.a_id+')}^t';
							is_first=false;
						}else flow_eq += ' + c_{('+cons.t_id +','+cons.a_id+')}^t('+ef.f_id+') x_{('+cons.t_id +','+cons.a_id+')}^t';
					}else{
						if (is_first){
							flow_eq += 'c_'+cons.t_id + '^t('+ef.f_id+') x_'+cons.t_id + '^t';
							is_first=false;
						}else flow_eq += ' + c_'+cons.t_id + '^t('+ef.f_id+') x_'+cons.t_id + '^t';							
					}
				}
				if (i==(json.energyLevels.length-1)) flow_eq += '\\color{red}{D_'+ef.f_id+'^t} </span>';
				else flow_eq += '</span>';
								
							
				lp+='\n';	
				var cur_ts, demand_ts=[];
				if (i==(json.energyLevels.length-1)){
					if (ef.demand.hasOwnProperty('ts')){
						demand_ts=ef.demand.ts.split(',');						
					}else{
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							demand_ts.push(ef.demand);
						}
					}
				}
				for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
					var t_i_li=$('<li/>').addClass('t_i_li');
					var cur_t_i_li='<span class="mymath">t</span>='+(t+1)+' : ';
					lp+='\nFlow_Conservation('+ef.f_id+','+(t+1)+') : ';	
					is_first=true;
					for (var io=0;io<ef.P.length;io++){
						var prod=ef.P[io];						
						var p_ts; 
						if (prod.ts.indexOf(',')>-1){
							p_ts=prod.ts.split(',');						
							cur_ts=Math.floor(parseFloat(p_ts[t])*1000)/1000;
						}else cur_ts=Math.floor(parseFloat(prod.ts)*1000)/1000;
						if (prod.hasOwnProperty('a_id')){
							if (is_first){
								cur_t_i_li+= cur_ts +'<span class="mymath"> x</span><sub>('+prod.t_id+','+prod.a_id+')</sub><sup>'+(t+1)+'</sup>';
								is_first=false;								
							}else cur_t_i_li+= ' + ' + cur_ts +'<span class="mymath"> x</span><sub>('+prod.t_id+','+prod.a_id+')</sub><sup>'+(t+1)+'</sup>';
							lp+=' + ' + cur_ts +' x_('+prod.t_id+','+prod.a_id+')@'+(t+1);
						}else{
							if (is_first){
								cur_t_i_li+= cur_ts +'<span class="mymath"> x</span><sub>'+prod.t_id+'</sub><sup>'+(t+1)+'</sup>';
								is_first=false;								
							}else cur_t_i_li+= ' + ' + cur_ts +'<span class="mymath"> x</span><sub>'+prod.t_id+'</sub><sup>'+(t+1)+'</sup>';
							lp+=' + ' + cur_ts +' x_'+prod.t_id+'@'+(t+1);
						}						
					}
					if (ef.eq){
						cur_t_i_li += ' = ';
					}else cur_t_i_li += ' &geq; ';
					
					is_first=true;
					for (var io=0;io<ef.C.length;io++){
						var cons=ef.C[io];						
						var p_ts; 
						if (cons.ts.indexOf(',')>-1){
							p_ts=cons.ts.split(',');						
							cur_ts=Math.floor(parseFloat(p_ts[t])*1000)/1000;
						}else cur_ts=Math.floor(parseFloat(cons.ts)*1000)/1000;
						if (cons.hasOwnProperty('a_id')){
							if (is_first){
								cur_t_i_li+= cur_ts +'<span class="mymath"> x</span><sub>('+cons.t_id+','+cons.a_id+')</sub><sup>'+(t+1)+'</sup>';
								is_first=false;								
							}else cur_t_i_li+= ' + ' + cur_ts +'<span class="mymath"> x</span><sub>('+cons.t_id+','+cons.a_id+')</sub><sup>'+(t+1)+'</sup>';
							lp+=' - ' + cur_ts +' x_('+cons.t_id+','+cons.a_id+')@'+(t+1);
						}else{
							if (is_first){
								cur_t_i_li+= cur_ts +'<span class="mymath"> x</span><sub>'+cons.t_id+'</sub><sup>'+(t+1)+'</sup>';
								is_first=false;								
							}else cur_t_i_li+= ' + ' + cur_ts +'<span class="mymath"> x</span><sub>'+cons.t_id+'</sub><sup>'+(t+1)+'</sup>';
							lp+=' - ' + cur_ts +' x_'+cons.t_id+'@'+(t+1);
						}
					}
					
					if (i==(json.energyLevels.length-1)){
						cur_t_i_li += Math.floor(parseFloat(demand_ts[t])*1000)/1000 +'</span>';
						lp += ' >= ' + Math.floor(parseFloat(demand_ts[t])*1000)/1000;
					}else{
						cur_t_i_li += '</span>';
						if (ef.eq) lp += ' = 0';
						else lp += ' >= 0 ';
					} 				
					
					
					t_i_li.append('').html(cur_t_i_li);
					i_ul.append(t_i_li);
				}
				
				
				i_li.append('').html(flow_eq);
				i_li.append(i_ul);				
				$(i_ul).hide();
				flow_ul.append(i_li);
			}			
		}
	}
	flow_main_li.append(flow_ul);
	$(flow_ul).hide();
	$("#lpConstraintUl").append(flow_main_li);

	
	
}
function generate_type123(){
	var type1_main_li=$('<li/>').addClass('main_li');
	type1_main_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'<span style="font-size:15px;margin-left:10px" class="const_name">Type-1 : </span>'
									+'<span class="math">'
									+ "\\displaystyle\\ \\sum_{i\\in I'}{a_i^t x_i^t \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T"+
									'</span>');

	var type1_ul=$('<ul/>');
	
	lp+='\n\n\\type 1 constraints';
	for (i=0;i<json.constraints.type1.length;i++){
		var cur_eq=json.constraints.type1[i];
		if (cur_eq.addToLP){
			var t1_li=$('<li/>').addClass('i_li');
			var t1_ul=$('<ul/>').addClass('i_ul');
			var type1_eq;
			if (!cur_eq.is_act){
				type1_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for capacity, name = '+cur_eq.name+', <span class="math">';
			}else if (cur_eq.is_input){
				type1_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for activity/input, name = '+cur_eq.name+', <span class="math">';				
			}else{
				type1_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for activity/output, name = '+cur_eq.name+', <span class="math">';				
			} 

			var addr=validateRange(cur_eq.excelMatrixRange);
			if ((addr[3]-addr[1])!=cur_eq.techs.length) alert('excel Range error :' + 'type1 constraint name =' + cur_eq.name);
			var ts=cur_eq.ts.split(',');
			var tech_var=[];
			var is_first=true;
			for (j=0;j<cur_eq.techs.length;j++){
				var cur_tech={};
				cur_tech.is_dummy=false;
				cur_tech.is_ts=false;
				if (cur_eq.techs[j].name.indexOf('/')>-1 && cur_eq.techs[j].name.split('/')[0]=='variable'){
					var temp=cur_eq.techs[j].name.split('(')[1];
					var dummy_id=parseInt(temp.split(')')[0])-1;
					cur_tech.is_dummy=true;
					if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
					cur_tech.name=json.variables[dummy_id].teXeq.replace('\\','/');
					tech_var.push(cur_tech);
					if (cur_tech.is_ts){
						if (is_first){
							type1_eq+= 'd_'+(dummy_id+1)+'^t' +  json.variables[dummy_id].teXeq+'^t';
							is_first=false;
						}else type1_eq+=' + d_'+(dummy_id+1)+'^t' + json.variables[dummy_id].teXeq+'^t';
					}else{
						if (is_first){
							type1_eq+= 'd_'+(dummy_id+1)+'^t' + json.variables[dummy_id].teXeq;
							is_first=false;
						}else  type1_eq+=' + d_'+(dummy_id+1)+'^t' + json.variables[dummy_id].teXeq;
					} 
				}else{
					var a_id=-1;
					if (cur_eq.techs[j].name.indexOf('/')==-1){
						var temp0=cur_eq.techs[j].name.split('(')[1];
						var tech_id=parseInt(temp0.split(')')[0]);
						if (cur_eq.is_act) cur_tech.name='x_'+tech_id;
						else cur_tech.name='y_'+tech_id;
						if (is_first){
							if (cur_eq.is_act){
								if (cur_eq.is_input) type1_eq+= 'a_'+tech_id+'^t x_'+tech_id+'^t';
								else type1_eq+= 'a_'+tech_id+'^t ((1/e_'+tech_id+'^t) x_'+tech_id+'^t)';
							}else type1_eq+= 'a_'+tech_id+'^t y_'+tech_id+'^t';
							is_first=false;
						}else{
							if (cur_eq.is_act){
								if (cur_eq.is_input) type1_eq+= ' + a_'+tech_id+'^t x_'+tech_id+'^t';
								else type1_eq+= ' + a_'+tech_id+'^t ((1/e_'+tech_id+'^t) x_'+tech_id+'^t)';
							}else type1_eq+= ' + a_'+tech_id+'^t y_'+tech_id+'^t';							
						} 
					}else{
						var temp=cur_eq.techs[j].name.split('/');
						var temp0=temp[0].split('(')[1];
						var tech_id=parseInt(temp0.split(')')[0]);
						var temp1=temp[1].split('(')[1];
						a_id=parseInt(temp1.split(')')[0]);
						if (cur_eq.is_act) cur_tech.name='x_('+tech_id+','+a_id+')';
						else cur_tech.name='y_'+tech_id;						
						if (is_first){
							if (cur_eq.is_act){
								if (cur_eq.is_input) type1_eq+= 'a_{('+tech_id+','+a_id+')}^t x_{('+tech_id+','+a_id+')}^t';
								else type1_eq+= 'a_{('+tech_id+','+a_id+')}^t ((1/e_{('+tech_id+','+a_id+')}^t) x_{('+tech_id+','+a_id+')}^t)';
							}else type1_eq+= 'a_'+tech_id+'^t y_'+tech_id+'^t';	
							is_first=false;
						}else{
							if (cur_eq.is_act){
								if (cur_eq.is_input) type1_eq+= ' + a_'+tech_id+'^t x_'+tech_id+'^t';
								else type1_eq+= ' + a_'+tech_id;+'^t (1/e_'+tech_id+'^t x_'+tech_id+'^t)';
							}else type1_eq+= ' + a_'+tech_id+'^t y_'+tech_id+'^t';							
							if (cur_eq.is_act){
								if (cur_eq.is_input) type1_eq+= ' + a_{('+tech_id+','+a_id+')}^t x_{('+tech_id+','+a_id+')}^t';
								else type1_eq+= ' + a_{('+tech_id+','+a_id+')}^t ((1/e_{('+tech_id+','+a_id+')}^t) x_{('+tech_id+','+a_id+')}^t)';
							}else type1_eq+= ' + a_'+tech_id+'^t y_'+tech_id+'^t';	
						} 
					}
					
					if (cur_eq.is_act && !cur_eq.is_input){  // make  a_i^t * (1/e_i^t)
						for (var ii=0;ii<json.techLevels.length;ii++){
							var tl=json.techLevels[ii];
							if (tech_id<=tl.techs[tl.techs.length-1].t_id){
								var arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-tech_id)-1;
								if (tl.techs[arr_t_id].t_id!=tech_id) alert(' t_id  error!');
								var out_ts;
								if (a_id==-1){
									if (tl.techs[arr_t_id].activities[0].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[0].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[0].outputs[0].value);
										}
										out_ts=temp.join(',');
									}
								}else{
									if (tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[a_id-1].outputs[0].value);
										}
										out_ts=temp.join(',');
									}									
								}
								if (out_ts.indexOf(',')>-1){
									cur_tech.ts=out_ts.split(',');
								}else{
									cur_tech.ts=[];
									for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
										cur_tech.ts.push(out_ts);
									}
								}
								break;
							}								
						}
					}
					
					tech_var.push(cur_tech);
				}
			}
			type1_eq+=' \\leq b^t, t \\in T</span>';
			
			lp+='\n\\type1 constraint name='+cur_eq.name+ ', type1_constraint_id= ' + (i+1);
			
			for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
				var t_i_li=$('<li/>').addClass('t_i_li');
				var cur_t_i_li='<span class="mymath">t</span>='+(t+1)+' : ';

				if (!cur_eq.is_act) lp+='\n\ttype1/capacity('+(i+1)+','+(t+1)+') : ';
				else if (cur_eq.is_input) lp+='\n\ttype1/activity/input('+(i+1)+','+(t+1)+') : ';
				else  lp+='\n\ttype1/activity/output('+(i+1)+','+(t+1)+') : ';
				for (ii=0;ii<tech_var.length+1;ii++){
					var cur_ts=ii*(json.general.lyear-json.general.fyear+1)+t;
					var cur_ts_val=Math.floor(parseFloat(ts[cur_ts])*1000)/1000;
					if (cur_eq.is_act && !cur_eq.is_input && ii<tech_var.length && !tech_var[ii].is_dummy ){
						cur_ts_val = Math.floor((cur_ts_val / parseFloat(tech_var[ii].ts[t]))*10000)/10000;
					}
					if (ii<tech_var.length){
						var temp, v_name, v_sub;
						if (tech_var[ii].name.indexOf('_')){
							temp=tech_var[ii].name.split('_');
							v_name=temp[0];
							v_sub=temp[1];
						}else{
							v_name=tech_var[ii].name;
						}
						if (tech_var[ii].is_dummy){
							if (tech_var[ii].is_ts){
								if (cur_ts_val>=0){
									lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1);	
									cur_t_i_li += ' + ' + cur_ts_val +' '  //+ tech_var[ii].name + '@' + (t+1);	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1)+'</sup>';	
								}else{
									lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1);	
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1)+'</sup>';	
								}
							}else{
								if (cur_ts_val>=0){
									lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name;	
									cur_t_i_li+= ' + ' + cur_ts_val +' '//+ tech_var[ii].name;	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub>';	
								}else{
									lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name;	
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name;	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub>';	
								}
							}
						}else{
							if (cur_ts_val>=0){
								lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1);	
								cur_t_i_li+= ' + ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1)+'</sup>';	
							}else{
								lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1);	
								cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1)+'</sup>';	
							}
						}								
					}else{
						if (cur_eq.eqType=='ge'){
							lp+=' >= ' + cur_ts_val ;
							cur_t_i_li+=' &ge; ' + cur_ts_val ;
						}else if (cur_eq.eqType=='eq'){
							lp+=' = ' + cur_ts_val ;
							cur_t_i_li+=' = ' + cur_ts_val ;
						}else{
							lp+=' <= ' + cur_ts_val ;
							cur_t_i_li+=' &le; ' + cur_ts_val ;
						}								
					}							
				}
				cur_t_i_li+='</span>';
				t_i_li.append('').html(cur_t_i_li);
				t1_ul.append(t_i_li);
				
			}
			t1_li.append('').html(type1_eq);
			t1_li.append(t1_ul);				
			$(t1_ul).hide();
			type1_ul.append(t1_li);
			
		}
	}
	type1_main_li.append(type1_ul);
	$(type1_ul).hide();
	$("#lpConstraintUl").append(type1_main_li);


	
	var type2_main_li=$('<li/>').addClass('main_li');
	type2_main_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'<span style="font-size:15px;margin-left:10px" class="const_name">Type-2 : </span>'
									+'<span class="math">'
									+ "\\displaystyle\\ \\sum_{i\\in I'} \\sum_{s=1}^t {a_i^s x_i^s \\leq b^t} , \\quad \\text{for } \\, I'  \\subseteq I, t \\in T"+
									'</span>');

	var type2_ul=$('<ul/>');
	
	lp+='\n\n\\type 2 constraints';
	for (i=0;i<json.constraints.type2.length;i++){
		var cur_eq=json.constraints.type2[i];
		if (cur_eq.addToLP){
			var t1_li=$('<li/>').addClass('i_li');
			var t1_ul=$('<ul/>').addClass('i_ul');
			var type2_eq;
			if (!cur_eq.is_act){
				type2_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for capacity, name = '+cur_eq.name+', <span class="math">';
			}else if (cur_eq.is_input){
				type2_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for activity/input, name = '+cur_eq.name+', <span class="math">';				
			}else{
				type2_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for activity/output, name = '+cur_eq.name+', <span class="math">';				
			} 

			var addr=validateRange(cur_eq.excelMatrixRange);
			if ((addr[3]-addr[1])!=cur_eq.techs.length) alert('excel Range error :' + 'type2 constraint name =' + cur_eq.name);
			var ts=cur_eq.ts.split(',');
			var tech_var=[];
			var is_first=true;
			var is_occured=false, is_closed=false;
			for (j=0;j<cur_eq.techs.length;j++){
				var cur_tech={};
				cur_tech.is_dummy=false;
				cur_tech.is_ts=false;
				if (cur_eq.techs[j].name.indexOf('/')>-1 && cur_eq.techs[j].name.split('/')[0]=='variable'){
					var temp=cur_eq.techs[j].name.split('(')[1];
					var dummy_id=parseInt(temp.split(')')[0])-1;
					if (is_occured){ type2_eq+= ')'; is_closed=true;}
					cur_tech.is_dummy=true;
					if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
					cur_tech.name=json.variables[dummy_id].teXeq.replace('\\','/');
					tech_var.push(cur_tech);
					if (cur_tech.is_ts){
						if (is_first){
							type2_eq+= 'd_'+(dummy_id+1)+'^t' + json.variables[dummy_id].teXeq+'^t';
							is_first=false;
						}else type2_eq+=' + d_'+(dummy_id+1)+'^t' + json.variables[dummy_id].teXeq+'^t';
					}else{
						if (is_first){
							type2_eq+= 'd_'+(dummy_id+1)+'^t' +  json.variables[dummy_id].teXeq;
							is_first=false;
						}else  type2_eq+=' + d_'+(dummy_id+1)+'^t' + json.variables[dummy_id].teXeq;
					} 
				}else{
					is_occured=true;
					var a_id=-1;
					if (cur_eq.techs[j].name.indexOf('/')==-1){
						var temp0=cur_eq.techs[j].name.split('(')[1];
						var tech_id=parseInt(temp0.split(')')[0]);
						if (cur_eq.is_act) cur_tech.name='x_'+tech_id;
						else cur_tech.name='y_'+tech_id;
						if (is_first){
							if (cur_eq.is_act){
								if (cur_eq.is_input) type2_eq+=  '\\displaystyle\\ \\sum_{s=1}^t (' + 'a_'+tech_id+'^s x_'+tech_id+'^s';
								else type2_eq+=  '\\displaystyle\\ \\sum_{s=1}^t (' + 'a_'+tech_id+'^s ((1/e_'+tech_id+'^s) x_'+tech_id+'^s)';
							}else type2_eq+= '\\displaystyle\\ \\sum_{s=1}^t (' +  'a_'+tech_id+'^s y_'+tech_id+'^s';
							is_first=false;
						}else{
							if (cur_eq.is_act){
								if (cur_eq.is_input) type2_eq+= ' + a_'+tech_id+'^s x_'+tech_id+'^s';
								else type2_eq+= ' + a_'+tech_id+'^s ((1/e_'+tech_id+'^s) x_'+tech_id+'^s)';
							}else type2_eq+= ' + a_'+tech_id+'^s y_'+tech_id+'^s';							
						} 
					}else{
						var temp=cur_eq.techs[j].name.split('/');
						var temp0=temp[0].split('(')[1];
						var tech_id=parseInt(temp0.split(')')[0]);
						var temp1=temp[1].split('(')[1];
						a_id=parseInt(temp1.split(')')[0]);
						if (cur_eq.is_act) cur_tech.name='x_('+tech_id+','+a_id+')';
						else cur_tech.name='y_'+tech_id;						
						if (is_first){
							if (cur_eq.is_act){
								if (cur_eq.is_input) type2_eq+=  '\\displaystyle\\ \\sum_{s=1}^t (' + 'a_{('+tech_id+','+a_id+')}^s x_{('+tech_id+','+a_id+')}^s';
								else type2_eq+= 'a_{('+tech_id+','+a_id+')}^s ((1/e_{('+tech_id+','+a_id+')}^s) x_{('+tech_id+','+a_id+')}^s)';
							}else type2_eq+= 'a_'+tech_id+'^s y_'+tech_id+'^s';	
							is_first=false;
						}else{
							if (cur_eq.is_act){
								if (cur_eq.is_input) type2_eq+= ' + a_'+tech_id+'^s x_'+tech_id+'^s';
								else type2_eq+= ' + a_'+tech_id;+'^s (1/e_'+tech_id+'^s x_'+tech_id+'^s)';
							}else type2_eq+= ' + a_'+tech_id+'^s y_'+tech_id+'^s';							
							if (cur_eq.is_act){
								if (cur_eq.is_input) type2_eq+= ' + a_{('+tech_id+','+a_id+')}^s x_{('+tech_id+','+a_id+')}^s';
								else type2_eq+= ' + a_{('+tech_id+','+a_id+')}^s ((1/e_{('+tech_id+','+a_id+')}^s) x_{('+tech_id+','+a_id+')}^s)';
							}else type2_eq+= ' + a_'+tech_id+'^s y_'+tech_id+'^s';	
						} 
					}
					
					if (cur_eq.is_act && !cur_eq.is_input){
						for (var ii=0;ii<json.techLevels.length;ii++){
							var tl=json.techLevels[ii];
							if (tech_id<=tl.techs[tl.techs.length-1].t_id){
								var arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-tech_id)-1;
								if (tl.techs[arr_t_id].t_id!=tech_id) alert(' t_id  error!');
								var out_ts;
								if (a_id==-1){
									if (tl.techs[arr_t_id].activities[0].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[0].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[0].outputs[0].value);
										}
										out_ts=temp.join(',');
									}
								}else{
									if (tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[a_id-1].outputs[0].value);
										}
										out_ts=temp.join(',');
									}									
								}
								if (out_ts.indexOf(',')>-1){
									cur_tech.ts=out_ts.split(',');
								}else{
									cur_tech.ts=[];
									for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
										cur_tech.ts.push(out_ts);
									}
								}
								break;
							}								
						}
					}
					
					tech_var.push(cur_tech);
				}
			}
			if (!is_closed) type2_eq+= ')'; 
			type2_eq+=' \\leq b^t, t \\in T</span>';
			
			lp+='\n\\type2 constraint name='+cur_eq.name+ ', type2_constraint_id= ' + (i+1);
			
			for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
				var t_i_li=$('<li/>').addClass('t_i_li');
				var cur_t_i_li='<span class="mymath">t</span>='+(t+1)+' : ';

				if (!cur_eq.is_act) lp+='\n\ttype2/capacity('+(i+1)+','+(t+1)+') : ';
				else if (cur_eq.is_input) lp+='\n\ttype2/activity/input('+(i+1)+','+(t+1)+') : ';
				else  lp+='\n\ttype2/activity/output('+(i+1)+','+(t+1)+') : ';
				for (ii=0;ii<tech_var.length+1;ii++){
					var cur_ts=ii*(json.general.lyear-json.general.fyear+1)+t;
					var cur_ts_val=Math.floor(parseFloat(ts[cur_ts])*1000)/1000;
					if (cur_eq.is_act && !cur_eq.is_input && ii<tech_var.length && !tech_var[ii].is_dummy ){
						cur_ts_val = Math.floor((cur_ts_val / parseFloat(tech_var[ii].ts[t]))*10000)/10000;
					}
					if (ii<tech_var.length){
						var temp, v_name, v_sub;
						if (tech_var[ii].name.indexOf('_')){
							temp=tech_var[ii].name.split('_');
							v_name=temp[0];
							v_sub=temp[1];
						}else{
							v_name=tech_var[ii].name;
						}
						if (tech_var[ii].is_dummy){
							if (tech_var[ii].is_ts){
								if (cur_ts_val>=0){
									lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1);	
									cur_t_i_li += ' + ' + cur_ts_val +' '  //+ tech_var[ii].name + '@' + (t+1);	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1)+'</sup>';	
								}else{
									lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1);	
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1)+'</sup>';	
								}
							}else{
								if (cur_ts_val>=0){
									lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name;	
									cur_t_i_li+= ' + ' + cur_ts_val +' '//+ tech_var[ii].name;	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub>';	
								}else{
									lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name;	
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name;	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub>';	
								}
							}
						}else{
							for (s=0;s<=t;s++) {
								cur_ts=ii*(json.general.lyear-json.general.fyear+1)+s;
								cur_ts_val=Math.floor(parseFloat(ts[cur_ts])*1000)/1000;
								if (cur_eq.is_act && !cur_eq.is_input && ii<tech_var.length && !tech_var[ii].is_dummy ){
									cur_ts_val = Math.floor((cur_ts_val / parseFloat(tech_var[ii].ts[s]))*1000)/1000;
								}
								if (cur_ts_val>=0){
									lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (s+1);	
									cur_t_i_li+= ' + ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
														+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(s+1)+'</sup>';	
								}else{
									lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (s+1);	
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
														+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(s+1)+'</sup>';	
								}
							}
						}								
					}else{
						if (cur_eq.eqType=='ge'){
							lp+=' >= ' + cur_ts_val ;
							cur_t_i_li+=' &ge; ' + cur_ts_val ;
						}else if (cur_eq.eqType=='eq'){
							lp+=' = ' + cur_ts_val ;
							cur_t_i_li+=' = ' + cur_ts_val ;
						}else{
							lp+=' <= ' + cur_ts_val ;
							cur_t_i_li+=' &le; ' + cur_ts_val ;
						}								
					}							
				}
				cur_t_i_li+='</span>';
				t_i_li.append('').html(cur_t_i_li);
				t1_ul.append(t_i_li);
				
			}
			t1_li.append('').html(type2_eq);
			t1_li.append(t1_ul);				
			$(t1_ul).hide();
			type2_ul.append(t1_li);
			
		}
	}
	type2_main_li.append(type2_ul);
	$(type2_ul).hide();
	$("#lpConstraintUl").append(type2_main_li);


	
	
	
	var type3_main_li=$('<li/>').addClass('main_li');
	type3_main_li.append('').html('<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
									+'<span style="font-size:15px;margin-left:10px" class="const_name">Type-3 : </span>'
									+'<span class="math">'
									+ "\\displaystyle\\ \\sum_{i \\in I'} \\sum_{s \\in S_i} {a_{(i,s)}^t x_i^{t+s} \\leq b^t} ,  S_i \\subseteq T\\cup\\{0,-1,-2,\\cdots\\}, I'\\subseteq I, t \\in T"+ 
									'</span>');

	var type3_ul=$('<ul/>');
	
	lp+='\n\n\\type 3 constraints';
	for (i=0;i<json.constraints.type3.length;i++){
		var cur_eq=json.constraints.type3[i];
		if (cur_eq.addToLP){
			var t1_li=$('<li/>').addClass('i_li');
			var t1_ul=$('<ul/>').addClass('i_ul');
			var type3_eq;
			if (!cur_eq.is_act){
				type3_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for capacity, name = '+cur_eq.name+', <span class="math">';
			}else if (cur_eq.is_input){
				type3_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for activity/input, name = '+cur_eq.name+', <span class="math">';				
			}else{
				type3_eq='<span class="bullet"><i class="fa fa-plus-circle" style="color:green"></i></span>'
							+'for activity/output, name = '+cur_eq.name+', <span class="math">';				
			} 

			//var addr=validateRange(cur_eq.excelMatrixRange);
			//if ((addr[3]-addr[1])!=cur_eq.techs.length) alert('excel Range error :' + 'type3 constraint name =' + cur_eq.name);
			var ts=cur_eq.ts.split(',');
			var tech_var=[];
			var is_first=true;
			for (j=0;j<cur_eq.techs.length;j++){
				var cur_tech={};
				cur_tech.is_dummy=false;
				cur_tech.is_ts=false;
				if (cur_eq.techs[j].name.indexOf('/')>-1 && cur_eq.techs[j].name.split('/')[0]=='variable'){
					var temp=cur_eq.techs[j].name.split('(')[1];
					var dummy_id=parseInt(temp.split(')')[0])-1;
					cur_tech.is_dummy=true;
					if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
					cur_tech.name=json.variables[dummy_id].teXeq.replace('\\','/');
					cur_tech.dummy_id=dummy_id;
					tech_var.push(cur_tech);
					if (cur_tech.is_ts){
						for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
							var last='';
							if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
							else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
							else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
							if (is_first){
								type3_eq+= 'd_{('+(dummy_id+1)+','+cur_eq.techs[j].S_is[jj].S_i+')}^t' +  json.variables[dummy_id].teXeq+'^{t' + last +'}';
								is_first=false;
							}else type3_eq+= ' + d_{('+(dummy_id+1)+','+cur_eq.techs[j].S_is[jj].S_i+')}^t' +  json.variables[dummy_id].teXeq+'^{t' + last +'}';
						}
					}else{
						for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
							if (is_first){
								type3_eq+= 'd_{('+(dummy_id+1)+','+cur_eq.techs[j].S_is[jj].S_i+')}^t' +  json.variables[dummy_id].teXeq;
								is_first=false;
							}else type3_eq+= ' + d_{('+(dummy_id+1)+','+cur_eq.techs[j].S_is[jj].S_i+')}^t' +  json.variables[dummy_id].teXeq;
						}
					} 
				}else{
					var a_id=-1;
					if (cur_eq.techs[j].name.indexOf('/')==-1){
						var temp0=cur_eq.techs[j].name.split('(')[1];
						var tech_id=parseInt(temp0.split(')')[0]);
						if (cur_eq.is_act) cur_tech.name='x_'+tech_id;
						else cur_tech.name='y_'+tech_id;
						cur_tech.t_id=tech_id;
						if (cur_eq.is_act){
							cur_tech.is_act=true;
							if (cur_eq.is_input){
								for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
									var last='';
									if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
									else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
									else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
									if (is_first){
										type3_eq+= 'a_{('+tech_id+','+cur_eq.techs[j].S_is[jj].S_i+')}^t x_'+tech_id+'^{t' + last +'}';
										is_first=false;
									}else type3_eq+= ' + a_{('+tech_id+','+cur_eq.techs[j].S_is[jj].S_i+')}^t x_'+tech_id+'^{t' + last +'}';
								}
								cur_tech.is_input=true;
							}else{
								for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
									var last='';
									if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
									else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
									else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
									if (is_first){
										type3_eq+= 'a_{('+tech_id+','+cur_eq.techs[j].S_is[jj].S_i+')}^t ((1/e_'+tech_id+'^{t' + last +'}) x_'+tech_id+'^{t' + last +'})';
										is_first=false;
									}else type3_eq+= ' + a_{('+tech_id+','+cur_eq.techs[j].S_is[jj].S_i+')}^t ((1/e_'+tech_id+'^{t' + last +'}) x_'+tech_id+'^{t' + last +'})';
								}
								cur_tech.is_input=false;
							}  
						}else{
							cur_tech.is_act=false;
							for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
								var last='';
								if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
								else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
								else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
								if (is_first){
									type3_eq+= 'a_{('+tech_id+','+cur_eq.techs[j].S_is[jj].S_i+')}^t y_'+tech_id+'^{t' + last +'}';
									is_first=false;
								}else type3_eq+= ' + a_{('+tech_id+','+cur_eq.techs[j].S_is[jj].S_i+')}^t y_'+tech_id+'^{t' + last +'}';
							}								
						} 
					}else{
						var temp=cur_eq.techs[j].name.split('/');
						var temp0=temp[0].split('(')[1];
						var tech_id=parseInt(temp0.split(')')[0]);
						var temp1=temp[1].split('(')[1];
						a_id=parseInt(temp1.split(')')[0]);
						cur_tech.t_id=tech_id;
						cur_tech.a_id=a_id;
						if (cur_eq.is_act) cur_tech.name='x_('+tech_id+','+a_id+')';
						else cur_tech.name='y_'+tech_id;						
						if (cur_eq.is_act){
							if (cur_eq.is_input){
								for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
									var last='';
									if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
									else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
									else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
									if (is_first){
										type3_eq+= 'a_{('+tech_id+','+a_id+'),'+cur_eq.techs[j].S_is[jj].S_i+')}^t x_'+tech_id+'^{t' + last +'}';
										is_first=false;
									}else type3_eq+= ' + a_{('+tech_id+','+a_id+'),'+cur_eq.techs[j].S_is[jj].S_i+')}^t x_'+tech_id+'^{t' + last +'}';
								}
							}else{
								for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
									var last='';
									if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
									else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
									else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
									if (is_first){
										type3_eq+= 'a_{('+tech_id+','+a_id+'),'+cur_eq.techs[j].S_is[jj].S_i+')}^t ((1/e_'+tech_id+'^{t' + last +'}) x_'+tech_id+'^{t' + last +'})';
										is_first=false;
									}else type3_eq+= ' + a_{('+tech_id+','+a_id+'),'+cur_eq.techs[j].S_is[jj].S_i+')}^t ((1/e_'+tech_id+'^{t' + last +'}) x_'+tech_id+'^{t' + last +'})';
								}									
							}  
						}else{
							for (var jj=0;jj<cur_eq.techs[j].S_is.length;jj++){
								var last='';
								if (cur_eq.techs[j].S_is[jj].S_i<0) last=cur_eq.techs[j].S_is[jj].S_i; 
								else if (cur_eq.techs[j].S_is[jj].S_i==0) last=''; 
								else  last='+'+cur_eq.techs[j].S_is[jj].S_i; 
								if (is_first){
									type3_eq+= 'a_{('+tech_id+','+a_id+'),'+cur_eq.techs[j].S_is[jj].S_i+')}^t y_'+tech_id+'^{t' + last +'}';
									is_first=false;
								}else type3_eq+= ' + a_{('+tech_id+','+a_id+'),'+cur_eq.techs[j].S_is[jj].S_i+')}^t y_'+tech_id+'^{t' + last +'}';
							}								
						} 
					}
					
					if (cur_eq.is_act && !cur_eq.is_input){   // make  a_i^t * (1/e_i^t)
						for (var ii=0;ii<json.techLevels.length;ii++){
							var tl=json.techLevels[ii];
							if (tech_id<=tl.techs[tl.techs.length-1].t_id){
								var arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-tech_id)-1;
								if (tl.techs[arr_t_id].t_id!=tech_id) alert(' t_id  error!');
								var out_ts;
								if (a_id==-1){
									if (tl.techs[arr_t_id].activities[0].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[0].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[0].outputs[0].value);
										}
										out_ts=temp.join(',');
									}
								}else{
									if (tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[a_id-1].outputs[0].value);
										}
										out_ts=temp.join(',');
									}									
								}
								//if (a_id==-1) out_ts=tl.techs[arr_t_id].activities[0].outputs[0].value.ts;
								//else out_ts=tl.techs[arr_t_id].activities[a_id-1].outputs[0].value.ts;
								if (out_ts.indexOf(',')>-1){
									cur_tech.ts=out_ts.split(',');
								}else{
									cur_tech.ts=[];
									for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
										cur_tech.ts.push(out_ts);
									}
								}
								break;
							}								
						}
					}
					
					tech_var.push(cur_tech);
				}
			}
			type3_eq+=' \\leq b^t, t \\in T</span>';
			
			lp+='\n\\type3 constraint name='+cur_eq.name+ ', type3_constraint_id= ' + (i+1);

			for (var ii=0;ii<tech_var.length;ii++){
				for (var jj=0;jj<cur_eq.techs[ii].S_is.length;jj++){
					var cur_S_i=cur_eq.techs[ii].S_is[jj];
					if (cur_S_i.hasOwnProperty('init')){
						var S_i=cur_eq.techs[ii].S_is[jj].S_i;
						var init=cur_S_i.init;
						var t_i_li=$('<li/>').addClass('t_i_li');
						var cur_t_i_li='<span class="mymath">t</span>='+(S_i+1)+' : ';

						if (!cur_eq.is_act) lp+='\n\ttype3/capacity('+(i+1)+','+tech_var[ii].name+'+$'+(-(S_i+1))+') : ';
						else if (cur_eq.is_input) lp+='\n\ttype3/activity/input('+(i+1)+','+tech_var[ii].name+'$'+(-(S_i+1))+') : ';
						else  lp+='\n\ttype3/activity/output('+(i+1)+','+tech_var[ii].name+'$'+(-(S_i+1))+') : ';
						
						var temp, v_name, v_sub;
						if (tech_var[ii].name.indexOf('_')){
							temp=tech_var[ii].name.split('_');
							v_name=temp[0];
							v_sub=temp[1];
						}else{
							v_name=tech_var[ii].name;
						}
						if (tech_var[ii].is_dummy){
							if (tech_var[ii].is_ts){
								if ((S_i+1)<0) lp+= tech_var[ii].name + '@$' + (-(S_i+1));	
								else lp+= tech_var[ii].name + '@' + (S_i+1);	
								cur_t_i_li += '<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(S_i+1)+'</sup>';	
							}
						}else{
							if ((S_i+1)<0) lp+= tech_var[ii].name + '@$' + (-(S_i+1));	
							else lp+= tech_var[ii].name + '@' + (S_i+1);	
							cur_t_i_li+= '  <span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(S_i+1)+'</sup>';	
						}
						lp+= ' = '+init;
						cur_t_i_li+='</span> = ' + init;
						t_i_li.append('').html(cur_t_i_li);
						t1_ul.append(t_i_li);			
					}
				}
			}
			
			for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
				var t_i_li=$('<li/>').addClass('t_i_li');
				var cur_t_i_li='<span class="mymath">t</span>='+(t+1)+' : ';
				var cur_row=0;

				if (!cur_eq.is_act) lp+='\n\ttype3/capacity('+(i+1)+','+(t+1)+') : ';
				else if (cur_eq.is_input) lp+='\n\ttype3/activity/input('+(i+1)+','+(t+1)+') : ';
				else  lp+='\n\ttype3/activity/output('+(i+1)+','+(t+1)+') : ';
				
				for (ii=0;ii<tech_var.length;ii++){
					for (jj=0;jj<cur_eq.techs[ii].S_is.length;jj++){
						var S_i=cur_eq.techs[ii].S_is[jj].S_i;
						var init=cur_eq.techs[ii].S_is[jj].init;
						for (var ss=0;ss<cur_eq.techs[ii].S_is.length;ss++){
							
						}
						var cur_ts=cur_row*(json.general.lyear-json.general.fyear+1)+t;
						var cur_ts_val=Math.floor(parseFloat(ts[cur_ts])*1000)/1000;
						if (cur_eq.is_act && !cur_eq.is_input && !tech_var[ii].is_dummy ){
							cur_ts_val = Math.floor((cur_ts_val / parseFloat(tech_var[ii].ts[t]))*10000)/10000;
						}
						var temp, v_name, v_sub;
						if (tech_var[ii].name.indexOf('_')){
							temp=tech_var[ii].name.split('_');
							v_name=temp[0];
							v_sub=temp[1];
						}else{
							v_name=tech_var[ii].name;
						}
						if (tech_var[ii].is_dummy){
							if (tech_var[ii].is_ts){
								if ((t+1+S_i)<=(json.general.lyear-json.general.fyear+1)){
									if (cur_ts_val>=0){
										if ((t+1+S_i)<0) lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@$' + (-(t+1+S_i));
										else lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1+S_i);									
										cur_t_i_li += ' + ' + cur_ts_val +' '  //+ tech_var[ii].name + '@' + (t+1);	
														+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1+S_i)+'</sup>';	
									}else{
										if ((t+1+S_i)<0) lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@$' + (-(t+1+S_i));
										else lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1+S_i);									
										cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
														+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1+S_i)+'</sup>';	
									}
								}
							}else{
								if (cur_ts_val>=0){
									lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name;	
									cur_t_i_li+= ' + ' + cur_ts_val +' '//+ tech_var[ii].name;	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub>';	
								}else{
									lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name;	
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name;	
													+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub>';	
								}
							}
						}else{
							if ((t+1+S_i)<=(json.general.lyear-json.general.fyear+1)){
								if (cur_ts_val>=0){
									if ((t+1+S_i)<0) lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@$' + (-(t+1+S_i));
									else lp+= ' + ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1+S_i);									
									cur_t_i_li+= ' + ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
														+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1+S_i)+'</sup>';	
								}else{
									if ((t+1+S_i)<0) lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@$' + (-(t+1+S_i));
									else lp+= ' ' + cur_ts_val +' '+ tech_var[ii].name + '@' + (t+1+S_i);									
									cur_t_i_li+= ' ' + cur_ts_val +' '//+ tech_var[ii].name + '@' + (t+1);	
														+'<span class="mymath">'+v_name+'</span><sub>'+v_sub+'</sub><sup>'+(t+1+S_i)+'</sup>';	
								}
							}
						}
						cur_row++;
					}
								
				}
				// for RHS
				var cur_ts=cur_row*(json.general.lyear-json.general.fyear+1)+t;
				var cur_ts_val=Math.floor(parseFloat(ts[cur_ts])*1000)/1000;
				
				if (cur_eq.eqType=='ge'){
					lp+=' >= ' + cur_ts_val ;
					cur_t_i_li+=' &ge; ' + cur_ts_val ;
				}else if (cur_eq.eqType=='eq'){
					lp+=' = ' + cur_ts_val ;
					cur_t_i_li+=' = ' + cur_ts_val ;
				}else{
					lp+=' <= ' + cur_ts_val ;
					cur_t_i_li+=' &le; ' + cur_ts_val ;
				}								
				
				cur_t_i_li+='</span>';
				t_i_li.append('').html(cur_t_i_li);
				t1_ul.append(t_i_li);			
			}
			t1_li.append('').html(type3_eq);
			t1_li.append(t1_ul);				
			$(t1_ul).hide();
			type3_ul.append(t1_li);
			
		}
	}
	type3_main_li.append(type3_ul);
	$(type3_ul).hide();
	$("#lpConstraintUl").append(type3_main_li);
	
	
}
function generate_short_type1(){
	lp+='\n\n\\type 1(lower bound/upper bound/equal) constraints';	
	for (i=0;i<json.constraints.short_type1.length;i++){
		var cur=json.constraints.short_type1[i];
		for (j=0;j<cur.techs.length;j++){
			var tech=cur.techs[j];
			
			var cur_tech={};
			if (tech.name.indexOf('/')>-1 && tech.name.split('/')[0]=='variable'){
				var temp=tech.name.split('(')[1];
				var dummy_id=parseInt(temp.split(')')[0])-1;
				cur_tech.is_dummy=true;
				if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
				cur_tech.name=json.variables[dummy_id].teXeq.replace('\\','/');
				cur_tech.dummy_id=dummy_id+1;
			}else{
				if (tech.name.indexOf('/')==-1){
					var temp0=tech.name.split('(')[1];
					cur_tech.t_id=parseInt(temp0.split(')')[0]);
				}else{
					var temp=tech.name.split('/');
					var temp0=temp[0].split('(')[1];
					cur_tech.t_id=parseInt(temp0.split(')')[0]);
					var temp1=temp[1].split('(')[1];
					cur_tech.a_id=parseInt(temp1.split(')')[0]);
				}
			}
			
			
			if (i==1 && !cur_tech.hasOwnProperty('is_dummy')){	// make  a_i^t * (1/e_i^t)
						for (var ii=0;ii<json.techLevels.length;ii++){
							var tl=json.techLevels[ii];
							if (cur_tech.t_id<=tl.techs[tl.techs.length-1].t_id){
								var arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-cur_tech.t_id)-1;
								if (tl.techs[arr_t_id].t_id!=cur_tech.t_id) alert(' t_id  error!');
								var out_ts;
								if (cur_tech.hasOwnProperty('a_id')){
									if (tl.techs[arr_t_id].activities[cur_tech.a_id-1].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[cur_tech.a_id-1].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[cur_tech.a_id-1].outputs[0].value);
										}
										out_ts=temp.join(',');
									}									
								}else{
									if (tl.techs[arr_t_id].activities[0].outputs[0].value.hasOwnProperty('ts'))
										out_ts=tl.techs[arr_t_id].activities[0].outputs[0].value.ts;
									else{
										var temp=[];
										for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
											temp.push(tl.techs[arr_t_id].activities[0].outputs[0].value);
										}
										out_ts=temp.join(',');
									}
								}
								if (out_ts.indexOf(',')>-1){
									cur_tech.ts=out_ts.split(',');
								}else{
									cur_tech.ts=[];
									for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
										cur_tech.ts.push(out_ts);
									}
								}
								break;
							}								
						}					
			}

			if (tech.lower.hasOwnProperty('addToLP') && tech.lower.addToLP){
				var cur_lp;
				if (cur_tech.hasOwnProperty('is_dummy')) cur_lp='\n\t\t'+cur.name+',lower(dummy'+cur_tech.dummy_id+',';
				else if (cur_tech.hasOwnProperty('a_id'))  cur_lp='\n\t\t'+cur.name+',lower(('+cur_tech.t_id+','+cur_tech.a_id+'),';
				else  cur_lp='\n\t\t'+cur.name+',lower('+cur_tech.t_id+',';
				lp+='\n\t\\'+cur.name+','+tech.name+',lower';
				var ts;
				if (tech.lower.hasOwnProperty('ts')){
					ts=tech.lower.ts.split(',');
				}
				if (cur_tech.hasOwnProperty('is_dummy')){
					if (!cur_tech.hasOwnProperty('is_ts')) 
						if (tech.lower.hasOwnProperty('ts')) lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + ' >= ' + ts[0];	
						else lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + ' >= ' + tech.lower.value;	
					else{
						if (tech.lower.hasOwnProperty('ts')){
							for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++)
								lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + '@' + (t+1)+' >= ' + ts[t];							
						}else{
							for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++)
								lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + '@' + (t+1)+' >= '+ tech.lower.value;	
						}
					}
				}else{					
					if (tech.lower.hasOwnProperty('ts')){
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							if (cur_tech.hasOwnProperty('a_id')){
								if (i==0) lp+= cur_lp + (t+1)+'): + x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' >= ' + ts[t];								
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' >= ' + ts[t];
								else  lp+= cur_lp + (t+1)+'): + y_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' >= ' + ts[t];								
							}else{
								if (i==0) lp+= cur_lp + (t+1)+'): + x_'+ cur_tech.t_id + '@' + (t+1)+' >= ' + ts[t];								
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_'+ cur_tech.t_id + '@' + (t+1)+' >= ' + ts[t];								
								else lp+= cur_lp + (t+1)+'): + y_'+ cur_tech.t_id + '@' + (t+1)+' >= ' + ts[t];								
							}
						}
					}else{
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							if (cur_tech.hasOwnProperty('a_id')){
								if (i==0) lp+= cur_lp + (t+1)+'): + x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' >= ' + tech.lower.value;	
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' >= ' + tech.lower.value;	
								else lp+= cur_lp + (t+1)+'): + y_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' >= ' + tech.lower.value;	
							}else{
								if (i==0) lp+= cur_lp + (t+1)+'): + x_'+ cur_tech.t_id + '@' + (t+1)+' >= ' + tech.lower.value;	
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_'+ cur_tech.t_id + '@' + (t+1)+' >= ' + tech.lower.value;	
								else lp+= cur_lp + (t+1)+'): + y_'+ cur_tech.t_id + '@' + (t+1)+' >= ' + tech.lower.value;	
							}
						}
					}						
				}
			}
			
			if (tech.upper.hasOwnProperty('addToLP') && tech.upper.addToLP){
				var cur_lp;
				if (cur_tech.hasOwnProperty('is_dummy')) cur_lp='\n\t\t'+cur.name+',upper(dummy'+cur_tech.dummy_id+',';
				else if (cur_tech.hasOwnProperty('a_id'))  cur_lp='\n\t\t'+cur.name+',upper(('+cur_tech.t_id+','+cur_tech.a_id+'),';
				else  cur_lp='\n\t\t'+cur.name+',upper('+cur_tech.t_id+',';
				lp+='\n\t\\'+cur.name+','+tech.name+',upper';
				var ts;
				if (tech.upper.hasOwnProperty('ts')){
					ts=tech.upper.ts.split(',');
				}
				if (cur_tech.hasOwnProperty('is_dummy')){
					if (!cur_tech.hasOwnProperty('is_ts')) 
						if (tech.upper.hasOwnProperty('ts')) lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + ' <= ' + ts[0];	
						else lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + ' <= ' + tech.upper.value;	
					else{
						if (tech.upper.hasOwnProperty('ts')){
							for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++)
								lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + '@' + (t+1)+' <= ' + ts[t];							
						}else{
							for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++)
								lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + '@' + (t+1)+' <= '+ tech.upper.value;	
						}
					}
				}else{					
					if (tech.upper.hasOwnProperty('ts')){
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							if (cur_tech.hasOwnProperty('a_id')){
								if (i==0) lp+= cur_lp + (t+1)+'): + x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' <= ' + ts[t];								
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' <= ' + ts[t];
								else  lp+= cur_lp + (t+1)+'): + y_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' <= ' + ts[t];								
							}else{
								if (i==0) lp+= cur_lp + (t+1)+'): + x_'+ cur_tech.t_id + '@' + (t+1)+' <= ' + ts[t];								
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_'+ cur_tech.t_id + '@' + (t+1)+' <= ' + ts[t];								
								else lp+= cur_lp + (t+1)+'): + y_'+ cur_tech.t_id + '@' + (t+1)+' <= ' + ts[t];								
							}
						}
					}else{
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							if (cur_tech.hasOwnProperty('a_id')){
								if (i==0) lp+= cur_lp + (t+1)+'): + x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' <= ' + tech.upper.value;	
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' <= ' + tech.upper.value;	
								else lp+= cur_lp + (t+1)+'): + y_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (t+1)+' <= ' + tech.upper.value;	
							}else{
								if (i==0) lp+= cur_lp + (t+1)+'): + x_'+ cur_tech.t_id + '@' + (t+1)+' <= ' + tech.upper.value;	
								else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_'+ cur_tech.t_id + '@' + (t+1)+' <= ' + tech.upper.value;	
								else lp+= cur_lp + (t+1)+'): + y_'+ cur_tech.t_id + '@' + (t+1)+' <= ' + tech.upper.value;	
							}
						}
					}						
				}
			}
			
			
			if (tech.equal.hasOwnProperty('addToLP') && tech.equal.addToLP){
				var cur_lp;
				if (cur_tech.hasOwnProperty('is_dummy')) cur_lp='\n\t\t'+cur.name+',equal(dummy'+cur_tech.dummy_id+',';
				else if (cur_tech.hasOwnProperty('a_id'))  cur_lp='\n\t\t'+cur.name+',equal(('+cur_tech.t_id+','+cur_tech.a_id+'),';
				else  cur_lp='\n\t\t'+cur.name+',equal('+cur_tech.t_id+',';
				lp+='\n\t\\'+cur.name+','+tech.name+',equal';
				var years, RHS;
				if (tech.equal.hasOwnProperty('years')){
					years=tech.equal.years.ts.split(',');
					RHS=tech.equal.RHS.ts.split(',');						
					if (years.length!=RHS.length) alert('years.length!=RHS.length in short_type3');
				}
				if (cur_tech.hasOwnProperty('is_dummy')){
					if (cur_tech.hasOwnProperty('is_ts')){
						for (var t=0;t<years.length;t++){						
							lp+= cur_lp + (t+1)+'): + '+ cur_tech.name + '@' + (parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];							
						}
					}else{
						if (tech.equal.hasOwnProperty('ts')){
							lp+= cur_lp + (t+1)+'): + '+ cur_tech.name +' = ' + RHS[0];							
						}else{
							lp+= cur_lp + (t+1)+'): + '+ cur_tech.name +' = ' + tech.equal.RHS.value;							
						}
					}
				}else{					
					if (!tech.equal.years.hasOwnProperty('ts') || !tech.equal.RHS.hasOwnProperty('ts')) alert('years or RHS error!!!');
					for (var t=0;t<years.length;t++){
						if (cur_tech.hasOwnProperty('a_id')){
							if (i==0) lp+= cur_lp + (t+1)+'): + x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' + (parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];								
							else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' +(parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];
							else  lp+= cur_lp + (t+1)+'): + y_('+ cur_tech.t_id +','+cur_tech.a_id+ ')@' +(parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];								
						}else{
							if (i==0) lp+= cur_lp + (t+1)+'): + x_'+ cur_tech.t_id + '@' +(parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];								
							else if (i==1) lp+= cur_lp + (t+1)+'): + '+ (1./parseFloat(cur_tech.ts[t])) +' x_'+ cur_tech.t_id + '@' +(parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];								
							else lp+= cur_lp + (t+1)+'): + y_'+ cur_tech.t_id + '@' +(parseInt(years[t])-json.general.fyear+1)+' = ' + RHS[t];								
						}
					}
											
				}
			}
			
			
		}
	}
	
	
}
function generate_bounds(){
	lp+='\n\nBounds';
  
	for(var i=0;i<json.techLevels.length;i++){
		var tl=json.techLevels[i];
		for (var j=0;j<tl.techs.length;j++){
			var tech=tl.techs[j];
			lp+='\n\\bounds for '+tech.name+'('+tech.t_id+')';
			for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
				lp+='\ny_'+tech.t_id+'@'+(t+1)+' >=0';
			}				
			if (tech.activities.length==1){
				for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
					lp+='\nx_'+tech.t_id+'@'+(t+1)+' >=0';
				}
			}else{
				for (var a=0;a<tech.activities.length;a++){
					var act=tech.activities[a];
					for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
						lp+='\nx_('+tech.t_id+','+(a+1)+')@'+(t+1)+' >=0';
					}			  
				}
			}
		}
	}
	lp+='\n\nEnd';	
}

var opt_sol_found=false;
var log = glp_print_func = function(value){
    document.getElementById("log").appendChild(document.createTextNode(value + "\n"));
};
function get_lp_optimal(btn){
	glp_set_print_func(log);
			
    start = new Date(); 
	document.getElementById("log").innerText = "";
    var lp1 = glp_create_prob();
    glp_read_lp_from_string(lp1, null, lp);

    glp_scale_prob(lp1, GLP_SF_AUTO);

    var smcp = new SMCP({presolve: GLP_ON});
    var ret = glp_simplex(lp1, smcp);
	opt_sol_found=false;
	if (ret==0) opt_sol_found=true;	

    log("obj: " + glp_get_obj_val(lp1));
	$('#objValue').text(glp_get_obj_val(lp1));
	
 	glp_create_index(lp1);
//	log('x_1@1='+glp_get_col_prim(lp1,glp_find_col(lp1, 'x_1@1')));
//	log('Flow_Conservation(5,1)='+glp_get_row_prim(lp1,glp_find_row(lp1, 'Flow_Conservation(5,1)')));
/*    for (var i = 1; i <= glp_get_num_cols(lp1); i++){
		if (parseInt((glp_get_col_prim(lp1, i))*10000)>=10)
			log(glp_get_col_name(lp1, i)  + " = " + glp_get_col_prim(lp1, i));
    }*/
	if (opt_sol_found){
		for(var i=0;i<json.techLevels.length;i++){
			var tl=json.techLevels[i];
			for (var j=0;j<tl.techs.length;j++){
				var tech=tl.techs[j];
				if (tech.hasOwnProperty('sol_y')){
					delete tech.sol_y;
				}
				var sol_y=[];
				var all_zero=true;
				for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
					var cur_y=glp_get_col_prim(lp1,glp_find_col(lp1, 'y_'+tech.t_id+'@'+(t+1)));
					if (cur_y>0 && all_zero){
						if (cur_y>0.0000001)
							all_zero=false;
					}
					if (cur_y>0.0000001) sol_y.push(cur_y);
					else sol_y.push(0);
				}
				if (all_zero) tech.sol_y=null;
				else tech.sol_y=sol_y;	
				
				if (tech.activities.length==1){
					if (tech.activities[0].hasOwnProperty('sol_x')){
						delete tech.activities[0].sol_x;
					}
					
					var sol_x=[];
					var all_zero=true;
					for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
						var cur_x=glp_get_col_prim(lp1,glp_find_col(lp1, 'x_'+tech.t_id+'@'+(t+1)));
						if (cur_x>0 && all_zero){
							if (cur_x>0.0000001)	all_zero=false;
							else 
								console.log('');
						}
						if (cur_x>0.0000001) sol_x.push(cur_x);
						else sol_x.push(0);
					}
					if (all_zero) tech.activities[0].sol_x=null;
					else tech.activities[0].sol_x=sol_x;	
				}else{
					for (var a=0;a<tech.activities.length;a++){
						var act=tech.activities[a];
						if (act.hasOwnProperty('sol_x')){
							delete act.sol_x;
						}
						
						var sol_x=[];
						var all_zero=true;
						for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
							var cur_x=glp_get_col_prim(lp1,glp_find_col(lp1, 'x_('+tech.t_id+','+(a+1)+')@'+(t+1)));
							if (cur_x>0 && all_zero){
								if (cur_x>0.0000001)	all_zero=false;
								else 
									console.log('');
							}
							if (cur_x>0.0000001) sol_x.push(cur_x);
							else sol_x.push(0);
						}
						if (all_zero) act.sol_x=null;
						else act.sol_x=sol_x;	
					}
				}
			}
		}
		
		for(var i=0;i<json.variables.length;i++){
			var cur=json.variables[i];
			var tex=cur.teXeq.replace('\\','/');
			if (cur.hasOwnProperty('sol')) delete cur.sol;
			
			var all_zero=true;
			if (cur.is_ts){
				var is_exist=false;
				for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
					if (glp_find_col(lp1, cur.teXeq+'@'+(t+1))){
						is_exist=true;
						break;
					}
				}
				if (is_exist){
					var sol=[];
					for (var t=0;t<(json.general.lyear-json.general.fyear+1);t++){
						var v_name=tex+'@'+(t+1);
						var temp=glp_find_col(lp1, v_name);
						if (temp){
							var cur_value=glp_get_col_prim(lp1,glp_find_col(lp1, v_name));
							if (cur_value>0 && all_zero){
								if (cur_value>0.0000001)	all_zero=false;
							}
							sol.push(cur_value);
						}else sol.push(null);
					}
					cur.sol=sol;
				}				
			}else{
				if (glp_find_col(lp1, tex)){
					cur.sol=glp_get_col_prim(lp1,glp_find_col(lp1, tex));
				}
			}
		}

		json_editor_update();	
	}	
}

function populate_solution(btn){
	$("#solutionUl>li").not(':first').remove();
	
	var curSolLi=$('#solutionUl').find('li.constraint');;
	for (var i=0;i<json.solutions.length;i++){
		if (i){
			$(curSolLi).clone().insertAfter(curSolLi);
			curSolLi=$(curSolLi).next('li');
		}				

		var cur=json.solutions[i];
		var isActivity;
		var isForInput;
		var isAllCap;
		$(curSolLi).find('.name').text(cur.name);
		
		if (cur.addToExcel){
			$(curSolLi).find('input[name=addToExcel]').prop('checked', true);
		}else $(curSolLi).find('input[name=addToExcel]').prop('checked', false);
		
		if (cur.is_act){
			$(curSolLi).find('input[name=activityOrCapacity]').filter('[value=activity]').prop('checked', true);
			isActivity=true;
			$(curSolLi).find('input[type=radio][name=ioRadio]').attr("disabled",false); 
			$(curSolLi).find('input[type=radio][name=capType]').attr("disabled",true); 
		}else{
			$(curSolLi).find('input[type=radio][name=activityOrCapacity]').filter('[value=capacity]').prop('checked', true);
			isActivity=false;
			$(curSolLi).find('input[type=radio][name=ioRadio]').attr("disabled",true); 
			$(curSolLi).find('input[type=radio][name=capType]').attr("disabled",false); 
		}
		if(cur.hasOwnProperty('is_input')){
			if (cur.is_input){
				$(curSolLi).find('input[name=ioRadio]').filter('[value=input]').prop('checked', true);
				isForInput=true;
			}else{
				$(curSolLi).find('input[name=ioRadio]').filter('[value=output]').prop('checked', true);
				isForInput=false;
			}			
		}
		if(cur.hasOwnProperty('is_allCap')){
			if (cur.is_allCap){
				$(curSolLi).find('input[name=capType]').filter('[value=allCap]').prop('checked', true);
				isAllCap=true;
			}else{
				$(curSolLi).find('input[name=capType]').filter('[value=newCap]').prop('checked', true);
				isAllCap=false;
			}			
		}		
		$(curSolLi).find('.excelSolutionAddress').text(cur.excelSolutionAddress);

		var curForm=$(curSolLi).find('form');//$('#c1_id'+(i+1));
		var table=$(curForm).find('table');
		$(table).find("tr:gt(0)").remove();
		var row='';
		for (var j=0;j<cur.techs.length;j++){
			row+='<tr><td style="min-width:140px;" class="techVarName">';
			var temp=cur.techs[j].name.split('/');
			if (temp[0]=='variable'){
				var temp1=temp[1].split('(');
				var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
				if (json.variables[v_arr_id].is_ts) row+=cur.techs[j].name+'</td><td><span class="math equation">'+json.variables[v_arr_id].teXeq+'^t</span></td>';
				else row+=cur.techs[j].name+'</td><td><span class="math equation">'+json.variables[v_arr_id].teXeq+'</span></td>';
				if (json.variables[v_arr_id].hasOwnProperty('sol')){
					if (json.variables[v_arr_id].is_ts){
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							row+='<td style="border: 1px solid black;">'+json.variables[v_arr_id].sol[k]+'</td>';
						}						
					}else{
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							if (k==0) row+='<td style="border: 1px solid black;">'+json.variables[v_arr_id].sol+'</td>';
							else  row+='<td style="border: 1px solid black;"></td>';
						}
					}
				}else{
					for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						row+='<td style="border: 1px solid black;"></td>';
					}					
				}
			}else{
				var t_id, a_id, arr_tl_id, arr_t_id;
				var temp1=temp[0].split('(');
				t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
					
				var cur_tech;
				for (var ii=0;ii<json.techLevels.length;ii++){
					var tl=json.techLevels[ii];
					if (t_id<=tl.techs[tl.techs.length-1].t_id){
						arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-t_id)-1;
						cur_tech=tl.techs[arr_t_id];
						ii=json.techLevels.length;
						break;
					}
				}
				
			
				if (isActivity){
					var a, a_id;
					if (temp.length==1) a=0;
					else{
						var temp1=temp[0].split('(');
						temp1=temp[1].split('(');
						a=parseInt(temp1[1].substr(0,temp1[1].length-1))-1;
						a_id=a+1;
					} 
					
					if (isForInput){
						if (temp.length==1) row+=cur.techs[j].name+'</td><td><span class="math equation">x_'+t_id+'^t</span></td>';	
						else row+=cur.techs[j].name+'</td><td><span class="math equation">x_{('+t_id+','+a_id+')}^t</span></td>';
						if (cur_tech.activities[a].sol_x!=null){
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.activities[a].sol_x[k]*1000)/1000)+'</td>';
							}						
						}else{
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								row+='<td style="border: 1px solid black;"></td>';
							}							
						}
					}else{
						var has_ts=false;
						var ts;
						if (cur_tech.activities[a].outputs[0].value.hasOwnProperty('ts')){
							has_ts=true;
							ts=cur_tech.activities[a].outputs[0].value.ts.split(',');
						}else ts=cur_tech.activities[a].outputs[0].value;
						
						if (temp.length==1) row+=cur.techs[j].name+'</td><td><span class="math equation">e_'+t_id+'^t x_'+t_id+'^t</span></td>';	
						else row+=cur.techs[j].name+'</td><td><span class="math equation">e_{('+t_id+','+a_id+')}^t x_{('+t_id+','+a_id+')}^t</span></td>';	
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							if (has_ts){
								if (cur_tech.activities[a].sol_x!=null)
									row+='<td style="border: 1px solid black;">'+(Math.floor((parseFloat(ts[k])*cur_tech.activities[a].sol_x[k])*1000)/1000)+'</td>';
								else row+='<td style="border: 1px solid black;"></td>';
							}else{
								if (cur_tech.activities[a].sol_x!=null)
									row+='<td style="border: 1px solid black;">'+(Math.floor((parseFloat(ts)*cur_tech.activities[a].sol_x[k])*1000)/1000)+'</td>';
								else row+='<td style="border: 1px solid black;"></td>';
							}
						}
					}									
				}else{
					if (isAllCap){
						row+=cur.techs[j].name+'</td><td><span class="math equation">Y_'+t_id+'^t</span></td>';
						if (cur_tech.hasOwnProperty('sol_y') && cur_tech.sol_y!=null){
							if (cur_tech.capacity.hasOwnProperty('H')){
								for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
									if (cur_tech.sol_y!=null)
										if (k<cur_tech.capacity.H.length)	
											row+='<td style="border: 1px solid black;">'+(Math.floor((cur_tech.sol_y[k]+cur_tech.capacity.H[k])*1000)/1000)+'</td>';
										else row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.sol_y[k]*1000)/1000)+'</td>';
									else
										if (k<cur_tech.capacity.H.length)	
											row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.capacity.H[k]*1000)/1000)+'</td>';
										else row+='<td style="border: 1px solid black;"></td>';
								}								
							}else{
								if (cur_tech.sol_y!=null)
									for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
										row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.sol_y[k]*1000)/1000)+'</td>';
									}												
								else
									for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
										row+='<td style="border: 1px solid black;"></td>';
									}												
							}
						}else{
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								row+='<td style="border: 1px solid black;"></td>';
							}											
						}						
					}else{
						row+=cur.techs[j].name+'</td><td><span class="math equation">y_'+t_id+'^t</span></td>';
						if (cur_tech.hasOwnProperty('sol_y') && cur_tech.sol_y!=null){
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								row+='<td style="border: 1px solid black;">'+(Math.floor(cur_tech.sol_y[k]*1000)/1000)+'</td>';
							}				
						}else{
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								row+='<td style="border: 1px solid black;"></td>';
							}											
						}
					}
				}
			} 
			row+='</tr>';					
		}
		
		$(table).append(row);	
		$(table).find('tr').not(':first').each(function(){
			var eq=$(this).find('.math').text();
			var el=$(this).find('.math').get(0);
			katex.render(eq,el);				
		});	
		
//		$(curSolLi).find('.excelSolutionAddress').trigger('blur');
	}
	
}
function add_sol(btn){   
	var cur=$(btn).closest('li.constraint');
	$(cur).clone().insertAfter(cur);
	if ($('#solutionUl').find('li.constraint').length==2)
		$('#solutionUl').find('li.constraint').find('[value=Remove]').removeAttr('disabled');		
}
function remove_sol(btn){ 
	$(btn).closest('li.constraint').remove();
	if ($('#solutionUl').find('li.constraint').length==1)
		$('#solutionUl').find('li.constraint').find('[value=Remove]').attr('disabled','disabled');
}

function make_cur_sol_array(this_sol,cur_sol){
	
	for (var j=0;j<cur_sol.techs.length;j++){
		var tech=cur_sol.techs[j];
		if (tech.hasOwnProperty('sol')) delete tech.sol;
		
		var temp=tech.name.split('/');
		var sol=[];
		if (temp[0]=='variable'){
			var temp1=temp[1].split('(');
			var v_arr_id=parseInt(temp1[1].substr(0,temp1[1].length-1)-1);
			if (json.variables[v_arr_id].hasOwnProperty('sol')){
				if (json.variables[v_arr_id].is_ts){
					for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						sol.push(json.variables[v_arr_id].sol[k]);
					}						
				}else sol.push(json.variables[v_arr_id].sol);
			}
		}else{		
			var t_id, a_id, arr_tl_id, arr_t_id;
			var temp1=temp[0].split('(');
			t_id=parseInt(temp1[1].substr(0,temp1[1].length-1));
				
			var cur_tech;
			for (var ii=0;ii<json.techLevels.length;ii++){
				var tl=json.techLevels[ii];
				if (t_id<=tl.techs[tl.techs.length-1].t_id){
					arr_t_id=tl.techs.length-(tl.techs[tl.techs.length-1].t_id-t_id)-1;
					cur_tech=tl.techs[arr_t_id];
					ii=json.techLevels.length;
					break;
				}
			}
			
			
			if (cur_sol.is_act){
				var a, a_id;
				if (temp.length==1) a=0;
				else{
					var temp1=temp[0].split('(');
					temp1=temp[1].split('(');
					a=parseInt(temp1[1].substr(0,temp1[1].length-1))-1;
					a_id=a+1;
				} 
				
				if (cur_sol.is_input){
					if (cur_tech.activities[a].sol_x!=null){
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							sol.push(Math.floor(cur_tech.activities[a].sol_x[k]*1000)/1000);
						}						
					}
				}else{
					var has_ts=false;
					var ts;
					if (cur_tech.activities[a].outputs[0].value.hasOwnProperty('ts')){
						has_ts=true;
						ts=cur_tech.activities[a].outputs[0].value.ts.split(',');
					}else ts=cur_tech.activities[a].outputs[0].value;
					
					for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
						if (has_ts){
							if (cur_tech.activities[a].sol_x!=null)
								sol.push(Math.floor((parseFloat(ts[k])*cur_tech.activities[a].sol_x[k])*1000)/1000);
						}else{
							if (cur_tech.activities[a].sol_x!=null)
								sol.push(Math.floor((parseFloat(ts)*cur_tech.activities[a].sol_x[k])*1000)/1000);
						}
					}
				}									
			}else{
				if (cur_sol.is_allCap){
					if (cur_tech.hasOwnProperty('sol_y') && cur_tech.sol_y!=null){
						if (cur_tech.capacity.hasOwnProperty('H')){
							for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
								if (cur_tech.sol_y!=null)
									if (k<cur_tech.capacity.H.length)	
										sol.push(Math.floor((cur_tech.sol_y[k]+cur_tech.capacity.H[k])*1000)/1000);
									else sol.push(Math.floor(cur_tech.sol_y[k]*1000)/1000);
								else
									if (k<cur_tech.capacity.H.length)	
										sol.push(Math.floor(cur_tech.capacity.H[k]*1000)/1000);
							}								
						}else{
							if (cur_tech.sol_y!=null)
								for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
									sol.push(Math.floor(cur_tech.sol_y[k]*1000)/1000);
								}												
						}
					}					
				}else{
					if (cur_tech.hasOwnProperty('sol_y') && cur_tech.sol_y!=null){
						for (k=0;k<(json.general.lyear-json.general.fyear+1);k++){
							sol.push(Math.floor(cur_tech.sol_y[k]*1000)/1000);
						}				
					}
				}
			}
		}
		tech.sol=sol;		
	}
}
function save_opt_to_excel(btn){
	json.solutions=[];
	$('#solutionUl').find('li.constraint').each(function(){
		var cur_sol={}; 
		cur_sol.name=$(this).find('.name').eq(0).html();
		cur_sol.is_act=($(this).find('input[name=activityOrCapacity]:checked').val()=='activity')?true:false;
		if (cur_sol.is_act) cur_sol.is_input=($(this).find('input[name=ioRadio]:checked').val()=='input')?true:false;
		else  cur_sol.is_allCap=($(this).find('input[name=capType]:checked').val()=='allCap')?true:false;
		cur_sol.addToExcel=$(this).find('input[name=addToExcel]').is(':checked');
		cur_sol.excelSolutionAddress=$(this).find('.excelSolutionAddress').text();
		techs=[];
		$(this).find('table tr').not(':first').each(function(){
			var tech={};
			tech.name=$(this).find('td:first').text();
			techs.push(tech);
		});
		cur_sol.techs=techs;		
		json.solutions.push(cur_sol);
		make_cur_sol_array($(this),cur_sol);
		
	});		
	save_sol_to_excel_ajax();
	json_editor_update();
}
function save_sol_to_excel_ajax(){
    $.ajax
    ({
        type: "POST",
 		cache:false,
        async: false,
        url: 'http://'+localhost+'/php_process/save_sol_to_excel.php',
        data: { data: JSON.stringify(json)},
		dataType: 'json',
        success: function(data) {		 
			console.log('excel file saved in "lp/save_sol.xlsx"');
			json=data;
        },
        error: 	function(request,status,error){
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)
		}
	});		
}

function onDragDrop(dragHandler, dropHandler) {
	var drag = d3.behavior.drag();

    drag.on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); })
		.on("drag", dragHandler)
		.on("dragend", dropHandler);
    return drag;
}
function dropHandler(d) {
        //alert('dropped');
}
var d = [{ x: 0, y: 0 }];
function dragmove(d) {
            //d.x += d3.event.dx;
            d.y += d3.event.dy;
            d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
}
function draw_res(btn){

	$("#svgContainer").find('svg').remove();
    var svg = d3.select("#svgContainer")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .call(d3.behavior.zoom().on("zoom", function () {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }))
      .append("g")

	d = [{ x: 0, y: 0 }];

	var width=(json.energyLevels.length+1)*json.RESdraw.energyLevel.xInterval;
	var maxNoOfEf=0;
	for (i=0;i<json.energyLevels.length;i++){
		width+=(json.energyLevels[i].energyForms.length-1)*json.RESdraw.energyForm.xInterval;
		if (maxNoOfEf<json.energyLevels[i].energyForms.length)
			maxNoOfEf=json.energyLevels[i].energyForms.length;
	}
	svg.attr('width',width);
	var height=30;
	var startH=15+maxNoOfEf*json.RESdraw.energyForm.yInterval+json.RESdraw.technology.height*2;
	height+=startH;
	var maxTechLevelHeight=0;
	for (i=0;i<json.techLevels.length;i++){
		var thisHeight=0;
		for (j=0;j<json.techLevels[i].techs.length;j++){
			if (json.techLevels[i].techs[j].activities.length==1){
				thisHeight+=json.RESdraw.technology.height+json.RESdraw.technology.yInterval;
			}else{
				thisHeight+=json.RESdraw.activity.topMargin+json.RESdraw.activity.bottomMargin;
				thisHeight+=(json.techLevels[i].techs[j].activities.length)*json.RESdraw.technology.height;
				thisHeight+=(json.techLevels[i].techs[j].activities.length-1)*json.RESdraw.activity.yInterval;
			}
		}
		json.techLevels[i].thisHeight=thisHeight;
		if (maxTechLevelHeight<thisHeight) maxTechLevelHeight=thisHeight;
	}
	height+=maxTechLevelHeight;
	//height+=json.RESdraw.technology.height*2;							
//	svg.attr('height',height);
 
	var defs = svg.append('svg:defs')
//							<marker id="markerArrow" markerWidth="12" markerHeight="12" refX="2" refY="5" orient="auto">
//								<path d="M2,2 L2,8 L8,5 L2,2" style="fill: #000000;" />
//							</marker>
	var marker = defs.append('svg:marker')
      .attr('id', 'markerArrow')
      .attr('markerHeight', 12)
      .attr('markerWidth', 12)
  //    .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', 2)
      .attr('refY', 5)
      .append('svg:path')
        .attr('d', 'M2,2 L2,8 L8,5 L2,2')
        .attr('fill', '#000000');

 
	var startX=0, startY=30;
	for (i=0;i<json.energyLevels.length;i++){
		if (i==0) startX=json.RESdraw.energyLevel.xInterval;
		else  startX+=json.RESdraw.energyLevel.xInterval+(json.energyLevels[i-1].energyForms.length-1)*json.RESdraw.energyForm.xInterval;
		svg.append('text').attr({'class':'el', x:startX-json.RESdraw.energyForm.xInterval/2,y:startY})
						 .style('font-size',(json.RESdraw.energyLevel.fontSize)+'px')
					.text(json.energyLevels[i].name+'('+(i+1)+')');

		for (j=0;j<json.energyLevels[i].energyForms.length;j++){
			var efX=startX+(json.RESdraw.energyForm.xInterval*j);
			var efY=startY+(json.RESdraw.energyForm.yInterval*(j+1));
			/*svg.append('text').attr({'class':'ef', x:efX-json.RESdraw.energyForm.xInterval/2, y:efY})
							 .style('font-size',(json.RESdraw.energyForm.fontSize)+'px')
					.text(json.energyLevels[i].energyForms[j].name+'('+json.energyLevels[i].energyForms[j].f_id+')');*/
			var text = svg.append("svg:text").attr({'class':'ef', x:efX-json.RESdraw.energyForm.xInterval/2, y:efY})
							 .style('font-size',(json.RESdraw.energyForm.fontSize)+'px')
				text.append("svg:tspan").style("fill", "black").text(json.energyLevels[i].energyForms[j].name+'(');
				text.append("svg:tspan").style("fill", "red").text(json.energyLevels[i].energyForms[j].f_id);					
				text.append("svg:tspan").style("fill", "black").text(')');
			if (i<json.energyLevels.length-1) 
				svg.append('line').attr({'class':'ef', x1:efX, y1:(efY+json.RESdraw.energyForm.yInterval/3), x2:efX, y2:height,
										  'id':'f_id_'+json.energyLevels[i].energyForms[j].f_id	});
			else  svg.append('line').attr({'class':'ef', x1:efX, y1:(efY+json.RESdraw.energyForm.yInterval/3), x2:efX, y2:height,
										  'id':'f_id_'+json.energyLevels[i].energyForms[j].f_id	})
									.style('stroke-width',2);
									//.style('stroke','blue');
		}
	}
	
	startX=json.RESdraw.energyLevel.xInterval/2-json.RESdraw.technology.width/2;
	for (i=0;i<json.techLevels.length;i++){
		if (i) startX+=json.RESdraw.energyLevel.xInterval+(json.energyLevels[i-1].energyForms.length-1)*json.RESdraw.energyForm.xInterval;
		startY=startH+maxTechLevelHeight/2-json.techLevels[i].thisHeight/2; 
		
		for (j=0;j<json.techLevels[i].techs.length;j++){
			var tech=json.techLevels[i].techs[j];
			var  this_g=svg.data(d).append('g')
						.attr("transform", function (d) { return  "translate(" + d.x + "," + d.y + ")"; })
						.on({ "mouseover": function(d) { d3.select(this).style("cursor", "move") },
							  "mouseout": function(d) { d3.select(this).style("cursor", "default")} })
						.call(onDragDrop(dragmove, dropHandler));
			if (tech.activities.length==1){
				act=tech.activities[0];
				var before_in=[], after_in=[], before_out=[], after_out=[];
				for (ii=0;ii<act.inputs.length;ii++){
					var arrow={};
					if (act.inputs[ii].hasOwnProperty('is_main') && act.inputs[ii].is_main) arrow.is_main=true;
					else arrow.is_main=false;
					arrow.f_id=act.inputs[ii].f_id;
					arrow.x=parseFloat(svg.select("line[id='f_id_"+arrow.f_id+"']").attr('x1')); 
					for (var l=0;l<json.energyLevels.length;l++){
						var el=json.energyLevels[l];
						if (act.inputs[ii].f_id<=el.energyForms[el.energyForms.length-1].f_id){
							arr_l_id=l;
							break;
						}
					}
					if (arrow.is_main) arrow.value=1;
					else{
						if (act.inputs[ii].value.hasOwnProperty('ts')){
							ts=act.inputs[ii].value.ts.split(',');
							arrow.value=ts;
						}else arrow.value=act.inputs[ii].value;
					}
					if (arr_l_id<i) before_in.push(arrow);
					else after_in.push(arrow);
				}
				for (ii=0;ii<act.outputs.length;ii++){
					var arrow={};
					if (act.outputs[ii].hasOwnProperty('is_main') && act.outputs[ii].is_main) arrow.is_main=true;
					else arrow.is_main=false;
					arrow.f_id=act.outputs[ii].f_id;
					arrow.x=parseFloat(svg.select("line[id='f_id_"+arrow.f_id+"']").attr('x1')); 
					for (var l=0;l<json.energyLevels.length;l++){
						var el=json.energyLevels[l];
						if (act.outputs[ii].f_id<=el.energyForms[el.energyForms.length-1].f_id){
							arr_l_id=l;
							break;
						}
					}
					if (act.outputs[ii].value.hasOwnProperty('ts')){
						ts=act.outputs[ii].value.ts.split(',');
						arrow.value=ts;
					}else arrow.value=act.outputs[ii].value;
					if (arr_l_id<i) before_out.push(arrow);
					else after_out.push(arrow);
				}
				
				var no_left_arrow=before_in.length+before_out.length;
				var no_right_arrow=after_in.length+after_out.length;
				var no_max_arrow;
				if (no_left_arrow>no_right_arrow) no_max_arrow=no_left_arrow;
				else no_max_arrow=no_right_arrow;
				var tech_height=json.RESdraw.technology.height;
				if (no_max_arrow>2){
					tech_height+=(no_max_arrow-2)*json.RESdraw.technology.height*3/5;
					height+=(no_max_arrow-2)*json.RESdraw.technology.height*3/5
					//svg.attr('height',height);
				}
				this_g.append('rect').attr({'class':'tech',x:startX,y:startY,width:json.RESdraw.technology.width,height:tech_height});
				if (no_max_arrow>2) this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.technology.width/2,y:startY+tech_height*3/5})
								 .style('font-size',(json.RESdraw.technology.fontSize)+'px')
						.text(tech.name);
				else this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.technology.width/2,y:startY+tech_height*2/3})
								 .style('font-size',(json.RESdraw.technology.fontSize)+'px')
						.text(tech.name);
				this_g.append('rect').attr({'class':'tech_id',x:startX,y:startY,width:13,height:13});
				this_g.append('text').attr({'class':'tech_id', x:startX+7,y:startY+10})
						.text(tech.t_id);

				var arrow_label;
				var arrow_loc_x=(json.RESdraw.energyLevel.xInterval-json.RESdraw.technology.width)/4;
				if (no_left_arrow){
					if (no_left_arrow==1){
						if (before_in.length){
							this_g.append('line')
									.attr({'x1':before_in[0].x, 'y1':startY+tech_height/2, 'x2':startX-8, 'y2':startY+tech_height/2,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
							if (Array.isArray(before_in[0].value))	arrow_label=before_in[0].value[0];
							else arrow_label=before_in[0].value;							
						}else{
							this_g.append('line')
									.attr({'x1':startX, 'y1':startY+tech_height/2, 'x2':before_out[0].x+8, 'y2':startY+tech_height/2,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});						
							if (Array.isArray(before_out[0].value))	arrow_label=before_out[0].value[0];
							else arrow_label=before_out[0].value;							
						}
						this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:startY+tech_height/2-3})
								.text(arrow_label);
					}else{
						if (no_left_arrow>no_right_arrow){
							var y_loc=startY+json.RESdraw.technology.height/5;
							for(var r=0;r<before_in.length;r++){
								this_g.append('line')
									.attr({'x1':before_in[r].x, 'y1':y_loc, 'x2':startX-8, 'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(before_in[r].value))	arrow_label=before_in[r].value[0];
								else arrow_label=before_in[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
													.text(arrow_label);
								y_loc+=json.RESdraw.technology.height*3/5;
							}
							for(var r=0;r<before_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX, 'y1':y_loc, 'x2':before_out[r].x+8, 'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
								if (Array.isArray(before_out[r].value))	arrow_label=before_out[r].value[0];
								else arrow_label=before_out[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
													.text(arrow_label);
								y_loc+=json.RESdraw.technology.height*3/5;
							}
						}else{
							var y_loc=startY+(tech_height/no_left_arrow)/2;
							for(var r=0;r<before_in.length;r++){
								this_g.append('line')
									.attr({'x1':before_in[r].x, 'y1':y_loc, 'x2':startX-8, 'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(before_in[r].value))	arrow_label=before_in[r].value[0];
								else arrow_label=before_in[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
													.text(arrow_label);
								y_loc+=tech_height/no_left_arrow;
							}
							for(var r=0;r<before_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX, 'y1':y_loc, 'x2':before_out[r].x+8, 'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
								if (Array.isArray(before_out[r].value))	arrow_label=before_out[r].value[0];
								else arrow_label=before_out[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
													.text(arrow_label);
								y_loc+=tech_height/no_left_arrow;
							}
						}
					}
				}
				if (no_right_arrow){
					if (no_right_arrow==1){
						if (after_in.length){
							this_g.append('line')
								.attr({'x1':after_in[0].x, 'y1':startY+tech_height/2, 
										'x2':startX+json.RESdraw.technology.width-8,
										'y2':startY+tech_height/2,
									'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
							if (Array.isArray(after_in[0].value))	arrow_label=after_in[0].value[0];
							else arrow_label=after_in[0].value;							
						}else{
							this_g.append('line')
								.attr({'x1':startX+json.RESdraw.technology.width, 'y1':startY+tech_height/2, 
										'x2':after_out[0].x-8, 
										'y2':startY+tech_height/2,
									'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
							if (Array.isArray(after_out[0].value))	arrow_label=after_out[0].value[0];
							else arrow_label=after_out[0].value;							
						}
						this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:startY+tech_height/2-3})
								.text(arrow_label);
					}else{
						if (no_left_arrow>no_right_arrow){
							var y_loc=startY+(tech_height/no_right_arrow)/2;
							for(var r=0;r<after_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX+json.RESdraw.technology.width, 'y1':y_loc, 
											'x2':after_out[r].x-8, 
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
								if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
								else arrow_label=after_out[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=tech_height/no_right_arrow;
							}
							for(var r=0;r<after_in.length;r++){
								this_g.append('line')
									.attr({'x1':after_in[r].x, 'y1':y_loc, 
											'x2':startX+json.RESdraw.technology.width+8,
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
								else arrow_label=after_in[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=tech_height/no_right_arrow;
							}							
						}else{
							var y_loc=startY+json.RESdraw.technology.height/5;
							for(var r=0;r<after_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX+json.RESdraw.technology.width, 'y1':y_loc, 
											'x2':after_out[r].x-8, 
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
								if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
								else arrow_label=after_out[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=json.RESdraw.technology.height*3/5;
							}
							for(var r=0;r<after_in.length;r++){
								this_g.append('line')
									.attr({'x1':after_in[r].x, 'y1':y_loc, 
											'x2':startX+json.RESdraw.technology.width+8,
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
								else arrow_label=after_in[r].value;							
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=json.RESdraw.technology.height*3/5;
							}							
						}
					}
					
				}
				startY+=json.RESdraw.technology.height+json.RESdraw.technology.yInterval;
			}else{
				var ac=json.RESdraw.activity;
				var tWidth=ac.lrMargin*2+json.RESdraw.technology.width;
				var tHeight=ac.topMargin+(tech.activities.length*json.RESdraw.technology.height)
									+(tech.activities.length-1)*json.RESdraw.activity.yInterval+ac.bottomMargin;
				var techStartY=startY;
				
				for (a=0;a<tech.activities.length;a++){
					thisHeight+=json.RESdraw.activity.topMargin+json.RESdraw.activity.bottomMargin;
					if (a==0) startY+=ac.topMargin;

					act=tech.activities[a];
					var before_in=[], after_in=[], before_out=[], after_out=[];
					for (ii=0;ii<act.inputs.length;ii++){
						var arrow={};
						if (act.inputs[ii].hasOwnProperty('is_main') && act.inputs[ii].is_main) arrow.is_main=true;
						else arrow.is_main=false;
						arrow.f_id=act.inputs[ii].f_id;
						arrow.x=parseFloat(svg.select("line[id='f_id_"+arrow.f_id+"']").attr('x1')); 
						for (var l=0;l<json.energyLevels.length;l++){
							var el=json.energyLevels[l];
							if (act.inputs[ii].f_id<=el.energyForms[el.energyForms.length-1].f_id){
								arr_l_id=l;
								break;
							}
						}
						if (arrow.is_main) arrow.value=1;
						else{
							if (act.inputs[ii].value.hasOwnProperty('ts')){
								ts=act.inputs[ii].value.ts.split(',');
								arrow.value=ts;
							}else arrow.value=act.inputs[ii].value;
						}
						if (arr_l_id<i) before_in.push(arrow);
						else after_in.push(arrow);
					}
					for (ii=0;ii<act.outputs.length;ii++){
						var arrow={};
						if (act.outputs[ii].hasOwnProperty('is_main') && act.outputs[ii].is_main) arrow.is_main=true;
						else arrow.is_main=false;
						arrow.f_id=act.outputs[ii].f_id;
						arrow.x=parseFloat(svg.select("line[id='f_id_"+arrow.f_id+"']").attr('x1')); 
						for (var l=0;l<json.energyLevels.length;l++){
							var el=json.energyLevels[l];
							if (act.outputs[ii].f_id<=el.energyForms[el.energyForms.length-1].f_id){
								arr_l_id=l;
								break;
							}
						}
						if (act.outputs[ii].value.hasOwnProperty('ts')){
							ts=act.outputs[ii].value.ts.split(',');
							arrow.value=ts;
						}else arrow.value=act.outputs[ii].value;
						if (arr_l_id<i) before_out.push(arrow);
						else after_out.push(arrow);
					}
					
					var no_left_arrow=before_in.length+before_out.length;
					var no_right_arrow=after_in.length+after_out.length;
					var no_max_arrow;
					if (no_left_arrow>no_right_arrow) no_max_arrow=no_left_arrow;
					else no_max_arrow=no_right_arrow;
					var act_height=json.RESdraw.technology.height;
					if (no_max_arrow>2){
						act_height+=(no_max_arrow-2)*json.RESdraw.technology.height*3/5;
						height+=(no_max_arrow-2)*json.RESdraw.technology.height*3/5
						//svg.attr('height',height);
					}
					this_g.append('rect').attr({'class':'tech',x:startX,y:startY,width:json.RESdraw.technology.width,height:act_height});
					if (no_max_arrow>2) this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.technology.width/2,y:startY+act_height*3/5})
															.style('font-size',(json.RESdraw.technology.fontSize)+'px')
															.text(act.name);
					else this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.technology.width/2,y:startY+act_height*2/3})
												.style('font-size',(json.RESdraw.technology.fontSize)+'px')
												.text(act.name);
					this_g.append('rect').attr({'class':'tech_id',x:startX,y:startY,width:13,height:13});
					this_g.append('text').attr({'class':'act_id', x:startX+7,y:startY+10})
										.text(a+1);
                
					var arrow_label;
					var arrow_loc_x=(json.RESdraw.energyLevel.xInterval-json.RESdraw.technology.width)/4;
					if (no_left_arrow){
						if (no_left_arrow==1){
							if (before_in.length){
								this_g.append('line')
										.attr({'x1':before_in[0].x, 'y1':startY+act_height/2, 'x2':startX-8, 'y2':startY+act_height/2,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(before_in[0].value))	arrow_label=before_in[0].value[0];
								else arrow_label=before_in[0].value;							
							}else{
								this_g.append('line')
										.attr({'x1':startX, 'y1':startY+act_height/2, 'x2':before_out[0].x+8, 'y2':startY+act_height/2,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});						
								if (Array.isArray(before_out[0].value))	arrow_label=before_out[0].value[0];
								else arrow_label=before_out[0].value;							
							}
							this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:startY+act_height/2-3})
									.text(arrow_label);
						}else{
							if (no_left_arrow>no_right_arrow){
								var y_loc=startY+json.RESdraw.technology.height/5;
								for(var r=0;r<before_in.length;r++){
									this_g.append('line')
										.attr({'x1':before_in[r].x, 'y1':y_loc, 'x2':startX-8, 'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(before_in[r].value))	arrow_label=before_in[r].value[0];
									else arrow_label=before_in[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
														.text(arrow_label);
									y_loc+=json.RESdraw.technology.height*3/5;
								}
								for(var r=0;r<before_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX, 'y1':y_loc, 'x2':before_out[r].x+8, 'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
									if (Array.isArray(before_out[r].value))	arrow_label=before_out[r].value[0];
									else arrow_label=before_out[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
														.text(arrow_label);
									y_loc+=json.RESdraw.technology.height*3/5;
								}
							}else{
								var y_loc=startY+(act_height/no_left_arrow)/2;
								for(var r=0;r<before_in.length;r++){
									this_g.append('line')
										.attr({'x1':before_in[r].x, 'y1':y_loc, 'x2':startX-8, 'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(before_in[r].value))	arrow_label=before_in[r].value[0];
									else arrow_label=before_in[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
														.text(arrow_label);
									y_loc+=act_height/no_left_arrow;
								}
								for(var r=0;r<before_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX, 'y1':y_loc, 'x2':before_out[r].x+8, 'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
									if (Array.isArray(before_out[r].value))	arrow_label=before_out[r].value[0];
									else arrow_label=before_out[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
														.text(arrow_label);
									y_loc+=act_height/no_left_arrow;
								}
							}
						}
					}
					if (no_right_arrow){
						if (no_right_arrow==1){
							if (after_in.length){
								this_g.append('line')
									.attr({'x1':after_in[0].x, 'y1':startY+act_height/2, 
											'x2':startX+json.RESdraw.technology.width-8,
											'y2':startY+act_height/2,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_in[0].value))	arrow_label=after_in[0].value[0];
								else arrow_label=after_in[0].value;							
							}else{
								this_g.append('line')
									.attr({'x1':startX+json.RESdraw.technology.width, 'y1':startY+act_height/2, 
											'x2':after_out[0].x-8, 
											'y2':startY+act_height/2,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
								if (Array.isArray(after_out[0].value))	arrow_label=after_out[0].value[0];
								else arrow_label=after_out[0].value;							
							}
							this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:startY+act_height/2-3})
									.text(arrow_label);
						}else{
							if (no_left_arrow>no_right_arrow){
								var y_loc=startY+(act_height/no_right_arrow)/2;
								for(var r=0;r<after_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX+json.RESdraw.technology.width, 'y1':y_loc, 
												'x2':after_out[r].x-8, 
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
									if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
									else arrow_label=after_out[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=act_height/no_right_arrow;
								}
								for(var r=0;r<after_in.length;r++){
									this_g.append('line')
										.attr({'x1':after_in[r].x, 'y1':y_loc, 
												'x2':startX+json.RESdraw.technology.width+8,
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
									else arrow_label=after_in[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=act_height/no_right_arrow;
								}							
							}else{
								var y_loc=startY+json.RESdraw.technology.height/5;
								for(var r=0;r<after_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX+json.RESdraw.technology.width, 'y1':y_loc, 
												'x2':after_out[r].x-8, 
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});							
									if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
									else arrow_label=after_out[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=json.RESdraw.technology.height*3/5;
								}
								for(var r=0;r<after_in.length;r++){
									this_g.append('line')
										.attr({'x1':after_in[r].x, 'y1':y_loc, 
												'x2':startX+json.RESdraw.technology.width+8,
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
									else arrow_label=after_in[r].value;							
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.technology.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=json.RESdraw.technology.height*3/5;
								}							
							}
						}
						
					}



					if (no_max_arrow>2){
						startY+=(no_max_arrow-2)*json.RESdraw.technology.height*3/5;
						tHeight+=(no_max_arrow-2)*json.RESdraw.technology.height*3/5;
					}
					 startY+=json.RESdraw.technology.height;				 
					if (a<tech.activities.length-1) startY+=ac.yInterval;
					else startY+=ac.bottomMargin;
				}
				
				this_g.append('rect').attr({'class':'tech_env',x:startX-ac.lrMargin,y:techStartY,width:tWidth,height:tHeight});
				this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.technology.width/2,y:techStartY+json.RESdraw.technology.height*2/3})
								 .style('font-size',(json.RESdraw.technology.fontSize)+'px')
								.text(tech.name);
				this_g.append('rect').attr({'class':'tech',x:startX-ac.lrMargin,y:techStartY,width:13,height:13});
				this_g.append('text').attr({'class':'tech_id', x:startX-ac.lrMargin+7,y:techStartY+10})
						.text(tech.t_id);
				
				startY+=json.RESdraw.technology.yInterval;
			}
		}
	
		svg.append('text').attr({'class':'el', x:startX,y:height})
					 .style('font-size',(json.RESdraw.energyLevel.fontSize)+'px')
					.text(json.techLevels[i].name+'('+(i+1)+')');

	}
	
	svg.selectAll('line.ef').attr('y2',height);

	for (i=0;i<json.techLevels.length;i++){
		delete json.techLevels[i].thisHeight;
	}
	
}

function render_math_obj(){
	var start=Date.now()-timerStart;		
	
//	var length=$('#lpObjUl').find('ul').find('.math').length;
//	var i=0;
		$('#lpObjUl').find('ul').find('.math').each(function(){
			eq=$(this).text();
			el=$(this).get(0);
			katex.render(eq,el);
			//$('#lptreeviewer').find('.progress').attr('aria-valuenow', 30*(i/length)).css('width',30*(i/length));
			//i++;
		});	
	var end=Date.now()-timerStart;
	console.log("Time after update obj equation : "+ (end-start));
		//$('ul li.active').removeClass('active'); 
}
function async(fn, callback) {
    setTimeout(function() {
        fn();
        if (callback) {callback();}
    }, 0);
}
function CalcJS() {  // math expression evaluation
	this.opvalues = { '(': -1, ')': -1, '+': 0, '-': 0, '/': 1, '*': 1, '^': 2 };
	this.variables = {};
	var stackop = [];
	var stacknum = [];
 
	this.tokenize = function (str) {
            str = str.replace(/\s/g, '');
            for (var i in this.opvalues) {
                var regex = new RegExp("\\" + i, "g");
                str = str.replace(regex, '#' + i + '#');
            }
            return str.split('#');
    }
 
	this.compareOps = function (curr, prev) {
            var currvalue = this.opvalues[curr];
            var prevvalue = this.opvalues[prev];
            if (currvalue < prevvalue) return -1;
            if (currvalue > prevvalue) return 1;
            return 0;
    }
 
	this.calculateStack = function (stopchar) {
            while (stackop.length > 0 && stackop[stackop.length - 1] != '(') {
                var op = stackop.pop();
                var right = stacknum.pop();
                var left = stacknum.pop();
 
                switch (op) {
                    case '+':
                        stacknum.push(left + right);
                        break;
                    case '-':
                        stacknum.push(left - right);
                        break;
                    case '/':
                        stacknum.push(left / right);
                        break;
                    case '*':
                        stacknum.push(left * right);
                        break;
                    case '^':
                        stacknum.push(Math.pow(left, right));
                        break;
                    default:
                        throw new Error('Unknown operator: ' + op);
                }
            }
 
            if (stopchar && stackop[stackop.length - 1] == '(') {
                stackop.pop();
            }
    }
 
	this.processTokens = function (arr, variables) {
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i];
			if (a == '') continue;
			if (variables[a]) {
				a = variables[a];
			}
 
            var parsed = parseFloat(a);
            if (isNaN(parsed)) {
                if (stackop.length == 0 || a == '(') {
                    stackop.push(a);
                    continue;
                }
     
                if (a == ')') {
                    this.calculateStack('(');
                    continue;
                }
     
                var prev = stackop[stackop.length - 1];
     
                var comp = this.compareOps(a, prev);
     
                if (comp < 0) {
                    this.calculateStack();
                }
     
                stackop.push(a);
            }
            else {
                stacknum.push(parsed);
            }
		}
 
		this.calculateStack();
		if (stacknum.length != 1) throw new Error('Invalid expression');
		return stacknum.pop();
	}
 
	this.calc = function (input) {
        for (var i in input) {
            var variablename = null;
            var expr = null;
 
            if (!variablename) {
                variablename = i;
                expr = input[variablename];
 
                var arr = this.tokenize(expr);
                var result = this.processTokens(arr, this.variables);
                this.variables[variablename] = result;
 
                variablename = null;
                expr = null;
            }
        }
 
        if (stackop.length != 0) throw new Error('Invalid expression');
        return this.variables;
    }
}


