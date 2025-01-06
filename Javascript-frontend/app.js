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
        // Calculate dimensions based on container
        const container = progressBar.getBoundingClientRect();
        const width = container.width;
        const height = 100;
        const padding = Math.max(40, width * 0.05); // Responsive padding, minimum 40px
        const labelPadding = 10; // Extra padding for labels

        // Clear any existing content
        progressBar.innerHTML = '';

        // Get total steps without duplicates
        const uniqueSteps = [...new Set([...steps, ...completedSteps.filter(step => optionalSteps.includes(step))])];
        
        // Use uniqueSteps instead of totalSteps for the rest of the function
        const stepWidth = (width - (2 * padding)) / (uniqueSteps.length - 1 || 1);

        // Create SVG with viewBox for responsiveness
        const svg = d3.select(progressBar)
            .append('svg')
            .attr('width', '100%')
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Create progress line
        svg.append('line')
            .attr('x1', padding)
            .attr('y1', height / 2)
            .attr('x2', width - padding)
            .attr('y2', height / 2)
            .style('stroke', '#ccc')
            .style('stroke-width', 2);

        // Create step circles and labels
        uniqueSteps.forEach((step, index) => {
            const x = padding + (stepWidth * index);
            const g = svg.append('g')
                .attr('class', 'step-group')
                .attr('transform', `translate(${x}, ${height/2})`);
            
            // Main circle
            g.append('circle')
                .attr('r', 10)
                .style('fill', getStepColor(step))
                .style('stroke', '#666')
                .style('stroke-width', 2);

            // Add loading indicator for current step
            if (currentStep === index && !completedSteps.includes(step)) {
                const loadingCircle = g.append('circle')
                    .attr('class', 'loading-indicator')
                    .attr('r', 15)
                    .style('fill', 'none')
                    .style('stroke', '#2196F3')
                    .style('stroke-width', 2)
                    .style('stroke-dasharray', '10 5');

                // Add rotation animation
                loadingCircle.append('animateTransform')
                    .attr('attributeName', 'transform')
                    .attr('type', 'rotate')
                    .attr('from', '0 0 0')
                    .attr('to', '360 0 0')
                    .attr('dur', '1.5s')
                    .attr('repeatCount', 'indefinite');
            }

            // Label with background for better readability
            const label = step.charAt(0).toUpperCase() + step.slice(1);
            
            // Add label with better positioning
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

        // Add resize handler
        window.addEventListener('resize', debounce(() => createProgressBar(), 250));
    }

    // Debounce function to prevent too many resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
            // Disable button and show loading state
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('processing');
            analyzeBtn.textContent = 'Processing...';

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
                if (!completedSteps.includes(optionalStep)) {  // Only offer if not already completed
                    const shouldProceed = await createOptionalStepPrompt(optionalStep);
                    
                    if (shouldProceed) {
                        currentStep = steps.length + optionalSteps.indexOf(optionalStep);
                        if (!steps.includes(optionalStep)) {  // Only add if not already in steps
                            steps.push(optionalStep);
                        }
                        createProgressBar();
                        
                        const result = await processStep(optionalStep);
                        if (!completedSteps.includes(optionalStep)) {  // Only add if not already completed
                            completedSteps.push(optionalStep);
                        }
                        addTab(optionalStep, result);
                        createProgressBar();
                    }
                }
            }

        } catch (error) {
            console.error('Analysis error:', error);
            analysisContent.innerHTML = `<div class="error">Error during analysis: ${error.message}</div>`;
        } finally {
            // Only re-enable button if there was an error
            if (analysisContent.querySelector('.error')) {
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('processing');
                analyzeBtn.textContent = 'Analyze';
            } else {
                // Keep button disabled after successful analysis
                analyzeBtn.textContent = 'Analysis Complete';
            }
        }
    });

    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
    }

    function markVisualizableCards() {
        const cards = document.querySelectorAll('.analysis-card');
        cards.forEach(card => {
            if (hasVisualizableData(card)) {
                card.classList.add('has-visualization');
                card.innerHTML += '<span class="visualization-indicator">📊</span>';
                card.addEventListener('click', () => showVisualization(card));
            }
        });
    }

    // Mock analysis data
    const mockAnalysisData = {
        deck: [
            {
                id: 'slide-1',
                title: 'Business Overview',
                content: 'Revolutionary AI-powered business analysis platform',
                visualizationType: 'summary',
                keyPoints: [
                    'Market size: $50B by 2025',
                    'Current traction: 1000+ beta users',
                    'Growth rate: 25% month-over-month'
                ]
            },
            {
                id: 'slide-2',
                title: 'Market Opportunity',
                content: 'Targeting the rapidly growing AI analytics market',
                visualizationType: 'chart',
                data: {
                    labels: ['2021', '2022', '2023', '2024', '2025'],
                    values: [10, 20, 35, 42, 50],
                    type: 'bar'
                }
            },
            {
                id: 'slide-3',
                title: 'Financial Projections',
                content: 'Strong growth trajectory with positive unit economics',
                visualizationType: 'graph',
                data: {
                    revenue: [1, 2, 5, 10, 20],
                    costs: [2, 3, 4, 6, 8],
                    profit: [-1, -1, 1, 4, 12]
                }
            }
        ]
    };

    // Function to create deck slides
    function createDeckSlides() {
        console.log('Creating deck slides'); // Debug log
        const deckContent = document.querySelector('.tab-content') || document.getElementById('deck-content');
        if (!deckContent) {
            console.error('Deck content container not found');
            return;
        }
        
        // Clear existing content
        deckContent.innerHTML = '<h2>Investor Deck</h2>';
        
        // Add mock slides
        mockAnalysisData.deck.forEach(slide => {
            console.log('Creating slide:', slide.title); // Debug log
            const slideCard = document.createElement('div');
            slideCard.className = 'analysis-card deck-card';
            slideCard.id = slide.id;
            slideCard.draggable = true;
            
            slideCard.innerHTML = `
                <h3 class="card-title">${slide.title}</h3>
                <div class="card-content">
                    <p>${slide.content}</p>
                    <div class="visualization-data" data-type="${slide.visualizationType}">
                        ${getVisualizationPreview(slide)}
                    </div>
                </div>
            `;
            
            deckContent.appendChild(slideCard);
        });
        
        initializeDragAndDrop();
    }

    // Function to show visualization preview
    function getVisualizationPreview(slide) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'visualization-preview';
        
        switch(slide.visualizationType) {
            case 'chart':
                previewDiv.innerHTML = `
                    <div class="chart-preview">
                        <span class="visualization-icon">📊</span>
                        <span>Click to view market size chart</span>
                    </div>
                `;
                break;
            case 'graph':
                previewDiv.innerHTML = `
                    <div class="chart-preview">
                        <span class="visualization-icon">📈</span>
                        <span>Click to view financial projections</span>
                    </div>
                `;
                break;
            default:
                previewDiv.innerHTML = `
                    <div class="summary-preview">
                        <ul>
                            ${slide.keyPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                `;
        }
        
        return previewDiv.outerHTML;
    }

    // Initialize drag and drop
    function initializeDragAndDrop() {
        const cards = document.querySelectorAll('.deck-card');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('drop', handleDrop);
        });
    }

    // Drag and drop handlers
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedId);
        const dropTarget = e.target.closest('.deck-card');
        
        if (draggedElement && dropTarget) {
            const container = dropTarget.parentNode;
            const draggedRect = draggedElement.getBoundingClientRect();
            const dropTargetRect = dropTarget.getBoundingClientRect();
            
            if (draggedRect.top < dropTargetRect.top) {
                container.insertBefore(draggedElement, dropTarget.nextSibling);
            } else {
                container.insertBefore(draggedElement, dropTarget);
            }
        }
        
        document.querySelector('.dragging')?.classList.remove('dragging');
    }

    // Add some additional styles for drag and drop
    const additionalStyles = `
        .deck-card.dragging {
            opacity: 0.5;
            cursor: move;
        }
        
        .visualization-preview {
            margin-top: 15px;
            padding: 15px;
            background: var(--surface-color);
            border-radius: 4px;
        }
        
        .chart-preview {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }
        
        .visualization-icon {
            font-size: 1.5rem;
        }
    `;

    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);

    // Initialize deck when tab is shown
    const deckTab = document.querySelector('.tab:last-child') || document.querySelector('[data-tab="deck"]');
    if (deckTab) {
        deckTab.addEventListener('click', () => {
            console.log('Deck tab clicked'); // Debug log
            createDeckSlides();
        });
    }

    // Add CSS for button states
    const buttonStyles = `
        button#analyze-btn.processing {
            cursor: not-allowed;
            opacity: 0.8;
        }

        button#analyze-btn:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }
    `;

    // Add the styles to the document
    const btnStyleSheet = document.createElement('style');
    btnStyleSheet.textContent = buttonStyles;
    document.head.appendChild(btnStyleSheet);

    // Tab switching functionality
    function setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const targetId = tab.getAttribute('data-tab') + '-content';
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                    
                    // If it's the deck tab, create the slides
                    if (targetId === 'deck-content') {
                        createDeckSlides();
                    }
                }
            });
        });
    }

    // Initialize when document is ready
    document.addEventListener('DOMContentLoaded', () => {
        setupTabs();
    });
});
