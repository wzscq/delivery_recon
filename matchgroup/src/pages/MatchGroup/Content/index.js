import { Table } from 'antd';
import { SplitPane } from "react-collapse-pane";
import { useResizeDetector } from 'react-resize-detector';
import './index.css';

const groupColumns=[
    {
        dataIndex:"customer_id",
        title:"客户名称",
        width: 250,
        ellipsis: true,
        render:(text)=>{
            let value=text.value;
            if(text.list&&text.list.length>0&&text.list[0].name){
                value='('+value+')'+text.list[0].name;
            }
            return value;
        }
    },
    {dataIndex:"po_number",title:"订单号",width: 100,ellipsis: true},
    {dataIndex:"material",title:"客户物料编码",width: 200,ellipsis: true},
    {
        dataIndex:"set_material",
        title:"套件",width: 50,
        ellipsis: true,
        render:(text)=>{
            return text==='1'?'是':'否';
        }
    },
    {
        dataIndex:"confirmed",
        title:"确认状态",
        width: 75,
        ellipsis: true,
        render:(text)=>{
            return text==='1'?'已确认':'未确认';
        }
    },
    {
        dataIndex:"recon_status",
        title:"核销状态",
        width: 75,
        ellipsis: true,
        render:(text)=>{
            return text==='1'?'已核销':'未核销';
        }
    },
    {
        dataIndex:"match_result",
        title:"匹配结果",
        width: 75,
        ellipsis: true,
        render:(text)=>{
            return text==='1'?'部分匹配':'完全匹配';
        }
    },
    {dataIndex:"update_time",title:"操作时间",width: 150,ellipsis: true},
    {dataIndex:"update_user",title:"操作人",width: 100,ellipsis: true}
]

const groupDeliveryColumns=[
    {
        title: '物料',
        dataIndex: 'material',
        key: 'material',
        ellipsis: true,
        width:150
    },
    {
        title: '客户对账单',
        children: [
            {
                title: '序号',
                dataIndex: 'sn',
                key: 'sn',
                width:70,
                render:(text)=>{
                    return <div className='row-number'>{text}</div>;
                }
            },
            {
                title: '单价',
                dataIndex: 'delivery_price',
                key: 'delivery_price',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: '数量',
                dataIndex: 'delivery_quantity',
                key: 'delivery_quantity',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: '金额',
                dataIndex: 'delivery_amount',
                key: 'delivery_amount',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
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
            }
        ]
    },
    {
        title: '数量差异',
        dataIndex: 'quantity_diff',
        key: 'quantity_diff',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        title: '金额差异',
        dataIndex: 'amount_diff',
        key: 'amount_diff',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    }
];

const groupBillingColumns=[
    {
        title: '序号',
        dataIndex: 'sn',
        key: 'sn',
        width:70,
        render:(text)=>{
            return <div className='row-number'>{text}</div>;
        }
    },
    {
        title: 'Billing',
        children: [
            {
                title: '单价',
                dataIndex: 'billing_price',
                key: 'billing_price',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: '数量',
                dataIndex: 'billing_quantity',
                key: 'billing_quantity',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: '金额',
                dataIndex: 'billing_amount',
                key: 'billing_amount',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: '调整后单价',
                dataIndex: 'adjusted_price',
                key: 'adjusted_price',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: '调整后金额',
                dataIndex: 'adjusted_amount',
                key: 'adjusted_amount',
                width:100,
                render:(text)=>{
                    const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
                    return <div className='row-number'>{value}</div>;
                }
            },
            {
                title: 'Billing Document',
                dataIndex: 'billing_document',
                key: 'billing_document',
                width:130,
                render:(text)=>{
                    return <div >{text}</div>;
                }
            },
            {
                title: 'Sales Document Type',
                dataIndex: 'sales_document_type',
                key: 'sales_document_type',
                width:160,
                render:(text)=>{
                    return <div >{text}</div>;
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
            }
        ]
    }
];

const adjustmentColumns=[
    {
        dataIndex:"sn",
        title:'序号',
        width:70,
        render:(text, record, index)=>{
            return record.children?null:<div className='row-number'>{index+1}</div>;
        }
    },
    {dataIndex:"sales_document_type",title:'Sales DocType',width:120,ellipsis: true},
    {
        dataIndex:"price",
        title:'单价',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        dataIndex:"quantity",
        title:'数量',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        dataIndex:"amount",
        title:'金额',
        width:100,
        render:(text)=>{
            const value=text?.replace?text.replace(/\B(?=(\d{3})+(?!\d))/g, ','):text;
            return <div className='row-number'>{value}</div>;
        }
    },
    {
        dataIndex:"adjust_by",
        title:'调整方式',
        width:120,
        render:(text,record)=>{
            return record.children?'':(text==='1'?'系统自动调差':'人工调差');
        }
    }
];

export default function Content({list}){
    const { height:heigthLeft,ref:refLeft } = useResizeDetector();
    const { height:heightRight,ref:refRight } = useResizeDetector();

    //按照物料号统计
    const deliveryMap={};
   
    list[0].deliveries?.list.forEach((row,index)=>{
        const material=row.material;
        if(deliveryMap[material]===undefined){
            deliveryMap[material]={
                delivery_quantity:0,
                delivery_amount:0,
                billing_quantity:0,
                billing_amount:0,
                quantity_diff:0,
                amount_diff:0,
                delivery_price:0,
                billing_price:0,
                children:[],
                material:row.material,
                key:row.material
            }
        }
        const totalDelivery=deliveryMap[material];

        totalDelivery.delivery_quantity+=parseFloat(row.quantity);
        totalDelivery.delivery_amount+=parseFloat(row.amount);
        totalDelivery.delivery_price=parseFloat(row.price);

        totalDelivery.children.push({
            delivery_price:row.price,
            delivery_quantity:row.quantity,
            delivery_amount:row.amount,
            sn:totalDelivery.children.length+1,
            period:row.period
        });
    });

    const totalBilling={
        delivery_quantity:0,
        delivery_amount:0,
        billing_quantity:0,
        billing_amount:0,
        quantity_diff:0,
        amount_diff:0,
        delivery_price:0,
        billing_price:0,
        adjusted_price:0,
        adjusted_amount:0
    }

    const groupBilling=list[0].billings?.list.map((row,index) => {
       
        totalBilling.billing_quantity+=parseFloat(row.quantity);
        totalBilling.billing_amount+=parseFloat(row.amount);
        totalBilling.billing_price=parseFloat(row.price);
        if(row.adjusted_price){
            totalBilling.adjusted_price=parseFloat(row.adjusted_price);
            totalBilling.adjusted_amount+=parseFloat(row.adjusted_amount);
        }

        const billingRow={
            billing_price:row.price,
            billing_quantity:row.quantity,
            billing_amount:row.amount,
            sn:index+1,
            billing_document:row.billing_document,
            sales_document_type:row.sales_document_type,
            adjusted_price:row.adjusted_price,
            adjusted_amount:row.adjusted_amount,
            period:row.period
        }

        return billingRow;
    });

    const deliveryMaterials=Object.keys(deliveryMap);
    let totalDeliveryAmount=parseFloat('0.0');
    let deliveryData=[];
    deliveryMaterials.forEach((item,index)=>{
        const totalDelivery=deliveryMap[item];
        totalDelivery.delivery_quantity=totalDelivery.delivery_quantity.toFixed(2);
        totalDelivery.delivery_amount=totalDelivery.delivery_amount.toFixed(2);
        totalDelivery.delivery_price=totalDelivery.delivery_price.toFixed(2);
        totalDeliveryAmount+=parseFloat(totalDelivery.delivery_amount);
        deliveryData.push(totalDelivery);
    });
    deliveryData=deliveryData.sort((a,b)=>b.delivery_quantity-a.delivery_quantity);
    const maxDeliveryQuantity=deliveryData[0].delivery_quantity;
    const minQuantity=deliveryData[1]?.delivery_quantity;
    let amount_diff=(totalDeliveryAmount-totalBilling.billing_amount).toFixed(2);
    let quantity_diff=(maxDeliveryQuantity-totalBilling.billing_quantity).toFixed(2);
    if(quantity_diff>-0.001 && quantity_diff<0.001){
        quantity_diff=0.00;
    }

    let min_quantity_diff=0;
    if(minQuantity){
        min_quantity_diff=(minQuantity-totalBilling.billing_quantity).toFixed(2);
        if(min_quantity_diff>-0.001 && min_quantity_diff<0.001){
            min_quantity_diff=0.00;
        }
    }

    if(amount_diff>-0.001 && amount_diff<0.001){
        amount_diff=0.00;
    }

    deliveryData[0].quantity_diff=quantity_diff;
    deliveryData[0].amount_diff=amount_diff;
    
    totalBilling.billing_quantity=totalBilling.billing_quantity.toFixed(2);
    totalBilling.billing_amount=totalBilling.billing_amount.toFixed(2);
    totalBilling.billing_price=totalBilling.billing_price.toFixed(2);
    totalBilling.adjusted_price=totalBilling.adjusted_price.toFixed(2);
    totalBilling.adjusted_amount=totalBilling.adjusted_amount.toFixed(2);
    totalBilling.children=groupBilling;
    
    const adjustTotal={
        quantity:0,
        minQuantity:0,
        amount:0,
        children:list[0].adjustments?list[0].adjustments.list:[]
    };
    list[0].adjustments?.list.forEach(row=>{
        if(row.set_material===null){
            adjustTotal.quantity=adjustTotal.quantity+parseFloat(row.quantity);
        }
        adjustTotal.minQuantity=adjustTotal.minQuantity+parseFloat(row.quantity);
        adjustTotal.amount=adjustTotal.amount+parseFloat(row.amount);
    });

    adjustTotal.quantity=adjustTotal.quantity.toFixed(2);
    adjustTotal.amount=adjustTotal.amount.toFixed(2);

    let resultAmount=(amount_diff-adjustTotal.amount).toFixed(2);
    let resultQuantity=(quantity_diff-adjustTotal.quantity).toFixed(2);
    if(resultAmount>-0.001 && resultAmount<0.001){
        resultAmount=0.00;
    }

    if(resultQuantity>-0.001 && resultQuantity<0.001){
        resultQuantity=0.00;
    }

    let resultMinQuantity=0;
    if(minQuantity){
        resultMinQuantity=(min_quantity_diff-adjustTotal.minQuantity).toFixed(2);
        if(resultMinQuantity>-0.001 && resultMinQuantity<0.001){
            resultMinQuantity=0.00;
        }
    }

    return (
        <div className='content'>
            <div className="group">
                <div className='title'>分组信息({list[0].id})：</div>
                <Table
                    columns={groupColumns}
                    dataSource={list}
                    pagination={false}
                    scroll={{y: 240,}}
                    size='small'
                    bordered
                />
            </div>
            <div className="group-detail">
                <div className='title'>匹配信息：</div>
                <div className='table-split' style={{height:heigthLeft>heightRight?heigthLeft:heightRight}}>
                    <SplitPane dir='ltr' initialSizes={[50,50]} split="vertical" collapse={false}>
                        <div className='table-left' ref={refLeft} >
                            <Table
                                columns={groupDeliveryColumns}
                                dataSource={deliveryData}
                                pagination={false}
                                scroll={{y: 200,}}
                                size='small'
                                bordered
                            />
                        </div>
                        <div className='table-right' ref={refRight}>
                            <Table
                                columns={groupBillingColumns}
                                dataSource={[totalBilling]}
                                pagination={false}
                                scroll={{y: 200,}}
                                size='small'
                                bordered
                            />
                        </div>
                    </SplitPane>
                </div>
            </div>
            <div className="adjustment">
                <div>差额调整：</div>
                <Table
                    columns={adjustmentColumns}
                    dataSource={[adjustTotal]}
                    pagination={false}
                    scroll={{y: 200,}}
                    size='small'
                    bordered
                />
            </div>
            <div className="result">
                <div>调整后汇总信息：</div>
                <div>数量差异：<span style={{color:resultQuantity===0&&resultMinQuantity===0?'green':'red'}}>{(resultQuantity+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{minQuantity?" , ":""}{minQuantity?((resultMinQuantity+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',')):""}</span></div>
                <div>金额差异：<span style={{color:resultAmount===0?'green':'red'}}>{(resultAmount+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></div>
            </div>
        </div>
    );
}