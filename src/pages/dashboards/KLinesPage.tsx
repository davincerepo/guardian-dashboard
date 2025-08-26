import {
    HomeOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import {
    PageHeader
} from '../../components';
import { DASHBOARD_ITEMS } from '../../constants';
import { useEffect, useRef } from 'react';
import { CandleStickChart } from 'src/components/Chart/CandleStickChart';
import { KLineChart } from 'src/components/Chart/KLineChart';
import KLineService from 'src/services/kline/KLineService';
import { SettingKey, webSetting } from 'src/framework/config/WebSetting';

const candleData = [
    { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
    { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 },
    { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
    { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
    { open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: 1642773476 },
    { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
    { open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: 1642946276 },
    { open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: 1643032676 },
    { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 },
    { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
];

export const KLinesDashboardPage = () => {

    useEffect(() => {
        message.success('11');

        (async () => {
            let res = await KLineService.hello("11")
            console.log(res.body);
        })()

        return () => {
            message.success('卸载');
        }
    }, [])

    return (
        <div>
            <Helmet>
                <title>K线 - guardian dashboard</title>
            </Helmet>
            <PageHeader
                title="K线"
                breadcrumbs={[
                    {
                        title: (
                            <>
                                <HomeOutlined />
                                <span>home</span>
                            </>
                        ),
                        path: '/',
                    },
                    {
                        title: (
                            <>
                                <PieChartOutlined />
                                <span>dashboards</span>
                            </>
                        ),
                        menu: {
                            items: DASHBOARD_ITEMS.map((d) => ({
                                key: d.title,
                                title: <Link to={d.path}>{d.title}</Link>,
                            })),
                        },
                    },
                    {
                        title: 'projects',
                    },
                ]}
            />

            <div style={{
                width: '90%'
            }}>
                <text>{crypto.randomUUID()}</text>
                <KLineChart></KLineChart>

            </div>

        </div>
    );
};
