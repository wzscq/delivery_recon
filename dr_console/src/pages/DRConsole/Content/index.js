import { useSelector } from "react-redux";
import {SwapOutlined,ImportOutlined,ExportOutlined} from '@ant-design/icons';

import {createOpenMessage,createOperationMessage} from '../../../utils/normalOperations';
import {FRAME_MESSAGE_TYPE} from '../../../utils/constant';

import './index.css';

const viewProcessingDelivery={
    model:"dr_delivery_statement",
    view:"viewProcessing",
    title:"客户对账单"
}

const viewProcessingBilling={
    model:"dr_billing",
    view:"viewProcessing",
    title:"OpenBilling"
}

const viewMatchDelivery={
    model:"dr_delivery_recon",
    view:"viewForMatch",
    title:"客户对账单比对记录"
}

const viewMatchBilling={
    model:"dr_billing_recon",
    view:"viewForMatch",
    title:"OpenBilling比对记录"
}

/*const viewMatchedGroup={
    model:"dr_delivery_billing_recon_group",
    view:"allGroups",
    title:"对账匹配分组"
}*/

const viewExactMatch={
    model:"dr_delivery_billing_recon_group",
    view:"exactMatchGroupsAll",
    title:"对账匹配分组"
}

const viewPartialMatch={
    model:"dr_delivery_billing_recon_group",
    view:"partialMatchingGroupsAll",
    title:"对账匹配分组"
}

export default function Content({sendMessageToParent,customerID,curentBatch}){
    const {list} =useSelector((state)=>state.data);

    const import_batch_number=curentBatch?.substring(customerID.length+1,curentBatch.length);
    
    viewProcessingDelivery.filter={customer_id:customerID,import_batch_number:import_batch_number};
    viewProcessingBilling.filter={sold_to_party:customerID};

    viewExactMatch.filter={customer_id:customerID,import_batch_number:import_batch_number};
    viewPartialMatch.filter={customer_id:customerID,import_batch_number:import_batch_number};

    const viewDetail=({model,view,title,filter})=>{
        //跳转到待处理对账单页面
        const params={
            url:"/listview/#/"+model,
            location:"tab",
            title:title,
            key:"/model/"+model,
            view:view,
            filter:filter
        }
        sendMessageToParent(createOpenMessage(params));
    }

    const viewManualMatch=({model,view,title})=>{
        //跳转到待处理对账单页面
        const params={
            url1:"http://localhost:9906",
            url:"http://1.15.91.60:8050/manualmatch/",
            location:"tab",
            title:"手工匹配",
            key:"/delivery_recon/manualmatch",
            customerID:customerID,
            import_batch_number:import_batch_number
        }
        sendMessageToParent(createOpenMessage(params));
    }

    const importDelivery=()=>{
        const params={
            url:"/formview/#/dr_delivery_statement/formControlImportFlow/create",
            location:"modal",
            title:"导入客户对账单",
            key:"/model/dr_delivery_statement/formControlImportFlow/create",
            width:600,
            height:350
        }
        sendMessageToParent(createOpenMessage(params));
    }

    const importBilling=()=>{
        const params={
            url:"/formview/#/dr_billing/formControlESI/create",
            location:"modal",
            title:"导入OpenBilling",
            key:"/model/dr_billing/formControlESI/create",
            width:600,
            height:250
        }
        sendMessageToParent(createOpenMessage(params));
    }

    const onMatch=()=>{
        const message={
            type:FRAME_MESSAGE_TYPE.DO_OPERATION,
            data:{
                operationItem:{
                    id:"doProcessing",
                    name:"客户对账单匹配",
                    type:"request",
                    params:{
                        url:"/redirect",
                        method:"post"
                    },
                    input:{
                        to:"processingFlow",
                        flowID:"delivery_billing_recon_and_adjust",
                        modelID:"dr_delivery_recon",
                        filter:{
                            import_batch_number:import_batch_number
                        }
                    },
                    description:"提交客户对账单匹配处理",
                    successOperation:{
                        type:"reloadFrameData",
                        params:{
                            location:"tab",
                            key:"/delivery_recon/dr_console"
                        },
                        description:"刷新页面数据"
                    }
                }
            }
        }
        sendMessageToParent(message);
    }

    const formatNumberInt=(value)=>{
        if(value){
            const intVal=parseFloat(value).toFixed(0)+'';
            return intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return 0;
    }

    const formatNumber=(value)=>{
        if(value){
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return 0;
    }

    const exportCDN=()=>{
        const operation={"name":"导出CDN",
            type:"request",
            params:{
                url:"/redirect",
                method:"post",
                responseType:"blob"
            },
            input:{
                to:"exportCDN"
            },
            description:"导出CDN"
        }
        sendMessageToParent(createOperationMessage(operation));
    }

    const exportInvoice=()=>{
        const operation={
            name:"导出开票数据",
            type:"request",
            params:{
                url:"/redirect",
                method:"post",
                responseType:"blob"
            },
            input:{
                to:"exportTaxLink"
            },
            description:"导出CDN"
        }
        sendMessageToParent(createOperationMessage(operation));
    }

    let processingData=list?list[0]:{};
    const matchedList=processingData?.match_result?.list;
    const matchedData=matchedList?matchedList[0]:{};

    let billingQuantity=matchedData?.billing_quantity?parseFloat(matchedData.billing_quantity):0;
    billingQuantity=billingQuantity+(matchedData?.adjusted_quantity?parseFloat(matchedData.adjusted_quantity):0);
    billingQuantity=billingQuantity.toFixed(0);

    let billingAmount=matchedData?.billing_amount?parseFloat(matchedData.billing_amount):0;
    billingAmount=billingAmount+(matchedData?.adjusted_amount?parseFloat(matchedData.adjusted_amount):0);
    billingAmount=billingAmount.toFixed(2);

    return (
        <div className="match-result-content">
        <div className="match-result-content-grid">
            <div className="title" style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:1,gridRowEnd:2}}>
                开票通知
            </div>
            <div className="title" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:1,gridRowEnd:2}}>
                匹配调差
            </div>
            <div className="title" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:1,gridRowEnd:2}}>
                Billing
            </div>

            <div className="phase_label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:2,gridRowEnd:3}}>
                待处理
            </div>
            <div className="data_block" style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:2,gridRowEnd:3}}>
                <div style={{float:"left"}}>
                <div>数量：<a onClick={()=>viewDetail(viewProcessingDelivery)}>{formatNumberInt(processingData?.delivery_quantity_processing)}</a></div> 
                <div>金额：<a onClick={()=>viewDetail(viewProcessingDelivery)}>{formatNumber(processingData?.delivery_amount_processing)}</a></div>
                </div>
                <div style={{float:"right"}}><a onClick={()=>{importDelivery()}}>获取客户对账单<ImportOutlined /></a></div>
            </div>
            <div className="" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:2,gridRowEnd:3}}>
                
            </div>
            <div className="data_block" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:2,gridRowEnd:3}}>
                <div style={{float:"left"}}>
                    <div>数量：<a onClick={()=>viewDetail(viewProcessingBilling)}>{formatNumberInt(processingData?.billing_quantity_processing)}</a></div> 
                    <div>金额：<a onClick={()=>viewDetail(viewProcessingBilling)}>{formatNumber(processingData?.billing_amount_processing)}</a></div>
                </div>
                <div style={{float:"right"}}><a onClick={()=>{importBilling()}}>获取Billing<ImportOutlined /></a></div>
            </div>
            

            <div className="phase_label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:3,gridRowEnd:4}}>
                待匹配
            </div>
            <div className="data_block" style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:3,gridRowEnd:4}}>
                <div style={{float:"left"}}>
                <div>数量：<a onClick={()=>viewManualMatch(viewMatchDelivery)}>{formatNumberInt(processingData?.delivery_quantity_match)}</a></div> 
                <div>金额：<a onClick={()=>viewManualMatch(viewMatchDelivery)}>{formatNumber(processingData?.delivery_amount_match)}</a></div>
                </div>
            </div>
            <div className="" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:3,gridRowEnd:4}}>
                <div style={{width:"100%",textAlign:"center",lineHeight:'55px'}}><a onClick={onMatch}><SwapOutlined /><span style={{padding:"10px"}}>点我进行匹配调差</span><SwapOutlined /></a></div>
            </div>
            <div className="data_block" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:3,gridRowEnd:4}}>
                <div style={{float:"left"}}>
                    <div>数量：<a onClick={()=>viewManualMatch(viewMatchBilling)}>{formatNumberInt(processingData?.billing_quantity_match)}</a></div> 
                    <div>金额：<a onClick={()=>viewManualMatch(viewMatchBilling)}>{formatNumber(processingData?.billing_amount_match)}</a></div>
                </div>
            </div>

            <div className="phase_label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:4,gridRowEnd:5}}>
                匹配结果
            </div>
            <div className="data_block" style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:4,gridRowEnd:5}}>
                <div style={{float:"left"}}>
                    <div>数量：{formatNumberInt(matchedData?.delivery_quantity)}</div> 
                    <div>金额：{formatNumber(matchedData?.delivery_amount)}</div>
                </div>
            </div>
            <div className="data_block" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:4,gridRowEnd:5}}>
                <div style={{float:"left"}}>
                    <div>完全匹配：<a onClick={()=>viewDetail(viewExactMatch)}>{formatNumber(matchedData?.exact_match)}</a></div> 
                    <div>部分匹配：<a onClick={()=>viewDetail(viewPartialMatch)}>{formatNumber(matchedData?.partial_match)}</a></div>
                </div>
                <div style={{float:"right"}}>
                    <div>数量差异：{formatNumberInt(matchedData?.quantity_gap)}</div> 
                    <div>金额差异：{formatNumber(matchedData?.amount_gap)}</div>
                </div>
            </div>
            <div className="data_block" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:4,gridRowEnd:5}}>
                <div style={{float:"left"}}>
                    <div>数量：{formatNumberInt(matchedData?.billing_quantity)}</div> 
                    <div>金额：{formatNumber(matchedData?.billing_amount)}</div>
                </div>
            </div>

            <div className="phase_label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:5,gridRowEnd:6}}>
                差异调整
            </div>
            <div className="" style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:5,gridRowEnd:6}}>
                
            </div>
            <div className="data_block" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:5,gridRowEnd:6}}>
                <div style={{float:"left"}}>
                    <div>调整数量：{formatNumberInt(matchedData?.adjusted_quantity)}</div> 
                    <div>调整金额：{formatNumber(matchedData?.adjusted_amount)}</div>
                </div>
                <div style={{float:"right"}}><a onClick={()=>{exportCDN()}}>导出CDN<ExportOutlined /></a></div>
            </div>
            <div className="" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:5,gridRowEnd:6}}>
               
            </div>

            <div className="phase_label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:6,gridRowEnd:7}}>
                开票差异
            </div>
            <div className="" style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:6,gridRowEnd:7}}>
                
            </div>
            <div className="data_block" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:6,gridRowEnd:7}}>
                <div style={{width:"100%",textAlign:"right"}}><a onClick={()=>{exportInvoice()}}>导出开票<ExportOutlined /></a></div>
                
                <div style={{float:"left"}}>
                    <div>开票数量：{formatNumberInt(billingQuantity)}</div> 
                    <div>开票金额：{formatNumber(billingAmount)}</div>
                </div>
                <div style={{float:"right"}}>
                    <div>数量差异：{formatNumberInt(matchedData?.not_adjusted_quantity)}</div> 
                    <div>金额差异：{formatNumber(matchedData?.not_adjusted_amount)}</div>
                </div>
            </div>
            <div className="" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:6,gridRowEnd:7}}>
               
            </div>
        </div>
        </div>
    );
} 