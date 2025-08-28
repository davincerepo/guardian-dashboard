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
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApiRequest } from 'src/hooks/useRequest';
import BacktestService from 'src/services/backtest/BacktestService';
import { BacktestListRequest } from 'src/types/BacktestTypes';
import { BacktestTable } from 'src/components/dashboard/projects/ProjectsTables/BacktestTable';

const PROJECT_TABS = [
    {
        key: 'all',
        label: 'All projects',
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

export const BacktestDashboardPage = () => {
    const page = 1;

    const listFun = useCallback(async () => {
        let req: BacktestListRequest = {
            page: page,
            pageSize: 30
        }
        return await BacktestService.list(req)
    }, [page]);

    const {
        data: backtestData,
        errorCode: backtestError,
        loading: backtestLoading,
    } = useApiRequest(listFun);

    const [projectTabsKey, setProjectsTabKey] = useState<string>('all');

    const PROJECT_TABS_CONTENT: Record<string, React.ReactNode> = {
        all: <BacktestTable key="all-projects-table" data={backtestError == 0 ? backtestData.list : []} />,
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
                <title>Projects | Antd Dashboard</title>
            </Helmet>
            <PageHeader
                title="回测"
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
            <Row
                gutter={[
                    { xs: 8, sm: 16, md: 24, lg: 32 },
                    { xs: 8, sm: 16, md: 24, lg: 32 },
                ]}
            >
                <Col span={24}>
                    <Card
                        title="回测列表"
                        extra={
                            <Space>
                                <Button icon={<CloudUploadOutlined />}>Import</Button>
                                <Button icon={<PlusOutlined />}>New project</Button>
                            </Space>
                        }
                        tabList={PROJECT_TABS}
                        activeTabKey={projectTabsKey}
                        onTabChange={onProjectsTabChange}
                    >
                        {PROJECT_TABS_CONTENT[projectTabsKey]}
                    </Card>
                </Col>

            </Row>
        </div>
    );
};
