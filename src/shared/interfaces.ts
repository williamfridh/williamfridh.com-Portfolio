export interface GeneralSettings {
	title: 			string;
	description: 	string;
}

export interface Page {
    node: PageNode
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

export interface Project extends ProjectFields {
	title: 	string;
	uri: 	string;
	image: 	string;
}

export interface ProjectRaw {
	title: 				string;
	uri: 				string;
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
	start: 		string;
	end: 		string;
	link: 		string;
	role: 		string;
}

export interface MenuItem{
	label: 	string;
	order: 	number;
	uri: 	string;
}