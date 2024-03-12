import React from 'react';



interface GeneralSettings {
	title: string;
	description: string;
}

interface Props {
  generalSettings: GeneralSettings;
}



const Header: React.FC<Props> = ({ generalSettings }) => {
	return (
		<header>
			<h1>{generalSettings.title}</h1>
			<h5>{generalSettings.description}</h5>
		</header>
	);
};
export default Header;

