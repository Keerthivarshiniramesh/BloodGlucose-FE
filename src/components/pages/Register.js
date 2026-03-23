import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.contact.trim()) {
            setError('Contact is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser({
                fullname: formData.name,
                email: formData.email,
                contact: formData.contact,
                password: formData.password,
            });

            if (response.success) {
                navigate('/login');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during registration');
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
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold hover:underline ml-2">
                                Login here
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Centered Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6  py-12">
                <div className="w-full max-w-5xl bg-blue-100 p-10 rounded-xl">
                    {/* Content with Illustration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-around">
                        {/* Left - Illustration & Info (responsive) */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-8">
                                <div className="relative w-full h-64 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-2xl flex items-center justify-center shadow-xl">
                                    <div className="text-6xl">💉</div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Join Our Health Network
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Start monitoring your blood glucose levels today and take control of your health with our innovative platform.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white text-sm">✓</div>
                                    <p className="ml-3 text-gray-700">Easy to use</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white text-sm">✓</div>
                                    <p className="ml-3 text-gray-700">Instant results</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white text-sm">✓</div>
                                    <p className="ml-3 text-gray-700">Health insights</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Register Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            {/* Form Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Get Started
                                </h2>
                                <p className="text-gray-600">Create your account in minutes</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="+1 (555) 000-0000"
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
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
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Already registered?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <Link
                                to="/login"
                                className="w-full block text-center py-3 px-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
