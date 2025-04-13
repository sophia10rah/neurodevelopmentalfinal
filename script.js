document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically handle the form submission
            // For now, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Brain image map interactions
    const brainAreas = document.querySelectorAll('area');
    if (brainAreas.length > 0) {
        brainAreas.forEach(area => {
            area.addEventListener('mouseover', () => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = area.alt;
                document.body.appendChild(tooltip);

                // Position tooltip near the mouse
                const updateTooltipPosition = (e) => {
                    tooltip.style.left = e.pageX + 10 + 'px';
                    tooltip.style.top = e.pageY + 10 + 'px';
                };

                document.addEventListener('mousemove', updateTooltipPosition);
            });

            area.addEventListener('mouseout', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // Scroll Animation
    handleScrollAnimation();

    // Quiz functionality
    const quizAnswers = {
        1: 'B', // ACC
        2: 'B', // False
        3: 'C', // Thimerosal
        4: 'B', // Dopamine
        5: 'C'  // 60%
    };

    let currentQuestion = 1;
    let selectedAnswer = null;

    // Show quiz popup when user reaches bottom of page
    function handleScroll() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= documentHeight - 100) {
            const quizPopup = document.querySelector('.quiz-popup');
            if (quizPopup && !quizPopup.classList.contains('visible')) {
                quizPopup.classList.add('visible');
            }
        }
    }

    // Initialize quiz functionality
    function initQuiz() {
        const quizPopup = document.querySelector('.quiz-popup');
        const quizModal = document.querySelector('.quiz-modal');
        const closeBtn = document.querySelector('.close-btn');
        const startQuizBtn = document.querySelector('.start-quiz');
        const nextBtn = document.querySelector('.next-btn');

        if (!quizPopup || !quizModal || !closeBtn || !startQuizBtn || !nextBtn) {
            console.error('Quiz elements not found');
            return;
        }

        // Show/hide quiz popup
        closeBtn.addEventListener('click', () => {
            quizPopup.classList.remove('visible');
        });

        // Start quiz
        startQuizBtn.addEventListener('click', () => {
            quizPopup.classList.remove('visible');
            quizModal.classList.add('visible');
            showQuestion(1);
        });

        // Handle option selection
        document.addEventListener('click', (e) => {
            const option = e.target.closest('.option');
            if (option) {
                const questionElement = option.closest('.question');
                if (questionElement) {
                    const questionOptions = questionElement.querySelectorAll('.option');
                    questionOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedAnswer = option.dataset.answer;
                    nextBtn.disabled = false;
                }
            }
        });

        // Handle next question
        nextBtn.addEventListener('click', handleNextQuestion);
    }

    // Handle next question
    function handleNextQuestion() {
        if (!selectedAnswer) return;

        const questions = document.querySelectorAll('.question');
        const currentQuestionElement = questions[currentQuestion - 1];
        if (!currentQuestionElement) return;

        const options = currentQuestionElement.querySelectorAll('.option');
        const isCorrect = selectedAnswer === quizAnswers[currentQuestion];
        
        // Show correct/incorrect states
        options.forEach(option => {
            if (option.dataset.answer === quizAnswers[currentQuestion]) {
                option.classList.add('correct');
            } else if (option.dataset.answer === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        // Show explanation
        const explanation = currentQuestionElement.querySelector('.explanation');
        if (explanation) {
            explanation.classList.add('visible');
        }

        // Add feedback message
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        feedback.style.marginTop = '1rem';
        feedback.style.padding = '1rem';
        feedback.style.borderRadius = '6px';
        feedback.style.textAlign = 'center';
        feedback.style.fontWeight = '500';

        if (isCorrect) {
            feedback.textContent = 'Congrats! Well done! 🎉';
            feedback.style.backgroundColor = '#e8f5e9';
            feedback.style.color = '#2e7d32';
            
            // Create and configure confetti canvas
            const confettiCanvas = document.createElement('canvas');
            confettiCanvas.style.position = 'fixed';
            confettiCanvas.style.top = '0';
            confettiCanvas.style.left = '0';
            confettiCanvas.style.width = '100%';
            confettiCanvas.style.height = '100%';
            confettiCanvas.style.pointerEvents = 'none';
            confettiCanvas.style.zIndex = '1002';
            document.body.appendChild(confettiCanvas);
            
            // Trigger confetti
            const confettiInstance = confetti.create(confettiCanvas, {
                resize: true,
                useWorker: true
            });
            
            confettiInstance({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Remove canvas after animation
            setTimeout(() => {
                confettiCanvas.remove();
            }, 3000);

            // Move to next question or end quiz
            if (currentQuestion < 5) {
                setTimeout(() => {
                    currentQuestion++;
                    showQuestion(currentQuestion);
                }, 3000);
            } else {
                setTimeout(() => {
                    const quizModal = document.querySelector('.quiz-modal');
                    const quizResults = document.querySelector('.quiz-results');
                    const quizThankYou = document.querySelector('.quiz-thank-you');
                    const quizCloseBtn = document.querySelector('.quiz-close');
                    
                    if (quizModal) {
                        quizModal.classList.remove('visible');
                    }
                    
                    if (quizResults && quizThankYou && quizCloseBtn) {
                        quizResults.style.display = 'block';
                        quizThankYou.style.display = 'block';
                        quizCloseBtn.style.display = 'block';
                    }
                }, 3000);
            }
        } else {
            const correctAnswer = options.find(opt => opt.dataset.answer === quizAnswers[currentQuestion]);
            feedback.textContent = `Incorrect! The correct answer is ${correctAnswer.textContent}. Try again!`;
            feedback.style.backgroundColor = '#fde8e8';
            feedback.style.color = '#c62828';
            
            // Reset selection after showing feedback
            setTimeout(() => {
                // Remove incorrect state
                options.forEach(opt => {
                    if (opt.dataset.answer === selectedAnswer) {
                        opt.classList.remove('incorrect');
                    }
                });
                
                // Reset selected answer
                selectedAnswer = null;
                nextBtn.disabled = true;
                
                // Remove feedback message
                feedback.remove();
            }, 2000);
        }

        currentQuestionElement.appendChild(feedback);
    }

    // Show specific question
    function showQuestion(questionNumber) {
        const questions = document.querySelectorAll('.question');
        if (!questions.length) return;

        questions.forEach((q, index) => {
            q.style.display = index + 1 === questionNumber ? 'block' : 'none';
            
            // Remove previous feedback and states
            const feedback = q.querySelector('.feedback');
            if (feedback) {
                feedback.remove();
            }
            
            // Reset option states
            q.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Hide explanation
            const explanation = q.querySelector('.explanation');
            if (explanation) {
                explanation.classList.remove('visible');
            }
        });

        // Reset next button
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.disabled = true;
        }
        selectedAnswer = null;
    }

    // Initialize quiz when DOM is loaded
    initQuiz();
    window.addEventListener('scroll', handleScroll);
});

// Scroll Animation
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });
} 