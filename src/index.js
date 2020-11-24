import React from 'react';
import ReactDOM from 'react-dom';

export const HomeComponent = () => {

    return (
        <div>
            Home page
        </div>
    )
}


const host = document.getElementById("app");
host ? ReactDOM.render(<HomeComponent />, host) : null;
