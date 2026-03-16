'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { capitalize } from 'lodash';

type BarChartProps = {
  chartData: Record<string, string | number>[] | undefined;
  xAxisDataKey: string;
  barColors: Record<string, string>;
  isStacked?: boolean;
  showLegend?: boolean;
};

export function BarChartComponent({
  chartData,
  xAxisDataKey,
  barColors,
  isStacked = false,
  showLegend = false,
}: BarChartProps) {
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
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-700)" />
        <XAxis
          dataKey={xAxisDataKey}
          interval="preserveStartEnd"
          tick={{ fill: 'var(--color-gray-400)', fontSize: 12, dy: 4 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-gray-700)' }}
        />
        <YAxis
          width="auto"
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
            fontSize: '12px',
          }}
          formatter={(value, name) => [value, capitalize(name as string)]}
        />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={6}
            height={20}
            wrapperStyle={{
              marginTop: '10px',
            }}
            labelStyle={{
              fontSize: '12px',
              marginLeft: '2px',
              marginRight: '4px',
            }}
            formatter={(value) => capitalize(value)}
          />
        )}
        {barData.map((barKey) => {
          return (
            <Bar
              key={barKey}
              dataKey={barKey}
              stackId={isStacked ? 'a' : undefined}
              fill={barColors[barKey]}
              barSize={60}
              radius={!isStacked ? 4 : 0}
              label={
                isStacked && {
                  position: 'center',
                  fill: '#000',
                  fontSize: 12,
                  formatter: () => capitalize(barKey),
                }
              }
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
