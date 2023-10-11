import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { SharedData } from '../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';

const DetailsEdit = ({ editInfo, editState, editValue }) => {
    const { user, logout } = useContext(SharedData);
    const navigate= useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.price.value === editInfo?.price) {
            toast.error("Please update the price");
            return;
        }
        if (form.details.value === editInfo?.details) {
            toast.error("Please update the description");
            return;
        }
        const price = parseInt(form.price.value);
        const description = form.details.value;
        fetch(`${process.env.REACT_APP_SERVER}/updateProduct?user=${user?.email}`, {
            method:"PUT",
            headers:{
                authorization: `bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({_id: editInfo?._id, price, description})
        })
        .then(res=>{
            if(res.status===401){
                logout();
                navigate('/login')
            }
            if(res.status===403){
                navigate('/forbidden')
            }
            return res.json();
        })
        .then(data=>{
            toast.success("Updated Successfully");
            editState(!editValue);
        })
        .catch(error=>{
            toast.error(error.message);
        })
    }
    return (
        <div className='modal fade' data-bs-backdrop="static" id='editModal' data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header border border-0">
                        <button className='btn btn-close' data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form className='form' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="price">Update price:</label>
                                <div>
                                    <input type="text" className='form-control' name='price' id='price' defaultValue={editInfo?.price} />
                                </div>

                            </div>
                            <div>
                                <label htmlFor="details">Update Details:</label>
                                <div>
                                    <textarea name="details" id="details" cols="20" rows="5" className='form-control' style={{ resize: "none" }} defaultValue={editInfo?.details}></textarea>
                                </div>

                            </div>
                            <div className='mt-2 '>
                                <button className='btn btn-success w-100' type='submit' data-bs-dismiss="modal">Update information</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsEdit;