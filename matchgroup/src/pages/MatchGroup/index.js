import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import useFrame from '../../hook/useFrame';
import PageLoading from './PageLoading';
import {createQueryDataMessage} from '../../utils/normalOperations';

import './index.css';

const queryFields=[
    {field:"id"},
    {field:"confirmed"},
    {field:"recon_status"},
    {field:"match_result"},
    {
        field:"customer_id",
        fieldType:"many2one",
        relatedModelID:"dr_customer",
        fields:[
            {field:"id"},
            {field:"name"}
        ]
    },
    {field:"po_number"},
    {field:"material"},
    {field:"set_material"},
    {field:"create_time"},
    {field:"create_user"},
    {field:"update_time"},
    {field:"update_user"},
    {
        field:"deliveries",
        fieldType:"one2many",
        relatedModelID:"dr_delivery_recon",
        relatedField:"match_group",
        fields:[
            {field:'match_group'},
            {field:"price"},
            {field:"quantity"},
            {field:"amount"},
            {field:"period"},
            {field:"material"}
        ]
    },
    {
        field:"billings",
        fieldType:"one2many",
        relatedModelID:"dr_billing_recon",
        relatedField:"match_group",
        fields:[
            {field:'match_group'},
            {field:"price"},
            {field:"quantity"},
            {field:"amount"},
            {field:"billing_document"},
            {field:"sales_document_type"},
            {field:"adjusted_amount"},
            {field:"adjusted_price"},
            {field:"period"}
        ]
    },
    {
        field:"adjustments",
        fieldType:"one2many",
        relatedModelID:"dr_delivery_billing_adjustment",
        relatedField:"match_group",
        fields:[
            {field:'match_group'},
            {field:"price"},
            {field:"quantity"},
            {field:"amount"},
            {field:"sales_document_type"},
            {field:"material"},
            {field:"source_id"},
            {field:"adjust_by"}
        ]
    }
];

export default function MatchGroup(){
    const sendMessageToParent=useFrame();
    const {origin,item}=useSelector(state=>state.frame);
    const {loaded,list}=useSelector(state=>state.data);

    useEffect(()=>{
        if(origin&&item){
            if(loaded===false){
                const dataID=item?.input?.selectedRowKeys[0];
                if(dataID){
                    const frameParams={
                        frameType:item.frameType,
                        frameID:item.params.key,
                        origin:origin
                    };
                    const queryParams={
                        modelID:item.input.modelID,
                        filter:{id:dataID},
                        fields:queryFields,
                        pagination:{current:1,pageSize:1}
                    };
                    sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
                }
            }
        }
    },[loaded,origin,item,sendMessageToParent]);

    return (
        <div className='main'>
            <Header sendMessageToParent={sendMessageToParent}/>
            {loaded===false?<PageLoading/>:<Content list={list}/>}
        </div>
    );
}