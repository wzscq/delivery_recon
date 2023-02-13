import './index.css';

export default function StatusBar({deliveryData,billingData,selectedDelivery,selectedBilling}){
    
    let deliveryQuantity=0;
    let deliveryAmount=0;
    selectedDelivery.forEach(element => {
        deliveryData.list.forEach(delivery=>{
            if(delivery.id===element){
                deliveryQuantity+=parseInt(delivery.quantity);
                deliveryAmount+=parseFloat(delivery.amount);
            }
        })
    });

    const deliveryQuantityStr=(deliveryQuantity+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const deliveryAmountStr=(deliveryAmount.toFixed(2)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let billingQuantity=0;
    let billingAmount=0;
    selectedBilling.forEach(element => {
        billingData.list.forEach(billing=>{
            if(billing.id===element){
                billingQuantity+=parseInt(billing.quantity);
                billingAmount+=parseFloat(billing.amount);
            }
        })
    });

    const billingQuantityStr=(billingQuantity+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const billingAmountStr=(billingAmount.toFixed(2)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const diffQuantity=(deliveryQuantity-billingQuantity)
    const diffQuantityStr=(diffQuantity+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const diffAmount=(deliveryAmount-billingAmount).toFixed(2);
    const diffAmountStr=(diffAmount+'').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
    <div className='status-bar'>
        <div>
            <div className='delivery-title'>客户对账单</div>
            <div className='billing-title'>Billing</div>
        </div>
        <div>
            <div className="delivery-status" >
                已选择：{selectedDelivery.length} 条，数量：<span style={{fontWeight:500}}>{deliveryQuantityStr}</span>，金额：<span style={{fontWeight:500}}>{deliveryAmountStr}</span>
            </div>
            <div className="diff-status">
                数量差：<span style={{fontWeight:500,color:diffQuantity===0?'green':'red'}}>{diffQuantityStr}</span>，金额差：<span style={{fontWeight:500,color:diffAmountStr<0.01&&diffAmountStr>-0.01?'green':'red'}}>{diffAmountStr}</span>
            </div>
            <div className="billing-status">
                已选择：{selectedBilling.length} 条，数量：<span style={{fontWeight:500}}>{billingQuantityStr}</span>，金额：<span style={{fontWeight:500}}>{billingAmountStr}</span>
            </div>
        </div>
    </div>
    );
}