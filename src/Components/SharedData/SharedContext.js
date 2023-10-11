import React, { createContext, useEffect, useState } from 'react';
import app from '../Firebase/Firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

export const SharedData = createContext();


const SharedContext = ({ children }) => {
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPosition, setCurrentPosition]= useState(null);

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const createAccount = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('token');
        return signOut(auth);
    }

    const updateName = (userName) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: userName
        })
    }

    const updatePhoto = (photoURL) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            photoURL: photoURL
        })
    }

    const passwordReset= (email)=>{
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    }

    const verifyEmail = () => {
        setLoading(true);
        return sendEmailVerification(auth.currentUser)
    }


    //After completing first time verifying email, below code will stop the user if the user reload this page to login into this software directly.
    useEffect(()=>{
        if(user?.email){
            fetch(`${process.env.REACT_APP_SERVER}/emailStatus?user=${user?.email}`)
                .then(res=>res.json())
                .then(data=>{
                    if(data.emailStatus){
                        setUser(user);
                    }
                    else{
                        logout()
                        setUser(null);
                    }
                })
        }
    },[user])


    useEffect(() => {
        const check = onAuthStateChanged(auth, currentUser => {
            if (currentUser === null || currentUser.emailVerified ) {
                // console.log(currentUser);
                setUser(currentUser);
            }
            setLoading(false);
        })
        return () => check();
    }, [])

    const authInfo = { googleLogin, logout, createAccount, login, loading, setLoading, user, setUser, updateName, updatePhoto, verifyEmail, passwordReset, currentPosition, setCurrentPosition };
    return (
        <div>
            <SharedData.Provider value={authInfo}>
                {children}
            </SharedData.Provider>
        </div>
    );
};

export default SharedContext;