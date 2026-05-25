import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';
import { sentimentHistory } from '../data/mockSentiment';

export function SentimentHistoryChart() {
  return (
    <div id="sentiment-history-chart-card" className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-md relative overflow-hidden">
      {/* Background vector */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <ChartIcon className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">7-DAY HISTORIC SENTIMENT COEFFICIENT</h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-2 py-0.5 rounded">
          MOCK DATA ENGINE
        </span>
      </div>

      {/* Recharts graph layer container */}
      <div className="w-full h-72 relative z-10 font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sentimentHistory}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#525252" 
              tickLine={false}
              dy={10}
              style={{ fontSize: '10px' }}
            />
            <YAxis 
              stroke="#525252" 
              tickLine={false}
              domain={[20, 100]}
              dx={-5}
              style={{ fontSize: '10px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161616',
                borderColor: '#404040',
                borderRadius: '8px',
                color: '#e5e5e5',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              style={{ fontSize: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="BTC"
              stroke="#00e5ff"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="ETH"
              stroke="#a855f7"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Market"
              stroke="#ffffff"
              strokeWidth={2}
              strokeDasharray="4 4"
              activeDot={{ r: 5 }}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
