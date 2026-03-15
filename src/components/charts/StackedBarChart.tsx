'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { capitalize } from 'lodash';

type StackedBarChartProps = {
  chartData: Record<string, string | number>[] | undefined;
  xAxisDataKey: string;
  barColors: Record<string, string>;
};

export function StackedBarChart({
  chartData,
  xAxisDataKey,
  barColors,
}: StackedBarChartProps) {
  const barData = Array.from(
    new Set(
      chartData?.flatMap((item) =>
        Object.keys(item).filter((key) => key !== xAxisDataKey),
      ) || [],
    ),
  );

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -50, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-700)" />
        <XAxis
          dataKey={xAxisDataKey}
          tick={{ fill: 'var(--color-gray-400)', fontSize: 12, dy: 4 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-gray-700)' }}
        />
        <YAxis
          domain={[0, 'dataMax + 1']}
          tick={false}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-gray-700)' }}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
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
          formatter={(value, name) => [`${capitalize(name as string)}`]}
        />
        {barData.map((barKey) => {
          return (
            <Bar
              key={barKey}
              dataKey={barKey}
              stackId="a"
              fill={barColors[barKey]}
              barSize={60}
              label={{
                position: 'center',
                fill: '#000',
                fontSize: 12,
                formatter: () => capitalize(barKey),
              }}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
