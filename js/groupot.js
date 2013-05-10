var contacts = [{"name":["me"]}];

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

function getUserBalance(currentEvent) {
	var userBalance = {};
	for(userId in currentEvent.contacts) {
		var user = currentEvent.contacts[userId];
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
	return userBalance;
}

function getSettlement(currentEvent) {
	var userBalance = getUserBalance(currentEvent);
	return getSettlementsFromBalance(userBalance);
}

function getSettlementsFromBalance(userBalance) {
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
	return settlement;
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

function sendEventByEmail(event) {
	var to = "";
	for(contactId in event.contacts) {
		to += event.contacts[contactId].email;
	}

	var subject = "[groupot] Summary of the event " + event.name;

	var text = "This is the summary of the event named " + event.name + "\n";

	text += "\nExpense details:\n";
	for(paymentId in event.payments) {
		text += event.payments[paymentId].name + " (" + event.payments[paymentId].amount + " from " + event.payments[paymentId].from + " to " + event.payments[paymentId].to + ")" + "\n";
	}

	text += "\nBalance by user:\n";

	var userBalance = getUserBalance(event);
	for(userBalanceId in userBalance) {
		if(userBalance[userBalanceId] > 0) {
			text += userBalanceId + " paid " + userBalance[userBalanceId] + " more than needed\n";
		} else if(userBalance[userBalanceId] < 0) {
			text += userBalanceId + " paid " + userBalance[userBalanceId] + " less than needed\n";
		} else {
			text += userBalanceId + " paid just what was needed\n";
		}
	}

	text += "\nRecommended payments to settle the event:\n";

	var settlement = getSettlementsFromBalance(userBalance);
	console.log(JSON.stringify(settlement));
	for(settlementId in settlement) {
		text += settlement[settlementId].from + " should give " + settlement[settlementId].amount + " to " + settlement[settlementId].to + "\n";
	}

	text += "\ngroupot: Accounting for groups made easy";

	var activity = new MozActivity({
		name: "new",
		data: {
			type: "mail",
			URI: "mailto:"+to+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(text)
		}
	});

	activity.onsuccess = function() {
		console.log("onsuccess");
		console.log(JSON.stringify(this));
	}

	activity.onerror = function() {
		console.log("onerror");
		console.log(JSON.stringify(this));
	}
}

function addPayment() {
	var name = document.getElementById("eventname").value;
}

function initForms() {
	var event = Events.getCurrentEvent();

	var paymentFrom = document.getElementById("from");
	var contactsForEvent = document.getElementById("contacts-for-payment");

	for(contactId in event.contacts) {
		var contact = event.contacts[contactId];
		console.log(JSON.stringify(contact));

		// To
		var li = document.createElement('li');
		var spanText = document.createElement('span');
		spanText.appendChild (document.createTextNode(contact["name"]));
		spanText.className = "left";
		contactsForEvent.appendChild(li);
		var checkbox = document.createElement('input');
		checkbox.id = contact["name"];
		checkbox.type = "checkbox";
		checkbox.name = contact["name"];
		checkbox.checked = true;
		checkbox.className = "right";
		li.appendChild(spanText);
		spanText.appendChild(checkbox);

		// From
		paymentFrom.options[paymentFrom.options.length] = new Option(contact["name"], contact["name"]);
	}
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
			Events.createEvent();
		});
	}
	var addPaymentElement = document.getElementById("save-payment");
	if(addPaymentElement) {
		addPaymentElement.addEventListener("click", function() {
			Events.setEventPayments();
		});
	}
	initForms();
}

document.addEventListener("DOMContentLoaded", addEventListeners);
