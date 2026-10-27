document.addEventListener('DOMContentLoaded', function () {

    // 1. GENERATE / START ATTENDANCE SESSION
   
    const createSessionForm = document.getElementById('createSessionForm');
    
    if (createSessionForm) {
        createSessionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect input values from lecturer form
            const sessionData = {
                course_code: document.getElementById('sessionCourseSelect').value,
                duration_minutes: document.getElementById('sessionDuration').value,
                verification_type: document.getElementById('verificationType').value // OTP or Bluetooth
            };

            // Basic validation
            if (!sessionData.course_code) {
                alert('Please select a course.');
                return;
            }

            // UI Feedback: Show loading state
            const submitBtn = createSessionForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Starting Session...';

            // Send session request to backend
            fetch('../../backend/api/lecturer/create_session.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Attendance session successfully created!');
                    
                    // Display generated OTP if server returned one
                    const otpDisplay = document.getElementById('generatedOtpDisplay');
                    if (otpDisplay && data.otp_code) {
                        otpDisplay.textContent = data.otp_code;
                    }
                } else {
                    alert('Failed to start session: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error starting session:', error);
                alert('Server error. Please check backend connection.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }


    // 2. FETCH & DISPLAY LIVE ATTENDANCE LOGS
   
    const courseFilterSelect = document.getElementById('courseFilterSelect');

    if (courseFilterSelect) {
        courseFilterSelect.addEventListener('change', function () {
            const selectedCourse = this.value;
            if (!selectedCourse) return;

            fetch(`../../backend/api/lecturer/get_attendance_list.php?course=${selectedCourse}`)
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('attendanceTableBody');
                    if (!tableBody) return;

                    tableBody.innerHTML = ''; // Clear previous rows

                    if (data.records && data.records.length > 0) {
                        data.records.forEach(student => {
                            const row = `
                                <tr>
                                    <td><strong>${student.full_name}</strong></td>
                                    <td><code>${student.matric_no}</code></td>
                                    <td>${student.time_marked}</td>
                                    <td><span class="badge bg-success">Present</span></td>
                                </tr>
                            `;
                            tableBody.innerHTML += row;
                        });
                    } else {
                        tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No attendance marked yet.</td></tr>';
                    }
                })
                .catch(err => console.error('Error fetching attendance list:', err));
        });
    }


    
    // 3. APPROVE OR REJECT STUDENT CORRECTIONS

    const correctionsContainer = document.getElementById('correctionsContainer');

    if (correctionsContainer) {
        correctionsContainer.addEventListener('click', function (e) {
            // Check if an approve or reject button was clicked
            if (e.target.classList.contains('btn-approve-appeal') || e.target.classList.contains('btn-reject-appeal')) {
                const appealId = e.target.getAttribute('data-appeal-id');
                const actionStatus = e.target.classList.contains('btn-approve-appeal') ? 'APPROVED' : 'REJECTED';

                fetch('../../backend/api/lecturer/review_appeal.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        appeal_id: appealId,
                        status: actionStatus
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert(`Appeal ${actionStatus.toLowerCase()} successfully.`);
                        location.reload(); // Refresh list
                    } else {
                        alert('Error updating appeal: ' + data.message);
                    }
                })
                .catch(err => console.error('Error reviewing appeal:', err));
            }
        });
    }

});