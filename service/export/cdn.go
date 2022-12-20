package export

import (
	"buoyancyinfo.com/delivery_recon/crvClient"
	"buoyancyinfo.com/delivery_recon/common"
	"encoding/json"
	"log"
	"github.com/xuri/excelize/v2"
	"github.com/gin-gonic/gin"
	"strconv"
)

type CDNColumn struct {
	Field string
	Header string
	Type int  //0 common 1 key
	ValueType int //0 string 1 number
}

var CDNColumnsAmount = []CDNColumn{
	{ Header:"Sold-To Party",Field:"sold_to_party",Type:0,ValueType:0},
	{ Header:"customer name(zh)",Field:"customer_name_zh",Type:0,ValueType:0},
	{ Header:"Billing Date",Field:"billing_date",Type:0,ValueType:0},
	{ Header:"Billing Document",Field:"billing_document",Type:0,ValueType:0},
	{ Header:"Item",Field:"item",Type:0,ValueType:0},
	{ Header:"Billing Type",Field:"billing_type",Type:0,ValueType:0},
	{ Header:"Delivery",Field:"delivery",Type:0,ValueType:0},
	{ Header:"Material",Field:"material",Type:0,ValueType:0},
	{ Header:"Material Description",Field:"material_description",Type:0,ValueType:0},
	{ Header:"Billed Quantity",Field:"quantity",Type:0,ValueType:1},
	{ Header:"Document Currency",Field:"document_currency",Type:0,ValueType:0},
	{ Header:"Net value",Field:"amount",Type:0,ValueType:1},
	{ Header:"Original unit price原始未税单价",Field:"price",Type:1,ValueType:1},
	{ Header:"New unit price新未税单价",Field:"adjusted_price",Type:1,ValueType:1},
	{ Header:"Net diff value差异金额",Field:"amount_diff",Type:1,ValueType:1},
}

var CDNColumnsQuantity = []CDNColumn{
	{ Header:"Sold-To Party",Field:"sold_to_party",Type:0,ValueType:0},
	{ Header:"customer name(zh)",Field:"customer_name_zh",Type:0,ValueType:0},
	{ Header:"Billing Date",Field:"billing_date",Type:0,ValueType:0},
	{ Header:"Billing Document",Field:"billing_document",Type:0,ValueType:0},
	{ Header:"Item",Field:"item",Type:0,ValueType:0},
	{ Header:"Billing Type",Field:"billing_type",Type:0,ValueType:0},
	{ Header:"Delivery",Field:"delivery",Type:0,ValueType:0},
	{ Header:"Material",Field:"material",Type:0,ValueType:0},
	{ Header:"Material Description",Field:"material_description",Type:0,ValueType:0},
	{ Header:"Billed Quantity",Field:"quantity",Type:0,ValueType:1},
	{ Header:"Document Currency",Field:"document_currency",Type:0,ValueType:0},
	{ Header:"Net value",Field:"amount",Type:0,ValueType:1},
	{ Header:"Delivery quantity",Field:"delivery_quantity",Type:1,ValueType:1},
	{ Header:"Billing quantity",Field:"billing_quantity",Type:1,ValueType:1},
	{ Header:"Quantity diff",Field:"quantity_gap",Type:1,ValueType:1},
	{ Header:"Amount diff",Field:"amount_by_quantity",Type:1,ValueType:1},
}

var QueryFields = []map[string]interface{}{
	{"field": "id"},
	{"field": "version"},
	{"field": "quantity_adjusted"},
	{"field": "price_adjusted"},
	{"field": "delivery_quantity"},
	{"field": "billing_quantity"},
	{"field": "quantity_gap"},
	{
		"field":"billings",
		"fieldType":"one2many",
		"relatedModelID":"dr_billing_recon",
		"relatedField":"match_group",
		"pagination":map[string]interface{}{
			"pageSize":10000,
			"current":1,
		},
		"sorter":[]map[string]interface{}{
			{
				"field":"priority",
				"order":"desc",
			},
		},
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
			{"field":"amount_diff"},
		},
  },
	{
		"field":"adjustments",
		"fieldType":"one2many",
		"relatedModelID":"dr_delivery_billing_adjustment",
		"relatedField":"match_group",
		"pagination":map[string]interface{}{
			"pageSize":10000,
			"current":1,
		},
		"fields":[]map[string]interface{}{
				{"field":"match_group"},
				{"field":"sold_to_party"},
				{"field":"billing_date"},
				{"field":"billing_type"},
				{"field":"material_description"},
				{"field":"customer_name_zh"},
				{"field":"billing_document"},
				{"field":"document_currency"},
				{"field":"item"},
				{"field":"delivery"},
				{"field":"price"},
				{"field":"quantity"},
				{"field":"amount"},
				{"field":"sales_document_type"},
				{"field":"material"},
				{"field":"source_id"},
				{"field":"adjust_by"},
				{"field":"adjusted_amount"},
				{"field":"adjusted_price"},
				{"field":"amount_diff"},
		},
  },
}

var borderStyle=[]excelize.Border{
	{Type: "left", Color: "000000", Style: 1},
	{Type: "top", Color: "000000", Style: 1},
	{Type: "bottom", Color: "000000", Style: 1},
	{Type: "right", Color: "000000", Style: 1},
}

var commonTitleStyle=excelize.Style{
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
}

var keyTitleStyle=excelize.Style{
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
		Color:[]string{"FFFF00",},
		Type:"pattern",
	},
}

var ValueStyle=excelize.Style{
	Border: borderStyle,
	Alignment:&excelize.Alignment{
		Horizontal:"left",
		Vertical:"center",
	},
	Font:&excelize.Font {
		Size:12,
		Bold:false,
	},
}

var ValueNumberStyle=excelize.Style{
	Border: borderStyle,
	Alignment:&excelize.Alignment{
		Horizontal:"right",
		Vertical:"center",
	},
	Font:&excelize.Font {
		Size:12,
		Bold:false,
	},
	NumFmt:4,
}

var adjustedFilter = map[string]interface{}{
	"Op.or":[]map[string]interface{}{
		map[string]interface{}{
			"quantity_adjusted":"1",
		},
		map[string]interface{}{
			"price_adjusted":"1",
		},
	},
}

func queryData(
	req *crvClient.CommonReq,
	header *crvClient.CommonHeader,
	crvClient *crvClient.CRVClient)(*common.CommonRsp){
	if req.SelectedRowKeys!=nil && len(*req.SelectedRowKeys)>0 {
		filter:=&map[string]interface{}{
			"id":map[string]interface{}{
				"Op.in":*req.SelectedRowKeys,
			},
		}
		req.Filter=filter
		req.FilterData=nil
	}

	if req.Filter != nil {
		req.Filter=&map[string]interface{}{
			"Op.and":[]map[string]interface{}{
				*req.Filter,
				adjustedFilter,
			},
		}
	} else {
		req.Filter=&adjustedFilter
	}

	req.ModelID="dr_delivery_billing_recon_group"
	req.Fields=&QueryFields
	return crvClient.Query(req,header)
}

func exportCDNPriceRow(
	f *excelize.File,
	sheetName string,
	rowMap map[string]interface{},
	sheetRow,styleValue,styleNumberValue int){
	for colNo,col:=range(CDNColumnsAmount){
		if len(col.Field)>0 {
			value,ok:=rowMap[col.Field]
			if ok && value != nil {
				cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
				//f.SetCellStr(sheetName,cellStart,value.(string))	
				if col.ValueType == 0 {
					f.SetCellValue(sheetName,cellStart,value)
					f.SetCellStyle(sheetName,cellStart,cellStart,styleValue)
				} else {
					floatNum, _ := strconv.ParseFloat(value.(string), 64)
					f.SetCellValue(sheetName,cellStart,floatNum)
					f.SetCellStyle(sheetName,cellStart,cellStart,styleNumberValue)
				}
			}
		}
	}
}

func exportCDNQuantityGroupRow(
	f *excelize.File,
	sheetName string,
	rowMap map[string]interface{},
	sheetRow,styleValue,styleNumberValue int){

	//获取数量调整的行
	//输出调整项中的zv60行
	//var adjustRow map[string]interface{}
	var amountByQuantity float64
	adjustments,hasAdjustments:=rowMap["adjustments"].(map[string]interface{})
	if hasAdjustments {
		adjustmentsList,hasAdjustmentList:=adjustments["list"].([]interface{})
		if hasAdjustmentList {
			for _,adjustmentRow:=range(adjustmentsList) {
				rowMap:=adjustmentRow.(map[string]interface{})
				if rowMap["sales_document_type"].(string) == "ZV60" || rowMap["sales_document_type"].(string) == "ZV70" {
					value,_:=rowMap["amount"]
					floatNum, _:= strconv.ParseFloat(value.(string), 64)
					amountByQuantity+=floatNum
				}
			}
		}
	}

	for colNo,col:=range(CDNColumnsQuantity){
		if len(col.Field)>0 {
			value,ok:=rowMap[col.Field]
			if col.Field=="amount_by_quantity" {
				value=amountByQuantity
				ok=true
			}
			if ok && value != nil {
				cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
				//f.SetCellStr(sheetName,cellStart,value.(string))	
				if col.ValueType == 0 {
					f.SetCellValue(sheetName,cellStart,value)
					f.SetCellStyle(sheetName,cellStart,cellStart,styleValue)
				} else {
					//floatNum, _ := strconv.ParseFloat(value.(string), 64)
					f.SetCellValue(sheetName,cellStart,value)
					f.SetCellStyle(sheetName,cellStart,cellStart,styleNumberValue)
				}
			}
		}
	}
}

func exportCDNQuantityRow(
	f *excelize.File,
	sheetName string,
	rowMap map[string]interface{},
	sheetRow,styleValue,styleNumberValue int){
	for colNo,col:=range(CDNColumnsQuantity){
		if len(col.Field)>0 {
			value,ok:=rowMap[col.Field]
			if ok && value != nil {
				cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
				//f.SetCellStr(sheetName,cellStart,value.(string))	
				if col.ValueType == 0 {
					f.SetCellValue(sheetName,cellStart,value)
					f.SetCellStyle(sheetName,cellStart,cellStart,styleValue)
				} else {
					floatNum, _ := strconv.ParseFloat(value.(string), 64)
					f.SetCellValue(sheetName,cellStart,floatNum)
					f.SetCellStyle(sheetName,cellStart,cellStart,styleNumberValue)
				}
			}
		}
	}
}

func exportCDNQuantity(
	queryRsp *common.CommonRsp,
	f *excelize.File,
	styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue int){
	sheetName:="调整数量"
	f.SetActiveSheet(f.NewSheet(sheetName))

	sheetRow:=1
	f.SetColWidth(sheetName, "A", "P", 20)
	//写入标题行
	for colNo,col:=range(CDNColumnsQuantity){
		cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
		f.SetCellStr(sheetName,cellStart,col.Header)	
		if col.Type == 0 {
			f.SetCellStyle(sheetName,cellStart,cellStart,styleCommonTitle)
		} else {
			f.SetCellStyle(sheetName,cellStart,cellStart,styleKeyTitle)
		}
	}
	f.SetRowHeight(sheetName,sheetRow,45)
	sheetRow++

	list,_:=queryRsp.Result.(map[string]interface{})["list"]
	records,_:=list.([]interface{})

	for _,groupRow:=range(records) {
		quantityAdjusted,_:=groupRow.(map[string]interface{})["quantity_adjusted"].(string)
		
		if quantityAdjusted == "1" {
			billings,_:=groupRow.(map[string]interface{})["billings"].(map[string]interface{})
			billingList,hasBillingList:=billings["list"].([]interface{})
			if hasBillingList {
				//输出汇总数据
				exportCDNQuantityGroupRow(f,sheetName,groupRow.(map[string]interface{}),sheetRow,styleValue,styleNumberValue)
				//输出billing
				for _,billingRow:=range(billingList) {
					rowMap:=billingRow.(map[string]interface{})
					exportCDNQuantityRow(f,sheetName,rowMap,sheetRow,styleValue,styleNumberValue)
					sheetRow++
				}
			} else {
				log.Println("no billings list")
			}
		}
	}
}

func exportCDNPrice(
	queryRsp *common.CommonRsp,
	f *excelize.File,
	styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue int){
	sheetName:="调整单价"
	f.SetActiveSheet(f.NewSheet(sheetName))
	
	sheetRow:=1
	f.SetColWidth(sheetName, "A", "O", 20)
	//写入标题行
	for colNo,col:=range(CDNColumnsAmount){
		cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
		f.SetCellStr(sheetName,cellStart,col.Header)	
		if col.Type == 0 {
			f.SetCellStyle(sheetName,cellStart,cellStart,styleCommonTitle)
		} else {
			f.SetCellStyle(sheetName,cellStart,cellStart,styleKeyTitle)
		}
	}
	f.SetRowHeight(sheetName,sheetRow,45)
	sheetRow++

	list,_:=queryRsp.Result.(map[string]interface{})["list"]
	records,_:=list.([]interface{})

	for _,groupRow:=range(records) {
		priceAdjusted,_:=groupRow.(map[string]interface{})["price_adjusted"].(string)
		if priceAdjusted == "1" {
			billings,hasBillings:=groupRow.(map[string]interface{})["billings"].(map[string]interface{})
			adjustments,hasAdjustments:=groupRow.(map[string]interface{})["adjustments"].(map[string]interface{})
			if hasBillings && hasAdjustments {
				billingList,hasBillingList:=billings["list"].([]interface{})
				adjustmentsList,hasAdjustmentList:=adjustments["list"].([]interface{})
				if hasBillingList && hasAdjustmentList  {
					//输出billing
					for _,billingRow:=range(billingList) {
						rowMap:=billingRow.(map[string]interface{})
						exportCDNPriceRow(f,sheetName,rowMap,sheetRow,styleValue,styleNumberValue)
						sheetRow++
					}
					//输出调整项中的zv60和ZV70行
					for _,adjustmentRow:=range(adjustmentsList) {
						rowMap:=adjustmentRow.(map[string]interface{})
						if rowMap["sales_document_type"].(string) == "ZV60" || rowMap["sales_document_type"].(string) == "ZV70" {
							exportCDNPriceRow(f,sheetName,rowMap,sheetRow,styleValue,styleNumberValue)
							sheetRow++
						}
					}
				} else {
					log.Println("no billings list")
				}
			} else {
				log.Println("no billings")
			}
		}
	}
}

func exportCDN(
	req *crvClient.CommonReq,
	header *crvClient.CommonHeader,
	crvClient *crvClient.CRVClient,
	c *gin.Context)(*common.CommonRsp){
	
	rsp:=queryData(req,header,crvClient)
	if rsp.Error==true {
		jsonStr, _:= json.MarshalIndent(rsp, "", "    ")
		log.Println(string(jsonStr))
		return rsp
	}

	f := excelize.NewFile()
	styleCommonTitle, _ := f.NewStyle(&commonTitleStyle)
	styleKeyTitle,_:=f.NewStyle(&keyTitleStyle)
	styleValue,_:=f.NewStyle(&ValueStyle)
	styleNumberValue,_:=f.NewStyle(&ValueNumberStyle)

	exportCDNQuantity(rsp,f,styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue)
	exportCDNPrice(rsp,f,styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue)
	
	f.DeleteSheet("Sheet1")
	c.Header("Content-Type", "application/octet-stream")
    c.Header("Content-Disposition", "attachment; filename=cdn.xlsx")
    c.Header("Content-Transfer-Encoding", "binary")
	f.Write(c.Writer)

	return nil
}

