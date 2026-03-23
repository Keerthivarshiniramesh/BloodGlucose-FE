import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="mb-4">
                    <div className="inline-block">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading</h2>
                <p className="text-gray-600">Please wait while we authenticate your session...</p>
            </div>
        </div>
    );
};

export default Loading;
