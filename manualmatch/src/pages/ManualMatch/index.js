import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import useFrame from '../../hook/useFrame';
import PageLoading from './PageLoading';
import {createQueryDataMessage} from '../../utils/normalOperations';

import {
    customerModel,
    customerBatchModel
} from '../../utils/constant';

import './index.css';

const queryFields=[
    {field:"id"},
    {field:"name"}
];

const queryBatchFields=[
    {field:'id'},
    {field:'customer_id'},
    {field:'import_batch_number'},
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
    {field:"set_material"},
    {field:"delivery_date"}
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
    {field:"customer_material_number"},
    {field:"billing_date"}
]

export default function ManualMatch(){
    const sendMessageToParent=useFrame();
    const {origin,item}=useSelector(state=>state.frame);
    const {deliveryLoaded,billingLoaded,deliveryData,billingData}=useSelector(state=>state.data);
    const {loaded:customerLoaded,current,material}=useSelector(state=>state.customer);
    const {loaded:batchLoaded,current:batchCurrent}=useSelector(state=>state.batch);

    console.log("ManualMatch refresh");

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

    //查询对账单导入批次信息
    useEffect(()=>{
        if(origin&&item&&customerLoaded===true&&batchLoaded===false){
            //查询客户信息
            const frameParams={
                frameType:item.frameType,
                frameID:item.params.key,
                origin:origin
            };
            const queryParams={
                modelID:customerBatchModel,
                fields:queryBatchFields,
                filter:{customer_id:current},
                pagination:{current:1,pageSize:500}
            };
            console.log('sendMessageToParent:',origin,item);
            sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
        }
    },[current,customerLoaded,batchLoaded,origin,item,sendMessageToParent]);

    useEffect(()=>{
        //查询数据
        
        /*if(material&&material.length>0){
            filter['Op.or']=[
                {material:'%'+material+'%'},
                {customer_material_number:'%'+material+'%'}
            ]
        }*/
        if(origin&&item&&customerLoaded===true&&batchLoaded===true){
            const filter={};
            if(deliveryLoaded===false){
                filter['customer_id']=current;
                const import_batch_number=batchCurrent.substring(current.length+1,batchCurrent.length);
                filter['import_batch_number']=import_batch_number;
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
    },[current,batchCurrent,batchLoaded,customerLoaded,item,origin,material,deliveryLoaded,billingLoaded,sendMessageToParent]);

    return (
        <div className='main'>
            {customerLoaded?(
                <>
                    <Header sendMessageToParent={sendMessageToParent} origin={origin} item={item}  />
                    {deliveryLoaded===true&&billingLoaded===true?<Content deliveryData={deliveryData} billingData={billingData} />:null}
                </>
            ):<PageLoading/>}    
        </div>
    );
}