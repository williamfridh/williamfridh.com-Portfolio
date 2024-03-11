import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
};

export default Layout;

