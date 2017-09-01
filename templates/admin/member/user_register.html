<? include "../include/admin_header.php"; ?>
<?
  // https://purecss.io/start/  => css 참조할 것
  $conn = new MongoDB\Driver\Manager("mongodb://localhost:27017");
  
  $id = $_POST["id"];

 
  if ($id != "")
  {
      $filter = ['userid' => $id];  // $_id];
  
      $options = [
          "projection" => ["_id" => 1, "userid" =>1, "name"=>1, "pass" => 1, "tel1" => 1, "tel2"=>1, "tel3"=>1, "dbname"=>1, "admin_chk"=>1],
          "sort" => ["lastModified" => -1],
      ];	    
      $query = new MongoDB\Driver\Query($filter);  // , $options);
      $cursor = $conn->executeQuery("commDB.member", $query);
  
      $data = current($cursor->toArray());
  
      if (!empty($data)) {
  	      $_id = $data->_id;
  	      $userid = $data->userid;
  	      $name = $data->name;
  	      $pass = $data->pass;
  	      $tel1 = $data->tel1;
  	      $tel2 = $data->tel2;
  	      $tel3 = $data->tel3;
  	      $dbname = $data->dbname;
  	      $admin_chk = $data->admin_chk;
      }
  }
?>	    
	    
            <div id="section"> 
            	  <!-- Left Menu define  -->
            	  <div class="left_menu">
            	  	 <ul>
            	  	 	  <li><a href="../admin/user_list.php">업체 관리자 정보관리</a></li>
            	  	 	  <li><a href="../builder/form_builder_list.php">일반 회원 관리</a></li>
            	  	</ul>
            	  </div>
            	  <!-- Left Menu end   -->
            	  <div class="empty_menu"></div>
            	  
                <div class="container_main">
                    <h3>업체 관리자 등록</h3>
                    
<form id="frm" name="frm" class="pure-form pure-form-aligned">
 <input type="hidden" id="mode" name="mode">
 <input type="hidden" id="m_key" name="m_key" value="<?=$userid?>">
 <input type="hidden" id="regChk">
 <input type="hidden" id="dbChk">
 
    <fieldset>
        <div class="pure-control-group">
            <label for="name">아이디(E-Mail) : </label>
            <input id="userid" name="userid" type="text" placeholder="Username" value="<?=$userid?>" <?if($userid != ""){?>readonly<?}?>>
            <?if($userid == ""){?><button type="button" id="identify" class="pure-button">중복확인</button><?}?>
            <span class="pure-form-message-inline">(This is a required field.)</span>
        </div>

        <div class="pure-control-group">
            <label for="Name">사용자명 : </label>
            <input id="name" name="name" class="pure-input-1-4"  type="text" placeholder="Enter Name" value="<?=$name?>">
        </div>

        <div class="pure-control-group">
            <label for="password">Password : </label>
            <input id="pass" name="pass" type="password" placeholder="Enter Password" value="<?=$pass?>">
        </div>

        <div class="pure-control-group">
            <label for="foo">전화번호 : </label>
             <input id="tel1" name="tel1" type="text"  class="pure-u-1-8 tel_input" maxlength="4" value="<?=$tel1?>" onkeydown="return isNumber(event)" onkeyup="removeWord(event)" style="ime-mode:disabled;">
            -<input id="tel2" name="tel2" type="text" class="pure-u-1-8 tel_input" maxlength="4" value="<?=$tel2?>" onkeydown="return isNumber(event)" onkeyup="removeWord(event)" style="ime-mode:disabled;">
            -<input id="tel3" name="tel3" type="text" class="pure-u-1-8 tel_input" maxlength="4" value="<?=$tel3?>" onkeydown="return isNumber(event)" onkeyup="removeWord(event)" style="ime-mode:disabled;">
        </div>
        
        <div class="pure-control-group">
            <label for="password">관리자 모드 :  </label>
                <input id="admin_chk" name="admin_chk" value="1" type="radio" <?if($admin_chk == "1" || $admin_chk == ""){?>checked<?}?>> 일반관리자
                <input id="admin_chk" name="admin_chk" value="2" type="radio" <?if($admin_chk == "2"){?>checked<?}?>> 통합관리자
        </div>

        <div class="pure-control-group">
            <label for="dbname">Database Name : </label>
            <input id="dbname" name="dbname" type="text" placeholder="Enter Database Name" maxlength="10" value="<?=$dbname?>"  <?if($userid != ""){?>readonly<?}?>>
            <?if($userid == ""){?><button type="button" id="dbIdentify" class="pure-button">중복확인</button><?}?>
            <span class="pure-form-message-inline">(최대 10자리 이내)</span>
        </div>
                
        <div class="pure-controls">
            <button type="button" id="register" class="pure-button">Submit</button>
            <button type="button" id="cancel" class="pure-button">Cancel</button>
        </div>
    </fieldset>
</form>
                </div>

            </div>           
<form id="commonForm" name="commonForm"></form>     
     
<script type="text/javascript">
	$(document).ready(function(){
			$("#identify").on("click", function(e){  
				e.preventDefault();
				fn_identifyProcess();
			});
			$("#dbIdentify").on("click", function(e){  
				e.preventDefault();
				fn_dbIdentifyProcess();
			});					  
			$("#register").on("click", function(e){  
				e.preventDefault();
				fn_registerProcess();
			});

			$("#cancel").on("click", function(e){  
				e.preventDefault();
				fn_cancelProcess();
			});							
	});
	
	function fn_identifyProcess()
	{
		  if ($("#userid").val() == "")
		  {
		  	   alert("아이디를 입력하세요!!!");
		  	   return;
		  }
		  // 중복 체크
      var mem =  {
      	    userid : $("#userid").val() 
      }; 

     // alert(JSON.stringify({ Member: mem }));
     
     $.ajax({
         url: "http://localhost:8000/rest/getUser/"+$("#userid").val(),
         data: { Member: JSON.stringify( mem ) },
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         type: "GET",
         success: function(data){
         	   console.log(data);
         	   var d = JSON.parse(data);
         	   if (d.success == true)
         	   {
         	   	   alert("이미 등록된 아이디입니다!!!");
         	   	   $("#regChk").val("N");
         	   	   $("#userid").val("");
         	   	   $("#userid").focus();
         	   }else {
         	   	   alert("사용할 수 있는 아디입니다!!!");        	   	   
         	   	   $("#regChk").val("Y");
         	   }
         	   //alert("success : " + d.success);
         	},
         error: function(errMsg) {
         	  console.log(errMsg);
            alert("error : " + errMsg);
         }
     });
	}
	
	function fn_dbIdentifyProcess()
	{
		  if ($("#dbname").val() == "")
		  {
		  	   alert("데이터베이스명을 입력하세요!!!");
		  	   return;
		  }
		  // 중복 체크
      var mem =  {
      	    dbname : $("#dbname").val() 
      }; 

     // alert(JSON.stringify({ Member: mem }));
     
     $.ajax({
         url: "http://localhost:8000/rest/getUserDB/"+$("#dbname").val(),
         data: { Dblist: JSON.stringify( mem ) },
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         type: "GET",
         success: function(data){
         	   console.log(data);
         	   var d = JSON.parse(data);
         	   if (d.success == true)
         	   {
         	   	   alert("이미 등록된 데이터베이스명입니다!!!");
         	   	   $("#dbChk").val("N");
         	   	   $("#dbname").val("");
         	   	   $("#dbname").focus();
         	   }else {
         	   	   alert("사용할 수 있는 데이터베이스명입니다!!!");        	   	   
         	   	   $("#dbChk").val("Y");
         	   }
         	   //alert("success : " + d.success);
         	},
         error: function(errMsg) {
         	  console.log(errMsg);
            alert("error : " + errMsg);
         }
     });
	}
		
	// 사용자를 등록하는 메소드
	function fn_registerProcess()
	{
			if ($("#userid").val() == "")
			{
				  alert("아이디를 입력하지 않았습니다!!!");
				  $("#userid").focus();
				  return;
		  }
			if ($("#name").val() == "")
			{
				  alert("성명을 입력하지 않았습니다!!!");
				  $("#name").focus();
				  return;
		  }
			if ($("#pass").val() == "")
			{
				  alert("패스워드를 입력하지 않았습니다!!!");
				  $("#pass").focus();
				  return;
		  }			  
			if ($("#dbname").val() == "")
			{
				  alert("사용할 데이터베이스명을 입력하지 않았습니다!!!");
				  $("#dbname").focus();
				  return;
		  }			  	  
		  if ($("#m_key").val() != "")
		  {
		  	  $("#mode").val("upst");
		  }else {
		  	  $("#mode").val("inst");
		  	  if ($("#regChk").val() != "Y") {
		  	  	  alert("아이디 중복 체크를 하지 않았습니다!!!");
		  	  	  return;
		  	  }
		  	  if ($("#dbChk").val() != "Y") {
		  	  	  alert("데이터베이스명을 입력하지 않았습니다.!");
		  	  	  return;
		  	  }
		  }
		  		  
		  try 
		  {
          var comSubmit = new ComSubmit("frm");
			    comSubmit.setUrl("user_register_save.php");
			    comSubmit.submit();		           
		      		  	
		  }catch(e)
		  {
		  		alert(E);
		  }
		  		  		  	  		  
	}
	
	function fn_cancelProcess () {
		   alert("cencel");
	}

</script>
            
<? include "../include/bottom.php"; ?>