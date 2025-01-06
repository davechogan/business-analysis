document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('business-context');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const progressBar = document.getElementById('progress-bar');
    const analysisContent = document.getElementById('analysis-content');

    const steps = ['strategy', 'competitors', 'revenue', 'cost', 'roi'];
    const optionalSteps = ['justification', 'deck'];
    let currentStep = 0;
    let completedSteps = [];

    // Enable/disable analyze button based on textarea content
    textarea.addEventListener('input', function() {
        analyzeBtn.disabled = !this.value.trim();
    });

    // Create tabs container
    function createTabsContainer() {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs-container';
        
        const tabsList = document.createElement('div');
        tabsList.className = 'tabs-list';
        
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        
        tabsContainer.appendChild(tabsList);
        tabsContainer.appendChild(tabContent);
        analysisContent.appendChild(tabsContainer);
        
        return { tabsList, tabContent };
    }

    // Add new tab
    function addTab(step, content) {
        const tabsContainer = document.querySelector('.tabs-container') || createTabsContainer().tabsList;
        const tabsList = document.querySelector('.tabs-list');
        const tabContent = document.querySelector('.tab-content');

        // Create tab button
        const tab = document.createElement('button');
        tab.className = 'tab';
        tab.textContent = step.charAt(0).toUpperCase() + step.slice(1);
        tabsList.appendChild(tab);

        // Parse the JSON content if it's a string
        let formattedContent;
        try {
            formattedContent = typeof content === 'string' ? JSON.parse(content) : content;
            console.log('Parsed content:', formattedContent);  // Debug log
        } catch (e) {
            console.error('Error parsing content:', e);
            formattedContent = { sections: [{ title: 'Raw Output', content: content }] };
        }

        // Create tab content with sections
        const contentDiv = document.createElement('div');
        contentDiv.className = 'tab-pane';
        
        // Build HTML based on the formatted content structure
        let htmlContent = `
            <div class="analysis-card">
                <h2>${step.charAt(0).toUpperCase() + step.slice(1)} Analysis</h2>
                <div class="markdown-content">
        `;

        // Add sections if they exist
        if (formattedContent && formattedContent.sections) {
            formattedContent.sections.forEach(section => {
                htmlContent += `
                    <div class="analysis-section">
                        <h3>${section.title}</h3>
                        ${section.content}
                    </div>
                `;
            });
        } else {
            // Fallback for unformatted content
            htmlContent += `
                <div class="analysis-section">
                    <h3>Analysis</h3>
                    ${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                </div>
            `;
        }

        // Add key points if they exist
        if (formattedContent.keyPoints && formattedContent.keyPoints.length > 0) {
            htmlContent += `
                <div class="analysis-section">
                    <h3>Key Points</h3>
                    <ul>
                        ${formattedContent.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Add recommendations if they exist
        if (formattedContent.recommendations && formattedContent.recommendations.length > 0) {
            htmlContent += `
                <div class="analysis-section">
                    <h3>Recommendations</h3>
                    <ul>
                        ${formattedContent.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        htmlContent += `
                </div>
            </div>
        `;

        contentDiv.innerHTML = htmlContent;
        tabContent.appendChild(contentDiv);

        // Hide all other content and show this one
        document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        contentDiv.style.display = 'block';
        tab.classList.add('active');

        // Add click handler
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            contentDiv.style.display = 'block';
            tab.classList.add('active');
        });
    }

    // Create D3 progress visualization
    function createProgressBar() {
        const width = progressBar.offsetWidth;
        const height = 100;
        const padding = 20;

        // Clear any existing content
        progressBar.innerHTML = '';

        // Get total steps (including accepted optional steps)
        const totalSteps = [...steps, ...completedSteps.filter(step => optionalSteps.includes(step))];
        
        // Create SVG
        const svg = d3.select(progressBar)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const stepWidth = (width - (2 * padding)) / (totalSteps.length - 1 || 1);

        // Create progress line
        svg.append('line')
            .attr('x1', padding)
            .attr('y1', height / 2)
            .attr('x2', width - padding)
            .attr('y2', height / 2)
            .style('stroke', '#ccc')
            .style('stroke-width', 2);

        // Create step circles and labels
        totalSteps.forEach((step, index) => {
            const x = padding + (stepWidth * index);
            
            // Circle
            svg.append('circle')
                .attr('cx', x)
                .attr('cy', height / 2)
                .attr('r', 10)
                .style('fill', getStepColor(step))
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

    function getStepColor(step) {
        if (completedSteps.includes(step)) {
            return '#4CAF50';  // Green for completed
        }
        if (steps.indexOf(step) === currentStep || 
            (optionalSteps.includes(step) && 
             completedSteps.length === steps.length + optionalSteps.indexOf(step))) {
            return '#2196F3';  // Blue for current
        }
        return '#fff';  // White for pending
    }

    async function processStep(step) {
        try {
            // Start the main process request
            const processPromise = fetch(`http://localhost:5000/process/${step}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            }).then(r => r.json());

            // Get the raw data
            const data = await processPromise;
            console.log(`Raw ${step} data:`, data);

            // Start formatting while we begin the next step
            const formatPromise = fetch(`http://localhost:5000/format/${step}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: data.result }),
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Formatting failed: ${response.statusText}`);
                }
                return response.json();
            });

            // Wait for formatting to complete
            const formattedData = await formatPromise;
            console.log(`Formatted ${step} data:`, formattedData);
            return formattedData;
        } catch (error) {
            console.error(`Error processing step ${step}:`, error);
            throw error;
        }
    }

    function createOptionalStepPrompt(step) {
        return new Promise((resolve) => {
            const promptDiv = document.createElement('div');
            promptDiv.className = 'optional-step-prompt';
            promptDiv.innerHTML = `
                <div class="prompt-card">
                    <h3>${step === 'justification' ? 'Create Business Justification Plan?' : 'Generate Investor Deck?'}</h3>
                    <p>${step === 'justification' ? 
                        'Would you like to generate a detailed business justification plan based on the analysis?' : 
                        'Would you like to generate an investor pitch deck based on the analysis?'}</p>
                    <div class="prompt-buttons">
                        <button class="accept-btn">Yes, generate it</button>
                        <button class="reject-btn">No, skip this</button>
                    </div>
                </div>
            `;

            document.body.appendChild(promptDiv);  // Append to body instead of analysisContent

            const acceptBtn = promptDiv.querySelector('.accept-btn');
            const rejectBtn = promptDiv.querySelector('.reject-btn');

            const cleanup = () => {
                promptDiv.style.opacity = '0';
                setTimeout(() => promptDiv.remove(), 300);
            };

            acceptBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            rejectBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Fade in effect
            setTimeout(() => promptDiv.style.opacity = '1', 0);
        });
    }

    analyzeBtn.addEventListener('click', async function() {
        const context = textarea.value.trim();
        if (!context) return;

        try {
            resultsSection.style.display = 'block';
            createProgressBar();
            analysisContent.innerHTML = '';

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

            // Process steps with overlapping requests
            let formatPromise = null;
            for (const step of steps) {
                currentStep = steps.indexOf(step);
                createProgressBar();
                
                // Wait for previous formatting to complete if it exists
                if (formatPromise) {
                    const formattedResult = await formatPromise;
                    addTab(steps[currentStep - 1], formattedResult);
                    completedSteps.push(steps[currentStep - 1]);
                    createProgressBar();
                }

                // Start processing next step
                const result = await processStep(step);
                formatPromise = Promise.resolve(result);
            }

            // Handle the last step
            if (formatPromise) {
                const formattedResult = await formatPromise;
                addTab(steps[steps.length - 1], formattedResult);
                completedSteps.push(steps[steps.length - 1]);
                createProgressBar();
            }

            // After completing main steps, offer optional steps
            for (const optionalStep of optionalSteps) {
                const shouldProceed = await createOptionalStepPrompt(optionalStep);
                
                if (shouldProceed) {
                    // Add the step to the progress bar immediately after accepting
                    steps.push(optionalStep);  // Add to total steps
                    currentStep = steps.length - 1;
                    createProgressBar();  // Update progress bar with new step
                    
                    const result = await processStep(optionalStep);
                    completedSteps.push(optionalStep);
                    addTab(optionalStep, result);
                    createProgressBar();  // Update progress bar to show completion
                }
            }

        } catch (error) {
            console.error('Analysis error:', error);
            analysisContent.innerHTML = `<div class="error">Error during analysis: ${error.message}</div>`;
        }
    });
});
