import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchThingSpeakData } from '../../services/api';
import DataCard from '../DataCard';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
    const BeURL = process.env.REACT_APP_BeURL

    const navigate = useNavigate();
    const [data, setData] = useState({
        // hr: null,
        // spo2: null,
        ir: null,
        red: null,
    });
    const [glucose, setGlucose] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 🔥 Track last shown second (IMPORTANT)
    const lastSecondRef = useRef(null);
    // Fetch ThingSpeak Data
    const fetchData = async () => {
        try {
            const response = await fetchThingSpeakData();

            if (response && response.feeds && response.feeds.length > 0) {
                const latestFeed = response.feeds[response.feeds.length - 1];

                // Parse field values
                // const hr = latestFeed.field1 ? parseInt(latestFeed.field1) : null;
                // const spo2 = latestFeed.field2 ? parseInt(latestFeed.field2) : null;
                const ir = latestFeed.field1 ? parseFloat(latestFeed.field1) : null;
                const red = latestFeed.field2 ? parseFloat(latestFeed.field2) : null;

                setData({
                    // hr, spo2,
                    ir, red
                });


                // Calculate Blood Glucose

                if (ir !== null && red !== null && ir > 5000 && ir < 120000) {
                    const glucoseValue = await syncData();

                    if (glucoseValue !== null) {
                        setGlucose(glucoseValue.toFixed(2));
                    }
                } else {
                    setGlucose("Place finger properly");
                }


                // Prepare chart data for IR values
                const chartPoints = response.feeds
                    .filter(feed => feed.field1 !== null)
                    .slice(-50)
                    .map(feed => ({
                        x: new Date(feed.created_at).getTime(),
                        y: parseFloat(feed.field1),
                    }))
                    .sort((a, b) => a.x - b.x);

                setChartData(chartPoints);
                setError('');
            }
        } catch (err) {
            setError('Failed to fetch sensor data. Please try again later.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Poll API every 5 seconds
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    const chartOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                },
            },
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#4f46e5'],
        },
        xaxis: {
            type: 'datetime',
            title: {
                text: 'Time (HH:MM:SS)',
                style: { fontSize: '12px', fontWeight: 600, },
            },
            labels:
            {
                formatter:
                    (value) => {
                        const date = new Date(parseInt(value));
                        return date.toLocaleTimeString('en-IN',
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                                timeZone: 'Asia/Kolkata',
                            });
                    }, style: { fontSize: '11px', },
            },
        },
        yaxis: {
            title: {
                text: 'IR Value',
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                },
            },
            forceNiceScale: true,
            tickAmount: undefined,
            stepSize: 5000,
            labels: {
                formatter: (value) => {
                    return value ? value.toFixed(0) : '0';
                },
                style: {
                    fontSize: '11px',
                },
            },
        },
        tooltip: {
            x: {
                formatter: (value) => {
                    const date = new Date(parseInt(value));
                    return date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    });
                },
            },
            y: {
                formatter: (value) => {
                    return value ? value.toFixed(2) : '0.00';
                },
                title: {
                    formatter: () => 'IR Value',
                },
            },
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
        },
    };

    const chartSeries = [
        {
            name: 'IR Value',
            data: chartData,
        },
    ];

    // useEffect(() => {

    const syncData = async () => {
        try {
            const thinkSpeakRes = await fetch("https://api.thingspeak.com/channels/3309237/feeds.json?api_key=J46YG04B20GE3NV0&results");
            const thinkSpeakData = await thinkSpeakRes.json();

            const backendRes = await fetch(`${BeURL}/blood-glucose`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(thinkSpeakData)
            });

            const result = await backendRes.json();

            return result.glucose; // ✅ now works
        } catch (error) {
            console.error("Error syncing data:", error);
            return null;
        }
    };

    // if (BeURL) {
    //     // First call immediately
    //     syncData();

    //     // Then repeat every 5 seconds
    //     const interval = setInterval(syncData, 5000);

    //     // Cleanup (IMPORTANT)
    //     return () => clearInterval(interval);
    // }

    // }, [BeURL]);

    if (loading && !data.ir) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block mb-4">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Loading Dashboard</h2>
                    <p className="text-gray-600 mt-2">Fetching sensor data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
                    <p className="text-gray-600 mt-2">Real-time sensor monitoring and glucose estimation</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={fetchData}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Data Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    <DataCard
                        title="IR Value"
                        value={data.ir ? data.ir.toFixed(2) : null}
                        unit="units"
                        color="purple"
                        icon={<span className="text-2xl">📊</span>}
                    />
                    <DataCard
                        title="RED Value"
                        value={data.red ? data.red.toFixed(2) : null}
                        unit="units"
                        color="pink"
                        icon={<span className="text-2xl">📈</span>}
                    />
                </div>
                {/* Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">IR Value Over Time</h2>
                    {chartData.length > 0 ? (
                        <div style={{ overflowX: 'auto', width: '100%' }}>
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="line"
                                height={chartData.length > 20 ? 450 : 350}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Waiting for sensor data...</p>
                        </div>
                    )}
                </div>

                {/* Glucose Estimation Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-4 border-green-500 mt-6">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-600 text-lg mb-3">Estimated Blood Glucose</p>
                        <div className="text-5xl font-bold text-green-600 mb-2">
                            {glucose ? glucose : '---'}
                        </div>
                        {glucose && <p className="text-gray-500 text-lg">mg/dL</p>}

                        {glucose && (
                            <div className="mt-4 text-center">
                                {/* <p className="text-sm text-gray-600">
                                    Formula: Glucose = (120 × R) + 30, where R = RED / IR
                                </p> */}
                                {glucose < 70 && <p className="text-red-600 font-semibold mt-2">⚠️ Low glucose detected</p>}
                                {glucose > 180 && <p className="text-orange-600 font-semibold mt-2">⚠️ High glucose detected</p>}
                                {glucose >= 70 && glucose <= 180 && <p className="text-green-600 font-semibold mt-2">✓ Glucose level normal</p>}
                            </div>
                        )}
                    </div>
                </div>



                {/* Last Updated */}
                <div className="mt-6 text-center">

                    <button
                        onClick={fetchData}
                        className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Refresh Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


{/* <DataCard
                        title="Heart Rate"
                        value={data.hr}
                        unit="bpm"
                        color="red"
                        icon={<span className="text-2xl">❤️</span>}
                    />
                    <DataCard
                        title="SpO2 (Oxygen)"
                        value={data.spo2}
                        unit="%"
                        color="blue"
                        icon={<span className="text-2xl">🫁</span>}
                    /> */}