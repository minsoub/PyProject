<?php
   // form builder data register
   $mode = $_POST["mode"];
   
   $db_name = $_POST["db_name"];
   $col_name = $_POST["col_name"];
   $conn_url = $_POST["conn_url"];
   $conn_page = $_POST["conn_page"];
   $conn_name = $_POST["conn_name"];
   $content = $_POST["content"];
   $id = $_POST["m_key"];
   
   //echo $content;

   $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017');
   $bulk = new MongoDB\Driver\BulkWrite;
   
   //$json = json_decode($content,true);
  
   if ($mode == "inst")   // $id == "")  
   {    $data = ["db_name" => $db_name, "col_name" => $col_name, 
            "conn_url" => $conn_url, "conn_page" => $conn_page,
            "conn_name" => $conn_name, "content" => $content, 
            "lastModified" => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
             ];
                	     
       $bulk->insert($data);
       $manager->executeBulkWrite("testDB.user", $bulk);
   }else if($mode == "upst") {
   	   $_id = new MongoDB\BSON\ObjectId($id);
   	   
       $data = "['db_name' => '$db_name', 'col_name' => '$col_name', " 
           +" 'conn_url' => '$conn_url', 'conn_page' => '$conn_page', "
           +" 'conn_name' => '$conn_name', 'content' => '$content',  "
           +" 'lastModified' => 'new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)' "
           +"  ]";
       echo $db_name."<br>";
                	   
   	   $bulk->update(['_id' => new MongoDB\BSON\ObjectId($id)], ['$set' => 
   	     [
   	        'db_name' => $db_name, 
   	        'col_name' => $col_name, 
   	        'conn_url' => $conn_url, 
   	        'conn_page' => $conn_page,
   	        'conn_name' => $conn_name,
   	        'content' => $content,
   	        'lastModified' => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
   	     ]
   	   ]);
   	   $manager->executeBulkWrite("testDB.user", $bulk);
    }
   
   $filter = [];
   $options = [
       "sort" => ["db_name" => -1],
   ];
   
   $query = new MongoDB\Driver\Query($filter, $options);
   $cursor = $manager->executeQuery("testDB.user", $query);
   echo date('Y-m-d H:i:s')."<br>";
   foreach($cursor as $document)
   {
   	
   	   //var_dump($document);
   	   
       $doc = (array)$document;
       echo $doc['db_name']."<br>";
       echo $doc['col_name']."<br>";
  }

?>
<form name="frm" method="post" action="./form_builder_list.php">
	<input type="hidden" name="id" value="<?=$id?>">
	
</form>
<script language="javascript">
<!--
    alert("작업을 완료하였습니다!!!");
    frm.submit();
//-->
</script>