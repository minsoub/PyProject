function gfn_isNull(str) {
    if (str == null) return true;
    if (str == "NaN") return true;
    if (new String(str).valueOf() == "undefined") return true;    
    var chkStr = new String(str);
    if( chkStr.valueOf() == "undefined" ) return true;
    if (chkStr == null) return true;    
    if (chkStr.toString().length == 0 ) return true;   
    return false; 
}

function ComSubmit(opt_formId) {
    this.formId = gfn_isNull(opt_formId) == true ? "commonForm" : opt_formId;
    this.url = "";


    if(this.formId == "commonForm"){
        $("#commonForm")[0].reset();
    }
    
    this.setUrl = function setUrl(url){
        this.url = url;
    };     

    this.addParam = function addParam(key, value){
        $("#"+this.formId).append($("<input type='hidden' name='"+key+"' id='"+key+"' value='"+value+"' >"));
    };

    this.submit = function submit(){
        var frm = $("#"+this.formId)[0];
        frm.action =this.url;
        frm.method = "post";
        frm.submit();
    };
}

function isNumber(event){
			event = event || window.event;
			var keyID = (event.which) ? event.which : event.keyCode;
			if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
				return;
			else
				return false;
}

function removeWord(event) {
			event = event || window.event;
			var keyID = (event.which) ? event.which : event.keyCode;
			if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
				return;
			else
				event.target.value = event.target.value.replace(/[^0-9]/g, "");
}

// JSON 파일을 읽어서 HTML 폼을 생성한다.
function json_register_form_make_handler(json_data)
{
    var html = json_data;
    var table = "";
    var tr = "";

    table = table + "<table class='bom_view'>";
    for (var i = 0; i < html.workForms.length; i++) {
         var line = html.workForms[i];

         var td = "<td class='"+line.class+"'>"+line.title+"</td>";
         var colspan = "";
         if (line.colspan != undefined) {
            colspan = "colspan='"+line.colspan+"'";
         }
         td = td + "<td class='"+line.form_class+"' "+colspan+">";
         for (var j=0; j< line.forms.length; j++) {
            var form = line.forms[j];
            var limit = "";
            var is_num = "";
            var cls = "";
            if (form.type == "text")
            {
                if (form.maxlength != undefined) {
                    limit = "maxlength='"+form.maxlength+"'";
                }
                if (form.is_num != undefined && form.is_num == "true"){
                    is_num = "onkeypress='return event.charCode >= 48 && event.charCode <= 57'";
                }
                if (form.is_calender != undefined && form.is_calender == "true")
                {
                    cls = " is_cal";
                }
                cls = form.class+cls;
                td = td + "<input type='text' name='"+form.name+"' class='"+cls+"' "+limit+" "+is_num+">";
                if (form.label != undefined) {
                    td = td + form.label+"&nbsp;";;
                }
            }else if(form.type == "combo")
            {
                td = td + "<select name='"+form.name+"' class='"+form.class+"'>";
                for (var k=0; k<form.data.length; k++) {
                    var data = form.data[k];
                    td = td + "<option value='"+data.value+"'>"+data.name+"</option>";
                }
                td = td + "</select>";
                if (form.label != undefined) {
                    td = td + form.label+"&nbsp;";
                }
            }else if(form.type == "radio")
            {
                for (var k=0; k<form.data.length; k++) {
                    var data = form.data[k];
                    td = td + "<input type='radio' name='"+form.name+"' class='"+form.class+"' value='"+data.value+"'>"+data.name+"&nbsp;";;
                    if (form.label != undefined) {
                        td = td + form.label;
                    }
                }
            }
         }
         td = td + "</td>";
         if (line.next == "false") {
            //console.log("line name : " + line.title);
            tr = "<tr>" + tr + td+"</tr>";
            //console.log("line tr : " + tr);
            table = table + tr;
            tr = "";
         }else {
            tr = tr + td;
         }
    }
    table = table + "</table>";

    return table;
}

function formatDate(dateObj,format)
{
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var curr_date = dateObj.getDate();
    var curr_month = dateObj.getMonth();
    curr_month = curr_month + 1;
    var curr_year = dateObj.getFullYear();
    var curr_min = dateObj.getMinutes();
    var curr_hr= dateObj.getHours();
    var curr_sc= dateObj.getSeconds();
    if(curr_month.toString().length == 1)
    curr_month = '0' + curr_month;
    if(curr_date.toString().length == 1)
    curr_date = '0' + curr_date;
    if(curr_hr.toString().length == 1)
    curr_hr = '0' + curr_hr;
    if(curr_min.toString().length == 1)
    curr_min = '0' + curr_min;

    if(format ==1)//dd-mm-yyyy
    {
        return curr_date + "-"+curr_month+ "-"+curr_year;
    }
    else if(format ==2)//yyyy-mm-dd
    {
        return curr_year + "-"+curr_month+ "-"+curr_date;
    }
    else if(format ==3)//dd/mm/yyyy
    {
        return curr_date + "/"+curr_month+ "/"+curr_year;
    }
    else if(format ==4)// MM/dd/yyyy HH:mm:ss
    {
        return curr_month+"-"+curr_date +"-"+curr_year+ " "+curr_hr+":"+curr_min+":"+curr_sc;
    }
}