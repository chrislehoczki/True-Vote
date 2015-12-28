'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/polls';
  
  
  //GET POLL VAR
   var pollHTML = "";
   var optionsHTML = "";
   var pollSpan = document.getElementById("polls");
   
   //DELETE POLL VAR
   var deletePollBtn = $(".deletePollBtn");
   console.log(deletePollBtn)
   
   //FUNCTION SHOW POLLS
   function updatePollList (data) {
         
         //GET USER DATA 
         //clear form data
         $('input[type="text"],textarea').val('');
         
         //parse JSON 
         var JSONdata = JSON.parse(data);
         console.log(JSONdata)
         var pollsObject = JSONdata.polls;
         console.log(pollsObject)
         var userName = JSONdata.github.username;
         //create HTML to insert
         pollHTML = ""
         pollHTML += "<h1> Your Polls </h1> <ul id='pollsList'>"
  
         //CREATE POLL OBJECT
         for (var i=0; i < pollsObject.length; i++) {
            
            
            //CREATE OPTIONS OBJECT FOR EACH POLL
            optionsHTML = "";
            optionsHTML += "<ul>"
            for (var x=0; x < pollsObject[i].options.length; x++) {
      
            optionsHTML += "<li>" + pollsObject[i].options[x].option + "</li>"
            }
            optionsHTML += "</ul>"
            console.log(optionsHTML)
        
            //INSERT POLL
            pollHTML += "<li class='poll'>"
            pollHTML += "<h3>" + pollsObject[i].question + "</h3>"
            pollHTML += optionsHTML;
            pollHTML += "<button class='btn'> <a href='" + appUrl + "/public/" + userName + "/" + encodeURIComponent(pollsObject[i].question) + "' target='_blank'>Visit Poll</a></button>"
            pollHTML += "<button class='btn btn-primary addOptBtn'> Add New Option </button>"
            pollHTML += "<button class='btn btn-primary deletePollBtn'> Delete </button>"
            pollHTML += "</li>"
         }
         
         pollHTML += "</ul>"
       
         //insert it
         pollSpan.innerHTML = pollHTML;
         
         //Bind click handlers to delete buttons
         bindClickHandlers();
      }

   //FUNCTION BIND CLICK HANDLERS
   function bindClickHandlers () {
      
      //DELETE BUTTON
    $(".deletePollBtn").click(function () {

   console.log("delete button working")
      var pollTitle = $(this).siblings("h3").text();
      console.log(pollTitle)
      pollTitle = encodeURIComponent(pollTitle);
   
   var pollUrl = apiUrl + "/" + pollTitle;
   console.log(pollUrl)
      
   ajaxFunctions.ajaxRequest('DELETE', pollUrl, function (data) {
         alert("You deleted:" + data)
         ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList);
      });
   });
   
    //ADD NEW OPTION TO ALREADY CREATED
   $(".addOptBtn").click(function () {
   
      
   $(this).siblings("ul").append("<input type=text class='newOpt'> </input> <button class='btn btn-primary sendOption'> Add </button>")
   
   
   
   //add event handler to button
    
      $(".sendOption").click(function() {
         console.log("working")
         
         
         var option = $(this).siblings(".newOpt")[0].value;
         
         if (option === "") {
            alert("you cannot send a blank option")
            $(this).siblings(".newOpt")[0].value === "";
            return;
         }
         
         var pollData = $(this).parent().parent();
         var pollTitle = pollData[0].children[0].textContent
         
         pollTitle = encodeURIComponent(pollTitle);
         
         console.log(option)
         var addPollUrl = appUrl + "/addoption/" + pollTitle + "/" + option
         
          ajaxFunctions.ajaxRequest('GET', addPollUrl, function (data) {
             console.log(data)
             ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList));
          });
         
         
      });
   
   });
   
   
  
  
   
   }//end of click handlers
   
 
   
  
   //FUNCTION ADD OPTION
   
      $("#addoption").click(function() {
         
         var formInputs = $("#addPoll input").length;
         
         var inputToFind = formInputs - 2;
         var inputToInsert = formInputs - 1;
         
         $("#addPoll input[name=option" + inputToFind + "]").after('<input type="text" name="option' + inputToInsert + '">');
 
      })
      

   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList));
   
















  //CLICK STUFF

    function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
