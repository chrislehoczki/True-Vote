'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler(); //new clickhandler object from the function in other file


	

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	//USER API - to get data on a user
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});
	
	//AUTH WITH GITHUB - initiates authentication
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	//CALLBACK FROM GITHUB
	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));



	//CLICK INFO
	/*
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick) 
		.delete(isLoggedIn, clickHandler.resetClicks);
		*/
		
		
		
		
		//PUBLIC VIEW AND VOTE API
	app.route('/vote')
		.get(function (req, res) {
			res.sendFile(path + '/public/poll.html');
		});
		
	//PUBLIC API TO GET POLL
	app.route("/public/:user?/:poll?")
		.get(clickHandler.getPublicPoll)
		.post(clickHandler.addPollData); //send data informatio
		
		
	//POLL INFO - PRIVATE API
	app.route("/api/:id?/polls/:pollname?")
		.post(isLoggedIn, clickHandler.addPoll)
		.get(isLoggedIn, clickHandler.getPolls)
		.delete(isLoggedIn, clickHandler.deletePoll);
		
	//ADD OPTION ROUTE
	
	app.route("/addoption/:polltitle?/:option?")
		.get(clickHandler.addOption);
	};

	
