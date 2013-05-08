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
				
				li.appendChild(spanText);
				li.appendChild(spanArrow);
	
				ul= document.getElementById('events');
				ul.appendChild(li);
					
				
			}
		} else {
			return false;
		}
	};
	
	return {
		loadEvents:loadEvents	
	}				
})();

document.addEventListener("DOMContentLoaded", Events.loadEvents);