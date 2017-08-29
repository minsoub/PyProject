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
	<link href="../css/select2.min.css" rel="stylesheet">
	<link href="../css/select2-bootstrap.min.css" rel="stylesheet">
    <link href="http://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script src="http://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <script src="../js/formform.js"></script>
  <script src="../js/alarm.js"></script>
  <script src="../js/jsonlint.js"></script>
  <script src="../js/formatter.js"></script>
	<script>
		$(document).ready(function() {
			var demoInput, example, outputForm;

			example = <?=$stringData?>;
			example = JSON.stringify(example);
			example = formatter.formatJson(example);
			demoInput = $('#form-demo-input');
			demoInput.val( example );

			outputForm = $('#form-demo-output');
			outputForm.submit(function() {return false});
			
			



			//$('#btn-render').click(function() {
				var inputJson, form, formFields, inputAlert;

				inputAlert = $('#input-alert');
				inputAlert.empty();
				inputJson = demoInput.val();
				try {
					jsonlint.parse(inputJson);
				} catch(e) {
					inputAlert.addAlert('danger', e.message.replace(/\n/g, '<br>'));
					return
				}
				formFields = JSON.parse(inputJson);
				outputForm.empty();
				form = FormForm( outputForm, formFields );
				try {
					form.render();
				} catch(e) {
					inputAlert.addAlert('danger', e);
				}
			//});
		});
	</script>
	<style>
    .container { margin:150px auto 50px auto;}
		#input-alert,
		#form-demo-input {
			font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
		}
	</style>
</head>
<body>

	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="page-header">
					<h1>jQuery FormForm Plugin Demo</h1>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<form>
					<div class="form-group">
						<label for="form-demo-input">JSON source</label>
						<textarea class="form-control" rows="12" id="form-demo-input"></textarea>
					</div>
					<div id="input-alert"></div>
					<button type="button" class="btn btn-primary btn-lg" id="btn-render">Render form</button>
				</form>
			</div>
			<div class="col-md-6">
				<form id="form-demo-output">
				</form>
			</div>
		</div>
		<div class="row" style="margin-top: 20px">

		</div>
	</div>
</body>
</html>