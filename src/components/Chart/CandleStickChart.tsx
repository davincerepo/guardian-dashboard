import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export const CandleStickChart = props => {
    const {
        data,
        colors: {
            backgroundColor = 'white',
            textColor = 'black',
            upColor = '#26a69a',
            downColor = '#ef5350',
            wickUpColor = '#26a69a',
            wickDownColor = '#ef5350',
        } = {},
    } = props;

    const chartContainerRef: any = useRef();

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor,
            downColor,
            wickUpColor,
            wickDownColor,
            borderVisible: false,
        });

        candlestickSeries.setData(data);
        chart.timeScale().fitContent();

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, textColor, upColor, downColor, wickUpColor, wickDownColor]);

    return <div ref={chartContainerRef} />;
};
