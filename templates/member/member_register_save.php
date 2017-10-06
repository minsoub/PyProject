<?php
   // form builder data register
   $mode = $_POST["mode"];
   
   $userid = $_POST["userid"];
   $name = $_POST["name"];
   $pass = $_POST["pass"];
   $tel1 = $_POST["tel1"];
   $tel2 = $_POST["tel2"];
   $tel3 = $_POST["tel3"];
   $re_save = $_POST["re_save"];
   $id = $_POST["m_key"];
   
   //echo $content;

   $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017');
   $bulk = new MongoDB\Driver\BulkWrite;
   
   //$json = json_decode($content,true);
  
   if ($mode == "inst")   // 신규등록
   {    $data = ["userid" => $userid, "name" => $name, 
            "pass" => $pass, "tel1" => $tel1,
            "tel2" => $tel2, "tel3" => $tel3, 
            "admin_chk" => "N",
            "creatDt" => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
            "lastModified" => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
             ];
                	     
       $bulk->insert($data);
       $manager->executeBulkWrite("commDB.member", $bulk);
       $msg = "회원가입을 완료하였습니다!!!";
       
   }else if($mode == "upst") {
   	   $_id = new MongoDB\BSON\ObjectId($id);
                	   
   	   $bulk->update(['_id' => new MongoDB\BSON\ObjectId($id)], ['$set' => 
   	     [
   	        'userid' => $userid, 
   	        'name' => $name, 
   	        'pass' => $pass, 
   	        'tel1' => $tel1,
   	        'tel2' => $tel2,
   	        'tel3' => $tel3,
   	        'lastModified' => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
   	     ]
   	   ]);
   	   $manager->executeBulkWrite("commDB.member", $bulk);
   	   $msg = "회원정보를 수정하였습니다!!!";
    }
   
   $filter = [];
   $options = [
       "sort" => ["userid" => -1],
   ];
   
   $query = new MongoDB\Driver\Query($filter, $options);
   $cursor = $manager->executeQuery("commDB.memberr", $query);
   echo date('Y-m-d H:i:s')."<br>";
   foreach($cursor as $document)
   {
   	
   	   //var_dump($document);
   	   
       $doc = (array)$document;
       echo $doc['userid']."<br>";
       echo $doc['name']."<br>";
  }
?>
<form name="frm" method="post" action="./member_register.php">
	<input type="hidden" name="id" value="<?=$id?>">
	
</form>
<script language="javascript">
<!--
    alert("<?=$msg?>");
    if ("<?=$mode?>" == "ins" || "<?=$mode?>" == "del") {
        frm.action = "../main.php";
    }
    frm.submit();
//-->
</script>