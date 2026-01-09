// dashboard.js - Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Load welcome message
        const userName = 'Student'; // In real app, get from session
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${userName}!`;

        // Load today's timetable
        await loadTodayTimetable();

        // Load upcoming assignments
        await loadUpcomingAssignments();

        // Load recent announcements
        await loadRecentAnnouncements();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadTodayTimetable() {
    try {
        const timetableData = await apiCall('timetable.php');

        const today = new Date().toLocaleLowerCase().split(',')[0]; // Get day name
        const todayEntries = timetableData.filter(entry =>
            entry.day.toLowerCase() === today
        );

        const container = document.getElementById('todayTimetable');

        if (todayEntries.length === 0) {
            container.innerHTML = '<p>No classes scheduled for today.</p>';
            return;
        }

        let html = '<ul>';
        todayEntries.forEach(entry => {
            html += `
                <li>
                    <strong>${entry.subject}</strong> - ${entry.faculty}<br>
                    ${entry.start_time} - ${entry.end_time} | Room: ${entry.room}
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;
    } catch (error) {
        document.getElementById('todayTimetable').innerHTML = '<p>Error loading timetable.</p>';
        console.error('Error loading today\'s timetable:', error);
    }
}

async function loadUpcomingAssignments() {
    try {
        const assignmentsData = await apiCall('assignments.php');

        const upcoming = assignmentsData
            .filter(assignment => !assignment.completed)
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
            .slice(0, 5); // Show next 5

        const container = document.getElementById('upcomingAssignments');

        if (upcoming.length === 0) {
            container.innerHTML = '<p>No upcoming assignments.</p>';
            return;
        }

        let html = '<ul>';
        upcoming.forEach(assignment => {
            const dueDate = new Date(assignment.due_date);
            const today = new Date();
            const isOverdue = dueDate < today;

            html += `
                <li class="${isOverdue ? 'overdue' : ''}">
                    <strong>${assignment.subject}</strong><br>
                    ${assignment.description}<br>
                    Due: ${formatDate(assignment.due_date)}
                    ${isOverdue ? ' <span style="color: red;">(Overdue)</span>' : ''}
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;
    } catch (error) {
        document.getElementById('upcomingAssignments').innerHTML = '<p>Error loading assignments.</p>';
        console.error('Error loading upcoming assignments:', error);
    }
}

async function loadRecentAnnouncements() {
    try {
        const announcementsData = await apiCall('announcements.php');

        const recent = announcementsData.slice(0, 3); // Show latest 3

        const container = document.getElementById('recentAnnouncements');

        if (recent.length === 0) {
            container.innerHTML = '<p>No announcements available.</p>';
            return;
        }

        let html = '<ul>';
        recent.forEach(announcement => {
            html += `
                <li>
                    <strong>${announcement.title}</strong><br>
                    ${announcement.message.substring(0, 100)}${announcement.message.length > 100 ? '...' : ''}<br>
                    <small>${formatDate(announcement.created_at)}</small>
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;
    } catch (error) {
        document.getElementById('recentAnnouncements').innerHTML = '<p>Error loading announcements.</p>';
        console.error('Error loading recent announcements:', error);
    }
}
