import { PageSlug, ProjectRaw, ProjectSlug, MenuItem } from '../shared/interfaces';



/**
 * Environment variables.
 * 
 * Note that these variables are set in the .env file.
 */
const API_URL 	= process.env.WORDPRESS_API_URL;
const MENU		= process.env.WORDPRESS_MENU;
const SOCIAL	= process.env.WORDPRESS_SOCIAL;



/**
 * Fetch API function used for accessing GraphQL.
 * 
 * Note that this function was taken from Next.js's
 * official GitHub repository:
 * https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress
 * 
 * @param {String} query
 * @param {Object} variables
 * @returns {Promise<any>}
 * @throws {Error}
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
 * 
 * @returns {Promise<GeneralSettings>}
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
 * 
 * @returns {Promise<PageSlug[]>}
 */
export const getPageSlugs = async () => {
	const data = await fetchAPI(
	`
	query GetPages {
		pages(where: {status: PUBLISH}) {
			nodes {
				slug
			}
		}
	}
	`
	);
	return data.pages.nodes.map((node: PageSlug) => ({
		params: {
			slug: node.slug
		}
	}));
}



/**
 * Get page.
 * 
 * @param {String} id
 * @returns {Promise<Page>}
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
				seo {
					metaDesc
					fullHead
					title
				}
			}	
		}
	`);
	const p = data.page;
	return {
		title: 						p.title,
		content: 					p.content,
		displayPortfolioElement: 	p.customPageFields.displayPortfolioElement,
		seoTitle:					p.seo.title,
		seoMetaDesc:				p.seo.metaDesc,
		seoFullHead:				p.seo.fullHead
	}
}



/**
 * Get Menu Items.
 * 
 * @returns {Promise<MenuItem[]>}
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
 * 
 * @returns {Promise<MenuItem[]>}
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
 * 
 * @returns {Promise<Project[]>}
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
					summary
					techStack
					start
					end
					link
					role
					github
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
		summary:	project.projectFields.summary,
		techStack:	project.projectFields.techStack,
		start:		project.projectFields.start,
		end:		project.projectFields.end,
		link:		project.projectFields.link,
		role:		project.projectFields.role,
		github:		project.projectFields.github,
		image:		project.featuredImage ? project.featuredImage.node.uri : null
	}));
}



/**
 * Get project slugs.
 * 
 * @returns {Promise<ProjectSlug[]>}
 */
export const getProjectSlugs = async () => {
	const data = await fetchAPI(
	`
	query GetProjectSlugs {
		projects(where: {status: PUBLISH}) {
			nodes {
				slug
			}
		}
	}
	`
	);
	return data.projects.nodes.map((node: PageSlug) => ({
		params: {
			slug: node.slug
		}
	}));
}



/**
 * Get project.
 * 
 * @param {String} id
 * @returns {Promise<Project>}
 */
export const getProject = async (id: string) => {
	const data = await fetchAPI(
	`
	query GetProject {
		project(id: "project/${id}", idType: URI) {
			content
			title
			projectFields {
			  end
			  link
			  role
			  start
			  techStack
			  summary
			  github
			}
			featuredImage {
			  node {
				uri
			  }
			}
			seo {
				metaDesc
				fullHead
				title
			}
		  }
		}
	`
	);
	const p = data.project;
	return {
		title:			p.title,
		uri:			id,
		content:		p.content,
		summary:		p.projectFields.summary,
		techStack:		p.projectFields.techStack,
		start:			p.projectFields.start,
		end:			p.projectFields.end,
		link:			p.projectFields.link,
		role:			p.projectFields.role,
		github:			p.projectFields.github,
		image:			p.featuredImage ? p.featuredImage.node.uri : null,
		seoTitle:		p.seo.title,
		seoMetaDesc:	p.seo.metaDesc,
		seoFullHead:	p.seo.fullHead
	};
}

