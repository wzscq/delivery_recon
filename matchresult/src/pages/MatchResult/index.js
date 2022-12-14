import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Content from './Content';
import useFrame from '../../hook/useFrame';
import PageLoading from './PageLoading';
import {createQueryDataMessage} from '../../utils/normalOperations';
import Header from './Header';

import {
    customerModel,
    matchResultModel
} from '../../utils/constant';

import './index.css';

const queryFields=[
    {field:'id'},
    {field:'name'}
];

const queryMatchResult=[
    {field:'id'},
    {field:'customer_id'},
    {field:'match_result'},
    {field:'delivery_value'},
    {field:'billing_value'},
    {field:'value_type'}
]

export default function MatchResult(){
    const sendMessageToParent=useFrame();
    const {origin,item}=useSelector(state=>state.frame);
    const {loaded:customerLoaded,current}=useSelector(state=>state.customer);
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

    useEffect(()=>{
        if(current!==null&&dataLoaded===false){
            //查询统计数据客户信息
            const frameParams={
                frameType:item.frameType,
                frameID:item.params.key,
                origin:origin
            };
            const queryParams={
                modelID:matchResultModel,
                filter:{customer_id:current},
                fields:queryMatchResult,
                pagination:{current:1,pageSize:500}
            };
            console.log('sendMessageToParent1:',origin,item);
            sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
        }
    },[current,dataLoaded,sendMessageToParent,item,origin]);

    return (
        <div className='main'>
            {customerLoaded?(
                <>
                    <Header/>
                    <Content sendMessageToParent={sendMessageToParent}/>
                </>
            ):<PageLoading/>}      
        </div>
    );
}