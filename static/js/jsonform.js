// 공정관리 JSON 데이터 생성
// 데이터베이스에 공정관리 JSON데이터가 없을 때 신규로 생성한다.
function read_process_json()
{
   // JSON 데이터 생성
   var totalJson = new Object();
   totalJson.projectId = $("#pro_id").val();
   totalJson.bomId = json._id['$oid'];

    var processList = new Array();
   for (var i=0;i<json.partsGroups.length;i++){
        var processGroups = new Object();
		cur_el=json.partsGroups[i];
		name = cur_el.name + " process";
		processGroups.name = name;
		processGroups.expanded = true;

		var techArray = new Array();
		for (var j = 0; j <cur_el.parts.length; j++){
		    var tech = new Object();
		    tech.name = cur_el.parts[j].name;

		    var act = new Array();  // activities array
		    var actObject = new Object();
		    actObject.expanded = true;

		    var inputList = new Array();
		    var inputObj = new Object();
		    inputObj.expanded = true;
		    inputObj.value = 1;
		    inputList.push(inputObj);

		    var outputList = new Array();
		    var outputObj = new Object();
		    outputObj.expanded = true;
		    outputObj.value = 1;
		    outputList.push(outputObj);

		    actObject.inputs = inputList;
		    actObject.outputs = outputList;
            act.push(actObject);
		    tech.activities = act;
		    techArray.push(tech);
		}
		processGroups.techs = techArray;
		processList.push(processGroups);
   }
   totalJson.processGroups = processList;
   var resDraw = new Object();
   var drawGroup = new Object();
   drawGroup.fontSize = 12;
   drawGroup.width = 100;
   drawGroup.height = 30;
   drawGroup.yInterval = 30;
   var activity = new Object();
   activity.fontSize = 12;
   activity.topMargin = 30;
   activity.bottomMargin = 15;
   activity.lrMargin = 15;
   activity.yInterval = 20;

   resDraw.processGroup = drawGroup;
   resDraw.activity = activity;
   totalJson.RESdraw = resDraw;

   console.log(totalJson);
   return totalJson;
}
function read_json()
{
    var data = {
      "projectId": $("#pro_id").val(),
	  "partsGroups": [
		{
			"name": "car energy",
			"parts": [
				{
					"name": "oil",
					"hasLoadRegion": true,
					"eq": true
				},
			]
		}
	  ],
	"RESdraw": {
		"partsGroup": {
			"fontSize": 14,
			"xInterval": 250
		},
		"part": {
			"fontSize": 12,
			"xInterval": 15,
			"yInterval": 15
		},
		"processGroup": {
			"fontSize": 12,
			"width": 100,
			"height": 30,
			"yInterval": 30
		},
		"activity": {
			"fontSize": 12,
			"topMargin": 30,
			"bottomMargin": 15,
			"lrMargin": 15,
			"yInterval": 20
		}
	}

    };
	return data;
}

// 부품 재고관리 아이템을 생성한다.
function read_item_json(item_project_id)
{
    var data = {
      "projectId": item_project_id,
	  "partsGroups": [
		{
			"name": "샘플그룹",
			"code": "sample_code",
			"parts": [
				{
					"p_name": "샘플아이템",
					"p_code": "code1",
					"unit": "3M",
					"ksk": "EA",
					"qty": 1200,
					"hasLoadRegion": true,
					"eq": true,
					"inputs" : [
					    {
					        "date": "2017-09-01",
					        "qty" : 100,
					    },
					    {
					        "date": "2017-09-02",
					        "qty" : 150,
					    },
					],
					"outputs" : [
					    {
					        "date": "2017-09-01",
					        "qty" : 100,
					    },
					    {
					        "date": "2017-09-02",
					        "qty" : 150,
					    },
					],
					"adjusts" : [
					    {
					        "date": "2017-09-11",
					        "qty" : -100,
					    }
					],
				},
			]
		},

	  ],
    };
	return data;
}