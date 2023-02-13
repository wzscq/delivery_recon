import { Table } from 'antd';
import { SplitPane } from "react-collapse-pane";
import { useResizeDetector } from 'react-resize-detector';
import moment from 'moment';
import { useMemo } from 'react';

import VirtualTable from '../../../components/VirtualTable';
import StatusBar from '../StatusBar';
import {setSelectedDelivery,setSelectedBilling} from '../../../redux/dataSlice';

import './index.css';
import { useDispatch } from 'react-redux';

const groupDeliveryColumns=[
    {
        title: '客户物料号',
        dataIndex: 'customer_material_number',
        key: 'customer_material_number',
        ellipsis: true,
        width:200
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width:150,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width:150,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '物料号',
        dataIndex: 'material',
        key: 'material',
        ellipsis: true,
        width:150
    },
    {
        title: '收货日期',
        dataIndex: 'delivery_date',
        key: 'delivery_date',
        width:130,
        render:(text)=>{
            const value=moment(text).format("YYYY-MM-DD");
            return <div >{value}</div>;
        }
    },
    {
        title: '账期',
        dataIndex: 'period',
        key: 'period',
        width:100,
        render:(text)=>{
            return <div >{text}</div>;
        }
    },
    {
        title: '客户',
        dataIndex: 'customer_id',
        key: 'customer_id',
        width:100,
        render:(text)=>{
            return <div >{text}</div>;
        }
    },
    {
        title: '匹配失败原因',
        dataIndex: 'match_failure_reason',
        key: 'match_failure_reason',
        width:300,
        render:(text)=>{
            return <div >{text}</div>;
        }
    },
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width:150
    }
];

/*const groupDeliveryColumns=[
    {
        title:"客户对账单",
        render:(text)=>{
            return <div >{text}</div>;
        },
        children:deliveryColumns
    }
]*/

const groupBillingColumns=[
    {
        title: '客户物料号',
        dataIndex: 'customer_material_number',
        key: 'customer_material_number',
        ellipsis: true,
        width:200
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width:150,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width:150,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '物料号',
        dataIndex: 'material',
        key: 'material',
        ellipsis: true,
        width:150
    },
    {
        title: 'Billing Date',
        dataIndex: 'billing_date',
        key: 'billing_date',
        width:130,
        render:(text)=>{
            const value=moment(text).format("YYYY-MM-DD");
            return <div >{value}</div>;
        }
    },
    {
        title: 'Billing Document',
        dataIndex: 'billing_document',
        key: 'billing_document',
        width:230,
        render:(text)=>{
            return <div >{text}</div>;
        }
    },
    {
        title: 'Sales Document Type',
        dataIndex: 'sales_document_type',
        key: 'sales_document_type',
        width:260,
        render:(text)=>{
            return <div>{text}</div>;
        }
    },
    {
        title: '账期',
        dataIndex: 'period',
        key: 'period',
        width:100,
        render:(text)=>{
            return <div>{text}</div>;
        }
    },
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width:150
    }
];

export default function Content({deliveryData,billingData,selectedDelivery,selectedBilling}){
    //const { height:heigthLeft,ref:refLeft } = useResizeDetector();
    //const { height:heightRight,ref:refRight } = useResizeDetector();
    const dispatch=useDispatch();
    console.log("Content Refresh",selectedDelivery);

    //return (<div>Content</div>);

    const { height,ref } = useResizeDetector();

    //const [selectedDelivery,setSelectedDelivery]=useState([]);
    //const [selectedBilling,setSelectedBilling]=useState([]);
    //处理行的选中
    const rowSelectionDelivery = useMemo(()=>{
        return {
            selectedRowKeys:selectedDelivery,
            onChange: (selectedRowKeys)=>{dispatch(setSelectedDelivery(selectedRowKeys))},
        };
    },[selectedDelivery,dispatch]);

    const rowSelectionBilling = useMemo(()=>{
        return {
            selectedRowKeys:selectedBilling,
            onChange: (selectedRowKeys)=>{dispatch(setSelectedBilling(selectedRowKeys))},
        };
    },[selectedBilling,dispatch]);

    const getDeliverySummary=()=>{
        return (
            <Table.Summary fixed>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>{deliveryData.total}</Table.Summary.Cell>
                    <Table.Summary.Cell index={2}><div className='row-number'>{deliveryData.summaries?.quantity?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}><div className='row-number'>{deliveryData.summaries?.amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></Table.Summary.Cell>
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

    const getBillingSummary=()=>{
        return (
            <Table.Summary fixed>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>{billingData.total}</Table.Summary.Cell>
                    <Table.Summary.Cell index={2}><div className='row-number'>{billingData.summaries?.quantity?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}><div className='row-number'>{billingData.summaries?.amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></Table.Summary.Cell>
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

    const scrolly=height-111;

    return (
        <div className='content'>
            <StatusBar deliveryData={deliveryData} billingData={billingData} selectedDelivery={selectedDelivery} selectedBilling={selectedBilling}  />
            <div className="group-detail">
                <div className='table-split' ref={ref} style={{height:'100%'}}>
                    <SplitPane dir='ltr' initialSizes={[50,50]} split="vertical" collapse={false}>
                        <div className='table-left' >
                            <VirtualTable
                                columns={groupDeliveryColumns}
                                dataSource={deliveryData.list}
                                pagination={false}
                                scroll={{y: scrolly,}}
                                rowKey='id'
                                size='small'
                                bordered
                                summary={getDeliverySummary}
                                rowSelection={rowSelectionDelivery}
                            />
                        </div>
                        <div className='table-right'>
                            <VirtualTable
                                columns={groupBillingColumns}
                                dataSource={billingData.list}
                                pagination={false}
                                rowSelection={rowSelectionBilling}
                                scroll={{y: scrolly,}}
                                summary={getBillingSummary}
                                rowKey='id'
                                size='small'
                                bordered
                            />
                        </div>
                    </SplitPane>
                </div>
            </div>
        </div>
    );
}