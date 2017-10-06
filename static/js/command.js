// group add
function add_el_after(btn){
	var arr_l_id=parseInt($(btn).closest('.partsGroups').find('.id').html())-1;
	var cur_el_li=$(btn).closest('.partsGroups');
	var cur_ef_li;

	json.partsGroups.splice(arr_l_id,0,json.partsGroups[arr_l_id]);
	json=JSON.parse(JSON.stringify(json));  // make copy_by_value !!!!
	var prev_el=json.partsGroups[arr_l_id];
	var cur_el=json.partsGroups[arr_l_id+1];
	cur_el.parts.splice(1,cur_el.parts.length-1);

	$(btn).closest('.partsGroups').clone().insertAfter(cur_el_li);

	cur_el_li=$(btn).closest('.partsGroups').next();
	var cur_ef=cur_el.parts[0];
	cur_ef.f_id+=prev_el.parts.length;
	var first_ef_li=$(cur_el_li).find('.ef');
	cur_el.l_id++;
	$(cur_el_li).find('.id').html(cur_el.l_id);
	$(first_ef_li).find('.id').html(cur_ef.f_id);
	$(first_ef_li).find('[value=Remove]').attr('disabled','disabled');

	if (prev_el.parts.length>1){
		cur_ef_li=$(first_ef_li).next();
		for (var j = 1; j <prev_el.parts.length; j++){
			$(first_ef_li).next().remove();
			if (j!=(prev_el.parts.length-1)){
				cur_ef_li=$(first_ef_li).next();
			}
		}
	}
	cur_el_li=$(cur_el_li).next();
	cur_ef_li=$(cur_el_li).find('.ef');

	for (var i=(arr_l_id+2);i<json.partsGroups.length;i++){
		cur_el=json.partsGroups[i];
		cur_el.l_id++;
		$(cur_el_li).find('.id').html(cur_el.l_id);
		for (var j = 0; j <cur_el.parts.length; j++){
			cur_el.parts[j].f_id++;
			$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
			if (j!=(cur_el.parts.length-1)){
				cur_ef_li=$(cur_ef_li).next();
			}
		}
		cur_el_li=$(cur_el_li).next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}

	changed_el_ef("add_el",arr_l_id+2, 0);
	make_contextmenu();
	//json_editor_update();

	return;

}

function add_ef_after(btn) {
	var arr_l_id=parseInt($(btn).closest('.partsGroups').find('.id').html())-1;
	var arr_f_id=-1;
	var f_id=parseInt($(btn).closest('.ef').find('.id').html());
	for (var i=0;i<json.partsGroups[arr_l_id].parts.length;i++){
			var cur_f_id=json.partsGroups[arr_l_id].parts[i].f_id;
			if (cur_f_id==f_id){
				arr_f_id=i;
				break;
			}
	}
	var PrevNoOfparts=json.partsGroups[arr_l_id].parts.length;
	json.partsGroups[arr_l_id].parts.splice(arr_f_id,0,json.partsGroups[arr_l_id].parts[arr_f_id]);
	json=JSON.parse(JSON.stringify(json));  // make copy_by_value !!!!

	var cur_el_li=$(btn).closest('.partsGroups');
	var cur_ef_li=$(btn).closest('.ef');
	$(btn).closest('.ef').clone().insertAfter(cur_ef_li);
	if (PrevNoOfparts==1){
		$(cur_el_li).find('.ef').find('[value=Remove]').removeAttr('disabled');
	}

	//f_id update
	for (var i=arr_l_id;i<json.partsGroups.length;i++){
		var cur_el=json.partsGroups[i];
		if (i==arr_l_id){
			if (cur_el.parts.length==2){
				$(cur_el_li).find('.ef').find('[value=Remove]').removeAttr('disabled');
			}
			for (var j = (arr_f_id+1); j <cur_el.parts.length; j++){
				cur_ef_li=$(cur_ef_li).next();
				cur_el.parts[j].f_id++;
				$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
			}
		}else{
			for (var j = 0; j <cur_el.parts.length; j++){
				cur_el.parts[j].f_id++;
				$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
				if (j!=(cur_el.parts.length-1)){
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

function remove_el(btn) {
	var arr_l_id=parseInt($(btn).closest('.partsGroups').find('.id').html())-1;
	var no_of_ef=json.partsGroups[arr_l_id].parts.length;
//	var last_f_id=json.partsGroups[arr_l_id].parts[no_of_ef-1].f_id;
	var cur_el_li=$(btn).closest('.partsGroups').next();
	var cur_ef_li=$(cur_el_li).find('.ef');

	json.partsGroups.splice(arr_l_id,1);
	$(btn).closest('.partsGroups').remove();

	//json update : l_id and f_id;
	for (var i = arr_l_id; i < json.partsGroups.length; i++) {
		var cur_el=json.partsGroups[i];
		--cur_el.l_id;
		$(cur_el_li).find('.id').html(cur_el.l_id);
		if ((i+1)!=cur_el.l_id){
			alert('l_id error');
		}
		for (var j = 0; j <cur_el.parts.length; j++){
			cur_el.parts[j].f_id-=no_of_ef;
			$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
			if (j!=(cur_el.parts.length-1)){
				cur_ef_li=$(cur_ef_li).next();
			}
		}
		cur_el_li=$(cur_ef_li).closest('.partsGroups').next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}

	changed_el_ef("remove_el",arr_l_id,no_of_ef);
	make_contextmenu();
	//json_editor_update();
}


function remove_ef(btn) {
	var arr_l_id=parseInt($(btn).closest('.partsGroups').find('.id').html())-1;
	var arr_f_id=-1;
	var f_id=parseInt($(btn).closest('.ef').find('.id').html());
	for (var i=0;i<json.partsGroups[arr_l_id].parts.length;i++){
			var cur_f_id=json.partsGroups[arr_l_id].parts[i].f_id;
			if (cur_f_id==f_id){
				arr_f_id=i;
				break;
			}
	}
	var cur_el=json.partsGroups[arr_l_id];

	cur_el.parts.splice(arr_f_id,1);

	var cur_el_li=$(btn).closest('.partsGroups');
	var cur_ef_li=$(btn).closest('.ef');


	if (arr_l_id==(json.partsGroups.length-1)){  // for demand level
		if (arr_f_id<cur_el.parts.length){
			cur_ef_li=$(btn).closest('.ef').next();
			for (var j = arr_f_id; j <cur_el.parts.length; j++){
				cur_el.parts[j].f_id--;
				$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
				if (j!=(cur_el.parts.length-1)){
					cur_ef_li=$(cur_ef_li).next();
				}
			}
		}
		$(btn).closest('.ef').remove();
		if (cur_el.parts.length==1){
			$(cur_el_li).find('.ef').find('[value=Remove]').attr('disabled','disabled');
		}
		return;
	}

	if (cur_el.parts.length==1){
		$(cur_el_li).find('.ef').find('[value=Remove]').attr('disabled','disabled');
	}

	if (arr_f_id==(cur_el.parts.length)){
		cur_el_li=$(cur_el_li).next();
		cur_ef_li=$(cur_el_li).find('.ef');
		arr_l_id++;
		arr_f_id=0;
	}else{
		cur_ef_li=$(btn).closest('.ef').next();
	}
	$(btn).closest('.ef').remove();

	for (var i=arr_l_id;i<json.partsGroups.length;i++){
		var cur_el=json.partsGroups[i];
		if (i==arr_l_id){
			for (var j = arr_f_id; j <cur_el.parts.length; j++){
				cur_el.parts[j].f_id--;
				$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
				if (j!=(cur_el.parts.length-1)){
					cur_ef_li=$(cur_ef_li).next();
				}
			}
		}else{
			for (var j = 0; j <cur_el.parts.length; j++){
				cur_el.parts[j].f_id--;
				$(cur_ef_li).find('.id').html(cur_el.parts[j].f_id);
				if (j!=(cur_el.parts.length-1)){
					cur_ef_li=$(cur_ef_li).next();
				}
			}
		}

		cur_el_li=$(cur_ef_li).closest('.partsGroups').next();
		cur_ef_li=$(cur_el_li).find('.ef');
	}

	changed_el_ef("remove_ef",arr_l_id,arr_f_id);
	make_contextmenu();
	//json_editor_update();
}


function changed_el_ef(menu,arr_l_id, arr_f_id){
	var el_name, el_id, ef_name, ef_id;
	switch(menu){
		case "change_el_name" :
			var new_el_name=json.partsGroups[arr_l_id].name;
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
			var new_ef_name=json.partsGroups[arr_l_id].parts[arr_f_id].name;
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
			var f_id=json.partsGroups[arr_l_id].parts[arr_f_id].f_id;
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
			var f_id=json.partsGroups[arr_l_id].parts[arr_f_id].f_id;
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
			var f_id=json.partsGroups[arr_l_id].parts[arr_f_id].f_id-1;
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