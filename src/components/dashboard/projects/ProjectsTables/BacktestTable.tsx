import {
  Badge,
  BadgeProps,
  Table,
  TableProps,
  Tag,
  TagProps,
  Typography,
} from 'antd';
import { Projects } from '../../../../types';
import { BacktestVO } from 'src/types/BacktestTypes';
import { MarketTypeMap } from 'src/types/KLineTypes';
import DateUtils from 'src/utils/DateUtils';

const COLUMNS = [
  {
    title: '标的',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (_: any, { symbol }: BacktestVO) => (
      <Typography.Paragraph
        ellipsis={{ rows: 1 }}
        className="text-capitalize"
        style={{ marginBottom: 0 }}
      >
        {symbol.substring(0, 20)}
      </Typography.Paragraph>
    ),
  },
  {
    title: '市场',
    dataIndex: 'marketType',
    key: 'marketType',
    render: (_: any) => <span className="text-capitalize">{MarketTypeMap[_].name}</span>,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (_: any) => <span className="text-capitalize">{DateUtils.format1(_)}</span>,
  },
  {
    title: '参数包',
    dataIndex: 'paramsPackageId',
    key: 'paramsPackageId',
  },
];

type Props = {
  data: BacktestVO[];
} & TableProps<any>;

export const BacktestTable = ({ data, ...others }: Props) => {
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
