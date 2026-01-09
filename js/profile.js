// profile.js - Profile management functionality

document.addEventListener('DOMContentLoaded', function() {
    loadProfile();

    // Event listeners
    document.getElementById('editProfileBtn').addEventListener('click', showEditForm);
    document.getElementById('cancelEditBtn').addEventListener('click', hideEditForm);
    document.getElementById('profileUpdateForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('changePasswordForm').addEventListener('submit', handlePasswordChange);
});

async function loadProfile() {
    try {
        showLoading('profileInfo', 'Loading profile information...');

        const data = await apiCall('profile.php');

        let html = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>USN:</strong> ${data.usn}</p>
            <p><strong>Email:</strong> ${data.email}</p>
        `;

        document.getElementById('profileInfo').innerHTML = html;
    } catch (error) {
        document.getElementById('profileInfo').innerHTML = '<p>Error loading profile information.</p>';
        console.error('Error loading profile:', error);
    }
}

function showEditForm() {
    // Populate form with current data
    const name = document.querySelector('#profileInfo p:nth-child(1)').textContent.replace('Name: ', '');
    const usn = document.querySelector('#profileInfo p:nth-child(2)').textContent.replace('USN: ', '');
    const email = document.querySelector('#profileInfo p:nth-child(3)').textContent.replace('Email: ', '');

    document.getElementById('editName').value = name;
    document.getElementById('editUsn').value = usn;
    document.getElementById('editEmail').value = email;

    document.getElementById('editProfileForm').style.display = 'block';
    document.getElementById('editProfileBtn').style.display = 'none';
}

function hideEditForm() {
    document.getElementById('editProfileForm').style.display = 'none';
    document.getElementById('editProfileBtn').style.display = 'inline-block';
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await apiCall('profile.php', {
            method: 'PUT',
            body: data
        });

        showMessage('message', response.success || response.message, 'success');
        hideEditForm();
        loadProfile();
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Client-side validation
    if (data.new_password !== data.confirm_password) {
        showMessage('message', 'New passwords do not match', 'error');
        return;
    }

    try {
        const response = await apiCall('profile.php', {
            method: 'PATCH',
            body: data
        });

        showMessage('message', response.success || response.message, 'success');
        e.target.reset();
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}
