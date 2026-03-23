'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';
import { capitalize } from 'lodash';

type LineChartComponentProps = {
  chartData: Record<string, string | number>[];
  lineData: { key: string; color?: string }[];
  xAxisDataKey: string;
  yAxisUnit?: string;
  yAxisRange?: AxisDomain;
  showLegend?: boolean;
  height?: number;
};

export function LineChartComponent({
  chartData,
  lineData,
  xAxisDataKey,
  yAxisUnit = '',
  yAxisRange = [0, 'auto'],
  showLegend = false,
  height = 240,
}: LineChartComponentProps) {
  return (
    <>
      {chartData.length ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--chart-line)" />
            <XAxis
              dataKey={xAxisDataKey}
              ticks={
                chartData.length > 1
                  ? [chartData[0]?.date, chartData[chartData.length - 1]?.date]
                  : [chartData[0]?.date]
              }
              tick={{ fill: 'var(--color-gray-400)', fontSize: 12, dy: 4 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-line)' }}
            />
            <YAxis
              width="auto"
              unit={yAxisUnit}
              domain={yAxisRange}
              tick={{
                fill: 'var(--color-gray-400)',
                fontSize: 12,
                dx: -8,
                dy: -4,
              }}
              tickLine={false}
              axisLine={false}
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
                fontSize: '12px',
              }}
              formatter={(value, name) => [
                `${value}${yAxisUnit}`,
                capitalize(name as string),
              ]}
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
            {lineData.map((line, index) => (
              <Line
                key={line.key}
                dataKey={line.key}
                stroke={line.color ?? `var(--color-chart-${index + 1})`}
                strokeWidth={2}
                dot={{
                  fill: line.color ?? `var(--color-chart-${index + 1})`,
                  r: 2,
                }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>
          <p className="text-sm text-center">No data to show</p>
        </div>
      )}
    </>
  );
}
