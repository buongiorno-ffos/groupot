var Events = (function(){

	var init = function(){
	var id = setId(),ids = [];
	var anEvent = {
		"name": "event_test",	
		"users": ["me", "a", "b", "c"],
		"payments": [	
			{ "from": "me", "to": ["a", "b"], "amount": 10 },
			{ "from": "a", "to": ["a", "b"], "amount": 10 },
			{ "from": "c", "to": ["me", "a", "b", "c"], "amount": 20 },
			{ "from": "c", "to": ["me", "a", "b"], "amount": 10 },
		]
	};
	var anEvent2 = {
		"name": "event2_test2",	
		"users": ["me", "a", "b", "c"],
		"payments": [	
			{ "from": "me", "to": ["a", "b"], "amount": 10 },
			{ "from": "a", "to": ["a", "b"], "amount": 10 },
			{ "from": "c", "to": ["me", "a", "b", "c"], "amount": 20 },
			{ "from": "c", "to": ["me", "a", "b"], "amount": 10 },
		]
	};	
	setCurrentEventCollection("");
	localStorage.setItem(id,JSON.stringify(anEvent));
	ids.push(id);
	id = setId();
	localStorage.setItem(id,JSON.stringify(anEvent2));
	ids.push(id);
	var events_ids = {
		"ids": [ids[0],ids[1]]
	}
	localStorage.setItem('events',JSON.stringify(events_ids));
	},

	setId = function(){
		return "event_" + Math.floor(Math.random()*1000000);
	},

	loadEvents = function(){
		var li,ul,spanText,spanArrow;

		//TODO: remove init() when createEvent is implemented
		init();
		if(!!localStorage.getItem('events')) {
			var events = JSON.parse(localStorage.getItem('events'));
			var ids = events['ids'];
			for(var i = 0; i < ids.length;i++){
				li = document.createElement('li');
				
				spanText = document.createElement('span');
				spanText.appendChild (document.createTextNode(JSON.parse(localStorage.getItem(ids[i]))['name']));
				
				spanArrow = document.createElement('span');											  
				spanArrow.className ="icon-right-open right";

				inputId = document.createElement('input');
				inputId.type="hidden";
				inputId.value=ids[i];
				
				li.appendChild(spanText);
				li.appendChild(spanArrow);
				li.appendChild(inputId);

				ul= document.getElementById('events');
				ul.appendChild(li);

				console.log("grouping events loaded within DOM");
					
				
			}
			/*Once loaded the events like HTMLElements within the DOM 
			we set click events to every li representing a group event*/

			var lis = document.getElementsByTagName('li');

			for(var i = 0 ; i < lis.length;i++){
		    	lis[i].addEventListener('click',function(ev){
		      		var children = ev.currentTarget.children;			      
		      		for (var j = 0; j < children.length; j++) {
		        		if (children[j].tagName == "INPUT") {
		        			console.log("currentEventId:" + children[j].value);

		           			setCurrentEventCollection(children[j].value);
		           			console.log("LS-CurrentEventIdCollection:" + localStorage.getItem('currentEvent'));
		           			console.log("LS-EntireEvent:" + localStorage.getItem(children[j].value));
		           //TODO redirect to summary.html page (payments section)
		        		}
		      		}
		    	});
			}
		} else {
			return false;
		}
	},

	createEvent = function(){

	//TODO 

	},

	getEventPayments = function(currentEventId){

		var currentEvent = JSON.parse(localStorage.getIem(currentEventId));

		var payments = currentEvent['payments'];

		//TODO insert into DOM 


	},

	getEVentPeople = function(){
		//TODO retrieve currentEvent people them insert it into the DOM (summary.html people section)
	},
	setCurrentEventCollection = function(currentEventId){
		var currentEvent = {
			"id": currentEventId
		};
		return localStorage.setItem("currentEvent",JSON.stringify(currentEvent));
	};

	return {
		loadEvents:loadEvents,
		createEvent : createEvent	
	}				
})();

document.addEventListener("DOMContentLoaded", Events.loadEvents);