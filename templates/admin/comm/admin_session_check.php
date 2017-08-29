<?
if(!isset($_SESSION['user_id'])) {
?>
  <script language="javascript">
  <!--
        alert("사용자 정보가 존재하지 않습니다!!!");     
  //-->
  </script>
  <meta http-equiv='refresh' content='0;url=/MES/admin/sign_in.php'>
<?	
}
?>
