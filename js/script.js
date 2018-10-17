$(function() {

    console.log("Michel ?");
	var htmlResult, activeSearch = "";
	var API_KEY = "AIzaSyAZUmS0rkkWttzfKO6Ynwr5vxzKNx_uLsE";
	var searchEngineId = "008506937237879921688:pmy70kjvvye";

	var basicArticleSearchUrl = "https://www.googleapis.com/customsearch/v1?key=" + API_KEY +"&cx=" + searchEngineId + "&callback=initBasicPage";
	var startIndexCurrent,totalResult = 0;
 	function getValueHrefMinusHash(hrefObject){
 		var href = $(hrefObject).attr("href");
	    var value = href.substr(href.indexOf("#") + 1);
	    console.log("Michel qu'est ce t'as foutu elle est ou ma value du link cliqué ? " + value);
	    return value;
 	}
	function loadPage(keywords,startIndex,callback){		
		$.ajax({
		    type: "get",
		    url: "https://www.googleapis.com/customsearch/v1?key=" + API_KEY + "&cx=" + searchEngineId + "&sort=date:d:s&q=" + keywords + "&start=" + startIndex,
		    
		    success: function(data) {
					console.log("oh yeah! Super Michel !" + data.toString());
					initBasicPage(data,keywords,callback); 				
		    }
		});
	}
	function removeLastDigit(number){
		if(number < 10){
			return 1
		}else{
			number = number.toString();
			number = number.slice(0, -1);
			number = parseInt(number);
			return number+1;
		}
	}
	function initPagination(currentIndex, nextIndex, previousIndex){
		var previousPage, nextPage, currentPage, firstIndex, lastIndex = 0;
		console.log("Michel arrete de deconner c'est quoi le previous index " + previousIndex);

	    currentPage = removeLastDigit(currentIndex);
		var firstPage = currentPage - 5;
	   


	    if(previousIndex != 0 && previousIndex != null){
	    	previousPage =  removeLastDigit(previousIndex);	    	
	    	htmlResult += "<a href='#" + previousIndex + "' class='page-link page-link-previous'> Previous </a>";
	    }

	    for(var i = 1;i < 11; i++){
	    	
	    	if(currentPage < 7){
	    		if(currentPage == i){
	    			htmlResult += currentPage;
	    		}else{
	    			htmlResult += "<a href='#" + (i*10-9) + "' class='page-link'> " + i + " </a>";
	    		}
	    	}else{
	    		if(firstPage == currentPage){
	    			htmlResult += currentPage;
	    		}else{
	    			htmlResult += "<a href='#" + (firstPage*10-9) + "' class='page-link'> " + firstPage + " </a>";
	    		}
	    		firstPage++;
	    	}
	    }

	    
	    
	    if(nextIndex != 0 && nextIndex != null){
	    	nextPage = removeLastDigit(nextIndex);
	    	htmlResult += "<a href='#" + nextIndex + "' class='page-link page-link-next'>Next</a>";
	    	
	    }	    
	    //console.log("Michel quel est l'index " + currentIndex + " celui d'apres " + nextIndex + " et celui d'avant " + previousIndex);
	}
	function initBasicPage(response,keywords,callback) { 
		var startIndexPrevious, startIndexNext, startIndexCurrent, totalResult = 0;
		htmlResult = '';	
		console.log("Les données Michel " + response)	
      	for (var i = 0; i < response.items.length; i++) {
	        var item = response.items[i];
      		//console.log("titre michel ! : " + item.title);
	        //document.getElementById("content").innerHTML += "<br/><br/>" + JSON.stringify(item);
	    	if( item.pagemap.cse_image != null){
		    	 for (var j = 0; j < item.pagemap.cse_image.length; j++) {	    
		         	var subitem = item.pagemap.cse_image[j];
		            htmlResult += "<br/><br/><img width='500' src='" + subitem.src + "'></img>";        		 	
		    	}
		         htmlResult += "<br/>" + item.title;
		         htmlResult += "<br/><a href='" + item.link + "'>"+ item.link +"</a><br/><br/><br/>";
	    	}
	    }

	    //recuperation des infos de pagination 
	    if(response.queries.previousPage != null){
	    	startIndexPrevious = response.queries.previousPage[0].startIndex;
	    console.log("bah Michel qu'est ce tu fous la ya une page avant ? " + startIndexPrevious);
	    }
	    if(response.queries.nextPage != null){
	    	startIndexNext = response.queries.nextPage[0].startIndex;
	    	console.log("bah Michel qu'est ce tu fous la ya une page apres ? " + startIndexNext);
	    }
	    startIndexCurrent = response.queries.request[0].startIndex;

	    initPagination(startIndexCurrent, startIndexNext,startIndexPrevious);

		//on vide la page
	    $("#content").html('');
	    //on remplit la page
	  	$("#content").append(htmlResult);
	  	//s'il y a callback zou
	  	if (callback && typeof(callback) === "function") {
	  		callback();
	  	}

    }
    function addingEvents() { 
	    $('.page-link').click(function(){

	    	
	        console.log("Michel sur quelle page suis-je ? " + getValueHrefMinusHash($('.menu-link.active')));
	        activeSearch = getValueHrefMinusHash(this);
	        loadPage(getValueHrefMinusHash($('.menu-link.active')),getValueHrefMinusHash(this),addingEvents);	
	    	
	    });
	    $('.menu-link').click(function(){

	    	$('.menu-link.active').removeClass('active');
	    	$(this).addClass('active');

	        console.log("Michelsur quelle page suis-je ? " + getValueHrefMinusHash($('.menu-link.active')));
	        loadPage(getValueHrefMinusHash(this),1,addingEvents);	
	        
	    	
	    });

    }

	loadPage(getValueHrefMinusHash($('.menu-link.active')),1, addingEvents);
 //     var dataJson = $.getJSON('data.js', function(json, textStatus) {
 //    		initBasicPage(json,"Blanchiment");

 //    }).done(function() {
	//     console.log( "second success" );
	//   })
	//   .fail(function(dataJson, textStatus, error) {
	//     var err = textStatus + ", " + error;
 //    	console.log( "Request Failed: " + err );
	//   })
	//   .always(function() {
	//     console.log( "complete" );
	// });
});
