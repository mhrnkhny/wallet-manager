'use client';

import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Transaction {
  jalali_date: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
}

interface PieChartProps {
  transactions: Transaction[];
}

const PieChart: React.FC<PieChartProps> = ({ transactions }) => {
  const processData = () => {
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    transactions.forEach((t) => {
      if (t.transaction_type === 'deposit') {
        totalDeposits += t.amount;
      } else {
        totalWithdrawals += t.amount;
      }
    });

    return [
      { name: 'واریز', value: totalDeposits, color: '#10B981' },
      { name: 'برداشت', value: totalWithdrawals, color: '#EF4444' },
    ];
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
      const data = payload[0];
      const total = payload[0].payload.value + (payload[1]?.payload.value || 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-dark-card border border-gray-700 rounded-xl p-3 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-gray-400 text-sm">{data.name}</span>
          </div>
          <div className="text-white font-bold text-base">
            {new Intl.NumberFormat('fa-IR').format(data.value)} ریال
          </div>
          <div className="text-gray-400 text-xs mt-1">{percentage}% از کل</div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (data.every(d => d.value === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>داده‌ای برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#9CA3AF', fontSize: 14 }}
            formatter={(value, entry: any) => {
              const amount = entry.payload.value;
              return `${value}: ${formatCurrency(amount)}`;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
