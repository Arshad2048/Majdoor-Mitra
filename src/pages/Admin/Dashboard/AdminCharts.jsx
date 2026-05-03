import React, { useState } from 'react';

const AdminCharts = ({ data, type = 'line', color = '#3B82F6', height = 240 }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value), 5);
    const avgValue = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
    
    // SVG Smoothing Logic (Bezier)
    const getPathData = () => {
        if (data.length < 2) return '';
        return data.reduce((path, d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.value / maxValue) * 100;
            if (i === 0) return `M ${x},${y}`;
            
            // Bezier control points
            const prevX = ((i - 1) / (data.length - 1)) * 100;
            const prevY = 100 - (data[i - 1].value / maxValue) * 100;
            const cp1x = prevX + (x - prevX) / 2;
            return `${path} C ${cp1x},${prevY} ${cp1x},${y} ${x},${y}`;
        }, '');
    };

    const pathData = getPathData();
    const areaPathData = `${pathData} L 100,100 L 0,100 Z`;

    const barWidth = (100 / data.length) * 0.7;
    const barGap = (100 / data.length) * 0.3;

    return (
        <div className="admin-chart-wrapper premium-chart">
            <div className="admin-chart-container" style={{ height }}>
                <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none" 
                    className="admin-svg-chart"
                >
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id={`bar-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[25, 50, 75].map(line => (
                        <line 
                            key={line} 
                            x1="0" y1={line} x2="100" y2={line} 
                            stroke="#F1F5F9" strokeWidth="0.5" 
                        />
                    ))}

                    {type === 'line' ? (
                        <>
                            <path d={areaPathData} fill={`url(#gradient-${color})`} />
                            <path
                                d={pathData}
                                fill="none"
                                stroke={color}
                                strokeWidth="3"
                                strokeLinecap="round"
                                filter="url(#glow)"
                                vectorEffect="non-scaling-stroke"
                            />
                            {data.map((d, i) => (
                                <circle
                                    key={i}
                                    cx={(i / (data.length - 1)) * 100}
                                    cy={100 - (d.value / maxValue) * 100}
                                    r={hoveredIndex === i ? "1.5" : "0"}
                                    fill={color}
                                    stroke="white"
                                    strokeWidth="0.5"
                                    style={{ transition: 'r 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                />
                            ))}
                        </>
                    ) : (
                        data.map((d, i) => {
                            const h = (d.value / maxValue) * 100;
                            const x = i * (barWidth + barGap);
                            return (
                                <rect
                                    key={i}
                                    x={x}
                                    y={100 - h}
                                    width={barWidth}
                                    height={h}
                                    fill={hoveredIndex === i ? color : `url(#bar-grad-${color})`}
                                    rx="2"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                />
                            );
                        })
                    )}

                    {type === 'line' && data.map((d, i) => (
                        <rect
                            key={`trigger-${i}`}
                            x={(i / (data.length - 1)) * 100 - 5}
                            y="0"
                            width="10"
                            height="100"
                            fill="transparent"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </svg>
                
                {hoveredIndex !== null && (
                    <div 
                        className="chart-tooltip active"
                        style={{ 
                            left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
                            transform: `translateX(-50%)`
                        }}
                    >
                        <div className="tooltip-value">{data[hoveredIndex].value}</div>
                        <div className="tooltip-label">{data[hoveredIndex].label}</div>
                    </div>
                )}
            </div>

            <div className="chart-labels-row">
                <span>{data[0].label}</span>
                <span className="chart-avg-label">Avg: {avgValue.toFixed(1)}</span>
                <span>{data[data.length - 1].label}</span>
            </div>
        </div>
    );
};

export default AdminCharts;

