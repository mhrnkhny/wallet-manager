'use client';

import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface Transaction {
  jalali_date: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
}

interface BarChartProps {
  transactions: Transaction[];
}

const BarChart: React.FC<BarChartProps> = ({ transactions }) => {
  // Group by last 7 days
  const processData = () => {
    const dailyData: Record<string, { date: string; واریز: number; برداشت: number }> = {};

    transactions.forEach((t) => {
      const date = t.jalali_date;
      if (!dailyData[date]) {
        dailyData[date] = { date, واریز: 0, برداشت: 0 };
      }

      if (t.transaction_type === 'deposit') {
        dailyData[date].واریز += t.amount;
      } else {
        dailyData[date].برداشت += t.amount;
      }
    });

    return Object.values(dailyData)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  };

  const data = processData();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}م`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}هزار`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-gray-700 rounded-xl p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-2">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: entry.fill }}>{entry.name}:</span>
              <span className="font-bold text-white">
                {new Intl.NumberFormat('fa-IR').format(entry.value)} ریال
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>داده‌ای برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => {
              const parts = value.split('/');
              return `${parts[1]}/${parts[2]}`;
            }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 14 }} />
          <Bar dataKey="واریز" fill="#10B981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="برداشت" fill="#EF4444" radius={[8, 8, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
