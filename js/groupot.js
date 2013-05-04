function loadContacts() {
	var activity = new MozActivity({
		// Ask for the "pick" activity
		name: "pick",
 
		// Provide de data required by the filters of the activity
		data: {
			type: ["webcontacts/contact", "webcontacts/email"]
			//type: "image/jpeg"
		}
	});
 
	activity.onsuccess = function() {
		var contact = this.result;
		console.log("A contact has been retrieved");
		console.error(contact);
		for(i in contact) {
			console.log(i);
			console.log(contact[i]);
		}
	};
 
	activity.onerror = function() {
		console.log(this.error);
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
	console.log(JSON.stringify(settlement));
	while(!isSettled(userBalance)) {
		//settlement.push(
/**/return;
	}
}
function isSettled(userBalance) {
	for(i in userBalance) {
		if(userBalance[i]!=0) {
			return false;
		}
	}
	return true;
}

var anEvent = {
	"users": ["me", "a", "b", "c"],
	"payments": [
		{ "from": "me", "to": ["a", "b"], "amount": 10 },
		{ "from": "a", "to": ["a", "b"], "amount": 10 },
		{ "from": "c", "to": ["me", "a", "b", "c"], "amount": 20 },
	]
};
getSettlement(anEvent);

//document.addEventListener("DOMContentLoaded", loadContacts);
