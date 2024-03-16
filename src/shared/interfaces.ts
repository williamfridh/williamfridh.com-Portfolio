export interface GeneralSettings {
	title: 			string;
	description: 	string;
}

export interface PageSlug {
    slug: string;
}

export interface PagePath {
    params: PageNode
}

export interface PageNode {
	title: 		string | null;
	slug: 		string;
	content: 	string | null;
}

export interface PageData {
	title: 						string;
	content: 					string;
	displayPortfolioElement: 	boolean;
}

export interface HomeProps {
    generalSettings: 	GeneralSettings;
    pageList: 			PageNode[];
}

export interface promptObj {
	command: 	string;
	result: 	string;
}

export interface ProjectSlug {
	slug: string;
}

export interface Project extends ProjectFields {
	title: 		string;
	uri: 		string;
	image: 		string;
	content:	string|null;
}

export interface ProjectRaw {
	title: 				string;
	uri: 				string;
	content:			string|null;
	projectFields: 		ProjectFields;
	featuredImage: 		ProjectFeaturedImage | null;
}

interface ProjectFeaturedImage {
	node: {
		uri: string
	}
}

interface ProjectFields {
	techStack: 	string;
	summary:	string;
	start: 		string;
	end: 		string;
	link: 		string;
	role: 		string;
}

export interface MenuItem{
	label: 	string;
	uri: 	string;
}

