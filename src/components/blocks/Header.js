import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/api';
import { DContext } from '../../context/Datacontext';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser, setIsAuth, setCurrentUser } = useContext(DContext);

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response.success) {
                setIsAuth(false);
                setCurrentUser(null);
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API fails
            setIsAuth(false);
            setCurrentUser(null);
            navigate('/login');
        }
    };

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Title */}
                    <div className="flex items-center">
                        <h1 className="text-white text-2xl font-bold">
                            🩺 Blood Glucose Monitor
                        </h1>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        {currentUser && (
                            <>
                                <div className="hidden sm:flex items-center">
                                    <div className="text-right">
                                        <p className="text-white font-semibold">{currentUser.name}</p>
                                        <p className="text-indigo-100 text-sm">{currentUser.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
