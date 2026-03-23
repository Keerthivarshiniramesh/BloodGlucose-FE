import React from 'react';

const DataCard = ({ title, value, unit, icon, color = 'indigo' }) => {
    const colorClasses = {
        red: 'bg-red-50 border-red-200 text-red-700',
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        pink: 'bg-pink-50 border-pink-200 text-pink-700',
    };

    const iconBgClasses = {
        red: 'bg-red-100 text-red-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        pink: 'bg-pink-100 text-pink-600',
    };

    return (
        <div className={`${colorClasses[color]} border rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                    <div className="flex items-baseline">
                        <p className="text-3xl font-bold">{value !== null && value !== undefined ? value : '---'}</p>
                        <p className="text-lg ml-2 text-gray-500">{unit}</p>
                    </div>
                </div>
                {icon && (
                    <div className={`${iconBgClasses[color]} w-14 h-14 rounded-lg flex items-center justify-center`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataCard;
