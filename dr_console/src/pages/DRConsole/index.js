import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Content from './Content';
import useFrame from '../../hook/useFrame';
import PageLoading from './PageLoading';
import {createQueryDataMessage} from '../../utils/normalOperations';
import Header from './Header';

import {
    customerModel,
    customerBatchModel,
    matchResultModel
} from '../../utils/constant';

import './index.css';

const queryFields=[
    {field:'id'},
    {field:'name'}
];

const queryBatchFields=[
    {field:'id'},
    {field:'customer_id'},
    {field:'import_batch_number'},
];

const queryMatchResult=[
    {field:"id"},
    {field:"delivery_quantity_processing"},
    {field:"delivery_amount_processing"},
    {field:"billing_quantity_processing"},
    {field:"billing_amount_processing"},
    {field:"delivery_amount_match"},
    {field:"delivery_quantity_match"},
    {field:"billing_quantity_match"},
    {field:"billing_amount_match"},
    {
        field:'match_result',
        relatedField:"id",
        fieldType:"one2many",
        relatedModelID:"dr_view_match_result_v2",
        pagination:{current:1,pageSize:1},
        fields:[
            {field:"id"},
            {field:"customer_id"},
            {field:"delivery_quantity"},
            {field:"billing_quantity"},
            {field:"delivery_amount"},
            {field:"billing_amount"},
            {field:"quantity_gap"},
            {field:"amount_gap"},
            {field:"exact_match"},
            {field:"partial_match"},
            {field:"adjusted_quantity"},
            {field:"adjusted_amount"},
            {field:"not_adjusted_quantity"},
            {field:"not_adjusted_amount"}
        ]
    },
]

export default function MatchResult(){
    const sendMessageToParent=useFrame();
    const {origin,item}=useSelector(state=>state.frame);
    const {loaded:customerLoaded,current}=useSelector(state=>state.customer);
    const {loaded:batchLoaded,current:curentBatch}=useSelector(state=>state.batch);
    const {loaded:dataLoaded} = useSelector(state=>state.data);

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

    //查询客户对账单批次信息，填充批次对话框
    useEffect(()=>{
        if(origin&&item&&current!==null&&batchLoaded===false){
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
    },[current,batchLoaded,origin,item,sendMessageToParent]);

    useEffect(()=>{
        if(curentBatch!==null&&dataLoaded===false){
            //查询统计数据客户信息
            const frameParams={
                frameType:item.frameType,
                frameID:item.params.key,
                origin:origin
            };
            const queryParams={
                modelID:matchResultModel,
                filter:{id:curentBatch},
                fields:queryMatchResult
            };
            console.log('sendMessageToParent1:',origin,item);
            sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
        }
    },[curentBatch,dataLoaded,sendMessageToParent,item,origin]);

    return (
        <div className='main'>
            {customerLoaded?(
                <>
                    <Header/>
                    <Content sendMessageToParent={sendMessageToParent} curentBatch={curentBatch} customerID={current}/>
                </>
            ):<PageLoading/>}      
        </div>
    );
}