// Currency formatting (aligned with BUC Calculator)
function formatMoney(amount) {
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Calculate monthly installment (EMI)
function calculateEMI(principal, rate, tenure) {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    if (monthlyRate === 0) return principal / months;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
}

// Calculate loan balance after one year
function calculateLoanBalanceAfterYear(principal, rate, tenure, monthlyPayment) {
    const monthlyRate = rate / 12 / 100;
    let balance = principal;
    
    for (let i = 0; i < 12; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
    }
    
    return balance;
}

// Calculate total interest paid in the first year
function calculateTotalInterestFirstYear(principal, rate, tenure, monthlyPayment) {
    const monthlyRate = rate / 12 / 100;
    let balance = principal;
    let totalInterest = 0;
    
    for (let i = 0; i < 12; i++) {
        const interestPayment = balance * monthlyRate;
        totalInterest += interestPayment;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
    }
    
    return totalInterest;
}

// Validation functions (aligned with BUC Calculator)
function validateCurrentLoanAmount(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid loan amount";
    }
    if (value < 100000) {
        return "Current loan amount must be at least S$100,000";
    }
    return null;
}

function validateCurrentTenure(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid tenure";
    }
    if (value < 1) {
        return "Tenure must be at least 1 year";
    }
    if (value > 35) {
        return "Tenure cannot exceed 35 years";
    }
    return null;
}

function validateCurrentInterestRate(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid interest rate";
    }
    if (value < 0.1) {
        return "Interest rate must be at least 0.1%";
    }
    if (value > 10) {
        return "Interest rate cannot exceed 10%";
    }
    return null;
}

function validateNewLoanAmount(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid loan amount";
    }
    if (value < 50000) {
        return "New loan amount must be at least S$50,000";
    }
    return null;
}

function validateNewTenure(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid tenure";
    }
    if (value < 5) {
        return "New tenure must be at least 5 years";
    }
    if (value > 35) {
        return "New tenure cannot exceed 35 years";
    }
    return null;
}

function validateNewInterestRate(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid interest rate";
    }
    if (value < 0.1) {
        return "New interest rate must be at least 0.1%";
    }
    if (value > 10) {
        return "Interest rate cannot exceed 10%";
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    // SORA rates and spread (aligned with BUC Calculator)
    const threeMonthSORA = 2.3778; // Placeholder: Update with actual 3M SORA rate
    const spread = 1;
    const spreadRange = "1.00% - 1.50%";
    const exampleInterest = (threeMonthSORA + spread).toFixed(2); // e.g., 3.39

    // Set placeholder for current interest rate (no prefill)
    const currentInterestInput = document.getElementById('currentInterestRate');
    currentInterestInput.value = ''; // No prefilled value
    currentInterestInput.placeholder = `E.g ${exampleInterest}`; // Show example like 3.39

    // Set new interest rate input (no prefill, keep existing placeholder)
    const newInterestInput = document.getElementById('newInterestRate');
    newInterestInput.value = ''; // No prefilled value

    // Set interest rate note for current interest only
    document.getElementById('currentInterestNote').textContent = `Current 3M SORA: ${threeMonthSORA.toFixed(2)}%, Spread range: ${spreadRange}`;

    // Input elements
    const inputs = {
        currentLoanAmount: document.getElementById('currentLoanAmount'),
        currentTenure: document.getElementById('currentTenure'),
        currentInterestRate: currentInterestInput,
        newLoanAmount: document.getElementById('newLoanAmount'),
        newTenure: document.getElementById('newTenure'),
        newInterestRate: newInterestInput
    };

    // Error elements
    const errors = {
        currentLoanAmount: document.getElementById('currentLoanAmountError'),
        currentTenure: document.getElementById('currentTenureError'),
        currentInterestRate: document.getElementById('currentInterestRateError'),
        newLoanAmount: document.getElementById('newLoanAmountError'),
        newTenure: document.getElementById('newTenureError'),
        newInterestRate: document.getElementById('newInterestRateError')
    };

    // Label elements for error state
    const labels = {
        currentLoanAmount: document.querySelector('label[for="currentLoanAmount"]'),
        currentTenure: document.querySelector('label[for="currentTenure"]'),
        currentInterestRate: document.querySelector('label[for="currentInterestRate"]'),
        newLoanAmount: document.querySelector('label[for="newLoanAmount"]'),
        newTenure: document.querySelector('label[for="newTenure"]'),
        newInterestRate: document.querySelector('label[for="newInterestRate"]')
    };

    // Validation event listeners
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', function() {
            const value = parseFloat(this.value);
            let error = null;

            switch (key) {
                case 'currentLoanAmount':
                    error = validateCurrentLoanAmount(value);
                    break;
                case 'currentTenure':
                    error = validateCurrentTenure(value);
                    break;
                case 'currentInterestRate':
                    error = validateCurrentInterestRate(value);
                    break;
                case 'newLoanAmount':
                    error = validateNewLoanAmount(value);
                    break;
                case 'newTenure':
                    error = validateNewTenure(value);
                    break;
                case 'newInterestRate':
                    error = validateNewInterestRate(value);
                    break;
            }

            if (error) {
                errors[key].textContent = error;
                errors[key].style.display = 'block';
                labels[key].classList.add('error');
            } else {
                errors[key].style.display = 'none';
                labels[key].classList.remove('error');
            }
        });

        inputs[key].addEventListener('blur', function() {
            if (!this.value) {
                errors[key].textContent = "This field is required";
                errors[key].style.display = 'block';
                labels[key].classList.add('error');
            }
        });
    });
});

function calculate() {
    const currentLoan = parseFloat(document.getElementById('currentLoanAmount').value);
    const currentTenure = parseFloat(document.getElementById('currentTenure').value);
    const currentInterest = parseFloat(document.getElementById('currentInterestRate').value);
    const newLoan = parseFloat(document.getElementById('newLoanAmount').value);
    const newTenure = parseFloat(document.getElementById('newTenure').value);
    const newInterest = parseFloat(document.getElementById('newInterestRate').value);
    const errorBox = document.getElementById('error');
    const results = document.getElementById('results');

    // Validate all inputs
    const errors = [
        validateCurrentLoanAmount(currentLoan),
        validateCurrentTenure(currentTenure),
        validateCurrentInterestRate(currentInterest),
        validateNewLoanAmount(newLoan),
        validateNewTenure(newTenure),
        validateNewInterestRate(newInterest)
    ].filter(error => error);

    if (errors.length > 0) {
        errorBox.style.display = 'block';
        errorBox.innerText = errors.join(' | ');
        return;
    }

    errorBox.style.display = 'none';
    results.innerHTML = "";
    
    // Create header with icon
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'results-header';
    
    const resultsIcon = document.createElement('div');
    resultsIcon.className = 'results-icon';
    resultsIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-5h-4v7h2zm-2-7h4V5h-4z"/>
        </svg>
    `;
    
    const resultsTitle = document.createElement('h2');
    resultsTitle.className = 'results-title';
    resultsTitle.textContent = 'Refinancing Results';
    
    resultsHeader.appendChild(resultsIcon);
    resultsHeader.appendChild(resultsTitle);
    results.appendChild(resultsHeader);

    // Calculate values
    const currentMonthlyPayment = calculateEMI(currentLoan, currentInterest, currentTenure);
    const newMonthlyPayment = calculateEMI(newLoan, newInterest, newTenure);
    const currentLoanAfterYear = calculateLoanBalanceAfterYear(currentLoan, currentInterest, currentTenure, currentMonthlyPayment);
    const newLoanAfterYear = calculateLoanBalanceAfterYear(newLoan, newInterest, newTenure, newMonthlyPayment);
    const currentYearInterest = calculateTotalInterestFirstYear(currentLoan, currentInterest, currentTenure, currentMonthlyPayment);
    const newYearInterest = calculateTotalInterestFirstYear(newLoan, newInterest, newTenure, newMonthlyPayment);

    // Calculate differences
    const interestDifference = newYearInterest - currentYearInterest;
    const principalDifference = newLoanAfterYear - currentLoanAfterYear;
    const monthlyInstalmentDifference = newMonthlyPayment - currentMonthlyPayment;
    const annualInstalmentDifference = monthlyInstalmentDifference * 12;

    // Impact After 1 Year Heading
    const impactHeading = document.createElement('h3');
    impactHeading.className = 'breakdown-title';
    impactHeading.textContent = 'Impact After 1 Year';
    results.appendChild(impactHeading);

    // Side-by-Side Breakdown
    const sideBySide = document.createElement('div');
    sideBySide.className = 'side-by-side';

    // Current Mortgage Breakdown
    const currentBreakdown = document.createElement('div');
    currentBreakdown.className = 'column';
    const currentContainer = document.createElement('div');
    currentContainer.className = 'breakdown-container current';
    currentContainer.innerHTML = `
        <div class="breakdown-icon">
            <img src="https://loan-eligibility.vercel.app/image/TLC_Square.png" alt="TLC Logo" style="width: 100%; height: 100%;">
        </div>
        <h4 class="breakdown-subheading current">Current Mortgage</h4>
        <div class="breakdown-row">
            <span class="breakdown-label">Current Loan Amount</span>
            <span class="breakdown-value neutral">${formatMoney(currentLoan)}</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Current Tenure</span>
            <span class="breakdown-value neutral">${currentTenure} years</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Current Interest Rate</span>
            <span class="breakdown-value neutral">${currentInterest.toFixed(2)}%</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Monthly Instalment</span>
            <span class="breakdown-value neutral">${formatMoney(currentMonthlyPayment)}</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Total Interest Paid</span>
            <span class="breakdown-value neutral">${formatMoney(currentYearInterest)}</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Balance Loan after 1 Year</span>
            <span class="breakdown-value neutral">${formatMoney(currentLoanAfterYear)}</span>
        </div>
        <div class="breakdown-summary neutral">
            Monthly Payment: ${formatMoney(currentMonthlyPayment)}
        </div>
    `;
    currentBreakdown.appendChild(currentContainer);
    sideBySide.appendChild(currentBreakdown);

    // Refinanced Mortgage Breakdown
    const newBreakdown = document.createElement('div');
    newBreakdown.className = 'column';
    const newContainer = document.createElement('div');
    newContainer.className = 'breakdown-container refinanced';
    // Determine classes for conditional coloring
    const interestRateClass = newInterest < currentInterest ? 'success' : newInterest > currentInterest ? 'error' : 'neutral';
    const monthlyPaymentClass = newMonthlyPayment < currentMonthlyPayment ? 'success' : newMonthlyPayment > currentMonthlyPayment ? 'error' : 'neutral';
    newContainer.innerHTML = `
        <div class="breakdown-icon">
            <img src="https://loan-eligibility.vercel.app/image/TLC_Square.png" alt="TLC Logo" style="width: 100%; height: 100%;">
        </div>
        <h4 class="breakdown-subheading refinanced">Refinanced Mortgage</h4>
        <div class="breakdown-row">
            <span class="breakdown-label">New Loan Amount</span>
            <span class="breakdown-value neutral">${formatMoney(newLoan)}</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">New Tenure</span>
            <span class="breakdown-value neutral">${newTenure} years</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">New Interest Rate</span>
            <span class="breakdown-value ${interestRateClass}">${newInterest.toFixed(2)}%</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Monthly Instalment</span>
            <span class="breakdown-value neutral">${formatMoney(newMonthlyPayment)}</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Total Interest Paid</span>
            <span class="breakdown-value neutral">${formatMoney(newYearInterest)}</span>
        </div>
        <div class="breakdown-row">
            <span class="breakdown-label">Balance Loan after 1 Year</span>
            <span class="breakdown-value neutral">${formatMoney(newLoanAfterYear)}</span>
        </div>
        <div class="breakdown-summary neutral">
            Monthly Payment: <span class="summary-value ${monthlyPaymentClass}">${formatMoney(newMonthlyPayment)}</span>
        </div>
    `;
    newBreakdown.appendChild(newContainer);
    sideBySide.appendChild(newBreakdown);
    results.appendChild(sideBySide);

    // Comparison Container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-container';
    comparisonContainer.innerHTML = `
        <h3 class="comparison-title">1 Year Comparison Summary</h3>
        <div class="comparison-row">
            <span class="comparison-label">Interest Savings Difference</span>
            <span class="comparison-value ${interestDifference < 0 ? 'positive' : interestDifference > 0 ? 'negative' : 'neutral'}">${formatMoney(Math.abs(interestDifference))}</span>
        </div>
        <div class="comparison-row">
            <span class="comparison-label">Principal Balance Difference</span>
            <span class="comparison-value ${principalDifference < 0 ? 'positive' : principalDifference > 0 ? 'negative' : 'neutral'}">${formatMoney(Math.abs(principalDifference))}</span>
        </div>
        <div class="comparison-row">
            <span class="comparison-label">Monthly Instalment Difference</span>
            <span class="comparison-value ${monthlyInstalmentDifference < 0 ? 'positive' : monthlyInstalmentDifference > 0 ? 'negative' : 'neutral'}">${formatMoney(Math.abs(monthlyInstalmentDifference))}</span>
        </div>
        <div class="comparison-row">
            <span class="comparison-label">Annual Instalment Difference</span>
            <span class="comparison-value ${annualInstalmentDifference < 0 ? 'positive' : annualInstalmentDifference > 0 ? 'negative' : 'neutral'}">${formatMoney(Math.abs(annualInstalmentDifference))}</span>
        </div>
    `;
    results.appendChild(comparisonContainer);

    // Add Disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer';
    disclaimer.textContent = 'Disclaimer from TLC: Figures provided on this page are for illustration purposes and do not constitute as a formal approval from a bank.';
    results.appendChild(disclaimer);
}

// Iframe resizer
document.addEventListener('DOMContentLoaded', function() {
    // Function to send height to parent window with extra padding
    function sendHeight() {
        // Get the document height with extra padding
        // Using Math.max to ensure we use the largest height value from various methods
        const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        ) + 20; // Add 20px padding
        
        window.parent.postMessage({ type: 'setHeight', height: height }, '*');
    }

    // Debounce function to prevent too many resize events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Use debounced version for events that may fire rapidly
    const debouncedSendHeight = debounce(sendHeight, 50);

    // Send height on important events
    const events = ['resize', 'input', 'change', 'click', 'keyup', 'transitionend', 'animationend'];
    events.forEach(event => {
        window.addEventListener(event, debouncedSendHeight);
    });

    // Watch for DOM changes
    const observer = new MutationObserver(debouncedSendHeight);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
        attributeFilter: ['style', 'class', 'id']
    });

    // Handle height requests from parent window
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'requestHeight') {
            sendHeight();
        }
    });

    // Initial height sends at strategic times
    setTimeout(sendHeight, 100); // Quick initial check
    setTimeout(sendHeight, 500); // Secondary check after initial rendering
    
    // Check after all images and resources have loaded
    window.addEventListener('load', function() {
        sendHeight();
        // Additional check slightly after load completes
        setTimeout(sendHeight, 1000);
    });
    
    // Send height when fonts load (if font loading API is available)
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(sendHeight);
    }
});