import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const ViolationsChart = ({ violations }) => {
    // Aggregate violations by type for a pie chart
    const data = useMemo(() => {
        const counts = {};
        violations.forEach(v => {
            counts[v.type] = (counts[v.type] || 0) + 1;
        });

        return Object.keys(counts).map(key => ({
            name: key.replace('_', ' ').toUpperCase(),
            value: counts[key]
        }));
    }, [violations]);

    const option = {
        tooltip: { trigger: 'item' },
        legend: {
            top: '5%',
            left: 'center',
            textStyle: { color: '#fff' }
        },
        series: [
            {
                name: 'Violation Types',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#1f2937',
                    borderWidth: 2
                },
                label: { show: false },
                data: data
            }
        ]
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg h-[400px]">
            <h3 className="text-gray-400 text-sm font-medium uppercase mb-4">Violation Distribution</h3>
            <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />
        </div>
    );
};

export default ViolationsChart;
