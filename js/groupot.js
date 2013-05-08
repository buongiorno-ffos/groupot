var contacts = [];

function loadContacts() {
	var activity = new MozActivity({
		// Ask for the "pick" activity
		name: "pick",
 
		// Provide de data required by the filters of the activity
		data: {
			type: "webcontacts/email"
		}
	});
 
	activity.onsuccess = function() {
		var contact = this.result;
		console.log("A contact has been retrieved");
		console.log(JSON.stringify(contact));
		for(i in contact) {
			console.log(i);
			console.log(contact[i]);
		}
		li = document.createElement('li');
		
		spanText = document.createElement('span');
		spanText.appendChild (document.createTextNode(contact["name"]));
		spanText.className = "left";
		
		li.appendChild(spanText);

		ul = document.getElementById('contacts');
		ul.appendChild(li);

		contacts.push(contact);
	};
 
	activity.onerror = function() {
		console.log(JSON.stringify(this));
	};
}

function getSettlement(currentEvent) {
	console.log(JSON.stringify(currentEvent));
	var userBalance = {};
	for(userId in currentEvent.users) {
		var user = currentEvent.users[userId];
		userBalance[user] = 0;
	}
	var payments = currentEvent.payments;
	for(paymentId in payments) {
		var payment = payments[paymentId];
		userBalance[payment.from] += payment.amount;
		for(userToId in payment.to) {
			var userTo = payment.to[userToId];
			userBalance[userTo] -= payment.amount / payment.to.length;
		}
	}

	// Round to cents
	for(i in userBalance) {
		userBalance[i] = roundCents(userBalance[i]);
	}

	console.log(JSON.stringify(userBalance));

	var settlement = [];
	if(!isSettled(userBalance)) {
		for(i in userBalance) {
			for(j in userBalance) {
				if(userBalance[i]>0 && userBalance[i] == -userBalance[j]) {
					settlement.push({ "from": j, "to": i, "amount": userBalance[i]});
					userBalance[j] += userBalance[i];
					userBalance[i] -= userBalance[i]; // =0;
				}
			}
		}
	}
	while(!isSettled(userBalance)) {
		var min = null;
		var max = null;
		for(i in userBalance) {
			if(min==null || userBalance[min]>userBalance[i]) {
				min = i;
			}
			if(max==null || userBalance[max]<userBalance[i]) {
				max = i;
			}
		}
		var amount = Math.min(Math.abs(userBalance[min]), Math.abs(userBalance[max]));
		settlement.push({ "from": min, "to": max, "amount": amount});
		userBalance[min] = roundCents(userBalance[min]+amount);
		userBalance[max] = roundCents(userBalance[max]-amount);
	}
	console.log(JSON.stringify(settlement));
}

function isSettled(userBalance) {
	var allPositive = true;
	var allNegative = true;
	for(i in userBalance) {
		if(roundCents(userBalance[i])>0) {
			allNegative = false;
		} else if(roundCents(userBalance[i])<0) {
			allPositive = false;
		}
	}
	return allNegative || allPositive;
}

function roundCents(amount) {
	return Math.round(amount*100)/100;
}

var anEvent = {
	"users": ["me", "a", "b", "c"],
	"payments": [
		{ "from": "me", "to": ["a", "b"], "amount": 10 },
		{ "from": "a", "to": ["a", "b"], "amount": 10 },
		{ "from": "c", "to": ["me", "a", "b", "c"], "amount": 20 },
		{ "from": "c", "to": ["me", "a", "b"], "amount": 10 },
	]
};
getSettlement(anEvent);

function createEvent() {
	var name = document.getElementById("eventname").value;
	console.log(name);
	console.log(JSON.stringify(contacts));
}

function addEventListeners() {
	var focused = document.getElementsByClassName("focused");
	if(focused && focused.length>0) {
		focused[0].focus();
	}
	var addPeople = document.getElementById("add-people");
	if(addPeople) {
		addPeople.addEventListener("click", function() {
			loadContacts();
		});
	}
	var createEventElement = document.getElementById("create-event");
	if(createEventElement) {
		createEventElement.addEventListener("click", function() {
			createEvent();
		});
	}
}

document.addEventListener("DOMContentLoaded", addEventListeners);
