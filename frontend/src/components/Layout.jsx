import React from 'react';
import { Helmet } from 'react-helmet';

const Layout = ({ children }) => {
    return (
        <>
            <Helmet>
                <link rel="icon" href="/favicon.ico" />
                {/* Remove the manifest icon references */}
            </Helmet>
            {children}
        </>
    );
};

export default Layout; 