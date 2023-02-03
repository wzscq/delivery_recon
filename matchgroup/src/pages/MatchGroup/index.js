import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Header from './Header';
import Content from './Content';
import useFrame from '../../hook/useFrame';
import PageLoading from './PageLoading';
import {createQueryDataMessage} from '../../utils/normalOperations';
import DialogSelectBilling from './DialogSelectBilling';

import './index.css';

const queryFields=[
    {field:"id"},
    {field:"version"},
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
        fields:[
            {field:'match_group'},
            {field:"price"},
            {field:"quantity"},
            {field:"amount"},
            {field:"billing_document"},
            {field:"sales_document_type"},
            {field:"adjusted_amount"},
            {field:"adjusted_price"},
            {field:"period"},
            {field:"customer_material_number"},
            {field:"material"},
            {field:"billing_date"},
            {field:"version"},
            {field:"id"}
        ]
    },
    {
        field:"adjustments",
        fieldType:"one2many",
        relatedModelID:"dr_delivery_billing_adjustment",
        relatedField:"match_group",
        fields:[
            {field:'match_group'},
            {field:"sold_to_party"},
            {field:"price"},
            {field:"quantity"},
            {field:"amount"},
            {field:"sales_document_type"},
            {field:"material"},
            {field:"set_material"},
            {field:"source_id"},
            {field:"adjust_by"}
        ]
    }
];

export default function MatchGroup(){
    const sendMessageToParent=useFrame();
    const {origin,item}=useSelector(state=>state.frame);
    const {loaded,list,showSelectBilling}=useSelector(state=>state.data);

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

    useEffect(()=>{
        if(loaded===true&&showSelectBilling===true){
          console.log("sendMessageToParent");
          const billingFields=[
            {field:"price"},
            {field:"quantity"},
            {field:"amount"},
            {field:"billing_document"},
            {field:"sales_document_type"},
            {field:"adjusted_amount"},
            {field:"adjusted_price"},
            {field:"period"},
            {field:"customer_material_number"},
            {field:"material"},
            {field:"billing_date"},
            {field:"version"},
            {field:"id"}
          ];
          //通过客户、零件筛选billing
          const customerID=list[0].customer_id.value;
          const material=list[0].material;
          const filter={
            sold_to_party:customerID,
            customer_material_number:material,
            match_status:{'Op.ne':'1'}
          }
          const modelID='dr_billing_recon';
    
          const frameParams={
            frameType:item.frameType,
            frameID:item.params.key,
            origin:origin
          };
          const queryParams={
              modelID:modelID,
              filter:filter,
              fields:billingFields,
              pagination:{current:1,pageSize:100000}
          };
          sendMessageToParent(createQueryDataMessage(frameParams,queryParams));
        }
    },[loaded,showSelectBilling,origin,list,item,sendMessageToParent]);

    return (
        <div className='main'>
            <Header sendMessageToParent={sendMessageToParent}/>
            {loaded===false?<PageLoading/>:<Content list={list}/>}
            {showSelectBilling===true?<DialogSelectBilling/>:null}
        </div>
    );
}