'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type LineChartComponentProps = {
  chartData: any;
  xAxisDataKey: string;
  lineDataKey: string;
};

export default function LineChartComponent({
  chartData,
  xAxisDataKey,
  lineDataKey,
}: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 10, left: -15, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-700)" />
        <XAxis
          dataKey={xAxisDataKey}
          tick={{ fill: 'var(--color-gray-400)', fontSize: 12, dy: 4 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-gray-700)' }}
        />
        <YAxis
          unit="km"
          domain={[0, 'auto']}
          tick={{ fill: 'var(--color-gray-400)', fontSize: 12, dx: -4, dy: -4 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-gray-700)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-black)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: '8px',
          }}
          labelStyle={{
            color: 'var(--color-white)',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '4px',
          }}
          itemStyle={{
            color: 'var(--color-neon-green-300)',
            fontSize: '12px',
          }}
          formatter={(value, name) => [`${value}km`, 'Distance']}
        />
        <Line
          dataKey={lineDataKey}
          stroke="var(--color-neon-green-300)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-neon-green-300)', r: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
