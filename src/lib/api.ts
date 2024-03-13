const API_URL = process.env.WORDPRESS_API_URL;



/**
 * Fetch API function used for accessing GraphQL.
 * 
 * Note that this function was taken from Next.js's
 * official GitHub repository:
 * https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress
 */
async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {

	// Catch missing API_URL. Required due to type checks.
	if (!API_URL) throw new Error("Missing API_URL.");

	// Set headers.
	const headers = { "Content-Type": "application/json" };

	// WPGraphQL Plugin must be enabled.
	const res = await fetch(API_URL, {
		headers,
		method: "POST",
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	// Await result and take action accordingly.
	const json = await res.json();
	if (json.errors) {
		console.error(json.errors);
		throw new Error("Failed to fetch API");
	}
	return json.data;
}



/**
 * Get General Settings.
 */
export const getGeneralSettings = async () => {
	const data = await fetchAPI(
	`
	query Default {
		generalSettings {
			title
			description
		}
	}`
	);
	return data.generalSettings;
}



/**
 * Get page list.
 */
export const getPageList = async () => {
	const data = await fetchAPI(
	`
	query GetPages {
		pages(where: {status: PUBLISH}) {
			edges {
				node {
					slug,
					title
				}
			}
		}
	}`
	);
	const res = [{
		slug: data.pages.edges.slug,
		title: data.pages.edges.title,
	}];
	console.log(res);
	return res;
}



/**
 * Get page.
 */
export const getPage = async(id: String) => {
	const data = await fetchAPI(`
		query pages {
			page(id: ${id}, idType: URI) {
				title
				content
			}
		}
	`);
	return {
		title: data.page.title,
		content: data.page.content
	}
}

