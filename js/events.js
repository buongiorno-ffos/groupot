

var Events = (function(){

	var init = function(){
		localStorage.clear();
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

	loadPayments = function(){

		var currentEvent = getCurrentEvent(),
			li,ul,spanConcept,spanAmount,spanFrom,spanTo,
		    payments = currentEvent['payments'];
		/*<li>	<span class="left concept">Car rental</span>
              <span class="right amount"> 200&euro;</span>
              <span class="fromto line clear">From: Me</span>
              <span class="fromto line">To: Javi,Jorge</span>

         </li>

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
		*/
		ul = document.getElementById('payments');

		for (var i =0; i < payments.length -1 ; i++){

			li = document.createElement('li');
			spanConcept = document.createElement('span');
			spanConcept.appendChild(document.createTextNode(payments[i]['concept']));
			spanConcept.className ="left concept";

			spanAmount = document.createElement('span');
			spanAmount.appendChild(document.createTextNode(payments[i]['amount']));
			spanAmount.className ="right amount";


			spanFrom = document.createElement('span');
			spanFrom.appendChild(document.createTextNode("From: " +  payments[i]['from']));
			spanFrom.className ="fromto line clear";

			var to = payments[i]['to'],toStr="";

			toStr = to.join(', ');

			spanTo = document.createElement('span');
			spanTo.appendChild(document.createTextNode("To: " + toStr));
			spanTo.className ="fromto line";

			li.appendChild(spanConcept);
			li.appendChild(spanAmount);
			li.appendChild(spanFrom);
			li.appendChild(spanTo);

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

	setEventPayments = function(){

		var currentEvent = getCurrentEvent();

		var value = document.getElementById('amount').value;
		var name = document.getElementById("paymentname").value;

		var select = document.getElementById("from");
		var from = select.options[select.selectedIndex].value;

		var to = [];
		for(contactId in currentEvent.contacts) {
			var contact = currentEvent.contacts[contactId];
			if(document.getElementById(contact.name).checked) {
				console.log("pushing "+contact.name);
				to.push(contact.name[0]);
			}
			console.log(JSON.stringify(to));
		}

		if(value == "") {
			alert("What was the amount?");
			return;
		}
		if(from == "") {
			alert("Who paid?");
			return;
		}
		if(to.length == 0) {
			alert("Who was the payment for?");
			return;
		}

		var new_payment = {
			"concept": name,
			"amount" : value,
			"from" : from,
			"to": to
		}

		currentEvent['payments'].push(new_payment);
		localStorage.setItem(JSON.parse(localStorage.getItem("currentEvent"))['id'],JSON.stringify(currentEvent));

		console.log("Payment added: " + JSON.stringify(getCurrentEvent()));

		document.location.href = "/summary.html";
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

	getCurrentEvent = function(){
		var id= JSON.parse(localStorage.getItem("currentEvent"))['id'];
		return JSON.parse(localStorage.getItem(id));
	},

	setCurrentEventCollection = function(currentEventId){
		var currentEvent = {
			"id": currentEventId
		};
		return localStorage.setItem("currentEvent",JSON.stringify(currentEvent));
	};

	return {
		loadEvents       : loadEvents,
		loadPayments     : loadPayments,
		createEvent      : createEvent,
		getEventContacts : getEventContacts,
		getEventPayments : getEventPayments,
		setEventContacts : setEventContacts,
		setEventPayments : setEventPayments,
		getCurrentEvent  : getCurrentEvent
	}
})();

