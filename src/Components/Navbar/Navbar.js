import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./Navbar.css";
import { SharedData } from '../SharedData/SharedContext';
import useSeller from '../CustomHook/useSeller';
import ChangeProfilePictureModal from '../ChangeProfilePictureModal/ChangeProfilePictureModal';

const Navbar = () => {
    const { logout, user } = useContext(SharedData);
    const [isSeller, selllerLoading] = useSeller(user?.email);
    const [visuality, setVisuality]= useState(false);
    const handleLogout = () => {
        logout()
    }


    return (
        <nav className='navbar navbar-expand-lg bg-gray'>
            <div className="container-fluid">
                <Link to={'/'} className='navbar-brand' onClick={()=>setVisuality(false)}>E-Buy</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" onClick={()=>setVisuality(false)}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse navFlex" id="navbarNavDropdown">
                    <ul className='navbar-nav'>
                        <li className='nav-item' onClick={()=>setVisuality(false)}>
                            <NavLink to={'/'} className={'nav-link '}>Home</NavLink>
                        </li>
                        {
                            user && user?.uid && <li className='nav-item' onClick={()=>setVisuality(false)}>
                                <NavLink to={'/cart'} className={'nav-link '}>Cart</NavLink>
                            </li>
                        }
                        {
                            user && user?.uid && <li className='nav-item' onClick={()=>setVisuality(false)}>
                                <NavLink to={'/wishList'} className={'nav-link'}>Wish List</NavLink>
                            </li>
                        }
                        {
                            user && user?.uid && <li className='nav-item' onClick={()=>setVisuality(false)}>
                                <NavLink to={'/orders'} className={'nav-link'}>Orders</NavLink>
                            </li>
                        }

                        {
                            user && user?.uid && isSeller && <> <li className='nav-item' onClick={()=>setVisuality(false)}>
                                <NavLink to={'/addProduct'} className={'nav-link '}>Add product</NavLink>
                            </li>
                                <li className='nav-item' onClick={()=>setVisuality(false)}>
                                    <NavLink to={'/myProducts'} className={'nav-link'}>My products</NavLink>
                                </li>
                            </>
                        }


                        {
                            user && user?.uid ? <> <li className='nav-item mt-1' style={{ cursor: "pointer" }}><img src={user?.photoURL ? user?.photoURL : 'https://i.ibb.co/bmVqbdY/empty-person.jpg'} height={24} width={24} alt={`${user?.displayName}'s` + " picture"} style={{ borderRadius: "50%" }} onClick={()=>setVisuality(!visuality)} /> </li>
                                <div className={`${visuality?"navFirst":"d-none"}`}>
                                    <h5 className='text-center  p-2 profileName' style={{ borderBottom: "2px solid black" }}>{user?.displayName}</h5>
                                    <li className='nav-item' data-bs-target="#changeProfilePicture" data-bs-toggle="modal" onClick={()=>setVisuality(false)}>
                                        <button className='btnCPP' >Change Profile Picture</button>
                                    </li>
                                    <li className='nav-item'>
                                <p className=' logout nav-link ' style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</p>
                            </li>
                                </div>

                            </> : <><li className='nav-item'>
                                <NavLink to={'/login'} className={'nav-link '}>Login</NavLink>
                            </li>
                                <li className='nav-item'>
                                    <NavLink to={'/register'} className={'nav-link '}>Signup</NavLink>
                                </li></>
                        }

                    </ul>
                    <ChangeProfilePictureModal></ChangeProfilePictureModal>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;