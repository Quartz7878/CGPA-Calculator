const courseContainer = document.getElementById('courseContainer');
        const addCourseBtn = document.getElementById('addCourse');
        const calculateBtn = document.getElementById('calculate');
        const resultDiv = document.getElementById('result');
        const cgpaResult = document.getElementById('cgpaResult');
        const errorDiv = document.getElementById('error');

        let courseCount = 0;

        function createCourseRow() {
            const row = document.createElement('div');
            row.className = 'course-row';
            row.innerHTML = `
                <div class="input-group">
                    <label>Course Credit</label>
                    <input type="number" class="credit" min="1" max="4" step="1" required>
                </div>
                <div class="input-group">
                    <label>Course CGPA</label>
                    <input type="number" class="cgpa" min="0" max="4" step="0.01" required>
                </div>
                <button class="remove-btn" onclick="removeCourse(this)">×</button>
            `;
            return row;
        }

        function addCourse() {
            if (courseCount < 5) {
                courseContainer.appendChild(createCourseRow());
                courseCount++;
                updateButtons();
            }
        }

        function removeCourse(btn) {
            if (courseCount > 3) {
                btn.closest('.course-row').remove();
                courseCount--;
                updateButtons();
            }
        }

        function updateButtons() {
            addCourseBtn.disabled = courseCount >= 5;
            const removeBtns = document.querySelectorAll('.remove-btn');
            removeBtns.forEach(btn => {
                btn.disabled = courseCount <= 3;
            });
        }

        function calculateCGPA() {
            errorDiv.style.display = 'none';
            const credits = [...document.querySelectorAll('.credit')].map(input => parseFloat(input.value));
            const cgpas = [...document.querySelectorAll('.cgpa')].map(input => parseFloat(input.value));

            // Validation
            if (credits.some(isNaN) || cgpas.some(isNaN)) {
                showError('Please fill in all fields with valid numbers.');
                return;
            }

            if (credits.some(credit => credit < 1 || credit > 6)) {
                showError('Course credits must be between 1 and 4.');
                return;
            }

            if (cgpas.some(cgpa => cgpa < 0 || cgpa > 4)) {
                showError('CGPA must be between 0 and 4.');
                return;
            }

            const totalWeightedGrade = credits.reduce((sum, credit, i) => sum + (credit * cgpas[i]), 0);
            const totalCredits = credits.reduce((sum, credit) => sum + credit, 0);
            const cgpa = totalWeightedGrade / totalCredits;

            resultDiv.classList.add('show');
            cgpaResult.textContent = cgpa.toFixed(2);
        }

        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            resultDiv.classList.remove('show');
        }

        // Initialize with 3 courses
        for (let i = 0; i < 3; i++) {
            addCourse();
        }

        addCourseBtn.addEventListener('click', addCourse);
        calculateBtn.addEventListener('click', calculateCGPA);