document.addEventListener("DOMContentLoaded", function() {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');
    const eventModal = document.getElementById('eventModal');
    const editModal = document.getElementById('editModal');
    const addModal = document.getElementById('addModal');
    const closeModal = document.querySelectorAll('.modal .close');
    const eventDetails = document.getElementById('eventDetails');
    const editForm = document.getElementById('editForm');
    const addForm = document.getElementById('addForm');
    const editBaleNumber = document.getElementById('editBaleNumber');
    const editLocation = document.getElementById('editLocation');
    const editFinalLocation = document.getElementById('editFinalLocation');
    const editDateReceived = document.getElementById('editDateReceived');
    const editCoolOffDate = document.getElementById('editCoolOffDate');
    const addBaleNumber = document.getElementById('addBaleNumber');
    const addLocation = document.getElementById('addLocation');
    const addFinalLocation = document.getElementById('addFinalLocation');
    const addDateReceived = document.getElementById('addDateReceived');
    const addCoolOffDate = document.getElementById('addCoolOffDate');
    const addEventButton = document.getElementById('addEventButton');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let eventsData = [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function updateCalendar() {
        calendar.innerHTML = '';
        monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekDays.forEach(day => {
            const headerElement = document.createElement('div');
            headerElement.className = 'header';
            headerElement.innerText = day;
            calendar.appendChild(headerElement);
        });

        const monthDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= monthDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            
            const dayContent = document.createElement('div');
            dayContent.className = 'day-content';
            dayContent.innerHTML = `<strong>${day}</strong>`;
            
            eventsData.forEach(event => {
                const eventDate = new Date(event["Date Received"]);
                if (eventDate.getDate() === day && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
                    const baleNumber = document.createElement('div');
                    baleNumber.className = 'bale-number';
                    baleNumber.innerText = event["Bale Number"];
                    baleNumber.onclick = () => {
                        eventDetails.innerHTML = `
                            <p><strong>Bale Number:</strong> ${event["Bale Number"]}</p>
                            <p><strong>Location:</strong> ${event["Location"]}</p>
                            <p><strong>Final Location:</strong> ${event["Final Location"]}</p>
                            <p><strong>Date Received:</strong> ${event["Date Received"]}</p>
                            <p><strong>Cool Off Date:</strong> ${event["Cool Off Date"]}</p>
                        `;
                        eventModal.style.display = 'flex';
                    };

                    const today = new Date();
                    const coolOffDate = new Date(event["Cool Off Date"]);
                    if (coolOffDate < today) {
                        baleNumber.classList.add('green');
                        baleNumber.innerHTML += `<br>${event["Final Location"]}`;
                    } else {
                        baleNumber.classList.add('red');
                        baleNumber.innerHTML += `<br>${event["Location"]}`;
                    }
                    dayContent.appendChild(baleNumber);
                }
            });

            dayElement.appendChild(dayContent);
            calendar.appendChild(dayElement);
        }

        // Display total number of Fire Bales
        const totals = document.querySelector('.totals');
        const totalBales = eventsData.length;
        const balesToCoolOff = eventsData.filter(event => new Date(event["Cool Off Date"]) >= new Date()).length;
        totals.innerHTML = `<p>Total Number of Fire Bales: ${totalBales}</p>
                            <p>Number Still to Cool Off: ${balesToCoolOff}</p>`;
    }

    // Handle form submission for editing events
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const baleNumber = parseInt(editBaleNumber.value);
        const updatedData = {
            "Bale Number": baleNumber,
            "Location": editLocation.value,
            "Final Location": editFinalLocation.value,
            "Date Received": editDateReceived.value,
            "Cool Off Date": editCoolOffDate.value
        };

        eventsData = eventsData.map(event =>
            event["Bale Number"] === baleNumber ? updatedData : event
        );

        fetch('update_data.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', data: updatedData })
        })
        .then(response => response.json())
        .then(() => {
            editModal.style.display = 'none';
            updateCalendar();
        })
        .catch(error => console.error('Error updating data:', error));
    });

    // Handle form submission for adding new events
    addForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newEvent = {
            "Bale Number": parseInt(addBaleNumber.value),
            "Location": addLocation.value,
            "Final Location": addFinalLocation.value,
            "Date Received": addDateReceived.value,
            "Cool Off Date": addCoolOffDate.value
        };

        eventsData.push(newEvent);

        fetch('update_data.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', data: newEvent })
        })
        .then(response => response.json())
        .then(() => {
            addModal.style.display = 'none';
            updateCalendar();
        })
        .catch(error => console.error('Error adding data:', error));
    });

    function loadEvents() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                eventsData = data;
                updateCalendar();
            })
            .catch(error => console.error('Error loading data:', error));
    }

    loadEvents();

    prevMonthButton.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    addEventButton.addEventListener('click', function() {
        addModal.style.display = 'flex';
    });

    closeModal.forEach(button => {
        button.addEventListener('click', function() {
            eventModal.style.display = 'none';
            editModal.style.display = 'none';
            addModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === eventModal || event.target === editModal || event.target === addModal) {
            eventModal.style.display = 'none';
            editModal.style.display = 'none';
            addModal.style.display = 'none';
        }
    });
});
