<?
  
  $id      = $_POST["id"];
  $pass    = $_POST["pass"];
  $re_save = $_POST["re_save"];
  
  $filter  = array('userid' => $id, 'pass' => $pass);  // $_id]; 
  $options = [
      "projection" => ["_id" => 1, "name" =>1, "admin_chk"=>1, "dbname"=>1, "lastModified"=>1],
      "sort" => ["lastModified" => -1],
  ];	    
  
  $conn = new MongoDB\Driver\Manager("mongodb://localhost:27017");
  $query = new MongoDB\Driver\Query($filter, $options);
  $cursor = $conn->executeQuery("commDB.member", $query);
  
  $data = current($cursor->toArray());
  
  //echo "re_save : " . $re_save;
  
  if (!empty($data)) {
  	   $username = $data->name;
  	   $lastModified = $data->lastModified;
  	   $mongo_id = $data->_id;
  	   $admin_chk = $data->admin_chk;
  	   $dbname = $data->dbname;
  	   
  	   // 업체 회원일 경우 업체 정보 조회
  	   
  	   
       session_start();
       $_SESSION['user_id'] = $id;
       $_SESSION['name'] = $username;
       $_SESSION['lastModified']= $lastModified;
       $_SESSION['admin_chk'] = $admin_chk;
       $_SESSION['dbname'] = $dbname;
       
       if ($re_save == "Y") {
           // 쿠키 등록
           setcookie('user_id',   $id,        time() + 86400 * 30);	
           setcookie('pass',      $pass,      time() + 86400 * 30);	
           setcookie('re_save',   $re_save,   time() + 86400 * 30);	
           //setcookie('admin_chk', $admin_chk, time() + 86400 * 30);	
          // echo "re_save : " .$re_save;
       }else {
       	   // 쿠키 삭제
           setcookie('user_id');
           setcookie('pass');
           setcookie('re_save');
           //setcookie('admin_chk');
       }
       
       // lastModified update
   	   $_id = new MongoDB\BSON\ObjectId($mongo_id);
   	   
       $data = "['lastModified' => 'new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)' "
           +"  ]";
           
       $bulk = new MongoDB\Driver\BulkWrite;       
         	   
   	   $bulk->update(['_id' => new MongoDB\BSON\ObjectId($_id)], ['$set' => 
   	     [
   	        'lastModified' => new MongoDB\BSON\UTCDateTime((new DateTime(date('Y-m-d H:i:s')))->getTimestamp()*1000)
   	     ]
   	   ]);
   	   
   	   $conn->executeBulkWrite("commDB.member", $bulk);
   	   
   	   if ($admin_chk == "2") { // 통합관리자
   	   	  $url = "/MES/admin/user_list.php";
   	   }else {
   	   	  $url = "/MES/admin/comm/reg_list.php";
   	   }
  	          
?>
       <meta http-equiv='refresh' content='0;url=<?=$url?>'>
<?
  }else {
?>
     <script language="javascript">
     <!--
          alert("사용자 정보가 존재하지 않습니다!!!");
          location.href="/MES/member/sign_in.php";
     //-->
     </script>
<?  	   
  }  
?>