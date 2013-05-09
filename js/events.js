

var Events = (function(){

	var init = function(){
	var id = setId(),ids = [];
	var anEvent = {
		"name": "event1",	
		"contacts": ["me", "a", "b", "c"],
		"payments": [	
			{ "concept":"payment","from": "me", "to": ["a", "b"], "amount": 10 },
			{ "concept":"payment2","from": "a", "to": ["a", "b"], "amount": 10 },
			{ "concept":"payment3","from": "c", "to": ["me", "a", "b", "c"], "amount": 20 },
			{ "concept":"payment4","from": "c", "to": ["me", "a", "b"], "amount": 10 },
		]
	};
	var anEvent2 = {
		"name": "event2",	
		"contacts": ["me", "a", "b", "c"],
		"payments": [	
			{ "concept":"payment","from": "me", "to": ["a", "b"], "amount": 10 },
			{ "concept":"payment2","from": "a", "to": ["a", "b"], "amount": 10 },
			{ "concept":"payment3","from": "c", "to": ["me", "a", "b", "c"], "amount": 20 },
			{ "concept":"paymen4","from": "c", "to": ["me", "a", "b"], "amount": 10 },
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
		//init();
		console.log('loadEvents method');
		if(!!localStorage.getItem('events')) {
			var events = JSON.parse(localStorage.getItem('events'));
			console.log("event"  + localStorage.getItem('events'));
			var ids = events['ids'];

			for(var i = 0; i < ids.length;i++){
				li = document.createElement('li');
				console.log("Ids en el bucle" + ids[i]);
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

				ul = document.getElementById('events');
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
		           			document.location.href = '/summary.html';
		        		}
		      		}
		    	});
			}
		} else {

			ul = document.getElementById('events');
			li = document.createElement('li');
			spanText =document.createElement('span');
			spanText.appendChild(document.createTextNode('Start creating your events'));
			li.appendChild(spanText);
			ul.appendChild(li);
		}
	},

	createEvent = function(){
		console.log('Fired createEvent method');
		var new_event,event_contacts=[],id=setId(),name,events_ids;
		name = document.getElementById("eventname").value;
		event_contacts = contacts; //global array with the contacts object comming from the "pick"
		/*event_contacts = [
			{"name":"Javi","email":"javier.herraiz@buongiorno.com"},
			{"name":"Jorge","email":"jorge.alvaro@buongiorno.com"}
		];*/
		new_event = {
			"name": name,
			"contacts" : event_contacts,
			"payments" : []
		};

		localStorage.setItem(id,JSON.stringify(new_event));
		console.log("new event created:" + localStorage.getItem(id) + "with id :" + id);
		setCurrentEventCollection(id);

		if(localStorage.getItem('events')){
			console.log("Habia eventos");
			events_ids = JSON.parse(localStorage.getItem('events'))['ids'];
		} else {

			localStorage.setItem('events',JSON.stringify({'ids':[]}));
			events_ids = [];
			console.log("No habia eventos");
		}
		events_ids.push(id);
		var events = {'ids':events_ids};
		console.log("The activated events are:" + JSON.stringify(events));
		localStorage.setItem('events',JSON.stringify(events));

	},

	getEventPayments = function(currentEventId){

		var currentEvent = JSON.parse(localStorage.getIem(currentEventId));
		return currentEvent['payments'];
	},

	setEventPayments = function(currentEventId,payment){

		var value= document.getElementById('amount').value;
		name = document.getElementById("paymentname").value;

		var select = document.getElementById("from");
		var from = select.options[select.selectedIndex].value;

		var radios = document.getElementsByName('to');
		var rad = [];
		for (var i = 0, length = radios.length; i < length; i++) {
    		if (radios[i].checked) {
    			rad.push(radios[i].value);
        		console(radios[i].value);
    		}
		}
		var new_payment = {
			"concept": name,
			"amount" : amount,
			"from" : from,
			"to": rad
		}

		var currentEvent = JSON.parse(localStorage.getItem(currentEventId));
		currentEvent['payments'].push(new_payment);
		localStorage.setItem(currentEventId,JSON.stringify(currentEvent));


	},

	getEventContacts = function(currentEventId){
		
		var currentEvent = JSON.parse(localStorage.getIem(currentEventId));
		return currentEvent['contacts'];
	},

	setEventContacts = function(currentEventId){
		
		var currentEvent = JSON.parse(localStorage.getItem(currentEventId));
		currentEvent['contacts'].push(contacts[contacts.length-1]);
		localStorage.setItem(currentEventId,JSON.stringify(currentEvent));

		
	},

	setCurrentEventCollection = function(currentEventId){
		var currentEvent = {
			"id": currentEventId
		};
		return localStorage.setItem("currentEvent",JSON.stringify(currentEvent));
	};

	return {
		loadEvents       : loadEvents,
		createEvent      : createEvent,
		getEventContacts : getEventContacts,
		getEventPayments : getEventPayments,
		setEventContacts : setEventContacts,
		setEventPayments : setEventPayments
	}				
})();

