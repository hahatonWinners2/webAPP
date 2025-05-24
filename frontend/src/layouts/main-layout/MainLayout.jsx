import React from "react";
import { useState } from 'react';
import {Outlet} from "react-router-dom";
import Header from "/src/components/header/Header";

const MainLayout = () => {
    const [header, setHeader] = useState(<Header />);
    return (
        <>
            {header}
            <main style={{flexGrow: 1}}>
                <Outlet context={{ setHeader }}/>
            </main>
        </>
    )
}

export default MainLayout;