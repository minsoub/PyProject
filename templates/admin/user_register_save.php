<?php
   // form builder data register
   $mode = $_POST["mode"];
   
   $userid = $_POST["userid"];
   $name = $_POST["name"];
   $pass = $_POST["pass"];
   $tel1 = $_POST["tel1"];
   $tel2 = $_POST["tel2"];
   $tel3 = $_POST["tel3"];
   $dbname = $_POST["dbname"];
   $admin_chk = $_POST["admin_chk"];
   $id = $_POST["m_key"];
   
   //echo $content;

   $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017');
   $bulk = new MongoDB\Driver\BulkWrite;
   
   //$json = json_decode($content,true);
  
   if ($mode == "inst")   // 신규등록
   {    $data = ["userid" => $userid, "name" => $name, 
            "pass" => $pass, "tel1" => $tel1,
            "tel2" => $tel2, "tel3" => $tel3, 
            "dbname" => $dbname,
            "admin_chk" => $admin_chk,
            "creatDt" => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000),
            "lastModified" => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
             ];
                	     
       $bulk->insert($data);
       $manager->executeBulkWrite("commDB.member", $bulk);
       $msg = "사용자를 등록하였습니다!!!";
       
   }else if($mode == "upst") {
   	   //$_id = new MongoDB\BSON\ObjectId($id);
                	   
   	   $bulk->update(['userid' => $id], ['$set' => 
   	     [
   	        'name' => $name, 
   	        'pass' => $pass, 
   	        'tel1' => $tel1,
   	        'tel2' => $tel2,
   	        'tel3' => $tel3,
   	        'admin_chk' => $admin_chk,
   	        'lastModified' => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
   	     ]
   	   ]);
   	   $manager->executeBulkWrite("commDB.member", $bulk);
   	   $msg = "관리자 정보를 수정하였습니다!!!";
   }else if($mode == "del") {
   	   //$_id = new MongoDB\BSON\ObjectId($id);                	   
   	   $bulk->delete(['userid' => $id],  ['limit' => 1]);
   	   $manager->executeBulkWrite("commDB.member", $bulk);
   	   
   	   // TODO : 데이터베이스 삭제 필요
   	   
   	   
   	   $msg = "관리자 정보를 삭제하였습니다!!!";   	
   }

?>
<form name="frm" method="post" action="./user_register.php">
	<input type="hidden" name="id" value="<?=$id?>">	
</form>
<script language="javascript">
<!--
    alert("<?=$msg?>");
    if ("<?=$mode?>" == "ins" || "<?=$mode?>" == "del") {
        frm.action = "../user_list.php";
    }
    frm.submit();
//-->
</script>