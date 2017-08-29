<? include "../../include/header.php"; ?>
<?
  $conn = new MongoDB\Driver\Manager("mongodb://localhost:27017");
  
  $id = $_POST["id"];

  $_id = new MongoDB\BSON\ObjectId($id);
  
  $filter = ['_id' => $_id];  // $_id];
  
  $options = [
      "projection" => ["_id" => 1, "db_name" =>1, "col_name"=>1, "conn_url" => 1, "conn_page" => 1, "conn_name" => 1, 
                       "content" => 1],
      "sort" => ["lastModified" => -1],
  ];	    
  $query = new MongoDB\Driver\Query($filter);  // , $options);
  $cursor = $conn->executeQuery("testDB.user", $query);
  
  $data = current($cursor->toArray());
  
  if (!empty($data)) {
  	   $_id = $data->_id;
  	   $db_name = $data->db_name;
  	   $col_name = $data->col_name;
  	   $conn_url = $data->conn_url;
  	   $conn_page = $data->conn_page;
  	   $conn_name = $data->conn_name;
  	   $content = $data->content;
  	   //echo $data->db_name;
  }else {
  	   //echo "no match found....";
  }
?>	    
	    
            <div id="section"> 
            	  <!-- Left Menu define  -->
            	  <? include "../menu/menu_inc.php"; ?>
            	  <!-- Left Menu end   -->
<form id="frm" name="frm">  
<input type="hidden" id="m_key" name="m_key" value="<?=$_id?>"> 
<input type="hidden" id="mode" name="mode">         	  
                <div class="container_main">
                    <h3>Form Builder Management(Create)</h3>
                    
                    <table class="table_view" style="margin-top:15px">
                        <colgroup>
                            <col width="150px" />
                            <col width="700px" />
                        </colgroup>
                        <tr>
                            <th>Database Name</th>
                            <td>
                                <label for="db_name">Database Name</label>
		                            <input type="text" id="db_name" name="db_name" class="input_box" value="<?=$db_name?>">
                            </td>
                        </tr>
                        <tr>
                            <th>Collection Name</th>
                            <td>
                                <label for="col_name">Collection Name</label>
		                            <input type="text" id="col_name" name="col_name" class="input_box" value="<?=$col_name?>">
                            </td>
                        </tr>
                        <tr>
                            <th>Connect URL</th>
                            <td>
                                <label for="conn_url">Connect URL</label>
		                            <input type="text" id="conn_url" name="conn_url" class="input_box" value="<?=$conn_url?>">
                            </td>
                        </tr>
                        <tr>
                            <th>Connect Page</th>                            
                            <td>
                                <label for="conn_page">Connect Page</label>
		                            <input type="text" id="conn_page" name="conn_page" class="input_box" value="<?=$conn_page?>">
                            </td>
                        </tr>
                        <tr>
                            <th>Connect Name</th>                            
                            <td>
                                <label for="conn_name">Connect Name</label>
		                            <input type="text" id="conn_name" name="conn_name" class="input_box" value="<?=$conn_name?>">
                            </td>
                        </tr>  
                        <tr>
                            <th>JSon Content</th>                            
                            <td><textarea id="content" name="content" class="area_box"><?=$content?></textarea></td>
                        </tr>  
                                                                   
                    </table> 
                    <?if($_id == ""){?>
                    <button type="button" id="create"  onclick="" class="btn_blue fl_right" style="margin-top:15px">Create</button>
                    <?}else{?>
                    <button type="button" id="create"  onclick="" class="btn_blue fl_right" style="margin-top:15px">Modify</button>	
                    <?}?> 
                    <button type="button" id="cancel"  onclick="" class="btn_blue fl_right" style="margin-top:15px;margin-right:10px">Cancel</button>                    
                    <button type="button" id="preview" onclick="" class="btn_blue fl_right" style="margin-top:15px;margin-right:10px">Preview</button>    
                </div>
            </div>
</form>            
<form id="commonForm" name="commonForm"></form>     
     
<script type="text/javascript">
	$(document).ready(function(){
			$("#create").on("click", function(e){  
				e.preventDefault();
				fn_createProcess();
			});

			$("#cancel").on("click", function(e){  
				e.preventDefault();
				fn_cancelProcess();
			});	
				
			$("#preview").on("click", function(e){  
				e.preventDefault();
				fn_previewProcess();
			});				
	});
	
	function fn_createProcess(){
			if ($("#db_name").val() == "")
			{
				  alert("DB 명을 입력하지 않았습니다!!!");
				  $("#db_name").focus();
				  return;
		  }
			if ($("#col_name").val() == "")
			{
				  alert("Collection 명을 입력하지 않았습니다!!!");
				  $("#col_name").focus();
				  return;
		  }
			if ($("#conn_url").val() == "")
			{
				  alert("Connect URL을 입력하지 않았습니다!!!");
				  $("#conn_url").focus();
				  return;
		  }		  
			if ($("#conn_page").val() == "")
			{
				  alert("Connect Page를 입력하지 않았습니다!!!");
				  $("#conn_page").focus();
				  return;
		  }		
			if ($("#conn_name").val() == "")
			{
				  alert("Connect Name을 입력하지 않았습니다!!!");
				  $("#conn_name").focus();
				  return;
		  }	
		  if ($("#content").val() == "")
		  {
		  		alert("JSON 데이터가 입력되지 않았습니다!!!");
		  		$("#content").focus();
		  		return;
		  }
		  
		  if ($("#m_key").val() != "")
		  {
		  	  $("#mode").val("upst");
		  }else {
		  	  $("#mode").val("inst");
		  }
		  
		  // JSON TEST
		  try 
		  {
		      var data = $("#content").val();
		      var contact = JSON.stringify(data);
		      
          var comSubmit = new ComSubmit("frm");
			    comSubmit.setUrl("form_builder_save.php");
			    comSubmit.submit();		           
		      		  	
		  }catch(e)
		  {
		  		alert(E);
		  }
		  		  		  	  		  
	}
	
	function fn_cancelProcess () {
		   alert("cencel");
	}
	
	function fn_previewProcess() {
		  //alert($("#content").val());
		  if ($("#content").val() == "")
		  {
		  		alert("JSON 데이터가 입력되지 않았습니다!!!");
		  		$("#content").focus();
		  		return;
		  }
		  try 
		  {
		      var data = $("#content").val();
		      //var contact = JSON.parse(data);
		      var contact = JSON.stringify(data);
          //console.log(contact);
      
          var weburl = "form_builder_preview2.php?test=abc";
          var title  = "testpop";
          var status = "toolbar=no,directories=no,scrollbars=auto,resizable=no,status=no,menubar=no,width=600, height=600, top=0,left=20"; 
          window.open("", title, status); 

          frm.target = title;
          frm.method = "post";
          frm.action = weburl;
          frm.submit();
          //var comSubmit = new ComSubmit("frm");
			    //comSubmit.setUrl(weburl);
			    //comSubmit.submit();
		  }catch(e)
		  {
			    alert(e);
		  }
	}
</script>
            
<? include "../../include/bottom.php"; ?>