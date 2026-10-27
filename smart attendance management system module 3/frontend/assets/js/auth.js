document.addEventListener('DOMContentLoaded', () => {
    const roleTabs = document.querySelectorAll('#roleTabs .nav-link');
    const selectedRoleInput = document.getElementById('selectedRole');
    const identifierLabel = document.getElementById('identifierLabel');
    const identifierIcon = document.getElementById('identifierIcon');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginForm = document.getElementById('loginForm');

    // ROLE TABS
    roleTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {

            roleTabs.forEach(t => {
                t.classList.remove('active', 'btn-primary');
                t.classList.add('text-secondary');
            });

            const target = e.currentTarget;

            target.classList.add('active');
            target.classList.remove('text-secondary');

            const role = target.getAttribute('data-role');
            selectedRoleInput.value = role;

            if (role === 'student') {
                identifierLabel.textContent = 'Matriculation Number';
                usernameInput.placeholder = 'e.g. FOC/24/014055';
                identifierIcon.innerHTML =
                    '<i class="fa-solid fa-user-graduate"></i>';

            } else if (role === 'lecturer') {
                identifierLabel.textContent = 'Staff Identification No';
                usernameInput.placeholder = 'e.g. LEC/0001';
                identifierIcon.innerHTML =
                    '<i class="fa-solid fa-chalkboard-user"></i>';

            } else if (role === 'admin') {
                identifierLabel.textContent = 'Admin Email or Staff ID';
                usernameInput.placeholder = 'e.g. ADM/0001';
                identifierIcon.innerHTML =
                    '<i class="fa-solid fa-user-gear"></i>';
            }
        });
    });


    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const role = selectedRoleInput.value;
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Check empty fields
            if (!username || !password) {
                alert('Please enter a username and password.');
                return;
            }


           
            // ADMIN LOGIN
           
            if (role === 'admin') {

                if (username === 'kecee' && password === 'admin123') {

                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('username', 'kecee');

                    window.location.href = 'admin/admin_index.html';

                } else {
                    alert('Invalid admin username or password.');
                }

                return;
            }


            
            // STUDENT LOGIN
         
            if (role === 'student') {

                window.location.href = 'student/student_index.html';

                return;
            }


         
            // LECTURER LOGIN
           
            if (role === 'lecturer') {

                window.location.href = 'lecturer/lecturer_index.html';

                return;
            }
        });
    }
});