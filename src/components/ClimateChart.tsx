import React, { useState } from 'react';

interface ClimateMonth {
  month: number;
  temp: number;
  rain: number;
}

interface ClimateChartProps {
  data: ClimateMonth[];
  climateType?: string;
}

export const ClimateChart: React.FC<ClimateChartProps> = ({ data, climateType }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 340;
  const height = 220;
  const padding = { top: 25, right: 36, bottom: 30, left: 36 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Max values for scaling
  const maxRain = Math.max(350, Math.ceil(Math.max(...data.map((d) => d.rain)) / 50) * 50);
  const minTemp = Math.min(0, Math.floor(Math.min(...data.map((d) => d.temp)) / 5) * 5);
  const maxTemp = Math.max(35, Math.ceil(Math.max(...data.map((d) => d.temp)) / 5) * 5);

  const getX = (index: number) => padding.left + (index + 0.5) * (chartW / 12);
  const getRainY = (rain: number) => padding.top + chartH - (rain / maxRain) * chartH;
  const getTempY = (temp: number) =>
    padding.top + chartH - ((temp - minTemp) / (maxTemp - minTemp)) * chartH;

  // Polyline coordinates for temperature line
  const tempPoints = data.map((d, i) => `${getX(i)},${getTempY(d.temp)}`).join(' ');

  const activeData = selectedMonth !== null ? data.find((d) => d.month === selectedMonth) : null;

  return (
    <div className="w-full bg-[#FAF7F0] p-3 rounded-xl border border-amber-800/20 shadow-inner">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-rose-700">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full inline-block"></span>
            기온 (꺾은선, ℃)
          </span>
          <span className="flex items-center gap-1 font-semibold text-sky-700">
            <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm inline-block"></span>
            강수량 (막대, mm)
          </span>
        </div>
        {climateType && (
          <span className="text-[11px] font-medium text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
            {climateType}
          </span>
        )}
      </div>

      <div className="relative w-full flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-w-[360px] select-none"
        >
          {/* Background grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding.top + chartH * ratio;
            const rainVal = Math.round(maxRain * (1 - ratio));
            const tempVal = Math.round(minTemp + (maxTemp - minTemp) * (1 - ratio));
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartW}
                  y2={y}
                  stroke="#E5DECF"
                  strokeDasharray="3 3"
                />
                {/* Temp Axis Label (Left) */}
                <text
                  x={padding.left - 5}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-rose-800 font-mono font-medium"
                >
                  {tempVal}
                </text>
                {/* Rain Axis Label (Right) */}
                <text
                  x={padding.left + chartW + 5}
                  y={y + 3}
                  textAnchor="start"
                  className="text-[9px] fill-sky-800 font-mono font-medium"
                >
                  {rainVal}
                </text>
              </g>
            );
          })}

          {/* Rainfall Bars */}
          {data.map((d, i) => {
            const barW = Math.max(8, chartW / 12 - 6);
            const x = getX(i) - barW / 2;
            const y = getRainY(d.rain);
            const h = padding.top + chartH - y;
            const isSelected = selectedMonth === d.month;

            return (
              <g key={`bar-${d.month}`} onClick={() => setSelectedMonth(d.month)}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  fill={isSelected ? '#0284C7' : '#38BDF8'}
                  opacity={isSelected ? 0.95 : 0.75}
                  rx={2}
                  className="cursor-pointer transition-all hover:opacity-100"
                />
              </g>
            );
          })}

          {/* Temperature Line */}
          <polyline
            points={tempPoints}
            fill="none"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Temperature Points & Touch Targets */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getTempY(d.temp);
            const isSelected = selectedMonth === d.month;

            return (
              <g key={`point-${d.month}`} onClick={() => setSelectedMonth(d.month)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 5.5 : 3.5}
                  fill="#FFF"
                  stroke="#DC2626"
                  strokeWidth={isSelected ? 2.5 : 2}
                  className="cursor-pointer transition-all"
                />
                {/* Month label along bottom */}
                <text
                  x={cx}
                  y={padding.top + chartH + 16}
                  textAnchor="middle"
                  className={`text-[10px] font-medium cursor-pointer ${
                    isSelected ? 'fill-amber-900 font-bold underline' : 'fill-stone-600'
                  }`}
                >
                  {d.month}월
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Tooltip & Details */}
      <div className="mt-2 min-h-[38px] flex items-center justify-between bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200/80 text-xs">
        {activeData ? (
          <>
            <span className="font-bold text-amber-900">
              📌 {activeData.month}월 상세 정보:
            </span>
            <div className="flex items-center gap-3">
              <span className="text-rose-700 font-mono font-bold">
                기온: {activeData.temp.toFixed(1)}℃
              </span>
              <span className="text-sky-700 font-mono font-bold">
                강수량: {activeData.rain}mm
              </span>
            </div>
          </>
        ) : (
          <span className="text-stone-500 text-[11px] flex items-center gap-1 mx-auto">
            💡 월(1~12월) 또는 막대를 터치하면 해당 달의 정확한 수치를 확인할 수 있습니다.
          </span>
        )}
      </div>
    </div>
  );
};
