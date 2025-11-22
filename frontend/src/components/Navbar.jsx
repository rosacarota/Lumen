import React, { useState } from 'react';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [userRole, setUserRole] = useState('user');
}

function Navbar{
    return(
        <header>
            <div>
                <a href="">Lumen</a>
            </div>

        </header>
    );
}

export default Navbar