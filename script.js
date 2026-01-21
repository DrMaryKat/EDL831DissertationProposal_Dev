/* EDL 831 Interactive Module JavaScript */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeProgress();
    initializeQuizzes();
    initializeReflections();
    initializeChecklists();
    initializeAccordions();
    initializeSelfAssessments();
    initializeTaskCheckboxes();
    loadSavedData();
});

// ==================== PROGRESS TRACKING ====================

function initializeProgress() {
    updateProgressBar();
}

function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    
    if (!progressFill || !progressPercent) return;
    
    const weekNumber = getWeekNumber();
    const storageKey = `edl831_week${weekNumber}_progress`;
    
    // Count completed items
    const checkboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"], .checklist-item input[type="checkbox"]');
    const quizzes = document.querySelectorAll('.quiz-container');
    const reflections = document.querySelectorAll('.reflection-textarea');
    
    let totalItems = checkboxes.length + quizzes.length + reflections.length;
    let completedItems = 0;
    
    // Count checked checkboxes
    checkboxes.forEach(cb => {
        if (cb.checked) completedItems++;
    });
    
    // Count completed quizzes
    quizzes.forEach(quiz => {
        if (quiz.classList.contains('completed')) completedItems++;
    });
    
    // Count reflections with content
    reflections.forEach(textarea => {
        if (textarea.value.trim().length > 50) completedItems++;
    });
    
    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    progressFill.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
    
    // Save progress
    localStorage.setItem(storageKey, JSON.stringify({
        completed: completedItems,
        total: totalItems,
        percent: percent,
        lastUpdated: new Date().toISOString()
    }));
}

function getWeekNumber() {
    const match = window.location.pathname.match(/week(\d+)/);
    return match ? match[1] : '1';
}

// ==================== QUIZ FUNCTIONALITY ====================

function initializeQuizzes() {
    document.querySelectorAll('.quiz-container').forEach((quiz, index) => {
        const quizId = quiz.dataset.quizId || `quiz-${index}`;
        const options = quiz.querySelectorAll('.quiz-option');
        const submitBtn = quiz.querySelector('.quiz-btn');
        const feedback = quiz.querySelector('.quiz-feedback');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected from all options
                options.forEach(opt => opt.classList.remove('selected'));
                // Add selected to clicked option
                this.classList.add('selected');
                // Check the radio button
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                // Enable submit button
                if (submitBtn) submitBtn.disabled = false;
            });
        });
        
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                checkQuizAnswer(quiz, quizId);
            });
        }
    });
}

function checkQuizAnswer(quizContainer, quizId) {
    const selectedOption = quizContainer.querySelector('.quiz-option.selected');
    const feedback = quizContainer.querySelector('.quiz-feedback');
    const correctAnswer = quizContainer.dataset.correct;
    const options = quizContainer.querySelectorAll('.quiz-option');
    
    if (!selectedOption) return;
    
    const selectedValue = selectedOption.dataset.value;
    const isCorrect = selectedValue === correctAnswer;
    
    // Mark options
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
        if (opt.dataset.value === correctAnswer) {
            opt.classList.add('correct');
        } else if (opt === selectedOption && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    // Show feedback
    if (feedback) {
        feedback.classList.remove('correct', 'incorrect');
        feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');
        
        const correctFeedback = quizContainer.dataset.correctFeedback || 'Correct! Well done.';
        const incorrectFeedback = quizContainer.dataset.incorrectFeedback || 'Not quite. Review the material and try again.';
        
        feedback.innerHTML = isCorrect ? 
            `<strong>✓ Correct!</strong> ${correctFeedback}` : 
            `<strong>✗ Not quite.</strong> ${incorrectFeedback}`;
    }
    
    // Mark quiz as completed
    quizContainer.classList.add('completed');
    
    // Disable further changes
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    const submitBtn = quizContainer.querySelector('.quiz-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isCorrect ? '✓ Completed' : 'Review Answer';
    }
    
    // Save result
    const weekNumber = getWeekNumber();
    const storageKey = `edl831_week${weekNumber}_${quizId}`;
    localStorage.setItem(storageKey, JSON.stringify({
        answer: selectedValue,
        correct: isCorrect,
        timestamp: new Date().toISOString()
    }));
    
    updateProgressBar();
}

// ==================== REFLECTION/WRITING EXERCISES ====================

function initializeReflections() {
    document.querySelectorAll('.reflection-container').forEach((container, index) => {
        const textarea = container.querySelector('.reflection-textarea');
        const charCount = container.querySelector('.char-count');
        const saveBtn = container.querySelector('.save-btn');
        const savedIndicator = container.querySelector('.saved-indicator');
        const reflectionId = container.dataset.reflectionId || `reflection-${index}`;
        
        if (textarea) {
            // Character count
            textarea.addEventListener('input', function() {
                if (charCount) {
                    const count = this.value.length;
                    charCount.textContent = `${count} characters`;
                }
                
                // Auto-save after typing stops
                clearTimeout(textarea.saveTimeout);
                textarea.saveTimeout = setTimeout(() => {
                    saveReflection(reflectionId, textarea.value);
                    if (savedIndicator) {
                        savedIndicator.textContent = '✓ Auto-saved';
                        setTimeout(() => savedIndicator.textContent = '', 2000);
                    }
                }, 1000);
                
                updateProgressBar();
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                saveReflection(reflectionId, textarea.value);
                if (savedIndicator) {
                    savedIndicator.textContent = '✓ Saved!';
                    setTimeout(() => savedIndicator.textContent = '', 3000);
                }
            });
        }
    });
}

function saveReflection(reflectionId, content) {
    const weekNumber = getWeekNumber();
    const storageKey = `edl831_week${weekNumber}_${reflectionId}`;
    localStorage.setItem(storageKey, JSON.stringify({
        content: content,
        timestamp: new Date().toISOString()
    }));
}

// ==================== CHECKLISTS ====================

function initializeChecklists() {
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach((checkbox, index) => {
        const checklistId = checkbox.closest('.checklist')?.dataset.checklistId || 'checklist';
        const itemId = `${checklistId}-item-${index}`;
        
        checkbox.addEventListener('change', function() {
            const item = this.closest('.checklist-item');
            if (item) {
                item.classList.toggle('checked', this.checked);
            }
            
            saveChecklistState(checklistId);
            updateProgressBar();
        });
    });
}

function saveChecklistState(checklistId) {
    const weekNumber = getWeekNumber();
    const storageKey = `edl831_week${weekNumber}_${checklistId}`;
    const checklist = document.querySelector(`[data-checklist-id="${checklistId}"]`) || document.querySelector('.checklist');
    
    if (!checklist) return;
    
    const items = [];
    checklist.querySelectorAll('input[type="checkbox"]').forEach((cb, index) => {
        items.push({
            index: index,
            checked: cb.checked
        });
    });
    
    localStorage.setItem(storageKey, JSON.stringify({
        items: items,
        timestamp: new Date().toISOString()
    }));
}

// ==================== TASK CHECKBOXES ====================

function initializeTaskCheckboxes() {
    document.querySelectorAll('.task-checkbox input[type="checkbox"]').forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (taskItem) {
                taskItem.classList.toggle('completed', this.checked);
            }
            
            saveTaskState();
            updateProgressBar();
        });
    });
}

function saveTaskState() {
    const weekNumber = getWeekNumber();
    const storageKey = `edl831_week${weekNumber}_tasks`;
    
    const tasks = [];
    document.querySelectorAll('.task-checkbox input[type="checkbox"]').forEach((cb, index) => {
        tasks.push({
            index: index,
            checked: cb.checked
        });
    });
    
    localStorage.setItem(storageKey, JSON.stringify({
        tasks: tasks,
        timestamp: new Date().toISOString()
    }));
}

// ==================== SELF-ASSESSMENTS ====================

function initializeSelfAssessments() {
    document.querySelectorAll('.assessment-item').forEach((item, index) => {
        const assessmentId = item.closest('.assessment-container')?.dataset.assessmentId || 'assessment';
        const itemId = `${assessmentId}-${index}`;
        
        item.querySelectorAll('.rating-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected from siblings
                item.querySelectorAll('.rating-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // Add selected to this option
                this.classList.add('selected');
                
                // Save selection
                saveAssessmentState(assessmentId);
                updateProgressBar();
            });
        });
    });
}

function saveAssessmentState(assessmentId) {
    const weekNumber = getWeekNumber();
    const storageKey = `edl831_week${weekNumber}_${assessmentId}`;
    const container = document.querySelector(`[data-assessment-id="${assessmentId}"]`) || document.querySelector('.assessment-container');
    
    if (!container) return;
    
    const responses = [];
    container.querySelectorAll('.assessment-item').forEach((item, index) => {
        const selected = item.querySelector('.rating-option.selected');
        responses.push({
            index: index,
            value: selected ? selected.dataset.value : null
        });
    });
    
    localStorage.setItem(storageKey, JSON.stringify({
        responses: responses,
        timestamp: new Date().toISOString()
    }));
}

// ==================== ACCORDIONS ====================

function initializeAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const accordion = this.closest('.accordion');
            accordion.classList.toggle('open');
        });
    });
}

// ==================== LOAD SAVED DATA ====================

function loadSavedData() {
    const weekNumber = getWeekNumber();
    
    // Load task states
    const taskData = localStorage.getItem(`edl831_week${weekNumber}_tasks`);
    if (taskData) {
        const parsed = JSON.parse(taskData);
        document.querySelectorAll('.task-checkbox input[type="checkbox"]').forEach((cb, index) => {
            const task = parsed.tasks.find(t => t.index === index);
            if (task) {
                cb.checked = task.checked;
                if (task.checked) {
                    const taskItem = cb.closest('.task-item');
                    if (taskItem) taskItem.classList.add('completed');
                }
            }
        });
    }
    
    // Load checklist states
    document.querySelectorAll('.checklist').forEach(checklist => {
        const checklistId = checklist.dataset.checklistId || 'checklist';
        const data = localStorage.getItem(`edl831_week${weekNumber}_${checklistId}`);
        if (data) {
            const parsed = JSON.parse(data);
            checklist.querySelectorAll('input[type="checkbox"]').forEach((cb, index) => {
                const item = parsed.items.find(i => i.index === index);
                if (item) {
                    cb.checked = item.checked;
                    if (item.checked) {
                        cb.closest('.checklist-item')?.classList.add('checked');
                    }
                }
            });
        }
    });
    
    // Load reflections
    document.querySelectorAll('.reflection-container').forEach((container, index) => {
        const reflectionId = container.dataset.reflectionId || `reflection-${index}`;
        const data = localStorage.getItem(`edl831_week${weekNumber}_${reflectionId}`);
        if (data) {
            const parsed = JSON.parse(data);
            const textarea = container.querySelector('.reflection-textarea');
            if (textarea && parsed.content) {
                textarea.value = parsed.content;
                const charCount = container.querySelector('.char-count');
                if (charCount) {
                    charCount.textContent = `${parsed.content.length} characters`;
                }
            }
        }
    });
    
    // Load self-assessments
    document.querySelectorAll('.assessment-container').forEach(container => {
        const assessmentId = container.dataset.assessmentId || 'assessment';
        const data = localStorage.getItem(`edl831_week${weekNumber}_${assessmentId}`);
        if (data) {
            const parsed = JSON.parse(data);
            container.querySelectorAll('.assessment-item').forEach((item, index) => {
                const response = parsed.responses.find(r => r.index === index);
                if (response && response.value) {
                    const option = item.querySelector(`.rating-option[data-value="${response.value}"]`);
                    if (option) option.classList.add('selected');
                }
            });
        }
    });
    
    // Load quiz states
    document.querySelectorAll('.quiz-container').forEach((quiz, index) => {
        const quizId = quiz.dataset.quizId || `quiz-${index}`;
        const data = localStorage.getItem(`edl831_week${weekNumber}_${quizId}`);
        if (data) {
            const parsed = JSON.parse(data);
            const correctAnswer = quiz.dataset.correct;
            
            quiz.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.dataset.value === parsed.answer) {
                    opt.classList.add('selected');
                    opt.querySelector('input[type="radio"]').checked = true;
                }
                if (opt.dataset.value === correctAnswer) {
                    opt.classList.add('correct');
                } else if (opt.dataset.value === parsed.answer && !parsed.correct) {
                    opt.classList.add('incorrect');
                }
                opt.style.pointerEvents = 'none';
            });
            
            const feedback = quiz.querySelector('.quiz-feedback');
            if (feedback) {
                feedback.classList.add('show', parsed.correct ? 'correct' : 'incorrect');
                const correctFeedback = quiz.dataset.correctFeedback || 'Correct! Well done.';
                const incorrectFeedback = quiz.dataset.incorrectFeedback || 'Not quite. Review the material and try again.';
                feedback.innerHTML = parsed.correct ? 
                    `<strong>✓ Correct!</strong> ${correctFeedback}` : 
                    `<strong>✗ Not quite.</strong> ${incorrectFeedback}`;
            }
            
            const submitBtn = quiz.querySelector('.quiz-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = parsed.correct ? '✓ Completed' : 'Review Answer';
            }
            
            quiz.classList.add('completed');
        }
    });
    
    updateProgressBar();
}

// ==================== UTILITY FUNCTIONS ====================

function exportProgress() {
    const weekNumber = getWeekNumber();
    const exportData = {};
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`edl831_week${weekNumber}`)) {
            exportData[key] = JSON.parse(localStorage.getItem(key));
        }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edl831_week${weekNumber}_progress.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function resetWeekProgress() {
    if (!confirm('Are you sure you want to reset all progress for this week? This cannot be undone.')) {
        return;
    }
    
    const weekNumber = getWeekNumber();
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`edl831_week${weekNumber}`)) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    location.reload();
}
