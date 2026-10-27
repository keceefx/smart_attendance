const facultiesAndDepartments = {
    "Faculty of Arts": [
        "English & Literary Studies",
        "History & National Studies",
        "Theatre & Media Arts"
    ],
    "Faculty of Agriculture": [
        "Animal Production",
        "Agricultural Economics",
        "Crop Science",
        "Soil Science"
    ],
    "Faculty of Law": [
        "Law"
    ],
    "Faculty of Communication & Media Studies": [
        "Advertising",
        "Broadcasting",
        "Development Communication",
        "Film & Multimedia Studies",
        "Information & Media Studies",
        "Journalism & Media Studies",
        "Mass Communication",
        "Public Relations"
    ],
    "Faculty of Engineering": [
        "Agricultural Engineering",
        "Computer Engineering",
        "Chemical Engineering",
        "Civil & Water Resources Engineering",
        "Electrical Engineering",
        "Electronic & Telecommunications Engineering",
        "Industrial & Production Engineering",
        "Marine Engineering",
        "Materials & Metallurgical Engineering",
        "Mechanical Engineering",
        "Mechatronics & Robotics Engineering",
        "Natural Gas Engineering",
        "Petroleum & Gas Engineering"
    ],
    "Faculty of Environmental Science": [
        "Architecture",
        "Building Technology",
        "Environmental Management",
        "Estate Management",
        "Fine Arts & Industrial Design",
        "Urban & Regional Planning",
        "Surveying & Geoinformatics",
        "Quantity Surveying"
    ],
    "Faculty of Computing": [
        "Computer Science",
        "Cyber Security",
        "Data Science & Analytics",
        "Information & Communication Technology",
        "Information Systems",
        "Information Systems & Technology",
        "Library & Information Science",
        "Software Engineering"
    ],
    "Faculty of Science": [
        "Animal & Environmental Biology",
        "Biochemistry",
        "Biology",
        "Chemistry",
        "Environmental Management & Toxicology",
        "Food Science & Technology",
        "Geology",
        "Industrial Chemistry",
        "Marine Science",
        "Mathematics",
        "Microbiology",
        "Petroleum Chemistry",
        "Physics",
        "Plant Science & Biotechnology",
        "Science Laboratory Technology",
        "Statistics"
    ],
    "Faculty of Basic Medical Sciences": [
        "Human Anatomy",
        "Human Physiology",
        "Medical Laboratory Science",
        "Nursing Science",
        "Public Health",
        "Pharmacology"
    ],
    "Faculty of Administration & Management": [
        "Accounting",
        "Actuarial Science",
        "Banking & Finance",
        "Business Administration",
        "Employment Relations & Human Management",
        "Entrepreneurship",
        "Insurance",
        "Logistics & Supply Chain Management",
        "Marketing",
        "Office & Information Management",
        "Public Administration",
        "Petroleum Information Management",
        "Procurement Management",
        "Project Management",
        "Security & Investment Management",
        "Transport & Marine Management",
        "Taxation",
        "Hospitality & Tourism Management"
    ],
    "Faculty of Social Sciences": [
        "Political Science",
        "Sociology",
        "Economics"
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    const facultySelect = document.getElementById("facultySelect");
    const deptSelect = document.getElementById("departmentSelect");

    // 1. Populate Faculty & Department Dropdowns
    if (facultySelect && deptSelect) {
        Object.keys(facultiesAndDepartments).forEach(faculty => {
            const option = document.createElement("option");
            option.value = faculty;
            option.textContent = faculty;
            facultySelect.appendChild(option);
        });

        facultySelect.addEventListener("change", (e) => {
            const selectedFaculty = e.target.value;
            deptSelect.innerHTML = '<option value="" selected disabled>Select Department...</option>';

            if (selectedFaculty && facultiesAndDepartments[selectedFaculty]) {
                facultiesAndDepartments[selectedFaculty].forEach(dept => {
                    const option = document.createElement("option");
                    option.value = dept;
                    option.textContent = dept;
                    deptSelect.appendChild(option);
                });
                deptSelect.disabled = false;
            }
        });
    }

    // 2. Correction Form Submission Handler (UPDATED: Saves to student_attendance_appeals)
    const form = document.getElementById('correctionForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const courseCode = document.getElementById('courseCodeSelect')?.value || document.getElementById('courseCodeInput')?.value || "SEN 226";
            const selectedDept = document.getElementById('departmentSelect')?.value || "Software Engineering";
            const reasonType = document.getElementById('reasonType')?.value || "Medical / Sick";
            const explanation = document.getElementById('explanationText')?.value || "";

            // Form validation: Enforce a meaningful explanation
            if (explanation.trim().length < 8) {
                alert("Please provide a clearer explanation for your correction request (minimum 8 characters).");
                return;
            }

            // Save to dedicated appeals storage
            let appeals = JSON.parse(localStorage.getItem('student_attendance_appeals')) || [];

            appeals.unshift({
                dateSubmitted: new Date().toLocaleDateString() + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                courseCode: courseCode,
                category: reasonType,
                reason: explanation,
                department: selectedDept,
                status: "Pending Review"
            });

            localStorage.setItem('student_attendance_appeals', JSON.stringify(appeals));
            alert("Attendance correction appeal submitted successfully!");
            window.location.href = "student_history.html";
        });
    }

    // 2b. Mark Attendance Form Handler (passcode entry + Bluetooth beacon)
    const attendanceForm = document.getElementById('markAttendanceForm');
    if (attendanceForm) {
        const passcodeInput = document.getElementById('passcodeInput');
        const attendanceAlert = document.getElementById('attendanceAlert');

        // Pre-fill passcode if arriving from a scanned QR code (?code=123456)
        const urlCode = new URLSearchParams(window.location.search).get('code');
        if (urlCode && passcodeInput) passcodeInput.value = urlCode;

        function showAttendanceAlert(message, type = 'danger') {
            if (!attendanceAlert) return;
            attendanceAlert.className = `alert alert-${type} text-start small`;
            attendanceAlert.textContent = message;
            attendanceAlert.classList.remove('d-none');
        }

        function getStudentProfile() {
            return JSON.parse(localStorage.getItem('student_profile')) || {
                name: 'Ojo Kecee Kesiena',
                matricNo: 'ENG/2021/045',
                department: 'Software Engineering',
                faculty: 'Faculty of Computing',
                level: '300L'
            };
        }

        // Shared logic: verify a session/passcode and record attendance for it
        function checkIn(method) {
            const session = JSON.parse(localStorage.getItem('active_session'));
            if (!session) {
                showAttendanceAlert('No active session found. Ask your lecturer to start one.');
                return;
            }
            if (new Date(session.endTime) <= new Date()) {
                localStorage.removeItem('active_session');
                showAttendanceAlert('This session has closed.');
                return;
            }
            if (method === 'Passcode') {
                const entered = (passcodeInput?.value || '').trim();
                if (entered.length !== 6) {
                    showAttendanceAlert('Enter the 6-digit passcode.');
                    return;
                }
                if (entered !== session.passcode) {
                    showAttendanceAlert('Incorrect passcode. Please check with your lecturer.');
                    return;
                }
            }

            const profile = getStudentProfile();

            // Prevent marking twice for the same session
            const attendees = JSON.parse(localStorage.getItem('session_attendees')) || [];
            const already = attendees.some(a => a.sessionId === session.sessionId && a.matricNo === profile.matricNo);
            if (already) {
                showAttendanceAlert('You have already been marked present for this session.', 'info');
                return;
            }

            const now = new Date();
            const elapsedMin = (now - new Date(session.startTime)) / 60000;
            const totalMin = (new Date(session.endTime) - new Date(session.startTime)) / 60000;
            const status = elapsedMin > totalMin / 2 ? 'Late' : 'Present';
            const methodLabel = method === 'Passcode' ? 'Manual' : 'Beacon + OTP';
            const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            attendees.push({
                sessionId: session.sessionId,
                studentName: profile.name,
                matricNo: profile.matricNo,
                time: timeLabel,
                method: methodLabel
            });
            localStorage.setItem('session_attendees', JSON.stringify(attendees));

            const history = JSON.parse(localStorage.getItem('student_attendance_history')) || [];
            history.unshift({
                date: now.toLocaleDateString() + ' • ' + timeLabel,
                courseCode: session.courseCode,
                courseTitle: session.courseTitle,
                lecturerName: session.lecturerName,
                department: session.department,
                venue: session.venue,
                method: methodLabel,
                status: status
            });
            localStorage.setItem('student_attendance_history', JSON.stringify(history));

            showAttendanceAlert(`Marked ${status} for ${session.courseCode}. Redirecting...`, 'success');
            setTimeout(() => { window.location.href = 'student_history.html'; }, 1200);
        }

        attendanceForm.addEventListener('submit', function (e) {
            e.preventDefault();
            checkIn('Passcode');
        });

        const btnBluetoothScan = document.getElementById('btnBluetoothScan');
        if (btnBluetoothScan) {
            btnBluetoothScan.addEventListener('click', function () {
                const original = btnBluetoothScan.innerHTML;
                btnBluetoothScan.disabled = true;
                btnBluetoothScan.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Scanning for beacon...';

                // Simulated scan delay
                setTimeout(() => {
                    btnBluetoothScan.disabled = false;
                    btnBluetoothScan.innerHTML = original;
                    checkIn('Bluetooth');
                }, 1800);
            });
        }
    }

    // 3. Dashboard Recent Attendance Table
    const historyTable = document.getElementById('dashboardHistoryBody');
    if (historyTable) {
        let history = JSON.parse(localStorage.getItem('student_attendance_history')) || [];

        const totalSessions = history.length;
        const presentCount = history.filter(item => item.status.toLowerCase() === 'present').length;
        const pendingCount = (JSON.parse(localStorage.getItem('student_attendance_appeals')) || []).length;
        const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

        if (document.getElementById('statTotal')) document.getElementById('statTotal').textContent = totalSessions;
        if (document.getElementById('statPresent')) document.getElementById('statPresent').textContent = presentCount;
        if (document.getElementById('statPending')) document.getElementById('statPending').textContent = pendingCount;
        if (document.getElementById('statPercentage')) document.getElementById('statPercentage').textContent = percentage + '%';

        if (history.length === 0) {
            historyTable.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No attendance activity recorded yet.</td></tr>`;
        } else {
            historyTable.innerHTML = history.slice(0, 5).map(item => {
                let badgeClass = "bg-secondary";
                if (item.status.toLowerCase() === "present") badgeClass = "bg-success";
                if (item.status.toLowerCase() === "pending") badgeClass = "bg-warning text-dark";
                if (item.status.toLowerCase() === "absent") badgeClass = "bg-danger";

                return `
                    <tr>
                        <td class="ps-3 fw-semibold small">${item.date}</td>
                        <td>
                            <div class="fw-bold">${item.courseCode}</div>
                            <div class="text-muted small">${item.courseTitle || ''}</div>
                        </td>
                        <td class="small">${item.department || 'N/A'}</td>
                        <td class="small text-muted"><span class="badge bg-light text-dark border">${item.method || 'Standard'}</span></td>
                        <td class="text-end pe-3"><span class="badge ${badgeClass}">${item.status}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }

    // 4. Load Student Profile Dynamically
    const studentNameEl = document.getElementById('dashStudentName');
    const studentDetailsEl = document.getElementById('dashStudentDetails');

    if (studentNameEl && studentDetailsEl) {
        let profile = JSON.parse(localStorage.getItem('student_profile')) || {
            name: "Ojo Kecee Kesiena",
            matricNo: "ENG/2021/045",
            department: "Software Engineering",
            faculty: "Faculty of Computing",
            level: "300L"
        };

        if (!localStorage.getItem('student_profile')) {
            localStorage.setItem('student_profile', JSON.stringify(profile));
        }

        studentNameEl.textContent = profile.name;
        studentDetailsEl.textContent = `${profile.department} • ${profile.faculty} • ${profile.level}`;

        const welcomeEl = document.getElementById('studentWelcome');
        if (welcomeEl) welcomeEl.textContent = `Welcome, ${profile.name.split(' ')[0]}`;
    }
});