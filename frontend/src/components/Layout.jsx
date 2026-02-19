import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, role }) => {
    return (
        <div className="flex h-screen bg-sea-dark text-white overflow-hidden">
            <Sidebar role={role} />
            <main className="flex-1 overflow-auto bg-gradient-to-br from-sea-dark to-[#0D2B55] relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sea-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="p-8 relative z-10">

                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
