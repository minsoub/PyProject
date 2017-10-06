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

// 공정관리의 JSON 데이터를 세팅한다.
// HTML 데이터를 생성해서 화면에 출력한다.
function populate_technology(){
    console.log("populate_technology called");
	$("#tree_for_tech>li").remove();
	var tree_for_tech = $('#tree_for_tech');
	var cur_t_id=1;

	for (var i = 0; i < pro_json.processGroups.length; i++) {
	    //console.log("pro_json.processGroups.length : " + pro_json.processGroups.length);
		var arr_tl_id=i;
		var tl=pro_json.processGroups[i];
		//console.log("tl name : "+tl.name);
		tl.tl_id=(i+1);
		var techLevelLi=$('<li/>').addClass('techLevelLi');
		techLevelLi.addClass('partsGroups')
		if (pro_json.processGroups.length!=1){
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
        //console.log("techs length : " + tl.techs.length);
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

            // capacity - nothing

            //console.log("activities length : " + tech.activities.length);
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


					if (act.inputs.length>0){
						for (var l=0;l<act.inputs.length;l++){
							var mainInputLi;
							if (l>0) mainInputLi=$('<li style="margin-top:5px;"/>').addClass('otherInputLi');
							else mainInputLi=$('<li/>').addClass('mainInputLi');
							var f_id_text='', found=false;
							if (act.inputs.length>0 && act.inputs[0].hasOwnProperty('f_id')){
								for (var ii = 0; ii < json.partsGroups.length; ii++) {
									for (var jj = 0; jj <json.partsGroups[ii].parts.length; jj++){
										if (json.partsGroups[ii].parts[jj].f_id== act.inputs[l].f_id){
											f_id_text=json.partsGroups[ii].name+'('+json.partsGroups[ii].l_id+')'
											+'/'+json.partsGroups[ii].parts[jj].name	+'('+json.partsGroups[ii].parts[jj].f_id+')';
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
							}else {i_id=1; mainInputValue='<span class="label">H:</span><span contenteditable data-type="value" class="value editable">1.0</span>';}
							mainInputLi.append('').html(otherBullet+inputText
												+'<span class="mymargin"><span data-type="inputMenu" class="select_menu context-menu-one btn btn-neutral">'
												+f_id_text
													+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
													+mainInputValue+'<span class="label">i_id</span><span class="id">'+i_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
													+otherInputRemove
												+'</span>');

							ioUl.append(mainInputLi);
						}
					}else{
							var i_id=1;
							var mainInputLi=$('<li/>').addClass('mainInputLi');
							mainInputLi.append('').html('<span class="mylabel" style="color:green;font-size:14px;">main input</span>'
												+'<span class="mymargin"><span  data-type="inputMenu" class="select_menu context-menu-one btn btn-neutral">'
												+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
												+'<span class="label">H:</span>'
												+'<span contenteditable data-type="value" class="value editable">1.0</span></span>'
												+'<span class="label">i_id</span><span class="id">'+i_id+'</span>'
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
								for (var ii = 0; ii < json.partsGroups.length; ii++) {
									for (var jj = 0; jj <json.partsGroups[ii].parts.length; jj++){
										if (json.partsGroups[ii].parts[jj].f_id== act.outputs[l].f_id){
											f_id_text=json.partsGroups[ii].name+'('+json.partsGroups[ii].l_id+')'
											+'/'+json.partsGroups[ii].parts[jj].name+'('+json.partsGroups[ii].parts[jj].f_id+')';
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
												+'<span class="label">H:</span><span contenteditable data-type="value" class="value editable">1.0</span>'
												+'<span class="label">o_id</span><span class="id">'+o_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
													+otherOutputRemove
												+'</span>');

							ioUl.append(mainOutputLi);

						}
					}else{
							var mainOutputLi=$('<li/>').addClass('mainOutputLi');
							var outputText='<span class="mylabel" style="color:green;font-size:14px;">main output</span>';
							mainOutputLi.append('').html('<span class="bullet"><i class="fa fa-minus-circle" style="color:green"></i></span>'
												+outputText
												+'<span class="mymargin"><span class="select_menu context-menu-one btn btn-neutral">'
												+'<i class="fa fa-caret-square-o-right"  style="font-size:12px;"></i></span>'
												+'<span class="label">H:</span><span contenteditable data-type="value" class="value editable">1.0</span>'
												+'<span class="label">o_id</span><span class="id">'+o_id+'</span>'
												+'<span class="aligh_button">'
													+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
												+'</span>');

							ioUl.append(mainOutputLi);
					}
                //console.log("tttt");
                //console.log(ioUl);
				activityLi.append(ioUl);
				activityUl.append(activityLi);
			}


			// techLi.append(capacityUl);
			techLi.append(activityUl);
			techUl.append(techLi);

			cur_t_id++;
		}
		techLevelLi.append(techUl);
		tree_for_tech.append(techLevelLi);
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
							//if (json.variables[dummy_id].is_ts) cur_tech.is_ts=true;
							//else
							cur_tech.is_ts=false;
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


				//if (isSolution){
				//	update_solution($(this),selected);
				//	return;
				//}
				//$(this).closest('li.constraint').find('.excelMatrixRange').text('');
				/*
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
				*/
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


function make_tech_var_menu(){
//http://swisnl.github.io/jQuery-contextMenu/
//	selected_tech=[];
	menu2={};
	for (var i = 0; i < pro_json.processGroups.length; i++) {
		var cur_tl=pro_json.processGroups[i];
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
/*
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
*/
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
							+'<span class="label">H:</span><span contenteditable data-type="value" class="value editable">1.0</span>'
							+'<span class="label">'+id_name+'</span><span class="id">'+cur_id+'</span>'
							+'<span class="aligh_button">'
								+'<input type="button" value="Add" class="ef_button ef_after" onclick="add_io_act_tech_tl(this)">'
								+'<input type="button" value="Remove" class="ef_button" onclick="remove_io_act_tech_tl(this)">'
							+'</span>');

		/* var costTableUl=$('<ul/>').addClass('costTableUl');
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

		otherInputLi.append(costTableUl); */

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

function save_tech(btn){
    if(confirm("저장하시겠습니까?"))
    {
	    update_all_tech_io_f_id();

	    // 데이터베이스 JSON 데이터를 저장한다.
	    process_save_json(1);       // 1 : save, 2 : delete (TODO: part_mng.js)
	    //update_all_ts('techLevels');
	    //update_P_C_K();
	    //make_tech_var_menu();
	    //json_editor_update();
	}
}

function delete_tech(btn) {
    if(confirm("데이터를 삭제하시겠습니까?"))
    {
        update_all_tech_io_f_id();  // JSON recreate

        // 데이터베이스 JSON 데이터를 삭제한다.
        process_save_json(2);       // 1 : save, 2 : delete (TODO: part_mng.js)
    }
}



// processGroup 데이터를 저장한다.
function update_all_tech_io_f_id(){
    project_id = pro_json.processGroups.projectId;
    bomId = pro_json.processGroups.bomId;
	pro_json.processGroups.length=0;
	pro_json.processGroups.project_id = project_id;
	pro_json.processGroups.bomId = bomId;

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

				inps=[];
				var menu, f_id, full_name;
				var main_input_exist=false;
				//console.log("here....................");
				//console.log($(this).find('li.mainInputLi').find('.context-menu-one').eq(0).text());
				if ($(this).find('li.mainInputLi').find('.context-menu-one').eq(0).text()){
				    //console.log("here is...");
					inp={};
					inp.is_main=true;
					full_name=$(this).find('li.mainInputLi').find('.context-menu-one').eq(0).text();
					menu=full_name.split('(');
					inp.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
					inp.comment=full_name;
					//console.log("value : " + $(this).find('li.mainInputLi').find('.value').eq(0).text());
					inp.value = $(this).find('li.mainInputLi').find('.value').eq(0).text();
					inps.push(inp);
					main_input_exist=true;
				}
				if (main_input_exist){
					$(this).find('li.otherInputLi').each(function(){
						if ($(this).find('.context-menu-one').eq(0).text()){
							inp={}
							inp.is_main=false;
					        full_name=$(this).find('.context-menu-one').eq(0).text();
					        menu=full_name.split('(');
					        //alert(full_name);
					        inp.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
					        inp.comment=full_name;
					        //console.log("value : " + $(this).find('li.otherInputLi').find('.value').eq(0).text());
					        inp.value = $(this).find('.value').eq(0).text();
					        inps.push(inp);
						}
					});
				}

				act.inputs=inps;

				outs=[];
				var main_output_exist=false;
				//console.log("mainOutput here....1");
				if ($(this).find('li.mainOutputLi').find('.context-menu-one').eq(0).text()){
				    //console.log("mainOutput here....");
					out={};val={};
					var cur=$(this).find('li.mainOutputLi').find('.excelRange').text();
					out.is_main=true;
					full_name=$(this).find('li.mainOutputLi').find('.context-menu-one').eq(0).text();
					menu=full_name.split('(');
					out.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
					out.comment=full_name;
					out.value = $(this).find('li.mainOutputLi').find('.value').eq(0).text();
					outs.push(out);
					main_output_exist=true;
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
							out.value = $(this).find('.value').eq(0).text();
							outs.push(out);
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
	pro_json.processGroups=tls;
    console.log(pro_json);
}