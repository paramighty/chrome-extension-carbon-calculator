const express = require("express");
const cors = require("cors");

const app = express();

app.use(
	cors({
		origin: "*", // Allow all origins for testing
		methods: ["GET"],
	})
);
const API_KEY = process.env.PAGESPEED_API_KEY;
if (!API_KEY) {
	console.error("ERROR: PAGESPEED_API_KEY environment variable not set");
	process.exit(1);
}

app.get("/api/pagespeed", async (req, res) => {
	const url = req.query.url;

	if (!url) {
		return res.status(400).json({ error: "URL required" });
	}

	try {
		const response = await fetch(
			`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${API_KEY}`
		);
		if (!response.ok) {
			const errorText = await response.text();

			return res
				.status(500)
				.json({ error: "PageSpeed API failed", details: errorText });
		}
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to fetch data", message: error.message });
	}
});
app.listen(3000, () => {
	console.log("Server running on port 3000");
});
