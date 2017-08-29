<?php include "../../include/admin_header.php"; ?>
<?
  $conn = new MongoDB\Driver\Manager("mongodb://localhost:27017");
  
  $filter = [];
  $options = [
      "projection" => ["_id" => 1, "db_name" =>1, "col_name"=>1, "conn_url" => 1, "conn_page" => 1, "conn_name" => 1],
      "sort" => ["lastModified" => -1],
  ];	    
  $query = new MongoDB\Driver\Query($filter, $options);
  $cursor = $conn->executeQuery("testDB.user", $query);
?>
	    
            <div id="section"> 
            	  <!-- Left Menu define  -->
                <? include "../menu/menu_inc.php"; ?>
            	  <!-- Left Menu end   -->
            	  
                <div class="container_main">
                    <h3>Form Builder Management</h3>
                    <div class="search_box">
                        <form action="" method="" name="search">
                            <fieldset>
                                <legend>검색</legend>
                                관측소별
                                <select name="select_location" class="sel" style="margin-right:25px;margin-left:10px">
                                </select>
                                날짜
                                <select name="select_year" class="sel" style="margin-left:10px">
                                </select>
                                <select name="select_month" class="sel" >
                                </select>
                                <select name="select_day" class="sel" >
                                </select>
                                <button type="button" class="btn_search" onclick="">검색</button>
                            </fieldset>                             
                        </form>
                    </div>	    

	                    <table class="table_list" style="margin-top:15px">
		                        <thead>
		                            <tr>
		                                <th>DB Name</th>
		                                <th>Collection Name</th>
		                                <th>Connect URL</th>
		                                <th>Connect Page</th>
		                                <th>Connect Name</th>
		                            </tr>
		                        </thead>
		                        <tbody>
		                        <?
		                           foreach($cursor as $document)
		                           {
		                           	   $doc = (array)$document;
		                        ?>
		                            <tr>
		                                <td><?=$doc['db_name']?></td>
		                                <td><?=$doc['col_name']?></td>
		                                <td><?=$doc['conn_url']?></td>
		                                <td><?=$doc['conn_page']?></td>
		                                <td><a href="javascript:fn_goView('<?=$doc['_id']?>');"><?=$doc['conn_name']?></a></td>
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
        <button type="button" class="btn_blue fl_right" onclick="" >List</button> 
  
		    <button type="button" id="create" class="btn_blue fl_right" onclick="" style="margin-right:10px">Create</button>           
                </div>
            </div>
            
<form id="commonForm" name="commonForm"></form>     
     
<script type="text/javascript">
	$(document).ready(function(){
			$("#create").on("click", function(e){ //로그인 버튼
				e.preventDefault();
				fn_createProcess();
			});				
	});
	
	function fn_createProcess(){
			var comSubmit = new ComSubmit();
			comSubmit.setUrl("form_builder_create.php");
			comSubmit.submit();
	}
	
	function fn_goView(_id)
	{
		  var comSubmit = new ComSubmit();
		  comSubmit.addParam("id", _id);
		  comSubmit.setUrl("form_builder_create.php");
		  comSubmit.submit();
		
	}
</script>
            

            
<?php include "../../include/bottom.php"; ?>