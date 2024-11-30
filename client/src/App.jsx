import React, { useEffect, useState } from 'react'
import axios from "axios"
import {Outlet} from "react-router-dom"

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('/api')
        .then((res) => {
            console.log("Client and Server connected!")            
        })
        .catch((error) => {
            console.error(error)            
        })
        .finally(() => setLoading(false))
    })

    return !loading ? (
        <div className='min-h-screen flex flex-col bg-white'>
            <main className='flex-grow p-8'>
                <Outlet />
            </main>
        </div>
    ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white">
            <div className="w-16 h-16 border-8 border-t-blue-600 border-gray-300 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-700 font-medium">Loading Email Scheduler...</p>
        </div>
    )
}

export default App