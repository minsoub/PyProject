/*
 * Bootstrap-FormForm
 * Christian Bergmiller 2015
 * https://github.com/cbergmiller/bootstrap-formform
 *
 * fields = [
 *    {
 * 		name: '',
 * 		label: '',
 * 		type: 'select',
 * 		'class': '',
 * 		id: null,
 * 		appendLabel: '',
 * 		default: '',
 * 		choices: []
 *    }
 * ];
*/

var FormForm = (function($) {
	
	
	return function(dom, fields) {
		var self = {};
    var chkData = new Array();
    
		self.isHorizontal = false;
		self.col1 = 4;
		self.col2 = 8;
		self.fields = fields;
		self.dom = dom;
		self.templates= {
			group: _.template(
				'<div class="form-group">\
					<label for="<%= data.id %>"><%- data.field.label %></label>\
					<%= data.renderedData %>\
					<span class="help-block"></span>\
				</div>', {variable: 'data'}),
			horizontalGroup: _.template(
				'<div class="form-group">\
					<label class="col-sm-<%= data.col1 %> control-label" for="<%= data.id %>"><%- data.field.label %></label>\
					<div class="col-sm-<%= data.col2 %>">\
						<%= data.renderedData %>\
					</div>\
					<div class="col-sm-<%= data.col1 %>"></div>\
					<div class="col-sm-<%= data.col2 %>">\
						<span class="help-block" style="margin: 0"></span>\
					</div>\
				</div>', {variable: 'data'}),
			horizontalOffsetGroup: _.template(
				'<div class="form-group">\
					<div class="col-sm-offset-<%= data.col1 %> col-sm-<%= data.col2 %>">\
						<%= data.renderedData %>\
					</div>\
				</div>', {variable: 'data'}),
			select: _.template(
				'<select name="<%= data.name %>" class="form-control" id="<%= data.id %>"></select>'
				, {variable: 'data'}),
			selectmultiple: _.template(
				'<select multiple="multiple" class="form-control" name="<%= data.name %>" id="<%= data.id %>"></select>'
				, {variable: 'data'}),
			input: _.template(
				'<input type="<%= data.type %>" name="<%= data.name %>" value="<%=data.value%>" class="form-control" id="<%= data.name %>" <% if (data.size != ""){%>style="width:<%=data.size%>px;"<%}%> <% if (data.maxlength != ""){%>maxlength="<%=data.maxlength%>"<%}%> <%if(data.IsNumber == "true"){%>onkeydown="return onlyNumber(event)" onkeyup="removeChar(event)" style="ime-mode:disabled;"<%}%> />'
				, {variable: 'data'}),
			multi_text:_.template(
				'<div style="float: auto;">\
				    <% var idx = data.datalist.length; %>\
				    <%  _.each(data.datalist, function(row) { %>\
							<input type=text  name="<%= row.name %>" value="<%=row.value%>" class="user-control" id="<%= row.name %>" <%if(row.size != ""){%>style="width:<%=row.size%>px;"<%}%> <%if (row.maxlength != ""){%>maxlength="<%=row.maxlength%>"<%}%> <%if(row.IsNumber == "true"){%>onkeydown="return onlyNumber(event)" onkeyup="removeChar(event)" style="ime-mode:disabled;"<%}%> />\
				    <% idx--; if(idx > 0){%>&nbsp;-&nbsp;<%}  })  %>\
				 </div>', {variable: 'data'}),			  	
			textarea: _.template(
				'<textarea name="<%= data.name %>" class="form-control" id="<%= data.id %>" rows="4"></textarea>'
				, {variable: 'data'}),
			file: _.template(
				'<div class="controls" style="height: 34px;">\
					<div class="fileinput <% if (data.value) { %>fileinput-exists<% } else { %>fileinput-new<% } %>" data-provides="fileinput">\
						<input id="<%= data.id %>-clear_id" name="<%= data.name %>-clear" type="checkbox">\
						<div class="input-group">\
							<div class="form-control uneditable-input" data-trigger="fileinput">\
								<span class="fileinput-filename"><%- data.value %></span>\
							</div>\
							<span class="input-group-addon btn btn-grey btn-file">\
								<span class="fileinput-new">select File</span>\
								<span class="fileinput-exists">\
									<span class="glyphicon glyphicon-file" style="margin-right: 0"></span>\
								</span>\
								<input type="file" id="<%= data.id %>" name="<%= data.name %>">\
							</span>\
							<a href="#" class="input-group-addon btn btn-grey fileinput-exists" data-dismiss="fileinput">\
								<span class="glyphicon glyphicon-remove" style="margin-right: 0"></span>\
							</a>\
						</div>\
					</div>\
				</div>', {variable: 'data'}),
			options: _.template(
				'<% _.each(choices, function(choice) { %>\
					<option value="<%= choice[0] %>"><%- choice[1] %></option>\
				<% }) %>', {variable: 'choices'}),
			optGroups: _.template(
				'<% _.each(choices, function(optgroup) { %>\
					<optgroup label="<%- optgroup[0] %>">\
						<% _.each(optgroup[1], function(choice) { %>\
							<option value="<%= choice[0] %>"><%- choice[1] %></option>\
						<% }) %>\
					</optgroup>\
				<% }) %>', {variable: 'choices'}),
			checkbox: _.template(
				'<div class="checkbox">\
					<label>\
						<input type="checkbox" name="<%= data.name %>" <% if (data.value){ %>checked="checked"<% } %>> <%- data.label %>\
					</label>\
				</div>', {variable: 'data'}),
			button: _.template(
				'<button type="<%= data.type %>" id="<%=data.id%>" class="btn <%= data.class %>">\
					<% if (data.icon) { %><span class="glyphicon glyphicon-<%= data.icon %>"></span><% } %>\
					<span><%- data.label %></span>\
				</button>&nbsp;', {variable: 'data'})
		}; // ToDo: addon

		self.typeConfig = {
			text: {
				template: self.templates.input,
				value: true
			},
			multi_text: {
				template: self.templates.multi_text,
				value: true
			},
			password: {
				template: self.templates.input,
				value: true
			},
			number: {
				template: self.templates.input,
				value: true
			},
			textarea: {
				template: self.templates.textarea,
				value: true
			},
			checkboxinput: {
				template: self.templates.checkbox
			},
			select: {
				template: self.templates.select,
				value: true
			},
			selectmultiple: {
				template: self.templates.selectmultiple,
				value: true
			},
			select2: {
				template: self.templates.select,
				value: true,
				select2: true
			},
			selectmultiple2: {
				template: self.templates.selectmultiple,
				value: true,
				select2: true
			},
			button: {
				template: self.templates.button
			},
			submit: {
				template: self.templates.button
			}
		};

		/**
		 * Render the Form and attach it to the DOM.
		 */
		self.render = function(result) {
			self._renderFields();
			self._renderButtons(result);
		};

		/**
		 * Render all buttons and attach them to the DOM.
		 * @private
		 */
		self._renderButtons = function(result) {
			var renderedButtons = '';

			_.each(self.fields, function(field) {
				if ( !_.contains( ['button', 'submit'], field.type ) ) return;
				renderedButtons += self.templates.button(field);
			});
			
			if (result == false) {
			   var data = {
            "label": "Delete",
            "id": "btnDel",
            "type": "button",
            "class": "btn-default",
            "icon": "ok"
         }   
         renderedButtons += self.templates.button(data); 
			}
			
			if (self.isHorizontal) {
				renderedButtons = self.templates.horizontalOffsetGroup({
					renderedData: renderedButtons,
					col1: self.col1,
					col2: self.col2
				})
			}
			self.dom.append(renderedButtons);
		};

		/**
		 * Render all form-fields and attach them to the DOM.
		 * @private
		 */
		self._renderFields = function() {
			_.each(self.fields, function(field) {
				var formField,
					inputTemplate,
					groupTemplate,
					typeConfig;

				// skip buttons
				if ( _.contains( ['button', 'submit'], field.type ) ) return;

				typeConfig = self.typeConfig[field.type];
				
				if (!field.id) field.id = _.uniqueId();
				inputTemplate = self._getInputTemplate(field);
				groupTemplate = self._getGroupTemplate(field);
				formField = $(
					groupTemplate({
						field: field,
						renderedData: inputTemplate(field),
						col1: self.col1,
						col2: self.col2
					})					
				);
				
				if (field.type == "multi_text")
				{
					  _.each(field.datalist, function(data) {
				      var dd = {
				        "label" : field.label,
				        "name"  : data.name,
				        "mandatory" : field.mandatory,
				        "type"  : "text",
				        "size"  : data.size,
				        "maxlength" : data.maxlength,
				        "IsNumber" : data.IsNumber,
				        "cal" : data.cal,
				        "view" : field.view				        
				      };
				      chkData.push(dd);
				   });
			 }else {
				   var dd = {
				    "label" : field.label,
				    "name"  : field.name,
				    "mandatory" : field.mandatory,
				    "type"  : field.type,
				    "size"  : field.size,
				    "maxlength" : field.maxlength,
				    "IsNumber" : field.IsNumber,
				    "cal" : field.cal,
				    "view" : field.view
				  };
				  chkData.push(dd);			 	
			 }
				
				
				// Select-Optionen Rendern
				if ( field.choices ) self._renderChoices(formField, field);
				// Initialen Wert setzten
				if ( _.has(field, 'value') && typeConfig.value ) {
					formField.find('input, select, textarea').val(field.value);
				}
				self.dom.append(formField);
				
				
				if ( typeConfig.select2 ) {
					formField.find('select').select2({theme: 'bootstrap'});
				}
		
			});
		};

    self.getData = function() {
    	  return chkData;
    }
		/**
		 * Get the matching template for a form-field.
		 */
		self._getInputTemplate = function(field) {
			if (self.typeConfig[field.type]) {
				return self.typeConfig[field.type].template
			} else {
				throw 'Unkown field type: ' + field.type;
			}
		};

		/**
		 * Get the matching template for a form-group.
		 */
		self._getGroupTemplate = function(field) {
			if ( field.type == 'checkbox') {
				if (self.isHorizontal) {
					return self.templates.horizontalOffsetGroup
				} else {
					return function(field) {
						return field.renderedInput
					}
				}
			} else if (self.isHorizontal) {
				return self.templates.horizontalGroup
			} else {
				return self.templates.group
			}
		};

		/*
		 * Render options for a select-box
		 */
		self._renderChoices = function (formField, field) {
			var select;

			select = formField.find('select');
			if ( _.isArray( field.choices[0][1] ) ) {
				select.html(self.templates.optGroups(field.choices));
			} else {
				select.html(self.templates.options(field.choices));
			}
		};

		/**
		 * Get the field config object by name.
		 */
		self.getFieldByName = function(name) {
			return _.find( self.fields, function(field) {
				return field.name == name
			})
		};

		/*
		 * Reset the form to default values.
		 */
		self.reset = function() {

		};

		/*
		 * Setze alle Formularfelder auf die Werte aus dem Objekt.
		 */
		self.update = function(obj) {

		};

		return self
	};
})(jQuery);


function dataEmptyCheck(form)
{
		var result = true;	
		var arr = form.getData();
		var found = 0;
		$.each(arr, function(key, value) {

			 if (value["type"] == "text" || value["type"] == "multi_text")
		 	 {
		 	 	  var data = value["name"];
		 	  	var myvalue = $("input[name='"+data+"']").val(); 
		 	  	
		 	  	if (value["mandatory"] == "true" && myvalue == "") 
		 	  	{
		 	  		alert(value["label"]+" 항목은 필수 항목입니다!!!");
		 	  		$("input[name='"+data+"']").focus();
		 	  		found = 1;
		 	  		return false;
		 	  	}
		 	 }
		});
		
		//alert(found);
		if (found == 1) result = false;
		 
		return result;
}

function onlyNumber(event){
			event = event || window.event;
			var keyID = (event.which) ? event.which : event.keyCode;
			if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
				return;
			else
				return false;
}
function removeChar(event) {
			event = event || window.event;
			var keyID = (event.which) ? event.which : event.keyCode;
			if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
				return;
			else
				event.target.value = event.target.value.replace(/[^0-9]/g, "");
}