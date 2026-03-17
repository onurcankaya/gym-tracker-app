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
import { AxisDomain } from 'recharts/types/util/types';
import { capitalize } from 'lodash';

type BarChartProps = {
  chartData: Record<string, string | number>[] | undefined;
  xAxisDataKey: string;
  yAxisRange?: AxisDomain;
  barColors: Record<string, string>;
  barSize?: number;
  isStacked?: boolean;
  showLegend?: boolean;
  height?: number;
};

export function BarChartComponent({
  chartData,
  xAxisDataKey,
  barColors,
  barSize = 60,
  yAxisRange = [0, 'auto'],
  isStacked = false,
  showLegend = false,
  height = 240,
}: BarChartProps) {
  const barData = Array.from(
    new Set(
      chartData?.flatMap((item) =>
        Object.keys(item).filter((key) => key !== xAxisDataKey),
      ) || [],
    ),
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 20, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          horizontal={false}
          strokeDasharray="3 3"
          stroke="var(--color-gray-700)"
        />
        <XAxis
          dataKey={xAxisDataKey}
          interval="preserveStartEnd"
          tick={{ fill: 'var(--color-gray-400)', fontSize: 12, dy: 4 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-gray-700)' }}
        />
        <YAxis
          width="auto"
          domain={yAxisRange}
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
              barSize={barSize}
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
