// announcements.js - Announcements display functionality

document.addEventListener('DOMContentLoaded', function() {
    loadAnnouncements();
});

async function loadAnnouncements() {
    try {
        showLoading('announcementsDisplay', 'Loading announcements...');

        const data = await apiCall('announcements.php');

        if (data.length === 0) {
            document.getElementById('announcementsDisplay').innerHTML = '<p>No announcements available.</p>';
            return;
        }

        let html = '';
        data.forEach(announcement => {
            html += `
                <div class="announcement-card">
                    <h4>${announcement.title}</h4>
                    <p>${announcement.message}</p>
                    <p class="announcement-date">Posted on: ${formatDate(announcement.created_at)}</p>
                </div>
            `;
        });

        document.getElementById('announcementsDisplay').innerHTML = html;
    } catch (error) {
        document.getElementById('announcementsDisplay').innerHTML = '<p>Error loading announcements.</p>';
        console.error('Error loading announcements:', error);
    }
}
