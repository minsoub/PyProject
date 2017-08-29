<html>
    <head>
        <!-- jquery -->
        <script type="text/javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script>
        <!-- bootstrap -->
        <link type="text/css" rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />
        <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
        <!-- handlebars -->
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js"></script>
        <!-- alpaca -->
        <link type="text/css" href="//code.cloudcms.com/alpaca/1.5.23/bootstrap/alpaca.min.css" rel="stylesheet" />
        <script type="text/javascript" src="//code.cloudcms.com/alpaca/1.5.23/bootstrap/alpaca.min.js"></script>
    </head>
    <body>
        <div id="form"></div>
        <script type="text/javascript">
            $(document).ready(function() {
                $("#form").alpaca({
                    "schema": {
                        "title":"User Feedback",
                        "description":"What do you think about Alpaca?",
                        "type":"object",
                        "properties": {
                            "name": {
                                "type":"string",
                                "title":"Name"
                            },
                            "feedback": {
                                "type":"string",
                                "title":"Feedback"
                            },
                            "ranking": {
                                "type":"string",
                                "title":"Ranking",
                                "enum":['excellent','ok','so so']
                            }
                        }
                    },
                    "options": {
                        "helper": "Tell us what you think about Alpaca!",
                        "fields": {
                            "name": {
                                "size": 20,
                                "helper": "Please enter your name.",
                                "placeholder": "Enter your name"
                            },
                            "feedback" : {
                                "type": "textarea",
                                "rows": 5,
                                "cols": 40,
                                "helper": "Please enter your feedback."
                            },
                            "ranking": {
                                "type": "select",
                                "helper": "Select your ranking.",
                                "optionLabels": ["Awesome!", "It's Ok", "Hmm..."]
                            }
                        }
                    }
                });
            });
        </script>       
    </body>
</html>