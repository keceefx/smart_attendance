document.addEventListener('DOMContentLoaded', function () {

    
    // 1. HARDCODED ADMIN LOGIN CREDENTIALS
    
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const adminId = document.getElementById('adminIdInput').value.trim();
            const password = document.getElementById('adminPasswordInput').value.trim();

            // Strict Credential Check
            if (adminId === 'KCEE' && password === 'Ojo') {
                alert('Admin Login Successful! Redirecting...');
                window.location.href = 'admin/index.html';
            } else {
                alert('Invalid Admin Credentials! (ID:  | Password: Ojo)');
            }
        });
    }

    // Dynamic Helper to Append Rows to Tables
    function addRowToTable(tableBodyId, cellsArray) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;

        const row = document.createElement('tr');
        let rowContent = '';
        
        cellsArray.forEach((cell, index) => {
            if (index === cellsArray.length - 1) {
                // Actions Column (Edit / Delete)
                rowContent += `
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary py-0 me-1 btn-edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-danger py-0 btn-delete"><i class="fa-solid fa-trash"></i></button>
                    </td>`;
            } else {
                rowContent += `<td>${cell}</td>`;
            }
        });

        row.innerHTML = rowContent;
        tableBody.appendChild(row);
    }


    // 2. REGISTER NEW STUDENT
  
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const surname = document.getElementById('studentSurname').value.trim();
            const otherNames = document.getElementById('studentOtherNames').value.trim();
            const matric = document.getElementById('studentMatric').value.trim();
            const dept = document.getElementById('studentDept').value;

            // Instantly append to UI Table
            addRowToTable('studentTableBody', [
                `<code>${matric}</code>`,
                `${surname} ${otherNames}`,
                dept,
                ''
            ]);

            alert(`Student ${surname} ${otherNames} registered successfully!`);
            addStudentForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
        });
    }

   
    // 3. REGISTER NEW LECTURER
  
    const addLecturerForm = document.getElementById('addLecturerForm');
    if (addLecturerForm) {
        addLecturerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('lecturerTitle').value;
            const surname = document.getElementById('lecturerSurname').value.trim();
            const otherNames = document.getElementById('lecturerOtherNames').value.trim();
            const staffId = document.getElementById('lecturerStaffId').value.trim();
            const dept = document.getElementById('lecturerDept').value;

            addRowToTable('lecturerTableBody', [
                `<code>${staffId}</code>`,
                `${title} ${surname} ${otherNames}`,
                dept,
                ''
            ]);

            alert(`Lecturer ${title} ${surname} registered successfully!`);
            addLecturerForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addLecturerModal')).hide();
        });
    }

  
    // 4. ADD NEW COURSE
    
    const manageCourseForm = document.getElementById('manageCourseForm');
    if (manageCourseForm) {
        manageCourseForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const code = document.getElementById('courseCode').value.trim();
            const title = document.getElementById('courseTitle').value.trim();
            const units = document.getElementById('courseUnits').value;

            addRowToTable('courseTableBody', [
                `<strong>${code}</strong>`,
                title,
                units,
                ''
            ]);

            alert(`Course ${code} added successfully!`);
            manageCourseForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();
        });
    }


    // 5. ADD DEPARTMENT & VENUE
   
    const addDeptForm = document.getElementById('addDeptForm');
    if (addDeptForm) {
        addDeptForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const faculty = document.getElementById('deptFaculty').value.trim();
            const deptName = document.getElementById('deptName').value.trim();

            addRowToTable('departmentTableBody', [faculty, deptName, '']);
            addDeptForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addDeptModal')).hide();
        });
    }

    const addVenueForm = document.getElementById('addVenueForm');
    if (addVenueForm) {
        addVenueForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const venueName = document.getElementById('venueName').value.trim();
            const capacity = document.getElementById('venueCapacity').value;

            addRowToTable('venueTableBody', [`<strong>${venueName}</strong>`, `${capacity} Seats`, '']);
            addVenueForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addVenueModal')).hide();
        });
    }

   
    // 6. DELETE BUTTON FUNCTIONALITY
  
    document.addEventListener('click', function (e) {
        if (e.target.closest('.btn-delete')) {
            if (confirm('Are you sure you want to delete this record?')) {
                e.target.closest('tr').remove();
            }
        }
    });

});