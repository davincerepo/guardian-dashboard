import {
    Badge,
    BadgeProps,
    Button,
    Table,
    TableProps,
    Tag,
    TagProps,
    Typography,
} from 'antd';
import { Projects } from '../../../../types';
import { BacktestVO, PositionRecordVO } from 'src/types/BacktestTypes';
import { MarketTypeMap } from 'src/types/KLineTypes';
import DateUtils from 'src/utils/DateUtils';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const COLUMNS = [
    {
        title: '方向',
        dataIndex: 'openLong',
        key: 'openLong',
        render: (_: any, { }: PositionRecordVO) => (
            <Typography.Paragraph
                ellipsis={{ rows: 1 }}
                className="text-capitalize"
                style={{
                    marginBottom: 0,
                    color: _ ? 'green' : 'red',
                    fontWeight: 'bold'
                }}
            >
                {_ ? '多' : '空'}
            </Typography.Paragraph>
        ),
    },
    {
        title: '盈亏',
        dataIndex: 'profit',
        key: 'profit',
        render: (_: any, { profitRate }: PositionRecordVO) => (_ != null && <span style={{
            color: _ <= 0 ? 'red' : 'green'
        }}>{_.toFixed(2)}<br />{(profitRate * 100).toFixed(2)}%</span>),
    },
    {
        title: '剩余资金',
        dataIndex: 'remainFund',
        key: 'remainFund',
        render: (_: any) => (_ != null && <span className="text-capitalize" style={{
        }}>{_.toFixed(2)}</span>),
    },
    {
        title: '持仓量',
        dataIndex: 'volume',
        key: 'volume',
        render: (_: any, { quotaAssetVolume, remainFund, profit }: PositionRecordVO) => (_ != null && profit != null && <span className="text-capitalize" style={{
        }}>{_}<br />{quotaAssetVolume}
        <br />{(quotaAssetVolume / (remainFund - profit)).toFixed(2)}x
        </span>),
    },
    {
        title: '开平仓价格',
        dataIndex: 'openPrice',
        key: 'openPrice',
        render: (_: any, { openPrice, closePrice }: PositionRecordVO) => (_ != null && <span className="text-capitalize" style={{
        }}>{_}<br />{closePrice}<br />
        {closePrice >= openPrice ? '+' : ''}{((closePrice - openPrice) / openPrice * 100).toFixed(2)}%
        </span>),
    },
    {
        title: '开平仓时间',
        dataIndex: 'openTime',
        key: 'openTime',
        render: (_: any, { closeTime }: PositionRecordVO) => (_ != null && <span className="text-capitalize" style={{
        }}>{DateUtils.format1(_)}<br />{DateUtils.format1(closeTime)}</span>),
    },
];

type Props = {
    data: PositionRecordVO[];
} & TableProps<any>;

export const PositionRecordsTable = ({ data, ...others }: Props) => {
    return (
        <Table
            dataSource={data}
            columns={COLUMNS}
            className="overflow-scroll"
            rowKey={undefined as any}
            {...others}
        />
    );
};
