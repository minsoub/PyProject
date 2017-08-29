<? 
  include "../include/admin_header.php";  
  include "../include/func.php";  

  $search_kind = $_POST["search_kind"];
  $word = $_POST["word"];
  
  $conn = new MongoDB\Driver\Manager("mongodb://localhost:27017");
  
  if ($search_kind == "") {
  	 $filter = [];
  }else {
     $filter = array($search_kind => $word);   // [$search_kind => $word];
  }
  
  //echo var_dump($filter);
  
  $options = [
      "projection" => ["_id" => 1, "userid" =>1, "name"=>1, "pass" => 1, "tel1" => 1, 
                       "tel2" => 1, "tel3" => 1, "dbname" => 1, "creatDt"=>1, "lastModified"=>1, "admin_chk" => 1],
      "sort" => ["lastModified" => -1],
  ];	    
  $query = new MongoDB\Driver\Query($filter,  $options);
  $cursor = $conn->executeQuery("commDB.member", $query);
?>
	    
            <div id="section"> 
            	  <!-- Left Menu define  -->
            	  <? include "./menu/menu_inc.php"; ?>
            	  <!-- Left Menu end   -->
            	  
                <div class="container_main">
                    <h3>사용자 정보 관리</h3>
                    <div class="search_box">
                        <form action="member_list.php" method="post" id="searchForm" name="searchForm">
                            <fieldset>
                                <legend>검색</legend>
                                분류 
                                <select id="search_kind" name="search_kind" class="sel" style="margin-right:25px;margin-left:10px">
                                	<option value="">분류를 선택하세요!!!</option>
                                	<option value="name" <?if($search_kind == "name"){?>selected<?}?>>성명</option>
                                	<option value="dbname"   <?if($search_kind == "dbname"){?>selected<?}?>>데이터베이스명</option>
                                </select>
                                &nbsp;<input type="text" id="word" name="word" value="<?=$word?>" class="input_box">
                                <button type="button" id="search" class="btn_search">검색</button>
                            </fieldset>                             
                        </form>
                    </div>	    

	                    <table class="table_list" style="margin-top:15px">
		                        <thead>
		                            <tr>
		                                <th>사용자명</th>
		                                <th>사용자 ID (E-Mail)</th>
		                                <th>전화번호</th>
		                                <th>데이터베이스명</th>
		                                <th>등록일자</th>
		                                <th>수정일자</th>
		                                <th>관리자</th>
		                            </tr>
		                        </thead>
		                        <tbody>
		                        <?
		                           foreach($cursor as $document)
		                           {
		                           	   $doc = (array)$document;
		                        ?>
		                            <tr>
		                                <td><?=$doc['name']?></td>
		                                <td><a href="javascript:fn_goView('<?=$doc['userid']?>');"><?=$doc['userid']?></a></td>
		                                <td><?=$doc['tel1']?>-<?=$doc['tel2']?>-<?=$doc['tel3']?></td>
		                                <td><?=$doc['dbname']?></td>
		                                <td><?=getMongoDate($doc['creatDt'])?></td>
		                                <td><?=getMongoDate($doc['lastModified'])?></td>
		                                <td><?if($doc['admin_chk']=="1"){?>일반관리자<?}else if($doc['admin_chk']=="2"){?>통합관리자<?}?></td>
		                            </tr>	
		                        <?
		                          }
		                        ?>
                            </tbody>
                      </table>
                      
                    <div class="pageNate">
                        <a class="start" href=""></a>
                        <a class="prev" href=""></a>
                        <a class="selected" href="">1</a>
                        <a href="">2</a>
                        <a href="">3</a>
                        <a href="">4</a>
                        <a href="">5</a>
                        <a class="next" href=""></a>
                        <a class="end" href=""></a>
                    </div>
        <button type="button" id="list"   class="btn_blue fl_right">List</button>   
		    <button type="button" id="create" class="btn_blue fl_right" style="margin-right:10px">Create</button>           
                </div>
            </div>
            
<form id="commonForm" name="commonForm"></form>     
     
<script type="text/javascript">
	$(document).ready(function(){
			$("#create").on("click", function(e){ // Create button
				e.preventDefault();
				fn_createProcess();
			});	

			$("#search").on("click", function(e){ // Search button
				e.preventDefault();
				fn_searchProcess();
			});			
			
			$("#list").on("click", function(e){ // List button 
				e.preventDefault();
				fn_listProcess();
			});			
										
	});
	
	function fn_createProcess(){
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("user_register.php");
			comSubmit.submit();
	}
	
	function fn_goView(_id)
	{
		  var comSubmit = new ComSubmit();
		  comSubmit.addParam("id", _id);
		  comSubmit.setUrl("user_register.php");
		  comSubmit.submit();
		
	}
	
	function fn_searchProcess()
	{
		  if ($("#search_kind").val() == "") {
		  	  alert("검색 분류를 선택하세요!!!");
		  	  $("#search_kind").focus();
		  	  return;
		  }
		  if ($("#word").val() == "") {
		  	  alert("검색 단어를 입력하세요!!!");
		  	  $("#word").focus();
		  	  return;
		  }
		  
		  searchForm.submit();
	}
	
	function fn_listProcess()
	{
		  location.href="user_list.php";
	}
</script>
            

            
<?php include "../include/bottom.php"; ?>