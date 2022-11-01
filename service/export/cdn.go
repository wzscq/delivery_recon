package export

import (
	"buoyancyinfo.com/delivery_recon/crvClient"
	"buoyancyinfo.com/delivery_recon/common"
	"encoding/json"
	"log"
	"github.com/xuri/excelize/v2"
	"github.com/gin-gonic/gin"
)

type CDNColumn struct {
	Field string
	Header string
}

var CDNColumns = []CDNColumn{
	{ Header:"Sold-To Party",Field:"sold_to_party"},
	{ Header:"customer name(zh)",Field:"customer_name_zh"},
	{ Header:"Billing Date",Field:"billing_date"},
	{ Header:"Billing Document",Field:"billing_document"},
	{ Header:"Item",Field:"item"},
	{ Header:"Billing Type",Field:"billing_type"},
	{ Header:"Delivery",Field:"delivery"},
	{ Header:"Material",Field:"material"},
	{ Header:"Material Description",Field:"material_description"},
	{ Header:"Billed Quantity",Field:"quantity"},
	{ Header:"Document Currency",Field:"document_currency"},
	{ Header:"Net value",Field:"amount"},
	{ Header:"Original unit price原始未税单价",Field:"price"},
	{ Header:"New unit price新未税单价",Field:"adjusted_price"},
	{ Header:"Net diff value差异金额",Field:"adjusted_amount"},
}

var QueryFields = []map[string]interface{}{
	{"field": "id"},
	{"field": "version"},
	{
        "field":"billings",
        "fieldType":"one2many",
        "relatedModelID":"dr_billing_recon",
        "relatedField":"match_group",
        "fields":[]map[string]interface{}{
            {"field":"match_group"},
			{"field":"sold_to_party"},
			{"field":"billing_date"},
			{"field":"billing_type"},
			{"field":"material"},
			{"field":"material_description"},
            {"field":"price"},
            {"field":"quantity"},
            {"field":"amount"},
            {"field":"billing_document"},
            {"field":"sales_document_type"},
            {"field":"adjusted_amount"},
            {"field":"adjusted_price"},
            {"field":"period"},
			{"field":"customer_name_zh"},
			{"field":"item"},
			{"field":"delivery"},
			{"field":"document_currency"},
		},
    },
    {
        "field":"adjustments",
        "fieldType":"one2many",
        "relatedModelID":"dr_delivery_billing_adjustment",
        "relatedField":"match_group",
        "fields":[]map[string]interface{}{
            {"field":"match_group"},
            {"field":"price"},
            {"field":"quantity"},
            {"field":"amount"},
            {"field":"sales_document_type"},
            {"field":"material"},
            {"field":"source_id"},
            {"field":"adjust_by"},
		},
    },
}

var borderStyle=[]excelize.Border{
	{Type: "left", Color: "000000", Style: 1},
	{Type: "top", Color: "000000", Style: 1},
	{Type: "bottom", Color: "000000", Style: 1},
	{Type: "right", Color: "000000", Style: 1},
}

func exportCDN(
	req *crvClient.CommonReq,
	header *crvClient.CommonHeader,
	crvClient *crvClient.CRVClient,
	c *gin.Context)(*common.CommonRsp){
	if req.SelectedRowKeys!=nil && len(*req.SelectedRowKeys)>0 {
		filter:=&map[string]interface{}{
			"id":map[string]interface{}{
				"Op.in":*req.SelectedRowKeys,
			},
		}
		req.Filter=filter
		req.FilterData=nil
	}

	req.Fields=&QueryFields
	rsp,_:=crvClient.Query(req,header)
	
	if rsp.Error==true {
		jsonStr, _:= json.MarshalIndent(rsp, "", "    ")
		log.Println(string(jsonStr))
		return rsp
	}

	f := excelize.NewFile()

	styleTitle, _ := f.NewStyle(&excelize.Style{
		Border: borderStyle,
		Alignment:&excelize.Alignment{
			Horizontal:"center",
			Vertical:"center",
			WrapText: true,
		},
		Font:&excelize.Font {
			Size:12,
			Bold:false,
		},
		Fill:excelize.Fill{
			Pattern:1,
			Color:[]string{"aaaaaa",},
			Type:"pattern",
		},
	})

	styleValue,_:=f.NewStyle(&excelize.Style{
		Border: borderStyle,
		Alignment:&excelize.Alignment{
			Horizontal:"left",
			Vertical:"center",
		},
		Font:&excelize.Font {
			Size:12,
			Bold:false,
		},
	})

	f.DeleteSheet("Sheet1")
	sheetName:="调整记录"
    f.SetActiveSheet(f.NewSheet(sheetName))
	sheetRow:=1
	f.SetColWidth(sheetName, "A", "O", 20)
	//写入标题行
	for colNo,col:=range(CDNColumns){
		cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
		f.SetCellStr(sheetName,cellStart,col.Header)	
		f.SetCellStyle(sheetName,cellStart,cellStart,styleTitle)
	}
	f.SetRowHeight(sheetName,sheetRow,45)
	sheetRow++

	list,_:=rsp.Result.(map[string]interface{})["list"]
	records,_:=list.([]interface{})

	for _,groupRow:=range(records) {
		billings,hasBillings:=groupRow.(map[string]interface{})["billings"].(map[string]interface{})
		adjustments,hasAdjustments:=groupRow.(map[string]interface{})["adjustments"].(map[string]interface{})
		if hasBillings && hasAdjustments {
			billingList,hasBillingList:=billings["list"].([]interface{})
			_,hasAdjustmentList:=adjustments["list"].([]interface{})
			if hasBillingList && hasAdjustmentList  {
				for _,billingRow:=range(billingList) {
					rowMap:=billingRow.(map[string]interface{})
					for colNo,col:=range(CDNColumns){
						if len(col.Field)>0 {
							value,ok:=rowMap[col.Field]
							if ok && value != nil {
								cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
								f.SetCellStr(sheetName,cellStart,value.(string))	
								f.SetCellStyle(sheetName,cellStart,cellStart,styleValue)
							}
						}
					}
					sheetRow++
				}
			} else {
				log.Println("no billings list")
			}
		} else {
			log.Println("no billings")
		}
	}

	//文件写入测试文件
	//if err := f.SaveAs("exportCDN.xlsx"); err != nil {
    //    log.Println(err)
    //}

	c.Header("Content-Type", "application/octet-stream")
    c.Header("Content-Disposition", "attachment; filename=cdn.xlsx")
    c.Header("Content-Transfer-Encoding", "binary")
	f.Write(c.Writer)

	
	return nil
}

