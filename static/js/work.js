var work_json_list = [];      // 작업자 관리 JSON 데이터 리스트
var work_form;           // 작업자 관리 등록 폼 JSON
var save_work_json;      // 작업자 저장 JSON 데이터
var save_work_idx = -1;
var worker_list_json = undefined;       // 작업자 근태 리스트

// 작업자 등록 페이지를 출력한다.
// 작업자 신규 등록
$(document).on("click", "#saveWorkForm", function (e) {
	e.preventDefault();
	// 작업자 등록 페이지를 출력한다.
	// 신규 등록
	save_work_idx = -1;
	save_work_json = undefined;
	work_make_form_create();
	$("#deleteWork").hide();
});

// 작업자 데이터를 등록한다.
$(document).on("click", "#saveWork", function (e) {
	e.preventDefault();

	// 입력 데이터를 JSON 포멧으로 생성한다.
	work_popuplate_create();

    // 작업 등록 데이터를 서버에 저장한다.
	save_work_json_handler('save');
});

// 작업자 데이터 삭제
$(document).on("click", "#deleteWork", function (e) {
	e.preventDefault();
    if(confirm("데이터를 삭제하시겠습니까?"))
    {
       work_popuplate_create();        // 입력 데이터를 JSON 포멧으로 생성한다.
	   save_work_json_handler('del');
	}

});

// 작업자 리스트에서 작업을 선택했을 때 호출되는 메소드
// index를 받아서 JSON 데이터를 세팅한다.
function worker_data_index_setup(idx)
{
    save_work_idx = idx;
    save_work_json = work_json_list[idx];
    worker_data_setup(save_work_json);
}
// 작업자 DB에 등록된 JSON 데이터를 받아서 입력 폼에 출력한다.
function worker_data_setup(data)
{
    // 상세 화면 출력
    if($("#work_register_form_head").hasClass("techLi") === true) {
        // 화면이 생성되어 있으므로 데이터만 세팅한다.
        work_data_output_form(data);
    }else {
        // 작업 등록폼 화면 생성
        work_make_form_create();
        // 생성된 화면에 데이터 세팅
        work_data_output_form(data);
    }
    console.log("why??");
    $("#deleteWork").show();
}
// 작업자 입력 데이터를 JSON 포멧으로 생성한다.
// JSON format
// {
//  _id : key value
//  worker {
//     inputs : [
//         {
//             lable:   'lable name',
//             name:    'field name',
//             value:   'field value',
//             is_link: 'start',     => 다음 필드와 같이 붙여서 출력할 필요가 있다. (end)
//             is_code: 'true',      => value가 코드성 데이터이다.
//             is_main:  'true',     => 리스트 화면에 출력 대상
//             code: [ ]
//         },
//     ],
//     lastUpdated: [
//         date1, date2
//     ]
//   }
// }
function work_popuplate_create()
{
    var work_format = work_form;
    var worker = new Object();
    var inputList = new Array();
    for (var i = 0; i < work_format.workForms.length; i++) {
         var line = work_format.workForms[i];

         for (var j=0; j< line.forms.length; j++) {
            var form = line.forms[j];
            var inputObj = new Object();
            inputObj.label = line.title;
            inputObj.name  = form.name;

            if (form.type == "combo") {
                inputObj.value = $("select[name='"+form.name+"']").val();
            }else if(form.type == "radio") {
                inputObj.value = $(":radio[name='"+form.name+"']:checked").val();
            }else {
                inputObj.value = $("input[name='"+form.name+"']").val();
            }

            if (line.forms.length > 1 && j < (line.forms.length-1))
                inputObj.is_link = 'start';
            else if (line.forms.length > 1 && (j == line.forms.length - 1))
                inputObj.is_link = 'end';

            if (form.data != undefined && form.data.length > 0) {
                inputObj.is_code = 'true';
                inputObj.code = form.data;
            }else {
                inputObj.is_code = 'false';
            }
            if (line.is_main != undefined && line.is_main == "true") {
                inputObj.is_main = "true";
            }else {
                inputObj.is_main = "false";
            }
            inputList.push(inputObj);
         }
    }
    worker.inputs = inputList;
    var inputDateList = new Array();
    // calling the function
    var inputDt = formatDate(new Date(),4);
    inputDateList.push(inputDt);
    worker.lastUpdated = inputDateList;

    var workerObj = new Object();
    workerObj.worker = worker;

    if (save_work_json == undefined)        // 신규 등록시
    {
        save_work_json = workerObj;
    }else {
        var oid = save_work_json._id;
        workerObj._id = oid;
        save_work_json = workerObj;
        //console.log(JSON.stringify(save_work_json));
    }
}

// 작업자 입력 정보를 데이터베이스에 저장한다.
// 파라미터에 Collection Name을 넘겨야 한다.
// Collection name은 JSON 데이터에 들어 있다. => work_form.general.collection
function save_work_json_handler(mode){
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/work/work_save",
        data: { data: JSON.stringify(save_work_json), collection_name: work_form.general.collection,  mode: mode},
		dataType: 'json',
        success: function(data) {
		    if (mode == 'save') {
		        str = JSON.stringify(data);
		        str = str.substring(1, str.length-1);
		        console.log("str : " + str);
		        save_work_json=JSON.parse(str);
                $("#deleteWork").show();
                alert("작업을 완료하였습니다!!!");
            }else { // 삭제
                str = JSON.stringify(data);
                save_work_json = JSON.parse(str);
                alert(save_work_json['msg']);
                $("#deleteWork").hide();
            }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
	    if (mode == 'save')
	    {
            worker_data_setup(save_work_json);  // 작업자 입력폼에 데이터 재출력
            // 리스트 화면 재출력
            if (save_work_idx != -1) {
                work_json_list[save_work_idx] = save_work_json;     // 수정
            }else {
                work_json_list.push(save_work_json);                // 신규 등록
                save_work_idx = work_json_list.length - 1;
            }
            console.log("work_json_list count : " + work_json_list.length);
            make_work_list_print("", "");  // 작업자 화면을 생성해서 출력한다.
            work_data_output_form(save_work_json);
        }else {
            work_json_list.splice(save_work_idx, 1);
            make_work_list_print("", "");
            // 입력폼 제거
            work_form_visibility(false);
            save_work_idx = -1;   // select index 초기화
        }
    });
}
// work_list.html에서 초기 로딩될 때 호출된다.
// JSON HTML 데이터를 JSON 변수에 저장한다.
function read_json_html_data(result)
{
    if (result != "" && result != undefined)
    {
        var str = JSON.stringify(result);
	    //str = str.substring(1, str.length-1);
	    //console.log("str : " + str);
	    work_form=JSON.parse(str);
    }
}

// JSON 데이터를 받아서 작업자 관리 리스트 화면을 출력한다.
// MongoDB에서 JSON 데이터 조회 후 HTML 페이지에서 바로 사용시
// safe를 사용해야 한다.
function read_json_worker_print(result)
{
    work_form_visibility(false);
    //console.log("result : " + result);
    if (result != "" && result != undefined)
    {
	    //console.log("str : " + str);
	    for (i=0; i<result.length; i++)
	    {
	        var str = JSON.stringify(result[i]);
	        //str = str.substring(1, str.length-1);
	        work_json_list[i] = JSON.parse(str);
	        //console.log("read_json_worker_print: " + JSON.stringify(work_json_list[i]));
	    }
        make_work_list_print("", "");  // 작업자 화면을 생성해서 출력한다.
	}
}

// 작업자 화면 리스트를 생성한다.
// JSON 데이터를 테이블 리스트로 출력한다.
function make_work_list_print(from, to)
{
    console.log("make_work_list_print called");
	//$("#tree_for_tech_item> #table_view_ui").remove();
	$("#tree_for_tech_item>li").remove();
	$("#table_view_ui>").remove();
    var table=$("#tree_for_tech_item").closest('#tree_for_tech_item');
    //console.log(table);
    //console.log(JSON.stringify(work_json_list));
    // job need
    var table_data = "";
    var th = "";
    table_data = table_data + "<table class='bom_view'>"
    // <th> 헤더 만들기
    var tdArr = Array();

    for (i=0; i<work_json_list.length; i++) {
        workers = work_json_list[i].worker;
        if (i == 0) {
            th = "<tr>";
        }
        var tdData = "";
        var linkData = "";
        //console.log(work_json_list[i]._id);
        var link = "onclick='javascript:worker_data_index_setup("+i+");'";
        //console.log(link);
        for (j=0; j<workers.inputs.length; j++)
        {
            var inputs = workers.inputs[j];
            if (i == 0 && inputs.is_main == "true") {
                if (inputs.is_link != undefined && inputs.is_link == "start")
                {
                    // 생성안함
                }else {
                    th = th + "<td class='work_td1'>" + inputs.label + "</td>";
                }
            }
            if (inputs.is_main == "true") {
                if (inputs.is_link != undefined) {
                    if (inputs.is_link == "start") {
                        linkData = linkData + inputs.value + "-";
                    }else {
                        linkData = linkData + inputs.value;
                        tdData = tdData + "<td class='work_td_content' "+link+">" + linkData+"</td>";
                        linkData = "";
                    }
                }else {
                    tdData = tdData + "<td class='work_td_content' "+link+">" + inputs.value+"</td>";
                }
            }
        }
        tdData = "<tr class='work_tr'>"+tdData+"</tr>";
        if (i == 0) {
            th = th + "</tr>";
            tdArr.push(th);
        }
        tdArr.push(tdData);
    }
    for (i=0; i<tdArr.length; i++) {
        table_data = table_data + tdArr[i];
    }
    table_data = table_data + "</table>";

    //console.log(table_data);

    var tableUI=$('#table_view_ui');
    var techLi=$('<li style="margin-bottom:20px;" />').addClass('table_view_li');
    techLi.append(table_data);
    tableUI.append(techLi);
    $("#tree_for_tech_item").append(tableUI);
}

// 작업자 등록폼 페이지를 생성한다.
function work_make_form_create(data)
{
    $("#work_register_form_head").show();
    $("#work_register_form>li").remove();

     // 작업자 등록폼 JSON 읽어서 HTML 페이지를 생성한다.
     //console.log("work_form: "+JSON.stringify(work_form));
     html_data = json_register_form_make_handler(work_form);    // TODO: common.js에 정의 => 공통으로 사용
     //console.log(html_data);
     var tableUI=$('#work_register_form');
     var techLi=$('<li style="margin-bottom:20px;" />').addClass('techLi');
     techLi.append(html_data);
     tableUI.append(techLi);

     $("#work_register_form").append(tableUI);
}

// 작업자 등록폼에 데이터를 출력한다.
// data => save_work_json
// work_form => 작업 등록폼 정의 JSON
function work_data_output_form(data)
{
    // 입력 데이터에 대해서 어떤 type 인지 확인해야 한다.
    var work_format = work_form;
    for (var i = 0; i < work_format.workForms.length; i++) {
         var line = work_format.workForms[i];

         for (var j=0; j< line.forms.length; j++) {
            var form = line.forms[j];
            for (var k=0; k<data.worker.inputs.length; k++)
            {
                var inputData = data.worker.inputs[k];
                if (form.name == inputData.name) {
                    // form type
                    if (form.type == "text") {
                        $("input[name='"+form.name+"']").val(inputData.value);
                    }else if(form.type == "combo") {
                        $("select[name='"+form.name+"']").val(inputData.value);
                    }else if(form.type == "radio") {
                        // $("input[name='"+form.name+"']").val(inputData.value);
                        $("input:radio[name="+form.name+"]:input[value="+inputData.value+"]").attr("checked", true);
                    }
                    break;
                }
            }
         }
    }
}

// 작업자 등록폼의 Visibility를 설정한다.
function work_form_visibility(visible)
{
    if (visible == false)
    {
        $("#work_register_form_head").hide();
        $("#work_register_form>li").remove();
    }else {
        $("#work_register_form_head").show();
        $("#work_register_form>li").remove();
    }
}
$(document).on("click", "#searchItemViewForm", function (e) {
		e.preventDefault();
		if ($("#from").val() == "") {
		    alert("날짜를 입력하세요!!!");
		    return;
		}
		if ($("#to").val() == "") {
		    alert("날짜를 입력하세요!!!");
		    return;
		}

        if (item_json == "") {
            alert("데이터가 존재하지 않습니다!!!");
            return;
        }
        make_bom_view_print($("#from").val(), $("#to").val());

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// work_reg.html 사용 스크립트
// JSON 데이터를 받아서 작업자 리스트를 화면에 출력한다.
function read_json_worker_list_print(result)
{
    //console.log("result : " + result);
    if (result != "" && result != undefined)
    {
	    //console.log("str : " + str);
	    for (i=0; i<result.length; i++)
	    {
	        var str = JSON.stringify(result[i]);
	        //str = str.substring(1, str.length-1);
	        work_json_list[i] = JSON.parse(str);
	        //console.log("read_json_worker_print: " + JSON.stringify(work_json_list[i]));
	    }
        make_worker_list_print("", "");  // 작업자 화면을 생성해서 출력한다.
	}
}
// 작업자 화면 리스트를 생성한다.
// JSON 데이터를 테이블 리스트로 출력한다.
function make_worker_list_print(from, to)
{
    console.log("make_work_list_print called");
	//$("#tree_for_tech_item> #table_view_ui").remove();
	$("#tree_for_tech_item>li").remove();
	$("#table_view_ui>").remove();
    var table=$("#tree_for_tech_item").closest('#tree_for_tech_item');
    //console.log(table);
    //console.log(JSON.stringify(work_json_list));
    // job need
    var table_data = "";
    var th = "";
    table_data = table_data + "<table class='bom_view'>"
    // <th> 헤더 만들기
    var tdArr = Array();

    for (i=0; i<work_json_list.length; i++) {
        workers = work_json_list[i].worker;
        if (i == 0) {
            th = "<tr>";
        }
        var tdData = "";
        var linkData = "";
        //console.log(work_json_list[i]._id);
        var link = "onclick='javascript:worker_reg_data_index_setup("+i+");'";
        //console.log(link);
        for (j=0; j<workers.inputs.length; j++)
        {
            var inputs = workers.inputs[j];
            if (i == 0 && inputs.is_main == "true") {
                if (inputs.is_link != undefined && inputs.is_link == "start")
                {
                    // 생성안함
                }else {
                    th = th + "<td class='work_td1'>" + inputs.label + "</td>";
                }
            }
            if (inputs.is_main == "true") {
                if (inputs.is_link != undefined) {
                    if (inputs.is_link == "start") {
                        linkData = linkData + inputs.value + "-";
                    }else {
                        linkData = linkData + inputs.value;
                        tdData = tdData + "<td class='work_td_content' "+link+">" + linkData+"</td>";
                        linkData = "";
                    }
                }else {
                    tdData = tdData + "<td class='work_td_content' "+link+">" + inputs.value+"</td>";
                }
            }
        }
        tdData = "<tr class='work_tr'>"+tdData+"</tr>";
        if (i == 0) {
            th = th + "</tr>";
            tdArr.push(th);
        }
        tdArr.push(tdData);
    }
    for (i=0; i<tdArr.length; i++) {
        table_data = table_data + tdArr[i];
    }
    table_data = table_data + "</table>";

    //console.log(table_data);

    var tableUI=$('#table_view_ui');
    var techLi=$('<li style="margin-bottom:20px;" />').addClass('table_view_li');
    techLi.append(table_data);
    tableUI.append(techLi);
    $("#tree_for_tech_item").append(tableUI);
}
// 작업자 근태 등록 리스트에서 사용자 클릭 시 호출되는 메소드
function worker_reg_data_index_setup(idx)
{
    save_work_idx = idx;
    save_work_json = work_json_list[idx];

    // 작업자의 근태 상세현황을 조회한다.
    // 월 선택 날짜
    var dt = $("#dt").val();

    search_worker_json_handler(dt);
    //worker_data_setup(save_work_json);
}
// 선택된 작업자의 근태 현황을 조회한다.
// dt : yyyy-mm
function search_worker_json_handler(dt){
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/work/worker_search",
        data: { data: JSON.stringify(save_work_json), dt: dt},
		dataType: 'json',
        success: function(data) {
		    if (data != '') {
		        str = JSON.stringify(data);
		        str = str.substring(1, str.length-1);
		        console.log("str : " + str);
		        worker_list_json=JSON.parse(str);
            }else { // Not data
                console.log("not found data");
                worker_list_json = undefined
            }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
	    if (worker_list_json != undefined)
	    {
	        worker_list_view_create_form();
            worker_data_list_setup(worker_list_json);  // 작업자 입력폼에 데이터 재출력
        }else {     // 조회된 작업자 근태 현황이 없으면 신규로 생성한다.
            // 작업자 근태 현황 리스트를 생성해서 출력한다.
            console.log("called...");
            worker_list_view_create_form();
        }
    });
}

// 작업자 근태 현황 리스트를 생성해서 화면에 출력한다.
function worker_list_view_create_form()
{
    var dt = $("#dt").val();
    var year = dt.substring(0, 4);
    var mon  = dt.substring(5);
    var lastDay = ( new Date( year, parseInt(mon), 0) ).getDate();
    console.log(new Date( year, parseInt(mon), 1));
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    var table_data = "";
    console.log(year + "-"+mon+"-"+lastDay);

    $("#worker_title").text("("+save_work_json.worker.inputs[0].value+")");

    $("#tr_head").nextAll("#work_tr").remove();

    for (var i=0; i<lastDay; i++)
    {
        var d = new Date(year, parseInt(mon), (i+1));
        var w = week[d.getDay()]
        // 일자, 요일, 출근, 퇴근, 근무시간, 정상, 연장, 야간, 비고
        table_data = table_data + "<tr id='work_tr' class='work_tr'>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='day' value='"+(i+1)+"' class='work_day_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='week' value='"+w+"' class='work_day_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='work_in' value='' class='work_time_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='work_out' value='' class='work_time_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='wk_tm' value='' class='work_day_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='normal_tm' value='' class='work_day_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='overtime' value='' class='work_day_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='night_tm' value='' class='work_day_input'></td>";
        table_data = table_data + "<td class='work_td2'><input type='text' name='etc' value='' class='work_day_input'></td>";
        table_data = table_data + "</tr>";
    }
    console.log(table_data);
    // table apppend
    $("#tr_head").after(table_data);
}
// 작업자 데이터를 등록한다.
$(document).on("click", "#saveWorkerList", function (e) {
	e.preventDefault();

	// 입력 데이터를 JSON 포멧으로 생성한다.
	worker_json_create();

    // 작업자 근무현황 데이터를 서버에 저장한다.
	save_worker_json_handler('save');
});

// 입력한 작업자 근무현황을 JSON 데이터로 생성한다.
function worker_json_create()
{
    var worker = new Object();
    var workerObj = new Object();
    var inputList = new Array();
	$("#tr_head").nextAll("#work_tr").each(function(){
		var day  = $(this).find('input[name=day]').val();
		var week = $(this).find('input[name=week]').val();
		var work_in = $(this).find('input[name=work_in]').val();
		var work_out = $(this).find('input[name=work_out]').val();
		var wk_tm = $(this).find('input[name=wk_tm]').val();
		var normal_tm = $(this).find('input[name=normal_tm]').val();
		var overtime = $(this).find('input[name=overtime]').val();
		var night_tm = $(this).find('input[name=night_tm]').val();
		var etc = $(this).find('input[name=etc]').val();

		var data = new Object();
		data.day = day;
		data.week = week;
		data.work_in = work_in;
		data.work_out = work_out;
		data.wk_tm = wk_tm;
		data.normal_tm = normal_tm;
		data.overtime = overtime;
		data.night_tm = night_tm;
		data.etc = etc;
		inputList.push(data);
	});
	workerObj.inputs = inputList;
	workerObj.work_dt = $("#dt").val();
	workerObj.work_id = save_work_json._id;

	if (worker_list_json != undefined)
	{
	    workerObj._id = worker_list_json._id;
	}
	worker_list_json = workerObj;
}
// 작업자 근태 현황을 등록한다.
// 등록 JSON : worker_list_json
function save_worker_json_handler(mode)
{
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/work/worker_list_save",
        data: { data: JSON.stringify(worker_list_json), mode: mode},
		dataType: 'json',
        success: function(data) {
		    if (mode == 'save') {
		        str = JSON.stringify(data);
		        str = str.substring(1, str.length-1);
		        console.log("str : " + str);
		        worker_list_json=JSON.parse(str);
                alert("작업을 완료하였습니다!!!");
            }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
	    if (mode == 'save')
	    {
            worker_data_list_setup(worker_list_json);  // 작업자 입력폼에 데이터 재출력
        }
    });
}
// 작업자 근태현황에 데이터를 재출력한다.
function worker_data_list_setup(data)
{
    var idx = 0;
	$("#tr_head").nextAll("#work_tr").each(function(){

		$(this).find('input[name=day]').val(data.inputs[idx].day);
		$(this).find('input[name=week]').val(data.inputs[idx].week);
		$(this).find('input[name=work_in]').val(data.inputs[idx].work_in);
		$(this).find('input[name=work_out]').val(data.inputs[idx].work_out);
		$(this).find('input[name=wk_tm]').val(data.inputs[idx].wk_tm);
		$(this).find('input[name=normal_tm]').val(data.inputs[idx].normal_tm);
		$(this).find('input[name=overtime]').val(data.inputs[idx].overtime);
		$(this).find('input[name=night_tm]').val(data.inputs[idx].night_tm);
		$(this).find('input[name=etc]').val(data.inputs[idx].etc);

		idx = idx + 1;
    });
}