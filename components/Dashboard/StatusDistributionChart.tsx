import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusDistributionChart = ({ data }) => {
  const COLORS = {
    sin_atender: '#EF4444',
    en_proceso: '#F59E0B',
    resuelto: '#22C55E',
    rechazado: '#6B7280'
  };

  const formatData = (data) => {
    return Object.entries(data).map(([status, count]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: count,
      status
    }));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="chart-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-label">{data.name}</div>
            <div className="tooltip-value">{data.value} reportes</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="chart-legend">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: COLORS[entry.payload.status] }}
            />
            <span className="legend-text">{entry.value}</span>
            <span className="legend-count">({entry.payload.value})</span>
          </div>
        ))}
      </div>
    );
  };

  const chartData = formatData(data);

  return (
    <div className="status-distribution-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.status]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusDistributionChart; 
