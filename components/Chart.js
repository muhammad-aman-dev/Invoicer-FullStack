'use client'

import { useEffect,useState } from 'react';
import {
      BarChart,
      Bar,
      XAxis,
      YAxis,
      Tooltip,
      ResponsiveContainer,
    } from 'recharts';
    
    
    
    export default function RevenueChart() {
      const [revData, setrevData] = useState([]);
     
      useEffect(() => {
      const fetchRevenue = async () => {
      try {
        const res = await fetch('/api/revenue');
        const data = await res.json();
        
        // Map API response to recharts format
        const formatted = data.map(item => ({
          month: item.month,           // e.g. "August 2025"
          revenue: item.totalRevenue,  // API returns `totalRevenue`
        }));
       console.log(formatted)
        setrevData(formatted);
      } catch (err) {
        console.error("Failed to load revenue:", err);
      }
    };
    fetchRevenue();
  },[]);

      return (
        <div className="w-[100%] sm:w-[80%] h-80 bg-[#fafafa] rounded-lg p-4 shadow-2xl ">
          <h2 className="text-xl font-bold mb-4">Last 12 Months Revenue</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={revData}>
              <XAxis dataKey="month" />
              <YAxis dataKey={'revenue'}/>
              <Tooltip />
              <Bar dataKey="revenue" fill="#8db8f8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }