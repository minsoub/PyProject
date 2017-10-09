var json_project_list_data = [];
var project_save_data = undefined;
var save_project_idx = -1;
// 프로젝트 리스트 JSON 데이터를 받아서 기본 세팅을 한다.
// json_project_list_data에 JSON 데이터를 세팅한다.
function read_json_process_list_setup(result)
{
    //console.log("result : " + result);
    if (result != "" && result != undefined)
    {
	    //console.log("str : " + str);
	    for (i=0; i<result.length; i++)
	    {
	        var str = JSON.stringify(result[i]);
	        //str = str.substring(1, str.length-1);
	        json_project_list_data[i] = JSON.parse(str);
	        //console.log("read_json_worker_print: " + JSON.stringify(work_json_list[i]));
	    }
        read_json_process_list_data_print("", "");
	}
}

// 프로젝트 등록리스트를 생성한다.
// JSON 데이터를 테이블 리스트로 출력한다.
function read_json_process_list_data_print(from, to)
{
    console.log("make_work_list_print called");
	//$("#tree_for_tech_item> #table_view_ui").remove();
	$("#tree_for_tech_item").find("#project_list_header").nextAll().remove();
	//$("#table_view_ui>").remove();
    var table=$("#tree_for_tech_item").closest('#tree_for_tech_item');
    // job need
    var table_data = "";
    var tdArr = Array();
    for (i=0; i<json_project_list_data.length; i++) {
        var project = json_project_list_data[i];
        var link = "onclick='javascript:project_reg_data_id_setup("+i+");'";
        console.log(project._id);
        var tr = "<tr id='project_list_view' class='work_tr'>";
        tr = tr + "<td class='work_td_content' "+link+">"+project.project_name+"</td>";
        tr = tr + "<td class='work_td_content' "+link+">"+project.project_expl+"</td>";
        tr = tr + "<td class='work_td_content' "+link+">"+project.createId+"</td>";
        tr = tr + "<td class='work_td_content' "+link+">"+project.createDt+"</td>";
        tr = tr + "<td class='work_td_content' "+link+">"+project.lastModified+"</td>";
        tr = tr+"</tr>";

        tdArr.push(tr);
    }
    for (i=0; i<tdArr.length; i++) {
        table_data = table_data + tdArr[i];
    }
    console.log(table_data);
    $("#project_list_header").after(table_data);
}
// 등록된 프로젝트를 수정 및 삭제를 위해서 사용자 리스트를 클릭했을 때 호출 되는 메소드
// 파라미터로 넘어온 아이디를 받아서 JSON 데이터에서 데이터를 찾아서 입력폼에 출력한다.
function project_reg_data_id_setup(idx)
{
    console.log("project_reg_data_id_setup called...");

    save_project_idx = idx;

    project_save_data = json_project_list_data[idx];

    // 등록폼 생성
    project_make_form_create();
    // 데이터 세팅
    project_populate_print();

}

// 사용자가 신규 입력을 눌렸을 때 호출되는 메소드
$(document).on("click", "#saveProjectForm", function (e) {
	e.preventDefault();
	// 작업자 등록 페이지를 출력한다.
	// 신규 등록
	save_project_idx = -1;
	project_save_data = undefined;
	project_make_form_create();
	$("#deleteProject").hide();
});

// 프로젝트 데이터를 등록한다.
$(document).on("click", "#saveProject", function (e) {
	e.preventDefault();

	// 입력 데이터를 JSON 포멧으로 생성한다.
	project_popuplate_create();

    // 작업 등록 데이터를 서버에 저장한다.
	save_project_json_handler('save');
});

// 프로젝트 데이터 삭제
$(document).on("click", "#deleteProject", function (e) {
	e.preventDefault();
    if(confirm("데이터를 삭제하시겠습니까?"))
    {
       project_popuplate_create();        // 입력 데이터를 JSON 포멧으로 생성한다.
	   save_project_json_handler('del');
	}
});

// 프로젝트 신규 등록 폼을 생성한다.
function project_make_form_create()
{
     $("#work_register_form_head").show();
     $("#work_register_form>li").remove();


     var html_data = "<table class='bom_view'>";
     html_data = html_data + "<tr>";
     html_data = html_data + "<td class='td_120'>프로젝트명</td>";
     html_data = html_data + "<td class='work_td2'><input type='text' name='project_name' class='input_200'></td>";
     html_data = html_data + "<td class='td_120'>프로젝트설명</td>";
     html_data = html_data + "<td class='work_td2'><input type='text' name='project_expl' class='input_200'></td>";
     html_data = html_data + "</tr>";
     html_data = html_data + "</table>";

     //console.log(html_data);
     var tableUI=$('#work_register_form');
     var techLi=$('<li style="margin-bottom:20px;" />').addClass('techLi');
     techLi.append(html_data);
     tableUI.append(techLi);

     $("#work_register_form").append(tableUI);
}
// 선택된 JSON 데이터를 HTML 폼에 출력한다.
function project_populate_print()
{
    $("#deleteProject").show();
    $("#work_register_form").find('input[name=project_name]').val(project_save_data.project_name);
    $("#work_register_form").find('input[name=project_expl]').val(project_save_data.project_expl);
}
// 사용자가 입력한 프로젝트 데이터를 JSON 데이터에 저장한다.
function project_popuplate_create()
{
    var project_data = Object();

    project_data.project_name =  $("#work_register_form").find('input[name=project_name]').val();
    project_data.project_expl = $("#work_register_form").find('input[name=project_expl]').val();

    if (project_save_data != undefined)
    {
        project_data._id = project_save_data._id;
        project_data.createDt = project_save_data.createDt;
        project_data.lastModified = project_save_data.lastModified;
        project_data.createId = project_save_data.createId;
    }
    project_save_data = project_data;
}
// 사용자 입력한 프로젝트 데이터에 대해서 저장 및 삭제를 수행한다.
function save_project_json_handler(mode){
    $.ajax
    ({
        type: "POST",
       // dataType : 'text',  //dataType : 'json' ==> 200 OK, SyntaxError
		cache:false,
        url: "/office/project_save",
        data: { data: JSON.stringify(project_save_data), mode: mode},
		dataType: 'json',
        success: function(data) {
		    if (mode == 'save') {
		        str = JSON.stringify(data);
		        //str = str.substring(1, str.length-1);
		        console.log("str : " + str);
		        project_save_data=JSON.parse(str);
                $("#deleteProject").show();
                alert("작업을 완료하였습니다!!!");
            }else { // 삭제
                str = JSON.stringify(data);
                project_save_data = JSON.parse(str);
                alert(project_save_data['msg']);
                $("#deleteProject").hide();
            }
        },
        error: 	function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error)}
	}).done(function( msg ) {
	    if (mode == 'save')
	    {
            project_populate_print();  // 작업자 입력폼에 데이터 재출력
            // 리스트 화면 재출력
            if (save_project_idx != -1) {
                json_project_list_data[save_project_idx] = project_save_data;     // 수정
            }else {
                json_project_list_data.push(project_save_data);                // 신규 등록
                save_project_idx = json_project_list_data.length - 1;
            }
            console.log("work_json_list count : " + work_json_list.length);
            project_make_form_create();  // 작업자 화면을 생성해서 출력한다.
            project_populate_print();
        }else {
            json_project_list_data.splice(save_project_idx, 1);
            // 입력폼 제거
            $("#work_register_form>li").remove();
            save_project_idx = -1;   // select index 초기화
        }
        read_json_process_list_data_print("", "");
    });
}