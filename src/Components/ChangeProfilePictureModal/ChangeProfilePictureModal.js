import React, { useContext, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ClockLoader from 'react-spinners/ClockLoader';

const ChangeProfilePictureModal = () => {
    const { user, logout, updatePhoto } = useContext(SharedData);
    const navigate= useNavigate();
    const [imgInfo, setImgInfo] = useState(null);
    const [tempImg, setTempImg] = useState('');
    const [dataLoading, setDataLoading]= useState(false);
    const [cancelLoading, setCancelLoading]= useState(false);
    const handleImgChange = (e) => {
        const imgFile = e.target.files[0];
        if (imgFile.type.split('/')[1] === 'jpeg' || imgFile.type.split('/')[1] === "png" || imgFile.type.split('/')[1] === "jpg") {
            setImgInfo(e.target.files[0]);
            setTempImg(URL.createObjectURL(e.target.files[0]));

        }
        else {
            toast.error("File must be in jpeg, jpg or png format");
            return;
        }

    }
    const handleCancel = () => {
        setCancelLoading(true);
        setTempImg('')
        setImgInfo(null);
        setCancelLoading(false);
    }

    const handleSave = () => {
        setDataLoading(true);
        const formData = new FormData();
        formData.append('image',imgInfo);
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                if(imgData.success){
                    fetch(`https://phone-resale-server-swadhin941.vercel.app/user?user=${user?.email}`,{
                        method:"PUT",
                        headers:{
                            authorization: `bearer ${localStorage.getItem("token")}`,
                            "content-type": "application/json"
                        },
                        body:JSON.stringify({profileURL: imgData.data.url})
                    })
                    .then(res=>{
                        if(res.status===401){
                            logout()
                            navigate('/login')
                        }
                        if(res.status===403){
                            navigate('/forbidden')
                        }
                        return res.json();
                    })
                    .then(data=>{
                        if(data.modifiedCount>=1){
                            updatePhoto(imgData.data.url)
                            .then(()=>{
                                toast.success("Profile picture updated");
                                setImgInfo(null);
                                setTempImg('');
                                setDataLoading(false);
                            })
                            .catch(error=>{
                                toast.error(error.message);
                                setDataLoading(false);
                            })
                        }
                    })
                }
            })
    }

    return (
        <div className='modal fade' id="changeProfilePicture" data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <button className='btn btn-close' data-bs-dismiss="modal" onClick={handleCancel}></button>
                    </div>
                    <div className="modal-body">
                        <div style={{ height: "300px", width: "auto" }} onClick={() => document.querySelector('.imgTake').click()} className='d-flex justify-content-center'>
                            <img src={user?.photoURL ? tempImg===""? user?.photoURL: tempImg : 'https://i.ibb.co/rHVSLgf/empty-person.jpg'} alt={`${user?.displayName}'s_picture`} className='img-fluid' style={{ height: "100%", width: "auto", borderRadius: "10px" }} />
                            <form>
                                <input type="file" name='imgTake' id='imgTake' className='imgTake' onChange={handleImgChange} hidden />
                            </form>
                        </div>
                        {
                            imgInfo && <div className='d-flex justify-content-center mt-3'><button className='btn btn-success mx-2 w-25 d-flex justify-content-center' onClick={handleSave}>{dataLoading? <ClockLoader color='white' size={24} /> :"Save"}</button> <button className='btn btn-danger' onClick={handleCancel}>Cancel</button></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeProfilePictureModal;