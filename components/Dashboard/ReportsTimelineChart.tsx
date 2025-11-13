import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ReportsTimelineChart = ({ data }) => {
  const formatData = (data) => {
    return data.map(item => ({
      ...item,
      period: item.period,
      nuevos: item.newReports,
      resueltos: item.resolvedReports,
      total: item.totalReports
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-label">{label}</div>
            {payload.map((entry, index) => (
              <div key={index} className="tooltip-item">
                <div 
                  className="tooltip-color" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="tooltip-name">{entry.name}:</span>
                <span className="tooltip-value">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = formatData(data);

  return (
    <div className="reports-timeline-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="nuevos" 
            fill="#3B82F6" 
            name="Nuevos"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="resueltos" 
            fill="#22C55E" 
            name="Resueltos"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportsTimelineChart; 
