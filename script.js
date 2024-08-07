document.addEventListener("DOMContentLoaded", function() {
	fetch('data.json')
		.then(response => response.json())
		.then(data => {
			const calendarDiv = document.getElementById('calendar');
			let table = '<table><tr><th>Date</th><th>Event</th><th>Description</th></tr>';
			
			data.forEach(event => {
				table += '<tr><td>${event.date}</td><td>${event.title}</td><td>${event.description}</td></tr>';
			});
			
			table += '</table>';
			calendarDiv.innerHTML = table;
		})
		.catch(error => console.error('Error loading data:', error));
});