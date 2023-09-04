import React, { useRef } from 'react';
import "./ProductSearch.css";

const ProductSearch = ({ searchText }) => {
    const searchRef = useRef();
    const handleSearch = () => {
        if (searchRef.current.value !== '') {
            searchText(searchRef.current.value);
        }
    }
    return (
        <div className='container-fluid'>
            <div>
                <div className='input-group'>
                    <input type="text" className='form-control' name='search' id='search' style={{ borderRight: "0px" }} ref={searchRef} />
                    <i className='input-group-text bi bi-search' style={{ cursor: "pointer" }} onClick={handleSearch}></i>
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;