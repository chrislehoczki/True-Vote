'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/polls';
  
  
  //GET POLL VAR
   var pollHTML = "";
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
         var userName = JSONdata.github.username;
         //create HTML to insert
         pollHTML = ""
         pollHTML += "<h1> Your Polls </h1> <ul>"
         
         for (var i=0; i < pollsObject.length; i++) {
            pollHTML += "<li> <p>" + pollsObject[i].question + "</p>" 
            pollHTML += "<button class='btn btn-primary deletePollBtn'> Delete </button>"
            pollHTML += "<a href='" + appUrl + "/public/" + userName + "/" + encodeURIComponent(pollsObject[i].question) + "'>Visit Poll</a>"
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
      
    $(".deletePollBtn").click(function () {

   console.log("delete button working")
      var pollTitle = $(this).siblings("p").text();
      pollTitle = encodeURIComponent(pollTitle);
   
   var pollUrl = apiUrl + "/" + pollTitle;
   console.log(pollUrl)
      
   ajaxFunctions.ajaxRequest('DELETE', pollUrl, function (data) {
         alert("You deleted:" + data)
         ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList);
      });
   
   });
   }
   
   //FUNCTION ADD OPTION
   
      
      $("#addoption").click(function() {
         console.log("working")
         
         console.log($("#addPollForm input").length)
         
         var formInputs = $("#addPollForm input").length;
         
         var inputToFind = formInputs - 2;
         var inputToInsert = formInputs - 1;
         
         $("#addPollForm input[name=option" + inputToFind + "]").after('<input type="text" name="option' + inputToInsert + '">');
         
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
