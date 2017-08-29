<?
  $stringData =  $_POST["content"];
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Preview</title>
	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<link href="../../css/select2.min.css" rel="stylesheet">
	<link href="../../css/select2-bootstrap.min.css" rel="stylesheet">
  <link href="http://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
  <link href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" rel="stylesheet">
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
		<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script src="http://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <script src="../../js/formform.js"></script>
  <script src="../../js/alarm.js"></script>
  <script src="../../js/jsonlint.js"></script>
  <script src="../../js/formatter.js"></script>
  <link rel="stylesheet" href="../../css/common.css" />
  <link rel="stylesheet" href="../../css/layout.css" />
	<script>
		var form;
		
		$(document).ready(function() {
			var demoInput, example, outputForm;

			example = <?=$stringData?>;
			example = JSON.stringify(example);
			example = formatter.formatJson(example);

			outputForm = $('#form-demo-output');
			outputForm.submit(function() {return false});
			
				var inputJson, formFields, inputAlert;

				inputAlert = $('#input-alert');
				inputAlert.empty();
				try {
					jsonlint.parse(example);
				} catch(e) {
					inputAlert.addAlert('danger', e.message.replace(/\n/g, '<br>'));
					return
				}
				formFields = JSON.parse(example);
				outputForm.empty();
				form = FormForm( outputForm, formFields );
				try {
					form.render();
				} catch(e) {
					inputAlert.addAlert('danger', e);
				}
		});
	</script>
	<style>
    //.container { margin:150px auto 50px auto;}
		#input-alert,
		#form-demo-input {
			font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
		}
	</style>
</head>
<body>

<div class="container">
  <h3>Form Builder Preview</h3>

		<div class="search_box">
			<div class="col-md-6">
				<form id="form-demo-output">
				</form>
			</div>
			<div id="input-alert"></div>
		</div>
		<div class="row" style="margin-top: 20px">

		</div>
</div>
</body>
</html>
<script language="javascript">
<!--
    $(function() {      
	 	     var arr = form.getData(); 	     
		     $.each(arr, function(key, value) {	     	  
            if (value["cal"] == "true") {
            	 
       	       var data = value["name"];
       	       $("input[name='"+data+"']").datepicker({
       	   	      dateFormat: 'yy-mm-dd'
       	       });
            }
		     });    	
    });
//-->
</script>