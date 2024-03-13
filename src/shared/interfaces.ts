export interface GeneralSettings {
	title: string;
	description: string;
}

export interface Page {
    node: PageNode
}

export interface PageNode {
	title: string;
	slug: string;
}

export interface HomeProps {
    generalSettings: GeneralSettings;
    pageList: PageNode[];
}
export interface promptObj {
	command: string;
	result: string;
}