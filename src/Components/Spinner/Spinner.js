import React from 'react';
import FadeLoader from "react-spinners/FadeLoader"

const Spinner = () => {
    return (
        <div className='container-fluid my-3 d-flex justify-content-center'>
            <FadeLoader color='black' />
        </div>
    );
};

export default Spinner;