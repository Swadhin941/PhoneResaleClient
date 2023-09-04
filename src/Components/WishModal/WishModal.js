import React from 'react';

const WishModal = ({wishId, wishState}) => {

    const handleYes=()=>{
        wishState(true);
    }
    const handleNo=()=>{
        wishState(false);
    }

    return (
        <div className='modal fade' id='wishModal' data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <h6 className='my-0'>Are you sure want to add this in wish list?</h6>
                        <p className='my-0'>Note: (This product will be no more in your cart if it is available)</p>
                        <p className='my-0'>Do you okay with that?</p>
                        <div className='mt-2 d-flex justify-content-between'>
                            <button className='btn btn-sm btn-success' data-bs-dismiss="modal" onClick={handleYes}>Yes</button>
                            <button className='btn btn-sm btn-danger' data-bs-dismiss="modal" onClick={handleNo}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishModal;