import { createContext, useEffect, useState } from "react";
import { THINGSPEAK_URL } from "../utils/ThinkSpeak";


export const DContext = createContext()

const DataContext = ({ children }) => {

    const BeURL = process.env.REACT_APP_BeURL
    const [isAuth, setIsAuth] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)



    useEffect(() => {
        fetch(`${BeURL}/checkauth`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsAuth(true)
                    setCurrentUser(data.user)
                }
                else {
                    setIsAuth(false)
                    setCurrentUser({})
                }
            })
            .catch(err => {
                setIsAuth(null)
                setCurrentUser(null)
                console.log("Erron in fetching User:", err)
                alert("Trouble in connecting to the Server, please try again later.")
            })
    }, [])


    const handleLogout = () => {
        fetch(`${BeURL}/logout`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message)
                if (data.success) {
                    setIsAuth(false)
                    setCurrentUser({})
                }
            })
            .catch(err => {
                console.log("Erron in Logout:", err)
                alert("Trouble in connecting to the Server, please try again later.")
            })
    }



    //     const fetchData = async () => {
    //         fetch(THINGSPEAK_URL)
    //             .then(res => res.json())
    //             .then(data => {
    //                 console.log("data:", data)
    //                 if (data && data.feeds && data.feeds.length > 0) {
    //                     const xAxis = data.feeds.map(feed => new Date(feed.created_at).getTime())

    //                     setFieldOne({
    //                         "x-axis": xAxis,
    //                         "y-axis": data.feeds.filter(feed => feed.field1 !== null).map(feed => feed.field1 || 0),
    //                         color: "green",
    //                         seriesName: 'Temperature'
    //                     })

    //                     setFieldTwo({
    //                         "x-axis": xAxis,
    //                         "y-axis": data.feeds.filter(feed => feed.field2 !== null).map(feed => feed.field2 || 0),
    //                         color: "green",
    //                         seriesName: 'Temperature'
    //                     })

    //                     setFieldThree({
    //                         "x-axis": xAxis,
    //                         "y-axis": data.feeds.filter(feed => feed.field3 !== null).map(feed => feed.field3 || 0),
    //                         color: "green",
    //                         seriesName: 'Temperature'
    //                     })

    //                     setFieldFour({
    //                         "x-axis": xAxis,
    //                         "y-axis": data.feeds.filter(feed => feed.field4 !== null).map(feed => feed.field4 || 0),
    //                         color: "green",
    //                         seriesName: 'Temperature'
    //                     })

    //                     setFieldFive({
    //                         "x-axis": xAxis,
    //                         "y-axis": data.feeds.filter(feed => feed.field5 !== null).map(feed => feed.field5 || 0),
    //                         color: "green",
    //                         seriesName: 'Temperature'
    //                     })

    //                     setFieldSix({
    //                         "x-axis": xAxis,
    //                         "y-axis": data.feeds.filter(feed => feed.field6 !== null).map(feed => feed.field6 || 0),
    //                         color: "green",
    //                         seriesName: 'Temperature'
    //                     })

    //                 }
    //                 else {
    //                     setFieldOne({
    //                         "x-axis": [],
    //                         "y-axis": [],
    //                         color: "black",
    //                         seriesName: 'Green'
    //                     })
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log("Error in fetching from Thinkspeak:", err)
    //             })
    //     };
    //     let intervalId
    //     if (THINGSPEAK_URL) {
    //         fetchData();
    //         // Optionally, set up polling for live data updates (e.g., every 30 seconds)
    //         intervalId = setInterval(fetchData, 5000);
    //     }
    //     return () => clearInterval(intervalId); // Cleanup on component unmount
    // }, [THINGSPEAK_URL]);

    const controls = {
        show: true,
        download: true,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        zoomEnabled: true,
        autoSelected: 'zoom'
    };

    const data = { isAuth, currentUser, setIsAuth, setCurrentUser, BeURL, handleLogout, controls }

    return (
        <DContext.Provider value={data}>
            {children}
        </DContext.Provider>
    )
}

export default DataContext