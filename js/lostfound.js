// lostfound.js - Lost and Found functionality

document.addEventListener('DOMContentLoaded', function() {
    loadItems();

    // Event listeners
    document.getElementById('addItemBtn').addEventListener('click', showAddForm);
    document.getElementById('cancelItemBtn').addEventListener('click', hideForm);
    document.getElementById('itemEntryForm').addEventListener('submit', handleItemSubmit);
    document.getElementById('filterType').addEventListener('change', filterItems);
    document.getElementById('searchInput').addEventListener('input', filterItems);
});

async function loadItems() {
    try {
        showLoading('itemsDisplay', 'Loading items...');

        const data = await apiCall('lostfound.php');

        if (data.length === 0) {
            document.getElementById('itemsDisplay').innerHTML = '<p>No items posted yet.</p>';
            return;
        }

        displayItems(data);
    } catch (error) {
        document.getElementById('itemsDisplay').innerHTML = '<p>Error loading items.</p>';
        console.error('Error loading items:', error);
    }
}

function displayItems(items) {
    let html = '';
    items.forEach(item => {
        html += `
            <div class="item-card ${item.type}" data-type="${item.type}" data-name="${item.item_name.toLowerCase()}">
                <h4>${item.item_name}</h4>
                <span class="item-type ${item.type}">${item.type}</span>
                <p>${item.description}</p>
                <p><strong>Contact:</strong> ${item.contact_details}</p>
                <p><small>Posted by: ${item.posted_by || 'Anonymous'} on ${formatDate(item.created_at)}</small></p>
                ${item.posted_by ? `<div class="item-actions">
                    <button onclick="deleteItem(${item.id})" class="btn-secondary">Delete</button>
                </div>` : ''}
            </div>
        `;
    });

    document.getElementById('itemsDisplay').innerHTML = html;
}

function showAddForm() {
    document.getElementById('formTitle').textContent = 'Post Lost/Found Item';
    document.getElementById('itemEntryForm').reset();
    document.getElementById('itemForm').style.display = 'block';
    document.getElementById('addItemBtn').style.display = 'none';
}

function hideForm() {
    document.getElementById('itemForm').style.display = 'none';
    document.getElementById('addItemBtn').style.display = 'inline-block';
}

async function handleItemSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await apiCall('lostfound.php', {
            method: 'POST',
            body: data
        });

        showMessage('message', response.success || response.message, 'success');
        hideForm();
        loadItems();
    } catch (error) {
        showMessage('message', error.message, 'error');
    }
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await apiCall('lostfound.php', {
                method: 'DELETE',
                body: { id: id }
            });

            showMessage('message', 'Item deleted successfully', 'success');
            loadItems();
        } catch (error) {
            showMessage('message', error.message, 'error');
        }
    }
}

function filterItems() {
    const filterType = document.getElementById('filterType').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const items = document.querySelectorAll('.item-card');

    items.forEach(item => {
        const type = item.dataset.type;
        const name = item.dataset.name;

        const typeMatch = filterType === 'all' || type === filterType;
        const searchMatch = name.includes(searchTerm);

        if (typeMatch && searchMatch) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
