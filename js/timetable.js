// timetable.js - Timetable management functionality

document.addEventListener('DOMContentLoaded', function() {
    loadTimetable();

    // Event listeners
    document.getElementById('addTimetableBtn').addEventListener('click', showAddForm);
    document.getElementById('cancelBtn').addEventListener('click', hideForm);
    document.getElementById('timetableEntryForm').addEventListener('submit', handleTimetableSubmit);
});

async function loadTimetable() {
    try {
        showLoading('timetableDisplay', 'Loading timetable...');

        const data = await apiCall('timetable.php');

        if (data.length === 0) {
            document.getElementById('timetableDisplay').innerHTML = '<p>No timetable entries found. Add your first entry!</p>';
            return;
        }

        // Group by day
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const timetableByDay = {};

        days.forEach(day => {
            timetableByDay[day] = data.filter(entry => entry.day === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
        });

        let html = '<div class="timetable-table-container"><table class="timetable-table"><thead><tr>';
        html += '<th>Time</th>';

        days.forEach(day => {
            html += `<th>${day}</th>`;
        });

        html += '</tr></thead><tbody>';

        // Find all unique time slots
        const allTimes = new Set();
        data.forEach(entry => {
            allTimes.add(entry.start_time);
        });

        const sortedTimes = Array.from(allTimes).sort();

        sortedTimes.forEach(time => {
            html += `<tr><td>${time}</td>`;

            days.forEach(day => {
                const entries = timetableByDay[day].filter(entry => entry.start_time === time);

                if (entries.length > 0) {
                    const entry = entries[0];
                    html += `
                        <td>
                            <div class="timetable-entry">
                                <strong>${entry.subject}</strong><br>
                                ${entry.faculty}<br>
                                ${entry.start_time} - ${entry.end_time}<br>
                                Room: ${entry.room}
                                <div class="timetable-actions">
                                    <button onclick="editTimetableEntry(${entry.id})" class="btn-secondary">Edit</button>
                                    <button onclick="deleteTimetableEntry(${entry.id})" class="btn-secondary">Delete</button>
                                </div>
                            </div>
                        </td>
                    `;
                } else {
                    html += '<td></td>';
                }
            });

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        document.getElementById('timetableDisplay').innerHTML = html;
    } catch (error) {
        document.getElementById('timetableDisplay').innerHTML = '<p>Error loading timetable.</p>';
        console.error('Error loading timetable:', error);
    }
}

function showAddForm() {
    document.getElementById('formTitle').textContent = 'Add Timetable Entry';
    document.getElementById('timetableEntryForm').reset();
    document.getElementById('entryId').value = '';
    document.getElementById('timetableForm').style.display = 'block';
    document.getElementById('addTimetableBtn').style.display = 'none';
}

function hideForm() {
    document.getElementById('timetableForm').style.display = 'none';
    document.getElementById('addTimetableBtn').style.display = 'inline-block';
}

async function handleTimetableSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        let response;
        if (data.id) {
            // Update
            response = await apiCall('timetable.php', {
                method: 'PUT',
                body: data
            });
        } else {
            // Create
            response = await apiCall('timetable.php', {
                method: 'POST',
                body: data
            });
        }

        showMessage('message', response.success || response.message, 'success');
        hideForm();
        loadTimetable();
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}

function editTimetableEntry(id) {
    // Find entry and populate form
    apiCall('timetable.php').then(data => {
        const entry = data.find(item => item.id == id);
        if (entry) {
            document.getElementById('entryId').value = entry.id;
            document.getElementById('subject').value = entry.subject;
            document.getElementById('faculty').value = entry.faculty;
            document.getElementById('day').value = entry.day;
            document.getElementById('start_time').value = entry.start_time;
            document.getElementById('end_time').value = entry.end_time;
            document.getElementById('room').value = entry.room;

            document.getElementById('formTitle').textContent = 'Edit Timetable Entry';
            document.getElementById('timetableForm').style.display = 'block';
            document.getElementById('addTimetableBtn').style.display = 'none';
        }
    });
}

async function deleteTimetableEntry(id) {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
        try {
            await apiCall('timetable.php', {
                method: 'DELETE',
                body: { id: id }
            });

            showMessage('message', 'Timetable entry deleted successfully', 'success');
            loadTimetable();
        } catch (error) {
            showMessage('message', error.message, 'error');
        }
    }
}
