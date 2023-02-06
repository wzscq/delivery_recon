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

type Column struct {
	Field string
	Header string
	Type int  //0 common 1 key
	ValueType int //0 string 1 number
	Default string
}

var taxLinkCommonTitleStyle=excelize.Style{
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
		Color:[]string{"FFFFFF",},
		Type:"pattern",
	},
}

var BillingColumns = []Column{
	{ Header:"billing No.",Field:"billing_document",Type:0,ValueType:0},
	{ Header:"Cust. Code",Field:"sold_to_party",Type:0,ValueType:0},
	{ Header:"DN No.",Field:"delivery",Type:0,ValueType:0},
}

var DeliveryColumns = []Column{
	{ Header:"billing No.",Field:"",Type:0,ValueType:0},
	{ Header:"Cust. Code",Field:"",Type:0,ValueType:0},
	{ Header:"DN No.",Field:"",Type:0,ValueType:0},
	{ Header:"duty paragraph",Field:"",Type:0,ValueType:0},
	{ Header:"Description",Field:"material",Type:0,ValueType:0},
	{ Header:"Qty",Field:"quantity",Type:0,ValueType:1},
	{ Header:"Net Price",Field:"price",Type:0,ValueType:1},
	{ Header:"税额",Field:"",Type:0,ValueType:0},
	{ Header:"折扣不含税金额",Field:"",Type:0,ValueType:0},
	{ Header:"折扣税额",Field:"",Type:0,ValueType:0},
	{ Header:"商品名称",Field:"material_name",Type:0,ValueType:0},
	{ Header:"计量单位",Field:"",Type:0,ValueType:0,Default:"只"},
	{ Header:"税率",Field:"tax_code",Type:0,ValueType:0},
	{ Header:"税务分类编码",Field:"",Type:0,ValueType:0},
	{ Header:"发票种类",Field:"",Type:0,ValueType:0,Default:"专票"},
	{ Header:"备注",Field:"",Type:0,ValueType:0,Default:""},
	{ Header:"序号",Field:"",Type:0,ValueType:0,Default:""},
}

var TaxLinkQueryFields = []map[string]interface{}{
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
	{
		"field":"deliveries",
		"fieldType":"one2many",
		"relatedModelID":"dr_delivery_recon",
		"relatedField":"match_group",
		"fields":[]map[string]interface{}{
				{"field":"match_group"},
				{"field":"material"},
				{"field":"quantity"},
				{"field":"price"},
				{"field":"amount"},
				{"field":"material_name"},
				{"field":"tax_code"},
		},
  },
}

var confirmedFilter = map[string]interface{}{
	"confirmed":map[string]interface{}{
		"Op.in":[]interface{}{
			"1",
			"0",
		},
	},
}

func queryTaxLindData(
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
				confirmedFilter,
			},
		}
	} else {
		req.Filter=&confirmedFilter
	}

	req.ModelID="dr_delivery_billing_recon_group"
	req.Fields=&TaxLinkQueryFields
	return crvClient.Query(req,header)
}

func exportTaxLinkRow(
	f *excelize.File,
	sheetName string,
	rowMap map[string]interface{},
	sheetRow,styleValue,styleNumberValue int,
	columns []Column){
	for colNo,col:=range(columns){
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
		} else if len(col.Default)>0 {
			cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
			//f.SetCellStr(sheetName,cellStart,value.(string))	
			if col.ValueType == 0 {
				f.SetCellValue(sheetName,cellStart,col.Default)
				f.SetCellStyle(sheetName,cellStart,cellStart,styleValue)
			} else {
				floatNum, _ := strconv.ParseFloat(col.Default, 64)
				f.SetCellValue(sheetName,cellStart,floatNum)
				f.SetCellStyle(sheetName,cellStart,cellStart,styleNumberValue)
			}
		}
	}
}

func exportTaxLinkBilling(
	groupRow interface{},
	f *excelize.File,
	styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue,sheetRow int,
	sheetName string)(int){
	billings,_:=groupRow.(map[string]interface{})["billings"].(map[string]interface{})
	billingList,hasBillingList:=billings["list"].([]interface{})
	if hasBillingList {
		for _,billingRow:=range(billingList) {
			rowMap:=billingRow.(map[string]interface{})
			exportTaxLinkRow(f,sheetName,rowMap,sheetRow,styleValue,styleNumberValue,BillingColumns)
			sheetRow++
		}
		return len(billingList)
	}
	return 0
}

func exportTaxLinkDelivery(
	groupRow interface{},
	f *excelize.File,
	styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue,sheetRow int,
	sheetName string)(int){
	deliveries,_:=groupRow.(map[string]interface{})["deliveries"].(map[string]interface{})
	deliveryList,hasDeliveryList:=deliveries["list"].([]interface{})
	log.Println(hasDeliveryList,deliveryList)
	if hasDeliveryList {
		for _,deliveryRow:=range(deliveryList) {
			rowMap:=deliveryRow.(map[string]interface{})
			log.Println(sheetRow,rowMap)
			exportTaxLinkRow(f,sheetName,rowMap,sheetRow,styleValue,styleNumberValue,DeliveryColumns)
			sheetRow++
		}
		return len(deliveryList)
	}
	return 0
}

func exportTaxLink(
	req *crvClient.CommonReq,
	header *crvClient.CommonHeader,
	crvClient *crvClient.CRVClient,
	c *gin.Context)(*common.CommonRsp){
	
	rsp:=queryTaxLindData(req,header,crvClient)
	if rsp.Error==true {
		jsonStr, _:= json.MarshalIndent(rsp, "", "    ")
		log.Println(string(jsonStr))
		return rsp
	}

	f := excelize.NewFile()
	styleCommonTitle, _ := f.NewStyle(&taxLinkCommonTitleStyle)
	styleKeyTitle,_:=f.NewStyle(&keyTitleStyle)
	styleValue,_:=f.NewStyle(&ValueStyle)
	styleNumberValue,_:=f.NewStyle(&ValueNumberStyle)

	sheetRow:=1
	sheetName:="Sheet1"
	f.SetColWidth(sheetName, "A", "Q", 20)
	//写入标题行
	for colNo,col:=range(DeliveryColumns){
		cellStart,_:=excelize.CoordinatesToCellName(colNo+1, sheetRow)
		f.SetCellStr(sheetName,cellStart,col.Header)	
		if col.Type == 0 {
			f.SetCellStyle(sheetName,cellStart,cellStart,styleCommonTitle)
		} else {
			f.SetCellStyle(sheetName,cellStart,cellStart,styleKeyTitle)
		}
	}
	sheetRow++

	list,_:=rsp.Result.(map[string]interface{})["list"]
	records,_:=list.([]interface{})

	for _,groupRow:=range(records) {
		billingCount:=exportTaxLinkBilling(groupRow,f,styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue,sheetRow,sheetName)
		deliverCount:=exportTaxLinkDelivery(groupRow,f,styleCommonTitle,styleKeyTitle,styleValue,styleNumberValue,sheetRow,sheetName)
		if billingCount>deliverCount {
			sheetRow+=billingCount
		} else {
			sheetRow+=deliverCount
		}
	}
	c.Header("Content-Type", "application/octet-stream")
  c.Header("Content-Disposition", "attachment; filename=taxlink.xlsx")
  c.Header("Content-Transfer-Encoding", "binary")
	f.Write(c.Writer)

	return nil
}