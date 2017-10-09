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

// DRAW Res
function drawGroup(btn){
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

	var width=(json.partsGroups.length+1)*json.RESdraw.partsGroup.xInterval;
	var maxNoOfEf=0;
	for (i=0;i<json.partsGroups.length;i++){
		width+=(json.partsGroups[i].parts.length-1)*json.RESdraw.part.xInterval;
		if (maxNoOfEf<json.partsGroups[i].parts.length)
			maxNoOfEf=json.partsGroups[i].parts.length;
	}
	svg.attr('width',width);
	var height=30;
	var startH=15+maxNoOfEf*json.RESdraw.part.yInterval;
	height+=startH;

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
	for (i=0;i<json.partsGroups.length;i++){
		if (i==0) startX=json.RESdraw.partsGroup.xInterval;
		else  startX+=json.RESdraw.partsGroup.xInterval+(json.partsGroups[i-1].parts.length-1)*json.RESdraw.part.xInterval;
		svg.append('text').attr({'class':'el', x:startX-json.RESdraw.part.xInterval/2,y:startY})
						 .style('font-size',(json.RESdraw.partsGroup.fontSize)+'px')
					.text(json.partsGroups[i].name+'('+(i+1)+')');

		for (j=0;j<json.partsGroups[i].parts.length;j++){
			var efX=startX+(json.RESdraw.part.xInterval*j);
			var efY=startY+(json.RESdraw.part.yInterval*(j+1));
			/*svg.append('text').attr({'class':'ef', x:efX-json.RESdraw.energyForm.xInterval/2, y:efY})
							 .style('font-size',(json.RESdraw.energyForm.fontSize)+'px')
					.text(json.partsGroups[i].parts[j].name+'('+json.partsGroups[i].parts[j].f_id+')');*/
			var text = svg.append("svg:text").attr({'class':'ef', x:efX-json.RESdraw.part.xInterval/2, y:efY})
							 .style('font-size',(json.RESdraw.part.fontSize)+'px')
				text.append("svg:tspan").style("fill", "black").text(json.partsGroups[i].parts[j].name+'(');
				text.append("svg:tspan").style("fill", "red").text(json.partsGroups[i].parts[j].f_id);
				text.append("svg:tspan").style("fill", "black").text(')');
			if (i<json.partsGroups.length-1)
				svg.append('line').attr({'class':'ef', x1:efX, y1:(efY+json.RESdraw.part.yInterval/3), x2:efX, y2:height,
										  'id':'f_id_'+json.partsGroups[i].parts[j].f_id	});
			else  svg.append('line').attr({'class':'ef', x1:efX, y1:(efY+json.RESdraw.part.yInterval/3), x2:efX, y2:height,
										  'id':'f_id_'+json.partsGroups[i].parts[j].f_id	})
									.style('stroke-width',2);
									//.style('stroke','blue');
		}
	}
	svg.selectAll('line.ef').attr('y2',height);

}


// 공정관리 프로세스를 그린다.
function drawProcess(btn){
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

	var width=(json.partsGroups.length+1)*json.RESdraw.partsGroup.xInterval;
	var maxNoOfEf=0;
	for (i=0;i<json.partsGroups.length;i++){
		width+=(json.partsGroups[i].parts.length-1)*json.RESdraw.part.xInterval;
		if (maxNoOfEf<json.partsGroups[i].parts.length)
			maxNoOfEf=json.partsGroups[i].parts.length;
	}
	svg.attr('width',width);
	var height=30;
	var startH=15+maxNoOfEf*json.RESdraw.part.yInterval+json.RESdraw.processGroup.height*2;
	height+=startH;
	var maxTechLevelHeight=0;
	for (i=0;i<pro_json.processGroups.length;i++){
		var thisHeight=0;
		for (j=0;j<pro_json.processGroups[i].techs.length;j++){
			if (pro_json.processGroups[i].techs[j].activities.length==1){
				thisHeight+=json.RESdraw.processGroup.height+json.RESdraw.processGroup.yInterval;
			}else{
				thisHeight+=json.RESdraw.activity.topMargin+json.RESdraw.activity.bottomMargin;
				thisHeight+=(pro_json.processGroups[i].techs[j].activities.length)*json.RESdraw.processGroup.height;
				thisHeight+=(pro_json.processGroups[i].techs[j].activities.length-1)*json.RESdraw.activity.yInterval;
			}
		}
		pro_json.processGroups[i].thisHeight=thisHeight;
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

    // 그룹부품 관리
	var startX=0, startY=30;
	for (i=0;i<json.partsGroups.length;i++){
		if (i==0) startX=json.RESdraw.partsGroup.xInterval;
		else  startX+=json.RESdraw.partsGroup.xInterval+(json.partsGroups[i-1].parts.length-1)*json.RESdraw.part.xInterval;
		svg.append('text').attr({'class':'el', x:startX-json.RESdraw.part.xInterval/2,y:startY})
						 .style('font-size',(json.RESdraw.partsGroup.fontSize)+'px')
					.text(json.partsGroups[i].name+'('+(i+1)+')');

		for (j=0;j<json.partsGroups[i].parts.length;j++){
			var efX=startX+(json.RESdraw.part.xInterval*j);
			var efY=startY+(json.RESdraw.part.yInterval*(j+1));
			/*svg.append('text').attr({'class':'ef', x:efX-json.RESdraw.energyForm.xInterval/2, y:efY})
							 .style('font-size',(json.RESdraw.energyForm.fontSize)+'px')
					.text(json.energyLevels[i].energyForms[j].name+'('+json.energyLevels[i].energyForms[j].f_id+')');*/
			var text = svg.append("svg:text").attr({'class':'ef', x:efX-json.RESdraw.part.xInterval/2, y:efY})
							 .style('font-size',(json.RESdraw.part.fontSize)+'px')
				text.append("svg:tspan").style("fill", "black").text(json.partsGroups[i].parts[j].name+'(');
				text.append("svg:tspan").style("fill", "red").text(json.partsGroups[i].parts[j].f_id);
				text.append("svg:tspan").style("fill", "black").text(')');
			if (i<json.partsGroups.length-1)
				svg.append('line').attr({'class':'ef', x1:efX, y1:(efY+json.RESdraw.part.yInterval/3), x2:efX, y2:height,
										  'id':'f_id_'+json.partsGroups[i].parts[j].f_id	});
			else  svg.append('line').attr({'class':'ef', x1:efX, y1:(efY+json.RESdraw.part.yInterval/3), x2:efX, y2:height,
										  'id':'f_id_'+json.partsGroups[i].parts[j].f_id	})
									.style('stroke-width',2);
									//.style('stroke','blue');
		}
	}

	startX=json.RESdraw.partsGroup.xInterval/2-json.RESdraw.processGroup.width/2;
	console.log(JSON.stringify(pro_json));
	for (i=0;i<pro_json.processGroups.length;i++){
		if (i) startX+=json.RESdraw.partsGroup.xInterval+(json.partsGroups[i-1].parts.length-1)*json.RESdraw.part.xInterval;
		startY=startH+maxTechLevelHeight/2-pro_json.processGroups[i].thisHeight/2;

		for (j=0;j<pro_json.processGroups[i].techs.length;j++){
			var tech=pro_json.processGroups[i].techs[j];
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
					for (var l=0;l<json.partsGroups.length;l++){
						var el=json.partsGroups[l];
						if (act.inputs[ii].f_id<=el.parts[el.parts.length-1].f_id){
							arr_l_id=l;
							break;
						}
					}
					// TODO : JMS update => w_tm, w_qty  추가
					console.log("wt_qty : " + act.inputs[ii].w_qty);
					arrow.value = act.inputs[ii].w_qty+"("+act.inputs[ii].w_tm+")";
					//if (arrow.is_main) arrow.value=1;
					//else{
					//	if (act.inputs[ii].value.hasOwnProperty('ts')){
					//		ts=act.inputs[ii].value.ts.split(',');
					//		arrow.value=ts;
					//	}else arrow.value=act.inputs[ii].value;
					//}

					if (arr_l_id<i) before_in.push(arrow);
					else after_in.push(arrow);
				}
				for (ii=0;ii<act.outputs.length;ii++){
					var arrow={};
					if (act.outputs[ii].hasOwnProperty('is_main') && act.outputs[ii].is_main) arrow.is_main=true;
					else arrow.is_main=false;
					arrow.f_id=act.outputs[ii].f_id;
					arrow.x=parseFloat(svg.select("line[id='f_id_"+arrow.f_id+"']").attr('x1'));
					for (var l=0;l<json.partsGroups.length;l++){
						var el=json.partsGroups[l];
						if (act.outputs[ii].f_id<=el.parts[el.parts.length-1].f_id){
							arr_l_id=l;
							break;
						}
					}
					// TODO : JMS update => w_tm, w_qty  추가
					arrow.value = act.outputs[ii].w_qty+"("+act.outputs[ii].w_tm+")";
					//if (act.outputs[ii].value.hasOwnProperty('ts')){
					//	ts=act.outputs[ii].value.ts.split(',');
					//	arrow.value=ts;
					//}else arrow.value=act.outputs[ii].value;

					if (arr_l_id<i) before_out.push(arrow);
					else after_out.push(arrow);
				}

				var no_left_arrow=before_in.length+before_out.length;
				var no_right_arrow=after_in.length+after_out.length;
				var no_max_arrow;
				if (no_left_arrow>no_right_arrow) no_max_arrow=no_left_arrow;
				else no_max_arrow=no_right_arrow;
				var tech_height=json.RESdraw.processGroup.height;
				if (no_max_arrow>2){
					tech_height+=(no_max_arrow-2)*json.RESdraw.processGroup.height*3/5;
					height+=(no_max_arrow-2)*json.RESdraw.processGroup.height*3/5
					//svg.attr('height',height);
				}
				this_g.append('rect').attr({'class':'tech',x:startX,y:startY,width:json.RESdraw.processGroup.width,height:tech_height});
				if (no_max_arrow>2) this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.processGroup.width/2,y:startY+tech_height*3/5})
								 .style('font-size',(json.RESdraw.processGroup.fontSize)+'px')
						.text(tech.name);
				else this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.processGroup.width/2,y:startY+tech_height*2/3})
								 .style('font-size',(json.RESdraw.processGroup.fontSize)+'px')
						.text(tech.name);
				this_g.append('rect').attr({'class':'tech_id',x:startX,y:startY,width:13,height:13});
				this_g.append('text').attr({'class':'tech_id', x:startX+7,y:startY+10})
						.text(tech.t_id);

				var arrow_label;
				var arrow_loc_x=(json.RESdraw.partsGroup.xInterval-json.RESdraw.processGroup.width)/4;
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
							var y_loc=startY+json.RESdraw.processGroup.height/5;
							for(var r=0;r<before_in.length;r++){
								this_g.append('line')
									.attr({'x1':before_in[r].x, 'y1':y_loc, 'x2':startX-8, 'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(before_in[r].value))	arrow_label=before_in[r].value[0];
								else arrow_label=before_in[r].value;
								this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
													.text(arrow_label);
								y_loc+=json.RESdraw.processGroup.height*3/5;
							}
							for(var r=0;r<before_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX, 'y1':y_loc, 'x2':before_out[r].x+8, 'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(before_out[r].value))	arrow_label=before_out[r].value[0];
								else arrow_label=before_out[r].value;
								this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
													.text(arrow_label);
								y_loc+=json.RESdraw.processGroup.height*3/5;
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
										'x2':startX+json.RESdraw.processGroup.width-8,
										'y2':startY+tech_height/2,
									'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
							if (Array.isArray(after_in[0].value))	arrow_label=after_in[0].value[0];
							else arrow_label=after_in[0].value;
						}else{
							this_g.append('line')
								.attr({'x1':startX+json.RESdraw.processGroup.width, 'y1':startY+tech_height/2,
										'x2':after_out[0].x-8,
										'y2':startY+tech_height/2,
									'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
							if (Array.isArray(after_out[0].value))	arrow_label=after_out[0].value[0];
							else arrow_label=after_out[0].value;
						}
						this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:startY+tech_height/2-3})
								.text(arrow_label);
					}else{
						if (no_left_arrow>no_right_arrow){
							var y_loc=startY+(tech_height/no_right_arrow)/2;
							for(var r=0;r<after_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX+json.RESdraw.processGroup.width, 'y1':y_loc,
											'x2':after_out[r].x-8,
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
								else arrow_label=after_out[r].value;
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=tech_height/no_right_arrow;
							}
							for(var r=0;r<after_in.length;r++){
								this_g.append('line')
									.attr({'x1':after_in[r].x, 'y1':y_loc,
											'x2':startX+json.RESdraw.processGroup.width+8,
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
								else arrow_label=after_in[r].value;
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=tech_height/no_right_arrow;
							}
						}else{
							var y_loc=startY+json.RESdraw.processGroup.height/5;
							for(var r=0;r<after_out.length;r++){
								this_g.append('line')
									.attr({'x1':startX+json.RESdraw.processGroup.width, 'y1':y_loc,
											'x2':after_out[r].x-8,
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
								else arrow_label=after_out[r].value;
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=json.RESdraw.processGroup.height*3/5;
							}
							for(var r=0;r<after_in.length;r++){
								this_g.append('line')
									.attr({'x1':after_in[r].x, 'y1':y_loc,
											'x2':startX+json.RESdraw.processGroup.width+8,
											'y2':y_loc,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
								else arrow_label=after_in[r].value;
								this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
											.text(arrow_label);
								y_loc+=json.RESdraw.processGroup.height*3/5;
							}
						}
					}

				}
				startY+=json.RESdraw.processGroup.height+json.RESdraw.processGroup.yInterval;
			}else{
				var ac=json.RESdraw.activity;
				var tWidth=ac.lrMargin*2+json.RESdraw.processGroup.width;
				var tHeight=ac.topMargin+(tech.activities.length*json.RESdraw.processGroup.height)
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
						for (var l=0;l<json.partsGroups.length;l++){
							var el=json.partsGroups[l];
							if (act.inputs[ii].f_id<=el.parts[el.parts.length-1].f_id){
								arr_l_id=l;
								break;
							}
						}
					    // TODO : JMS update => w_tm, w_qty  추가
					    arrow.value = act.inputs[ii].w_qty+"("+act.inputs[ii].w_tm+")";
						//if (arrow.is_main) arrow.value=1;
						//else{
						//	if (act.inputs[ii].value.hasOwnProperty('ts')){
						//		ts=act.inputs[ii].value.ts.split(',');
						//		arrow.value=ts;
						//	}else arrow.value=act.inputs[ii].value;
						//}

						if (arr_l_id<i) before_in.push(arrow);
						else after_in.push(arrow);
					}
					for (ii=0;ii<act.outputs.length;ii++){
						var arrow={};
						if (act.outputs[ii].hasOwnProperty('is_main') && act.outputs[ii].is_main) arrow.is_main=true;
						else arrow.is_main=false;
						arrow.f_id=act.outputs[ii].f_id;
						arrow.x=parseFloat(svg.select("line[id='f_id_"+arrow.f_id+"']").attr('x1'));
						for (var l=0;l<json.partsGroups.length;l++){
							var el=json.partsGroups[l];
							if (act.outputs[ii].f_id<=el.parts[el.parts.length-1].f_id){
								arr_l_id=l;
								break;
							}
						}
					    // TODO : JMS update => w_tm, w_qty  추가
					    arrow.value = act.outputs[ii].w_qty+"("+act.outputs[ii].w_tm+")";
						//if (act.outputs[ii].value.hasOwnProperty('ts')){
						//	ts=act.outputs[ii].value.ts.split(',');
						//	arrow.value=ts;
						//}else arrow.value=act.outputs[ii].value;
						if (arr_l_id<i) before_out.push(arrow);
						else after_out.push(arrow);
					}

					var no_left_arrow=before_in.length+before_out.length;
					var no_right_arrow=after_in.length+after_out.length;
					var no_max_arrow;
					if (no_left_arrow>no_right_arrow) no_max_arrow=no_left_arrow;
					else no_max_arrow=no_right_arrow;
					var act_height=json.RESdraw.processGroup.height;
					if (no_max_arrow>2){
						act_height+=(no_max_arrow-2)*json.RESdraw.processGroup.height*3/5;
						height+=(no_max_arrow-2)*json.RESdraw.processGroup.height*3/5
						//svg.attr('height',height);
					}
					this_g.append('rect').attr({'class':'tech',x:startX,y:startY,width:json.RESdraw.processGroup.width,height:act_height});
					if (no_max_arrow>2) this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.processGroup.width/2,y:startY+act_height*3/5})
															.style('font-size',(json.RESdraw.processGroup.fontSize)+'px')
															.text(act.name);
					else this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.processGroup.width/2,y:startY+act_height*2/3})
												.style('font-size',(json.RESdraw.processGroup.fontSize)+'px')
												.text(act.name);
					this_g.append('rect').attr({'class':'tech_id',x:startX,y:startY,width:13,height:13});
					this_g.append('text').attr({'class':'act_id', x:startX+7,y:startY+10})
										.text(a+1);

					var arrow_label;
					var arrow_loc_x=(json.RESdraw.partsGroup.xInterval-json.RESdraw.processGroup.width)/4;
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
								var y_loc=startY+json.RESdraw.processGroup.height/5;
								for(var r=0;r<before_in.length;r++){
									this_g.append('line')
										.attr({'x1':before_in[r].x, 'y1':y_loc, 'x2':startX-8, 'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(before_in[r].value))	arrow_label=before_in[r].value[0];
									else arrow_label=before_in[r].value;
									this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
														.text(arrow_label);
									y_loc+=json.RESdraw.processGroup.height*3/5;
								}
								for(var r=0;r<before_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX, 'y1':y_loc, 'x2':before_out[r].x+8, 'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(before_out[r].value))	arrow_label=before_out[r].value[0];
									else arrow_label=before_out[r].value;
									this_g.append('text').attr({'class':'arrow_label', x:startX-arrow_loc_x,y:y_loc-3})
														.text(arrow_label);
									y_loc+=json.RESdraw.processGroup.height*3/5;
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
											'x2':startX+json.RESdraw.processGroup.width-8,
											'y2':startY+act_height/2,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_in[0].value))	arrow_label=after_in[0].value[0];
								else arrow_label=after_in[0].value;
							}else{
								this_g.append('line')
									.attr({'x1':startX+json.RESdraw.processGroup.width, 'y1':startY+act_height/2,
											'x2':after_out[0].x-8,
											'y2':startY+act_height/2,
										'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
								if (Array.isArray(after_out[0].value))	arrow_label=after_out[0].value[0];
								else arrow_label=after_out[0].value;
							}
							this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:startY+act_height/2-3})
									.text(arrow_label);
						}else{
							if (no_left_arrow>no_right_arrow){
								var y_loc=startY+(act_height/no_right_arrow)/2;
								for(var r=0;r<after_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX+json.RESdraw.processGroup.width, 'y1':y_loc,
												'x2':after_out[r].x-8,
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
									else arrow_label=after_out[r].value;
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=act_height/no_right_arrow;
								}
								for(var r=0;r<after_in.length;r++){
									this_g.append('line')
										.attr({'x1':after_in[r].x, 'y1':y_loc,
												'x2':startX+json.RESdraw.processGroup.width+8,
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
									else arrow_label=after_in[r].value;
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=act_height/no_right_arrow;
								}
							}else{
								var y_loc=startY+json.RESdraw.processGroup.height/5;
								for(var r=0;r<after_out.length;r++){
									this_g.append('line')
										.attr({'x1':startX+json.RESdraw.processGroup.width, 'y1':y_loc,
												'x2':after_out[r].x-8,
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(after_out[r].value))	arrow_label=after_out[r].value[0];
									else arrow_label=after_out[r].value;
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=json.RESdraw.processGroup.height*3/5;
								}
								for(var r=0;r<after_in.length;r++){
									this_g.append('line')
										.attr({'x1':after_in[r].x, 'y1':y_loc,
												'x2':startX+json.RESdraw.processGroup.width+8,
												'y2':y_loc,
											'stroke':"#000", 'stroke-width':"1", 'marker-end':"url(#markerArrow)"});
									if (Array.isArray(after_in[r].value))	arrow_label=after_in[r].value[0];
									else arrow_label=after_in[r].value;
									this_g.append('text').attr({'class':'arrow_label', x:startX+json.RESdraw.processGroup.width+arrow_loc_x,y:y_loc-3})
												.text(arrow_label);
									y_loc+=json.RESdraw.processGroup.height*3/5;
								}
							}
						}

					}



					if (no_max_arrow>2){
						startY+=(no_max_arrow-2)*json.RESdraw.processGroup.height*3/5;
						tHeight+=(no_max_arrow-2)*json.RESdraw.processGroup.height*3/5;
					}
					 startY+=json.RESdraw.processGroup.height;
					if (a<tech.activities.length-1) startY+=ac.yInterval;
					else startY+=ac.bottomMargin;
				}

				this_g.append('rect').attr({'class':'tech_env',x:startX-ac.lrMargin,y:techStartY,width:tWidth,height:tHeight});
				this_g.append('text').attr({'class':'tech', x:startX+json.RESdraw.processGroup.width/2,y:techStartY+json.RESdraw.processGroup.height*2/3})
								 .style('font-size',(json.RESdraw.processGroup.fontSize)+'px')
								.text(tech.name);
				this_g.append('rect').attr({'class':'tech',x:startX-ac.lrMargin,y:techStartY,width:13,height:13});
				this_g.append('text').attr({'class':'tech_id', x:startX-ac.lrMargin+7,y:techStartY+10})
						.text(tech.t_id);

				startY+=json.RESdraw.processGroup.yInterval;
			}
		}

		svg.append('text').attr({'class':'el', x:startX,y:height})
					 .style('font-size',(json.RESdraw.partsGroup.fontSize)+'px')
					.text(pro_json.processGroups[i].name+'('+(i+1)+')');

	}

	svg.selectAll('line.ef').attr('y2',height);

	for (i=0;i<pro_json.processGroups.length;i++){
		delete pro_json.processGroups[i].thisHeight;
	}

}