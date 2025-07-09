// Admin dashboard specific JavaScript

// Load staff data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStaffData();
    loadStaffStatistics();
});

// Load staff data
async function loadStaffData() {
    try {
        const response = await fetch(`${API_URL}/staff`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const staff = await response.json();
            displayStaffData(staff);
        } else {
            showError('Failed to load staff data');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while loading staff data');
    }
}

// Display staff data in table
function displayStaffData(staff) {
    const tableBody = document.getElementById('staffTableBody');
    tableBody.innerHTML = '';
    
    staff.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.department}</td>
            <td>${member.role}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editStaff('${member.id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaff('${member.id}')"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load staff statistics
async function loadStaffStatistics() {
    try {
        const response = await fetch(`${API_URL}/staff/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            updateDashboardStats(stats);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('totalStaff').textContent = stats.total || 0;
    document.getElementById('staffPresent').textContent = stats.present || 0;
    document.getElementById('staffAbsent').textContent = stats.absent || 0;
}

// Submit add staff form
async function submitAddStaffForm() {
    const form = document.getElementById('addStaffForm');
    const formData = new FormData(form);
    
    const staffData = {
        id: formData.get('staffId'),
        name: formData.get('name'),
        department: formData.get('department'),
        role: formData.get('role')
    };
    
    try {
        const response = await fetch(`${API_URL}/staff`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(staffData)
        });
        
        if (response.ok) {
            // Close modal and reload data
            const modal = bootstrap.Modal.getInstance(document.getElementById('addStaffModal'));
            modal.hide();
            form.reset();
            loadStaffData();
            loadStaffStatistics();
            showSuccess('Staff added successfully');
        } else {
            const data = await response.json();
            showError(data.message || 'Failed to add staff');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while adding staff');
    }
}

// Edit staff member
async function editStaff(staffId) {
    // Implementation for editing staff
    console.log('Edit staff:', staffId);
}

// Delete staff member
async function deleteStaff(staffId) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        try {
            const response = await fetch(`${API_URL}/staff/${staffId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                loadStaffData();
                loadStaffStatistics();
                showSuccess('Staff deleted successfully');
            } else {
                const data = await response.json();
                showError(data.message || 'Failed to delete staff');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while deleting staff');
        }
    }
}

// Show success message
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}