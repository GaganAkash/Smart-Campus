// assignments.js - Assignment management functionality

document.addEventListener('DOMContentLoaded', function() {
    loadAssignments();

    // Event listeners
    document.getElementById('addAssignmentBtn').addEventListener('click', showAddForm);
    document.getElementById('cancelAssignmentBtn').addEventListener('click', hideForm);
    document.getElementById('assignmentEntryForm').addEventListener('submit', handleAssignmentSubmit);
});

async function loadAssignments() {
    try {
        showLoading('assignmentsDisplay', 'Loading assignments...');

        const data = await apiCall('assignments.php');

        if (data.length === 0) {
            document.getElementById('assignmentsDisplay').innerHTML = '<p>No assignments found. Add your first assignment!</p>';
            return;
        }

        // Sort by due date
        data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

        let html = '';
        data.forEach(assignment => {
            const dueDate = new Date(assignment.due_date);
            const today = new Date();
            const isOverdue = dueDate < today && !assignment.completed;
            const isCompleted = assignment.completed;

            let cardClass = 'assignment-card';
            if (isOverdue) cardClass += ' overdue';
            if (isCompleted) cardClass += ' completed';

            html += `
                <div class="${cardClass}">
                    <h4>${assignment.subject}</h4>
                    <p>${assignment.description}</p>
                    <p class="assignment-due">Due: ${formatDate(assignment.due_date)}</p>
                    ${isCompleted ? '<p class="assignment-completed">✓ Completed</p>' : ''}
                    <div class="assignment-actions">
                        ${!isCompleted ? `<button onclick="toggleAssignment(${assignment.id})" class="btn-secondary">Mark Complete</button>` : `<button onclick="toggleAssignment(${assignment.id})" class="btn-secondary">Mark Incomplete</button>`}
                        <button onclick="editAssignment(${assignment.id})" class="btn-secondary">Edit</button>
                        <button onclick="deleteAssignment(${assignment.id})" class="btn-secondary">Delete</button>
                    </div>
                </div>
            `;
        });

        document.getElementById('assignmentsDisplay').innerHTML = html;
    } catch (error) {
        document.getElementById('assignmentsDisplay').innerHTML = '<p>Error loading assignments.</p>';
        console.error('Error loading assignments:', error);
    }
}

function showAddForm() {
    document.getElementById('formTitle').textContent = 'Add Assignment';
    document.getElementById('assignmentEntryForm').reset();
    document.getElementById('assignmentId').value = '';
    document.getElementById('assignmentForm').style.display = 'block';
    document.getElementById('addAssignmentBtn').style.display = 'none';
}

function hideForm() {
    document.getElementById('assignmentForm').style.display = 'none';
    document.getElementById('addAssignmentBtn').style.display = 'inline-block';
}

async function handleAssignmentSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        let response;
        if (data.id) {
            // Update
            response = await apiCall('assignments.php', {
                method: 'PUT',
                body: data
            });
        } else {
            // Create
            response = await apiCall('assignments.php', {
                method: 'POST',
                body: data
            });
        }

        showMessage('message', response.success || response.message, 'success');
        hideForm();
        loadAssignments();
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}

async function toggleAssignment(id) {
    try {
        // First get current status
        const assignments = await apiCall('assignments.php');
        const assignment = assignments.find(a => a.id == id);

        if (assignment) {
            await apiCall('assignments.php', {
                method: 'PUT',
                body: { id: id, completed: assignment.completed ? 0 : 1 }
            });

            showMessage('message', 'Assignment status updated successfully', 'success');
            loadAssignments();
        }
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}

function editAssignment(id) {
    // Find assignment and populate form
    apiCall('assignments.php').then(data => {
        const assignment = data.find(item => item.id == id);
        if (assignment) {
            document.getElementById('assignmentId').value = assignment.id;
            document.getElementById('assignmentSubject').value = assignment.subject;
            document.getElementById('assignmentDescription').value = assignment.description;
            document.getElementById('dueDate').value = assignment.due_date;

            document.getElementById('formTitle').textContent = 'Edit Assignment';
            document.getElementById('assignmentForm').style.display = 'block';
            document.getElementById('addAssignmentBtn').style.display = 'none';
        }
    });
}

async function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        try {
            await apiCall('assignments.php', {
                method: 'DELETE',
                body: { id: id }
            });

            showMessage('message', 'Assignment deleted successfully', 'success');
            loadAssignments();
        } catch (error) {
            showMessage('message', error.message, 'error');
        }
    }
}
