import React from 'react';

const DeleteModal = ({deleteID, deleteStatus}) => {
    const handleYes= ()=>{
        deleteStatus(true);
    }
    const handleNo= ()=>{
        deleteStatus(false);
    }
    return (
        <div className='modal fade' id='DeleteModal' data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className='text-center'>
                            <h6>Are you sure want to remove this?</h6>
                        </div>
                        <div className='mt-3 d-flex justify-content-between'>
                            <button className='btn btn-success' data-bs-dismiss="modal" onClick={handleYes}>Yes</button>
                            <button className='btn btn-danger' data-bs-dismiss="modal" onClick={handleNo}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;