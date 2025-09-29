import { co2 } from "@tgwf/co2";

/**
 * Get the URL of the currently active browser tab
 */
async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab.url;
}

// Get current page URL when extension loads
let urlName = await getCurrentTab();
console.log(urlName);

/**
 * Main function to fetch PageSpeed data and calculate carbon emissions
 * Displays loading progress through multiple stages, then shows final results
 */
const fetchPageSpeed = async () => {
	try {
		// STAGE 1: Display initial loading screen with checklist
		document.body.innerHTML = `
		<div class="loading-container">
			<h1> 
				<img src="https://upload.wikimedia.org/wikipedia/commons/7/7f/Rotating_earth_animated_transparent.gif" width="24" height="24" style="vertical-align: middle;"> 	Carbon Footprint
			</h1>
				<div class="loading-container">
					<h3>RUNNING ANALYSIS</h3>
					<div class="checklist">
						<div class="check-item" id="step1">Fetching website data...</div>
						<div class="check-item" id="step2">Calculating emissions</div>
						<div class="check-item" id="step3">Checking green hosting</div>
					</div>
				</div>
		</div>
			`;

		await new Promise((resolve) => setTimeout(resolve, 100));

		// Mark first step as active and in progress
		document.getElementById("step1").className = "check-item completed";
		document.getElementById("step1").textContent = "✓ Fetching website data";

		document.getElementById("step2").className = "check-item active";
		document.getElementById("step2").textContent = "Calculating emissions...";

		// Extract domain for green hosting check
		const domain = new URL(urlName).hostname;

		// STAGE 2: Fetch data from both APIs in parallel
		// - PageSpeed API via backend server (keeps API key secure)
		// - Green Web Foundation API directly (public API)
		const [response, greenResponse] = await Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/api/pagespeed?url=${urlName}`),
			fetch(
				`https://api.thegreenwebfoundation.org/api/v3/greencheck/${domain}`
			),
		]);

		// Check if PageSpeed request succeeded
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// Update UI to show step 2 complete
		document.getElementById("step2").className = "check-item completed";
		document.getElementById("step2").textContent = "✓ Calculating emissions";
		document.getElementById("step3").className = "check-item active";
		document.getElementById("step3").textContent = "Checking green hosting...";

		// Parse JSON responses from both APIs
		const result = await response.json();
		const greenData = await greenResponse.json();

		// STAGE 3: Extract data and calculate CO2 emissions
		// Get total bytes transferred from Lighthouse audit
		const audits = result.lighthouseResult.audits;
		const totalByteWeight = audits["total-byte-weight"].numericValue;
		console.log("Total Byte Weight:", totalByteWeight);

		// Calculate CO2 emissions using the OneByte model from @tgwf/co2 library
		const co2Emission = new co2({ model: "1byte" });
		const totalCO2 = co2Emission.perByte(totalByteWeight);

		// Calculate annual impact if user visits this site daily
		const annualImpact = (totalCO2 * 365).toFixed(0);

		await new Promise((resolve) => setTimeout(resolve, 100));

		// Mark final step as complete
		document.getElementById("step3").className = "check-item completed";
		document.getElementById("step3").textContent = "✓ Checking green hosting";

		await new Promise((resolve) => setTimeout(resolve, 100));

		// STAGE 4: Display final results in card layout
		document.body.innerHTML = `
		<div class="results-container">
			<h1>🌍 Carbon Footprint</h1>
			
			<!-- Single visit CO2 emissions -->
			<div class="result-card">
			<strong>This Visit</strong>
			<div class="result-value">${totalCO2.toFixed(2)}g CO2</div>
			</div>
			
			<!-- Projected annual emissions if visited daily -->
			<div class="result-card">
			<strong>Annual Impact (Daily Visits)</strong>
			<div class="result-value">${annualImpact}g CO2</div>
			</div>
			
			<!-- Green hosting status with color coding -->
			<div class="result-card ${
				greenData.green ? "green-hosting" : "not-green-hosting"
			}">
			<strong>${domain}</strong>
			<div class="result-value">${
				greenData.green
					? "✓  Hosted on green energy"
					: "✗  Not hosted on green energy"
			}</div>
			</div>
		</div>
		`;
	} catch (error) {
		// Handle any errors during fetch or processing
		console.error("Fetching PageSpeed Insights failed:", error);
		document.body.textContent = `Failed to fetch PageSpeed data. Check the console for errors.`;
	}
};

// Execute main function when extension popup opens
await fetchPageSpeed();
