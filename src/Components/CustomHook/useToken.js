import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const useToken = (email) => {
    const [token, setToken] = useState(false);
    useEffect(() => {
        if (email) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/jwt?user=${email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        setToken(true);
                    }
                })
                .catch(error=>{
                    toast.error(error.message);
                });
        }
    }, [email])
    return [token];
};

export default useToken;