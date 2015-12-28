'use strict';

var Users = require('../models/users.js');


function ClickHandler () {

	//GET POLLS FOR USER
	this.getPolls = function (req, res) {
		console.log(req.params);
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				
				res.json(result);
			});
	};
	
	//ADD A POLL FOR USER
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

					res.redirect('back');
				}
			)
	}//END

		
	//DELETE A POLL
	this.deletePoll = function (req, res) {
				
		var pollQuestion = req.params.pollname;
		console.log(req.params)
		
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, {$pull: {polls: {question: req.params.pollname}}})
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(pollQuestion);
				}
			);
	};//END
	
	
	
	//PUBLIC 
	this.getPublicPoll = function (req,res) {

		var user = req.params.user;

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
						
						var formUrl = "/public/" + user + "/" + encodeURIComponent(item.question)
					
    				
    				console.log(item.options.length)
    				
    				
						console.log(item.question)
						console.log(item)
						res.render('poll', {item, url: formUrl});
					}
				});
				
				}
			});
			
	}; //end
			
			//PUBLIC ADD DATA TO POLL
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
 		
       Users
            .findOneAndUpdate({ 'github.username': userName, "polls.question": pollName },	incModifier,  { "new": true})
            .exec(function (err, result) {
                    if (err) { throw err; }
				
				
										//redirects back to page so that can see chart data
                    res.redirect('back');
                }
            );

    }
    
    this.addOption = function(req, res) {
    	
    	
    	var pollTitle = req.params.polltitle;
    	console.log("POLL TITLE")
    	console.log(pollTitle)
    	var option = req.params.option;
    	var pollArray;
    	
    	
    	var newOption = { value: 0, option: option };
    	console.log("new option to push")
    	console.log(newOption)	  
    	//GET POLL DATA
    	Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				console.log(typeof result.polls)
				
				console.log(typeof result.polls)
				console.log("ALL POLLS IN OBJECT: " + result.polls)
				
				console.log(result.polls[0])
				console.log(result.polls[1])
				var resultPolls = result.polls;
				
				resultPolls.map(function(item) {
					console.log("QUESTIONS IN ARRAY")
					console.log(item.question)
					if (item.question === pollTitle) {
						pollArray = item;
					}
				})//END OF MAP 
				
					console.log("OLD POLL ARRAY")
					console.log(pollArray)
					
				
					pollArray.options.push(newOption)
					console.log("NEW POLLS TO PUSH: " + pollArray)
					
					//DELETE OLD POLL
					Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, {$pull: {polls: {question: pollTitle}}})
			.exec(function (err, result) {
					if (err) { throw err; }
					
					
					//ADD NEW POLL OBJECT
					
					Users
		.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { polls: pollArray } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.send("back");
				});
	
				});//END OF DELETE POLL
	
				});//END OF OVERALL FUNCTION
					
				
			
	
    
    }
    

}//END OF OBJECT

module.exports = ClickHandler;
