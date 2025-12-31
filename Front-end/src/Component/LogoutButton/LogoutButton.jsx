import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/Slices/authSlice';



const LogoutButton = () => {
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/login";
    }
    return (
        <div>
            <button className='block px-4 py-2 text-red-500 hover:bg-gray-100' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default LogoutButton
