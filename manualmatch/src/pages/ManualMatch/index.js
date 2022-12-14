import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import useFrame from '../../hook/useFrame';
import PageLoading from './PageLoading';
import {createQueryDataMessage} from '../../utils/normalOperations';

import {
    customerModel
} from '../../utils/constant';

import './index.css';

const queryFields=[
    {field:"id"},
    {field:"name"}
];

const deliverFields=[
    {field:"id"},
    {field:"period"},
    {field:"material"},
    {field:"customer_material_number"},
    {field:"po_number"},
    {field:"price"},
    {field:"quantity",summarize:"sum(quantity)"},
    {field:"amount",summarize:"sum(amount)"},
    {field:"customer_id"},
    {field:"match_status"},
    {field:"match_failure_reason"},
    {field:"set_material"}
]

const billingFields=[
    {field:"id"},
    {field:"price"},
    {field:"quantity",summarize:"sum(quantity)"},
    {field:"amount",summarize:"sum(amount)"},
    {field:"billing_document"},
    {field:"sales_document_type"},
    {field:"period"},
    {field:"sold_to_party"},
    {field:"material"},
    {field:"customer_material_number"}
]

export default function ManualMatch(){
    const sendMessageToParent=useFrame();
    const {origin,item}=useSelector(state=>state.frame);
    const {deliveryLoaded,billingLoaded,deliveryData,billingData}=useSelector(state=>state.data);
    const {loaded:customerLoaded,current,material}=useSelector(state=>state.customer);

    //查询客户信息数据，填充客户下拉选择列
    useEffect(()=>{
        if(origin&&item&&customerLoaded===false){
            //查询客户信息
            const frameParams={
                frameType:item.frameType,
                frameID:item.params.key,
                origin:origin
            };
            const queryParams={
                modelID:customerModel,
                fields:queryFields,
                pagination:{current:1,pageSize:500}
            };
            console.log('sendMessageToParent:',origin,item);
            sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
        }
    },[customerLoaded,origin,item,sendMessageToParent]);

    useEffect(()=>{
        //查询数据
        const filter={};
        /*if(material&&material.length>0){
            filter['Op.or']=[
                {material:'%'+material+'%'},
                {customer_material_number:'%'+material+'%'}
            ]
        }*/
        if(origin&&item){
            if(current&&current.length>0){
                if(deliveryLoaded===false){
                    filter['customer_id']=current;
                    filter['match_status']={'Op.in':['0','2','3']}
                    
                    if(material&&material.length>0){
                        filter['Op.or']=[
                            {material:'%'+material+'%'},
                            {customer_material_number:'%'+material+'%'}
                        ]
                    }
                    
                    const frameParams={
                        frameType:item.frameType,
                        frameID:item.params.key,
                        origin:origin
                    };
                    const queryParams={
                        modelID:'dr_delivery_recon',
                        filter:filter,
                        fields:deliverFields,
                        pagination:{current:1,pageSize:10000}
                    };
                    sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
                } else if (billingLoaded===false){
                    filter['sold_to_party']=current;
                    filter['match_status']={'Op.in':['0','2','3']}
                    
                    if(material&&material.length>0){
                        filter['Op.or']=[
                            {material:'%'+material+'%'},
                            {customer_material_number:'%'+material+'%'}
                        ]
                    }
                    
                    const frameParams={
                        frameType:item.frameType,
                        frameID:item.params.key,
                        origin:origin
                    };
                    const queryParams={
                        modelID:'dr_billing_recon',
                        filter:filter,
                        fields:billingFields,
                        sorter:[
                            {
                                field:"priority",
                                order:"desc"
                            },
                            {
                                field:"id",
                                order:"asc"
                            }
                        ],
                        pagination:{current:1,pageSize:10000}
                    };
                    sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
                }
            }
        }
    },[current,item,origin,material,deliveryLoaded,billingLoaded]);

    return (
        <div className='main'>
            {customerLoaded?(
                <>
                    <Header sendMessageToParent={sendMessageToParent} origin={origin} item={item}  />
                    <Content deliveryData={deliveryData} billingData={billingData} />
                </>
            ):<PageLoading/>}    
        </div>
    );
}