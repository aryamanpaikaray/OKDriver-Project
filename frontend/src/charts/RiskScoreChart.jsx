import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const RiskScoreChart = ({ analytics }) => {
    // Faking a small sparkline trend towards the actual riskScore for visualization
    const data = useMemo(() => {
        const base = Math.max(0, analytics.riskScore - 20);
        return [base + 5, base + 2, base + 10, base + 8, base + 15, analytics.riskScore];
    }, [analytics.riskScore]);

    const option = {
        tooltip: { trigger: 'axis' },
        grid: {
            top: '20%',
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now'],
            axisLabel: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } }
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: '#374151' } },
            axisLabel: { color: '#9ca3af' }
        },
        series: [
            {
                data: data,
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(239, 68, 68, 0.5)' }, // Tailwind red-500
                            { offset: 1, color: 'rgba(239, 68, 68, 0.0)' }
                        ]
                    }
                },
                itemStyle: { color: '#ef4444' },
                lineStyle: { width: 3 }
            }
        ]
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg h-[400px]">
            <h3 className="text-gray-400 text-sm font-medium uppercase mb-4">Risk Score Trend</h3>
            <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />
        </div>
    );
};

export default RiskScoreChart;
