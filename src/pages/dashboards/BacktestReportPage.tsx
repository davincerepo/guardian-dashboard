import { Alert, Button, Col, Row, Segmented, Space } from 'antd';
import {
    Card,
    ClientsTable,
    Loader,
    PageHeader,
    ProjectsCard,
    RevenueCard,
} from '../../components';
import { Column } from '@ant-design/charts';
import { Projects } from '../../types';
import { useCallback, useState } from 'react';
import {
    CloudUploadOutlined,
    HomeOutlined,
    PieChartOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { DASHBOARD_ITEMS } from '../../constants';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApiRequest } from 'src/hooks/useRequest';
import BacktestService from 'src/services/backtest/BacktestService';
import { BacktestListRequest } from 'src/types/BacktestTypes';
import { BacktestTable } from 'src/components/dashboard/projects/ProjectsTables/BacktestTable';
import { PositionRecordsTable } from 'src/components/dashboard/projects/ProjectsTables/PositionRecordsTable';
import { IndicatorCard } from 'src/components/dashboard/shared/RevenueCard/IndicatorCard';

const PROJECT_TABS = [
    {
        key: 'all',
        label: '仓位历史',
    },
    {
        key: 'inProgress',
        label: 'Active',
    },
    {
        key: 'onHold',
        label: 'On Hold',
    },
];

export const BacktestReportPage = () => {
    const { id } = useParams();

    const req = useCallback(async () => {
        return await BacktestService.getReport(id!)
    }, []);

    const {
        data: reportData,
        errorCode: reportError,
        loading: reportLoading,
    } = useApiRequest(req);

    const [projectTabsKey, setProjectsTabKey] = useState<string>('all');

    const PROJECT_TABS_CONTENT: Record<string, React.ReactNode> = {
        all: <PositionRecordsTable key="all" data={reportError === 0 ? reportData.positionRecords : []} />,
        // inProgress: (
        //     <BacktestTable
        //         key="in-progress-projects-table"
        //         data={[]}
        //     />
        // ),
        // onHold: (
        //     <BacktestTable
        //         key="on-hold-projects-table"
        //         data={[]}
        //     />
        // ),
    };

    const onProjectsTabChange = (key: string) => {
        setProjectsTabKey(key);
    };

    return (
        <div>
            <Helmet>
                <title>回测报告</title>
            </Helmet>
            <PageHeader
                title={"回测报告"}
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
            {reportData != null && <Row
                gutter={[
                    { xs: 8, sm: 16, md: 24, lg: 32 },
                    { xs: 8, sm: 16, md: 24, lg: 32 },
                ]}
            >
                <Col xs={24} sm={12} lg={6}>
                    <IndicatorCard title="收益率" value={(reportData.revenueSummary.profitRate * 100).toFixed(2) + '%'} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <IndicatorCard title="盈亏比" value={(reportData.revenueSummary.plr).toFixed(2)} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <IndicatorCard title="胜率" value={(reportData.revenueSummary.winRate * 100).toFixed(2) + '%'} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <IndicatorCard title="夏普率" value={reportData.revenueSummary.sharpeRatio.toFixed(2)} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <IndicatorCard title="最大回撤" value={(reportData.revenueSummary.maxPullback * 100).toFixed(2) + '%'} />
                </Col>
                <Col span={24}>
                    <Card
                        title="交易记录"
                        tabList={PROJECT_TABS}
                        activeTabKey={projectTabsKey}
                        onTabChange={onProjectsTabChange}
                    >
                        {PROJECT_TABS_CONTENT[projectTabsKey]}
                    </Card>
                </Col>

            </Row>}
        </div>
    );
};
