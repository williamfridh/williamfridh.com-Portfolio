import { Page, ProjectRaw, MenuItem } from '../shared/interfaces';



const API_URL 	= process.env.WORDPRESS_API_URL;
const MENU		= process.env.WORDPRESS_MENU;
const SOCIAL	= process.env.WORDPRESS_SOCIAL;



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
 * Get page slugs.
 */
export const getPageSlugs = async () => {
	const data = await fetchAPI(
	`
	query GetPages {
		pages(where: {status: PUBLISH}) {
			edges {
				node {
					slug
				}
			}
		}
	}`
	);
	return data.pages.edges.map(({node}: Page) => ({
		params: {
			slug: node.slug
		}
	}));
}



/**
 * Get page.
 */
export const getPage = async(id: String) => {
	const data = await fetchAPI(`
		query GetPage {
			page(id: "${id}", idType: URI) {
			  title
			  content
			  customPageFields {
				displayPortfolioElement
			  }
			}
		  }
	`);
	const p = data.page;
	return {
		title: 						p.title,
		content: 					p.content,
		displayPortfolioElement: 	p.customPageFields.displayPortfolioElement
	}
}



/**
 * Get Menu Items.
 */
export const getMenuItems = async() => {
	const data = await fetchAPI(`
		query GetMenuItems {
			menu(id: "${MENU}", idType: NAME) {
				menuItems {
					nodes {
						label
						uri
					}
				}
			}
		}
	`);
	return data.menu.menuItems.nodes.map((node: MenuItem) => ({
		label: 	node.label,
		uri: 	node.uri
	}));
}



/**
 * Get Social Media.
 */
export const getSocialMedia = async() => {
	const data = await fetchAPI(`
		query GetSocialMedia {
			menu(id: "${SOCIAL}", idType: NAME) {
				menuItems {
					nodes {
						label
						uri
					}
				}
			}
		}
	`);
	return data.menu.menuItems.nodes.map((node: MenuItem) => ({
		label: 	node.label,
		uri: 	node.uri,
	}));
}



/**
 * Get projects.
 */
export const getProjects = async () => {
	const data = await fetchAPI(
	`
	query GetProjects {
		projects(where: {status: PUBLISH}) {
			nodes {
					title
					uri
					link
					projectFields {
					techStack
					start
					end
					link
					role
				}
				featuredImage {
					node {
						uri
					}
				}
			}
		}
	}
	`
	);
	return data.projects.nodes.map((project: ProjectRaw) => ({
		title:		project.title,
		uri:		project.uri,
		techStack:	project.projectFields.techStack,
		start:		project.projectFields.start,
		end:		project.projectFields.end,
		link:		project.projectFields.link,
		role:		project.projectFields.role,
		image:		project.featuredImage ? project.featuredImage.node.uri : null
	}));
}

