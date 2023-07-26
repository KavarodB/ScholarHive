import axios from "axios";

const serverUrl = "http://localhost:3000";

let completedRequests = 0;
const postRoute = "/author/error";
const totalRequests = 96;
const payload = {
	authorname: "Wanda Pratt",
};

// Add an interceptor to measure request time
axios.interceptors.request.use(
	(config) => {
		config.metadata = { startTime: new Date() };
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		response.config.metadata.endTime = new Date();
		response.duration =
			response.config.metadata.endTime - response.config.metadata.startTime;
		return response;
	},
	(error) => {
		error.config.metadata.endTime = new Date();
		error.duration =
			error.config.metadata.endTime - error.config.metadata.startTime;
		return Promise.reject(error);
	}
);

function sendRequest() {
	const startTime = new Date();
	const postData = JSON.stringify(payload);

	axios
		.post(`${serverUrl}${postRoute}`, postData, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((response) => {
			const endTime = new Date();
			completedRequests++;
			console.log(
				`Request ${completedRequests}/${totalRequests} - Status: ${response.status}, Duration: ${response.duration}ms`
			);
			if (completedRequests === totalRequests) {
				console.log("Load test complete!");
			}
		})
		.catch((error) => {
			completedRequests++;
			console.error(
				`Error in request: ${error.message}, Duration: ${error.duration}ms`
			);
			if (completedRequests === totalRequests) {
				console.log("Load test complete!");
			}
		});
}

for (let i = 0; i < totalRequests; i++) {
	sendRequest();
}
