import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { DContext } from '../../context/Datacontext';

const Login = () => {
    const navigate = useNavigate();
    const { setIsAuth, setCurrentUser } = useContext(DContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser({ email, password });

            if (response.success) {
                setIsAuth(true);
                setCurrentUser(response.user);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-white text-2xl font-bold flex items-center">
                                <span className="text-3xl mr-2">🩺</span>
                                Blood Glucose Monitor
                            </h1>
                        </div>
                        <div className="text-white text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold hover:underline ml-2">
                                Register here
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Centered Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 ">
                <div className="w-full max-w-5xl bg-blue-100 p-10 rounded-xl ">
                    {/* Content with Illustration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                        {/* Left - Illustration & Info (responsive) */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-8">
                                <div className="relative w-full h-64 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-2xl flex items-center justify-center shadow-xl">
                                    <div className="text-6xl">📊</div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Monitor Your Health
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Track your blood glucose levels in real-time with our advanced monitoring system.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white text-sm">✓</div>
                                    <p className="ml-3 text-gray-700">Real-time monitoring</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white text-sm">✓</div>
                                    <p className="ml-3 text-gray-700">Accurate estimation</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white text-sm">✓</div>
                                    <p className="ml-3 text-gray-700">Secure & private</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Login Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            {/* Form Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-gray-600">Sign in to your account</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">New here?</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <Link
                                to="/register"
                                className="w-full block text-center py-3 px-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
