module.exports = function(app, mongoose)
{
	  mongoose.connect('mongodb://localhost:27017/commDB', function(err) {
	     if (err) {
	        console.log("mongodb connection error", err);	
	     }
	     console.log("mongodb connected..");
	  });
	  // Create a schema
    var memberSchema =  new mongoose.Schema({
      	_id: {type: mongoose.Schema.Types.ObjectId},
        userid: String,
        name: String,
        pass: String,
        tel1: String,
        tel2: String,
        tel3: String,
        lastModified: { type: Date, default: Date.now },
    });
    // Create a model based on the schema
    var memberModel = mongoose.model('member' , memberSchema, 'member');  // , memberSchema);
         
	   //app.use(express.json());
	   
     app.get('/about', function(req, res) {
          res.render('about.html');
     });
     
     app.get('/list', function(req, res) {
         // json data
         
         res.end("json_data");	
     });
     
     app.get('/rest/getUser/:userid', function(req, res) 
     {
     	   var result;
     	   console.log(req.params.Member);
     	   console.log(req.params.userid);
	       var paramData = req.param("Member");  // req.params.Member;
	       
	       console.log(paramData);
	       var data = JSON.parse(paramData);
	   
	       console.log(data);

	       var key = data.userid;
	       //commDB.member
 
         //var mem = new memberModel();
         console.log("search userid : " + key);
         var member = mongoose.model('member');  // memberModel.model('member');
         
         member.findOne({userid : req.params.userid }, function(err, mem){
             //res.render('main', { user: user } );
             if (err) {
                 console.log("Error : " + err);	                
             }
             if (mem != null)
             {
             	   result = {"success" : true};
             	   res.setHeader('Content-Type', 'application/json');
	               res.json(JSON.stringify(result));
             }else {
             	   result = {"success" : false};
             	   res.setHeader('Content-Type', 'application/json');
	               res.json(JSON.stringify(result));             	   
             }
             console.log("getData : " + mem);             
         });
     });
     
     app.get('/rest/getUserDB/:dbname', function(req, res) 
     {
     	   var result;
	       
         var member = mongoose.model('member');  // memberModel.model('member');
         
         member.findOne({dbname : req.params.dbname }, function(err, mem){
             //res.render('main', { user: user } );
             if (err) {
                 console.log("Error : " + err);	                
             }
             if (mem != null)
             {
             	   result = {"success" : true};
             	   res.setHeader('Content-Type', 'application/json');
	               res.json(JSON.stringify(result));
             }else {
             	   result = {"success" : false};
             	   res.setHeader('Content-Type', 'application/json');
	               res.json(JSON.stringify(result));             	   
             }
             console.log("getData : " + mem);             
         });
     });
     
          
     app.post('/rest/getUser/:userid', function(req, res) {
     	   req.accepts('application/json');
     	   
     	   var result = {  };
     	   var userid = req.params.userid;
     	   
     	   var json = req.body;
     	   console.log("userid : " + json.userid);
     	   
     	   // check req validity
     	   //if (!req.body['Member']) {
     	       result["success"] = "false";
     	       result["error"] = "Invalid request";
     	       
     	       res.json(result);
     	       
     	       return;	
     	   //}
     	   
     });
}