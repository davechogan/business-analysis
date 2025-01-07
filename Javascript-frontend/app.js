document.addEventListener('DOMContentLoaded', function() {
    // Core DOM elements
    const textarea = document.getElementById('business-context');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const progressBar = document.getElementById('progress-bar');
    const analysisContent = document.getElementById('analysis-content');

    // Analysis steps configuration
    const steps = ['strategy', 'competitors', 'revenue', 'cost', 'ROI'];
    const optionalSteps = ['justification', 'deck'];
    let currentStep = 0;
    let completedSteps = [];

    // Dark theme detection
    function initializeTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.body.classList.toggle('dark-theme', e.matches);
        });
    }

    // Enable/disable analyze button based on textarea content
    textarea.addEventListener('input', function() {
        analyzeBtn.disabled = !this.value.trim();
    });

    // Tabs container creation
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
        tab.textContent = step === 'ROI' ? 'ROI' : step.charAt(0).toUpperCase() + step.slice(1);
        tabsList.appendChild(tab);

        // Parse content
        let formattedContent;
        try {
            formattedContent = typeof content === 'string' ? JSON.parse(content) : content;
            console.log('Parsed content:', formattedContent);
        } catch (e) {
            console.error('Error parsing content:', e);
            formattedContent = { sections: [{ title: 'Raw Output', content: content }] };
        }

        // Create tab content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'tab-pane';
        
        let htmlContent = `
            <div class="analysis-card">
                <h2>${step.charAt(0).toUpperCase() + step.slice(1)} Analysis</h2>
                <div class="markdown-content">
        `;

        // Add sections
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
            htmlContent += `
                <div class="analysis-section">
                    <h3>Analysis</h3>
                    ${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                </div>
            `;
        }

        // Add key points
        if (formattedContent.keyPoints?.length > 0) {
            htmlContent += `
                <div class="analysis-section">
                    <h3>Key Points</h3>
                    <ul>
                        ${formattedContent.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Add recommendations
        if (formattedContent.recommendations?.length > 0) {
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

        // Show current tab
        document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        contentDiv.style.display = 'block';
        tab.classList.add('active');

        // Tab click handler
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            contentDiv.style.display = 'block';
            tab.classList.add('active');
        });
    }

    // Progress visualization
    function createProgressBar() {
        const container = progressBar.getBoundingClientRect();
        const width = container.width;
        const height = 100;
        const padding = Math.max(40, width * 0.05);
        
        progressBar.innerHTML = '';

        const uniqueSteps = [...new Set([...steps, ...completedSteps.filter(step => optionalSteps.includes(step))])];
        const stepWidth = (width - (2 * padding)) / (uniqueSteps.length - 1 || 1);

        const svg = d3.select(progressBar)
            .append('svg')
            .attr('width', '100%')
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Progress line
        svg.append('line')
            .attr('x1', padding)
            .attr('y1', height / 2)
            .attr('x2', width - padding)
            .attr('y2', height / 2)
            .style('stroke', '#ccc')
            .style('stroke-width', 2);

        // Step circles and labels
        uniqueSteps.forEach((step, index) => {
            const x = padding + (stepWidth * index);
            const g = svg.append('g')
                .attr('class', 'step-group')
                .attr('transform', `translate(${x}, ${height/2})`);
            
            g.append('circle')
                .attr('r', 10)
                .style('fill', getStepColor(step))
                .style('stroke', '#666')
                .style('stroke-width', 2);

            if (currentStep === index && !completedSteps.includes(step)) {
                const loadingCircle = g.append('circle')
                    .attr('class', 'loading-indicator')
                    .attr('r', 15)
                    .style('fill', 'none')
                    .style('stroke', '#2196F3')
                    .style('stroke-width', 2)
                    .style('stroke-dasharray', '10 5');

                loadingCircle.append('animateTransform')
                    .attr('attributeName', 'transform')
                    .attr('type', 'rotate')
                    .attr('from', '0 0 0')
                    .attr('to', '360 0 0')
                    .attr('dur', '1.5s')
                    .attr('repeatCount', 'indefinite');
            }

            const label = step === 'ROI' ? 'ROI' : step.charAt(0).toUpperCase() + step.slice(1);
            svg.append('text')
                .attr('x', x)
                .attr('y', height / 2 + 25)
                .attr('text-anchor', 'middle')
                .attr('class', 'step-label')
                .text(label)
                .style('font-size', '12px')
                .style('font-weight', currentStep === index ? 'bold' : 'normal')
                .style('fill', currentStep === index ? '#2196F3' : '#666');
        });

        window.addEventListener('resize', debounce(() => createProgressBar(), 250));
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function getStepColor(step) {
        if (completedSteps.includes(step)) return '#4CAF50';
        if (steps.indexOf(step) === currentStep || 
            (optionalSteps.includes(step) && completedSteps.length === steps.length + optionalSteps.indexOf(step))) {
            return '#2196F3';
        }
        return '#fff';
    }

    // Process analysis step
    async function processStep(step) {
        try {
            const processPromise = fetch(`http://localhost:5000/process/${step}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            }).then(r => r.json());

            const data = await processPromise;
            console.log(`Raw ${step} data:`, data);

            const formatPromise = fetch(`http://localhost:5000/format/${step}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: data.result }),
            }).then(response => {
                if (!response.ok) throw new Error(`Formatting failed: ${response.statusText}`);
                return response.json();
            });

            const formattedData = await formatPromise;
            console.log(`Formatted ${step} data:`, formattedData);
            return formattedData;
        } catch (error) {
            console.error(`Error processing step ${step}:`, error);
            throw error;
        }
    }

    // Optional step prompt
    function createOptionalStepPrompt(step) {
        return new Promise((resolve) => {
            const promptDiv = document.createElement('div');
            promptDiv.className = 'optional-step-prompt';
            
            // Different prompt text based on step type
            const promptContent = step === 'deck' ? {
                title: 'Create Investor Deck?',
                description: 'Would you like to generate an investor pitch deck based on the analysis?'
            } : {
                title: 'Create Business Justification Plan?',
                description: 'Would you like to generate a detailed business justification plan based on the analysis?'
            };

            promptDiv.innerHTML = `
                <div class="prompt-card">
                    <h3>${promptContent.title}</h3>
                    <p>${promptContent.description}</p>
                    <div class="prompt-buttons">
                        <button class="accept-btn">Yes, generate it</button>
                        <button class="reject-btn">No, skip this</button>
                    </div>
                </div>
            `;

            document.body.appendChild(promptDiv);

            const cleanup = () => {
                promptDiv.style.opacity = '0';
                setTimeout(() => promptDiv.remove(), 300);
            };

            promptDiv.querySelector('.accept-btn').addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            promptDiv.querySelector('.reject-btn').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            setTimeout(() => promptDiv.style.opacity = '1', 0);
        });
    }

    // Main analysis handler
    analyzeBtn.addEventListener('click', async function() {
        const context = textarea.value.trim();
        if (!context) return;

        try {
            // Disable button and update UI
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('processing');
            analyzeBtn.textContent = 'Processing...';

            resultsSection.style.display = 'block';
            createProgressBar();
            analysisContent.innerHTML = '';

            const contextResponse = await fetch('http://localhost:5000/submit_context', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ custom_context: context }),
            });

            if (!contextResponse.ok) throw new Error('Failed to submit context');

            let formatPromise = null;
            for (const step of steps) {
                currentStep = steps.indexOf(step);
                createProgressBar();
                
                if (formatPromise) {
                    const formattedResult = await formatPromise;
                    addTab(steps[currentStep - 1], formattedResult);
                    completedSteps.push(steps[currentStep - 1]);
                    createProgressBar();
                }

                const result = await processStep(step);
                formatPromise = Promise.resolve(result);
            }

            if (formatPromise) {
                const formattedResult = await formatPromise;
                addTab(steps[steps.length - 1], formattedResult);
                completedSteps.push(steps[steps.length - 1]);
                createProgressBar();
            }

            // Handle optional steps
            for (const optionalStep of optionalSteps) {
                if (!completedSteps.includes(optionalStep)) {
                    const shouldProceed = await createOptionalStepPrompt(optionalStep);
                    
                    if (shouldProceed) {
                        currentStep = steps.length + optionalSteps.indexOf(optionalStep);
                        if (!steps.includes(optionalStep)) steps.push(optionalStep);
                        createProgressBar();
                        
                        const result = await processStep(optionalStep);
                        if (!completedSteps.includes(optionalStep)) completedSteps.push(optionalStep);
                        addTab(optionalStep, result);
                        createProgressBar();
                    }
                }
            }

        } catch (error) {
            console.error('Analysis error:', error);
            analysisContent.innerHTML = `<div class="error">Error during analysis: ${error.message}</div>`;
            // Only re-enable button on error
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('processing');
            analyzeBtn.textContent = 'Analyze';
        } finally {
            if (!analysisContent.querySelector('.error')) {
                // Keep button disabled on success
                analyzeBtn.disabled = true;
                analyzeBtn.textContent = 'Analysis Complete';
            }
        }
    });

    // Initialize
    initializeTheme();
});
