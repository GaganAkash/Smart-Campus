// forum.js - Doubt Forum functionality

document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();

    // Event listeners
    document.getElementById('askQuestionBtn').addEventListener('click', showAddForm);
    document.getElementById('cancelQuestionBtn').addEventListener('click', hideForm);
    document.getElementById('questionEntryForm').addEventListener('submit', handleQuestionSubmit);
});

async function loadQuestions() {
    try {
        showLoading('questionsDisplay', 'Loading questions...');

        const data = await apiCall('forum.php');

        if (data.length === 0) {
            document.getElementById('questionsDisplay').innerHTML = '<p>No questions posted yet. Be the first to ask!</p>';
            return;
        }

        let html = '';
        data.forEach(question => {
            html += `
                <div class="question-card">
                    <p>${question.question}</p>
                    <p class="question-date">Posted on: ${formatDate(question.created_at)}</p>
                    <div class="item-actions">
                        <button onclick="deleteQuestion(${question.id})" class="btn-secondary">Delete</button>
                    </div>
                </div>
            `;
        });

        document.getElementById('questionsDisplay').innerHTML = html;
    } catch (error) {
        document.getElementById('questionsDisplay').innerHTML = '<p>Error loading questions.</p>';
        console.error('Error loading questions:', error);
    }
}

function showAddForm() {
    document.getElementById('questionForm').style.display = 'block';
    document.getElementById('askQuestionBtn').style.display = 'none';
}

function hideForm() {
    document.getElementById('questionForm').style.display = 'none';
    document.getElementById('askQuestionBtn').style.display = 'inline-block';
}

async function handleQuestionSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await apiCall('forum.php', {
            method: 'POST',
            body: data
        });

        showMessage('message', response.success || response.message, 'success');
        hideForm();
        loadQuestions();
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}

async function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        try {
            await apiCall('forum.php', {
                method: 'DELETE',
                body: { id: id }
            });

            showMessage('message', 'Question deleted successfully', 'success');
            loadQuestions();
        } catch (error) {
            showMessage('message', error.message, 'error');
        }
    }
}
