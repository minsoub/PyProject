<?php
   session_start();
   
   // 사용자 체크를 통해서 세션이 없으면 로그인 창으로 이동한다.
   require "../comm/admin_session_check.php";
   
   // 관리자 회원인지 확인 : 관리자 회원만 등록이 가능
   if ($_SESSION['admin_chk'] != "1")
   {
?>
       <script language="javascript">
       <!--
           alert("관리자만 등록이 가능합니다!!!");
           location.href="/MES/admin/index.php";
       //-->
       </script>
<?       	
   }
   
   // form builder data register
   $mode = $_POST["mode"];
   $id = $_POST["mkey"];
   $_id = $_POST["_id"];
   $conn_page = $_POST["conn_page"];

   $conn = new MongoDB\Driver\Manager("mongodb://localhost:27017");

   $doc_id = new MongoDB\BSON\ObjectId($_id);
   $filter = ['_id' => $doc_id];  // $_id];
  
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
  	   //$db_name = $data->db_name;
  	   $col_name = $data->col_name;
  	   $conn_url = $data->conn_url;
  	   $conn_page = $data->conn_page;
  	   $conn_name = $data->conn_name;
  	   $content = $data->content;
   }

   $data_object =  json_decode($content, true);
   
   $dataList = array();
   
   //echo var_dump($data_object);
   
   foreach ($data_object as $data)
   {
   	     if ($data['type'] == "text" || $data['type'] == "password")
   	     {
   	     	   $dataList[$data['name']] = $_POST[$data['name']];
   	     	   
          //   echo $data['name']."=>".$_POST[$data['name']]."<br>";
         }else if($data['type'] == "multi_text")
         {
            foreach($data['datalist'] as $list)
            {
            //	  echo $list."=>".$_POST[$list]."<br>";
            	  $dataList[$list['name']] = $_POST[$list['name']];
            }
         }
    } 

    $dataList["lastModified"] = new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000);
    $dataList["createId"] = $_SESSION['user_id'];
  
    if ($mode == "upt")
    {
    	 $criteria = array('_id' => new MongoDB\BSON\ObjectId($id));
    	 $ddd = array('$set'=>$dataList);
    	 
    	 //echo var_dump($ddd);
    	 $bulk = new MongoDB\Driver\BulkWrite;
   	   $bulk->update($criteria, $ddd);
   	   $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
   	   $result = $conn->executeBulkWrite($_SESSION['dbname'].".".$col_name, $bulk, $writeConcern);
   	   if ($result->getModifiedCount()) {
     	     $msg = "수정을 완료하였습니다!!!";
       }else {
           $msg = "수정을 하는데 에러가 발생하였습니다!!!";	
       }
    }else if($mode == "del") {
    	 // 삭제를 수행한다.
    	 $bulk = new MongoDB\Driver\BulkWrite;
   	   $bulk->delete(['_id'=> new MongoDB\BSON\ObjectId($id)], ['limit' => 1]);
   	   $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
   	   $result = $conn->executeBulkWrite($_SESSION['dbname'].".".$col_name, $bulk, $writeConcern);
   	   if ($result->getDeletedCount()) {
   	      $msg = "삭제를 완료하였습니다!!!";
   	   }else {
   	      $msg = "삭제 하는데 에러가 발생하였습니다!!!";
   	   }
    }else {   
    	 $dataList["createDt"] = new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000);  
       $bulk = new MongoDB\Driver\BulkWrite;
       $bulk->insert($dataList);
       $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
       $result = $conn->executeBulkWrite($_SESSION['dbname'].".".$col_name, $bulk, $writeConcern);
       if ($result->getInsertedCount()) {
          $msg = "등록을 완료하였습니다!!!";	
       }else {
       	  $msg = "등록하는데 에러가 발생하였습니다!!!";
       }       
    }
    
?>
<form name="frm" method="post" action="reg.php">
	<input type="hidden" name="_id" value="<?=$_id?>">
	<input type="hidden" name="id" value="<?=$id?>">
	<input type="hidden" name="conn_page" value="<?=$conn_page?>">
	
</form>
<script language="javascript">
<!--
    alert("<?=$msg?>");
    if ("<?=$mode?>" == "ins" || "<?=$mode?>" == "del") {
        frm.action = "reg_list.php";
    }
    frm.submit();
//-->
</script>