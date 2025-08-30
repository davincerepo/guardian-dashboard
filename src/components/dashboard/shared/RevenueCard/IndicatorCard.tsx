import { CardProps, Flex, Space, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { green, red } from '@ant-design/colors';
import CountUp from 'react-countup';
import { Card } from '../../../index.ts';
import { CSSProperties } from 'react';

type Props = {
    title: string;
    value: string | number;
    diff?: number;
    justify?: CSSProperties['justifyContent'];
    height?: number;
} & CardProps;

export const IndicatorCard = (props: Props) => {
    const { title, value, diff, justify, height, ...others } = props;

    return (
        <Card {...others} style={{ height }}>
            <Flex
                vertical
                gap={justify ? 0 : 'large'}
                justify={justify}
                style={{ height: height ? height - 60 : 'auto' }}
            >
                <Typography.Title level={5} style={{ margin: 0 }}>
                    <span>{title}</span>
                </Typography.Title>
                <Flex justify="space-between" align="center">
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        <span>{value}</span>
                    </Typography.Title>
                    {diff != null && <Space style={{ color: diff > 0 ? green[6] : red[5] }}>
                        {diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        <Typography.Text
                            style={{
                                color: diff > 0 ? green[6] : red[5],
                                fontWeight: 500,
                            }}
                        >
                            <CountUp end={diff} />%
                        </Typography.Text>
                    </Space>}
                </Flex>
            </Flex>
        </Card>
    );
};
