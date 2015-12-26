'use strict';

var Users = require('../models/users.js');


function ClickHandler () {

	
	this.getPolls = function (req, res) {
		console.log(req.params);
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				
				res.json(result);
			});
	};
	
	this.addPoll = function (req, res) {
		
	console.log(req.body)
	console.log(Object.keys(req.body).length)
	
	var optionNmbr = Object.keys(req.body).length;
		
	var poll = { question: req.body.question, options: []}

	console.log(poll)

	for (var i = 1; i < optionNmbr; i++) {
  	var index = "option" + i;
				poll.options.push({option: req.body[index], value: 0})
		}

	console.log(poll);

		
	Users
		.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { polls: poll } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.polls);
				}
			)
	}//END

		
	
	this.deletePoll = function (req, res) {
				
		var pollQuestion = req.params.pollname;
		console.log(pollQuestion)
		
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, {$pull: {polls: {question: req.params.pollname}}})
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(pollQuestion);
				}
			);
	};//END
	
	this.getPublicPoll = function (req,res) {
		console.log(req.params);
	
		Users
			.findOne({ 'github.username': req.params.user }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				
				if (!req.params.poll) {
				res.json(result.polls);
				}
				
				else {

				var polls = result.polls;
				
				polls.map(function(item) {
					if(item.question === req.params.poll) {
					var html = "<h1> A Poll App </h1>"
					
					html += "<ul>";
    				html += "<form action='/public/" + req.params.user + "/" + encodeURIComponent(item.question) + "'" +  "method='post'>"
    				html += "<h2>" + item.question + "</h2>";
    				html += "<input type='radio' name='option' value='0'>" + item.options[0].option;
				    html += "<input type='radio' name='option' value='1'>" + item.options[1].option;
    				html += "<input type='submit'> </input>"
    				html += "</form>"
    				html += "</ul>"
    				html += "<div id='chart_div'></div>"
						console.log(item.question)
						res.send(item)
					}
				});
				
				
				}
			});
	}; //end
			
			
			this.addPollData = function(req, res) {
        console.log(req.params)
        console.log(req.body)
        //data from params of api 
        var userName = req.params.user;
        var pollName = req.params.poll;
       
        
        //data from POST method body
        var choice = req.body.option;
        
      
        //build a inc modifier to use in update
        var incModifier = { $inc: {} };
        incModifier.$inc["polls.$.options." + choice + ".value"] = 1;
 		
 		console.log(incModifier)
 		
        //update users poll with value
        /*
          Users.update(
   { 'github.username': userName, "poll.question": pollName }, incModifier);
   */
   
   console.log(pollName)
       
       Users
            .findOneAndUpdate({ 'github.username': "christoph-phillips", "polls.question": pollName },	incModifier,  { "new": true})
            .exec(function (err, result) {
                    if (err) { throw err; }
				
                    res.json(result);
                }
            );

    }
    
     



}//END OF OBJECT

module.exports = ClickHandler;
