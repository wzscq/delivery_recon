import { useSelector } from "react-redux";

import {createOpenMessage} from '../../../utils/normalOperations';

import './index.css';

export default function Content({sendMessageToParent}){
    const {list} =useSelector((state)=>state.data);

    const viewDetail=(type,side)=>{
        if(type==0||type==1){
            //跳转到比对分组页面 
            const params={
                url:"/listview/#/dr_delivery_billing_recon_group",
                location:"tab",
                title:"对账匹配分组",
                key:"/model/dr_delivery_billing_recon_group",
                view:type==0?"exactMatchGroupsAll":"partialMatchingGroupsAll"
            }
            sendMessageToParent(createOpenMessage(params));
        }

        if(type==2){
            if(side==0){
                //跳转到待比对对账单页面
                const params={
                    url:"/listview/#/dr_delivery_recon",
                    location:"tab",
                    title:"客户对账单比对记录",
                    key:"/model/dr_delivery_recon",
                    view:"viewForMatchAll"
                }
                sendMessageToParent(createOpenMessage(params));
            }
            if(side==1){
                //跳转到待比对Billing页面
                const params={
                    url:"/listview/#/dr_billing_recon",
                    location:"tab",
                    title:"OpenBilling比对记录",
                    key:"/model/dr_billing_recon",
                    view:"viewForMatch"
                }
                sendMessageToParent(createOpenMessage(params));
            }
        }
    }

    const getValue=(match_result,value_type,side)=>{
        let row=list?.filter(item=>item.match_result==match_result&&item.value_type==value_type)[0]
        let value=row?.delivery_value;
        if(side==1){
            value=row?.billing_value;
        }
        if(value){
            value=value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return value;
    }

    const getPercent=(match_result,value_type,side)=>{
        let total=0;
        list.filter(item=>item.value_type==value_type).forEach(element => {
            if(side==0){
                total=total+parseFloat(element.delivery_value);
            } else {
                total=total+parseFloat(element.billing_value);
            }         
        });
        
        let row=list?.filter(item=>item.match_result==match_result&&item.value_type==value_type)[0]
        let value=row?.delivery_value;
        if(side==1){
            value=row?.billing_value;
        }

        return (parseFloat(value)/total*100).toFixed(0);
    }

    return (
        <div className="match-result-content">
        <div className="match-result-content-grid">
            <div className="title" style={{gridColumnStart:1,gridColumnEnd:3,gridRowStart:1,gridRowEnd:2,backgroundColor:"#FFFFFF",padding:5}}>
                客户对账单
            </div>
            <div className="title" style={{gridColumnStart:3,gridColumnEnd:5,gridRowStart:1,gridRowEnd:2,backgroundColor:"#FFFFFF",padding:5}}>
                我方Billing
            </div>
            <div className="sub-title"  style={{gridColumnStart:1,gridColumnEnd:4,gridRowStart:2,gridRowEnd:3,backgroundColor:"#FFFFFF",padding:5}}>
                1、双方数量/单价完全一致的记录 [<a onClick={()=>viewDetail(0,0)}>详情</a>]
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:3,gridRowEnd:4,backgroundColor:"#FFFFFF",padding:5}}>
                记录数
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:3,gridRowEnd:4,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(0,0,0)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:3,gridRowEnd:4,backgroundColor:"#FFFFFF",padding:5}}>
                记录数
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:3,gridRowEnd:4,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(0,0,1)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:4,gridRowEnd:5,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总数量
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:4,gridRowEnd:5,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(0,1,0)}<span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:4,gridRowEnd:5,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总数量
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:4,gridRowEnd:5,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(0,1,1)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:5,gridRowEnd:6,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总金额
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:5,gridRowEnd:6,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(0,2,0)} <span className="percent">{getPercent(0,2,0)}%</span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:5,gridRowEnd:6,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总金额
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:5,gridRowEnd:6,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(0,2,1)} <span className="percent">{getPercent(0,2,1)}%</span>
            </div>

            <div className="sub-title"  style={{gridColumnStart:1,gridColumnEnd:4,gridRowStart:6,gridRowEnd:7,backgroundColor:"#FFFFFF",padding:5}}>
                2、双方数量/单价有差异的记录 [<a onClick={()=>viewDetail(1,0)}>详情</a>]
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:7,gridRowEnd:8,backgroundColor:"#FFFFFF",padding:5}}>
                记录数
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:7,gridRowEnd:8,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(1,0,0)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:7,gridRowEnd:8,backgroundColor:"#FFFFFF",padding:5}}>
                记录数
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:7,gridRowEnd:8,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(1,0,1)}<span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:8,gridRowEnd:9,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总数量
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:8,gridRowEnd:9,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(1,1,0)}<span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:8,gridRowEnd:9,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总数量
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:8,gridRowEnd:9,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(1,1,1)}<span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:9,gridRowEnd:10,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总金额
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:9,gridRowEnd:10,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(1,2,0)}<span className="percent">{getPercent(1,2,0)}%</span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:9,gridRowEnd:10,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总金额
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:9,gridRowEnd:10,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(1,2,1)}<span className="percent">{getPercent(1,2,1)}%</span>
            </div>

            <div className="sub-title"  style={{gridColumnStart:1,gridColumnEnd:4,gridRowStart:10,gridRowEnd:11,backgroundColor:"#FFFFFF",padding:5}}>
                3、双方未能匹配的记录 [<a onClick={()=>viewDetail(2,0)}>对账单详情</a>][<a onClick={()=>viewDetail(2,1)}>Billing详情</a>]
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:11,gridRowEnd:12,backgroundColor:"#FFFFFF",padding:5}}>
                记录数
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:11,gridRowEnd:12,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(2,0,0)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:11,gridRowEnd:12,backgroundColor:"#FFFFFF",padding:5}}>
                记录数
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:11,gridRowEnd:12,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(2,0,1)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:12,gridRowEnd:13,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总数量
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:12,gridRowEnd:13,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(2,1,0)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:12,gridRowEnd:13,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总数量
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:12,gridRowEnd:13,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(2,1,1)} <span className="percent"></span>
            </div>
            <div className="label" style={{gridColumnStart:1,gridColumnEnd:2,gridRowStart:13,gridRowEnd:14,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总金额
            </div>
            <div className="value"  style={{gridColumnStart:2,gridColumnEnd:3,gridRowStart:13,gridRowEnd:14,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(2,2,0)} <span className="percent">{getPercent(2,2,0)}%</span>
            </div>
            <div className="label" style={{gridColumnStart:3,gridColumnEnd:4,gridRowStart:13,gridRowEnd:14,backgroundColor:"#FFFFFF",padding:5}}>
                记录汇总金额
            </div>
            <div className="value" style={{gridColumnStart:4,gridColumnEnd:5,gridRowStart:13,gridRowEnd:14,backgroundColor:"#FFFFFF",padding:5}}>
                {getValue(2,2,1)} <span className="percent">{getPercent(2,2,1)}%</span>
            </div>
        </div>
        </div>
    );
} 