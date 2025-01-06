document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('business-context');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const progressBar = document.getElementById('progress-bar');
    const analysisContent = document.getElementById('analysis-content');

    const steps = ['strategy', 'competitors', 'revenue', 'cost', 'roi'];
    let currentStep = 0;
    let completedSteps = [];

    // Enable/disable analyze button based on textarea content
    textarea.addEventListener('input', function() {
        analyzeBtn.disabled = !this.value.trim();
    });

    // Create D3 progress visualization
    function createProgressBar() {
        const width = progressBar.offsetWidth;
        const height = 100;
        const padding = 20;

        // Clear any existing content
        progressBar.innerHTML = '';

        // Create SVG
        const svg = d3.select(progressBar)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const stepWidth = (width - (2 * padding)) / (steps.length - 1);

        // Create progress line
        svg.append('line')
            .attr('x1', padding)
            .attr('y1', height / 2)
            .attr('x2', width - padding)
            .attr('y2', height / 2)
            .style('stroke', '#ccc')
            .style('stroke-width', 2);

        // Create step circles and labels
        steps.forEach((step, index) => {
            const x = padding + (stepWidth * index);
            
            // Circle
            svg.append('circle')
                .attr('cx', x)
                .attr('cy', height / 2)
                .attr('r', 10)
                .style('fill', getStepColor(index))
                .style('stroke', '#666')
                .style('stroke-width', 2);

            // Label
            svg.append('text')
                .attr('x', x)
                .attr('y', height / 2 + 25)
                .attr('text-anchor', 'middle')
                .text(step.charAt(0).toUpperCase() + step.slice(1))
                .style('font-size', '12px');
        });
    }

    function getStepColor(index) {
        if (completedSteps.includes(steps[index])) {
            return '#4CAF50';  // Green for completed
        }
        if (index === currentStep) {
            return '#2196F3';  // Blue for current
        }
        return '#fff';  // White for pending
    }

    async function processStep(step) {
        try {
            const response = await fetch(`http://localhost:5000/process/${step}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error(`Error processing step ${step}:`, error);
            throw error;
        }
    }

    analyzeBtn.addEventListener('click', async function() {
        const context = textarea.value.trim();
        if (!context) return;

        try {
            // Show results section and initialize progress bar
            resultsSection.style.display = 'block';
            createProgressBar();

            // Submit context
            const contextResponse = await fetch('http://localhost:5000/submit_context', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ custom_context: context }),
            });

            if (!contextResponse.ok) {
                throw new Error('Failed to submit context');
            }

            // Process each step
            for (const step of steps) {
                currentStep = steps.indexOf(step);
                createProgressBar();  // Update progress visualization
                
                const result = await processStep(step);
                completedSteps.push(step);
                
                // Update progress bar and display results
                createProgressBar();
                analysisContent.innerHTML += `
                    <div class="step-result">
                        <h2>${step.charAt(0).toUpperCase() + step.slice(1)} Analysis</h2>
                        <div class="content">${result}</div>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Analysis error:', error);
            analysisContent.innerHTML = `<div class="error">Error during analysis: ${error.message}</div>`;
        }
    });
});
