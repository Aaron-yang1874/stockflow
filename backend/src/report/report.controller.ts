import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService, DashboardOverview, StockSummaryItem, InboundDailyRecord, InboundTypeSummary, OutboundDailyRecord, OutboundTypeSummary, ProductTurnoverItem, SupplierAnalysisItem, CustomerAnalysisItem } from './report.service';
import { DateRangeDto } from './dto/date-range.dto';

@ApiTags('报表')
@ApiBearerAuth()
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '仪表盘概览数据' })
  getDashboardOverview(): Promise<DashboardOverview> {
    return this.reportService.getDashboardOverview();
  }

  @Get('stock-summary')
  @ApiOperation({ summary: '库存汇总（按仓库分组）' })
  getStockSummary(@Query() query: DateRangeDto): Promise<StockSummaryItem[]> {
    return this.reportService.getStockSummary(query);
  }

  @Get('inbound')
  @ApiOperation({ summary: '入库报表' })
  getInboundReport(@Query() query: DateRangeDto): Promise<{ dailyRecords: InboundDailyRecord[]; typeSummaries: InboundTypeSummary[] }> {
    return this.reportService.getInboundReport(query);
  }

  @Get('outbound')
  @ApiOperation({ summary: '出库报表' })
  getOutboundReport(@Query() query: DateRangeDto): Promise<{ dailyRecords: OutboundDailyRecord[]; typeSummaries: OutboundTypeSummary[] }> {
    return this.reportService.getOutboundReport(query);
  }

  @Get('turnover')
  @ApiOperation({ summary: '产品周转分析' })
  getProductTurnover(@Query() query: DateRangeDto): Promise<ProductTurnoverItem[]> {
    return this.reportService.getProductTurnover(query);
  }

  @Get('supplier')
  @ApiOperation({ summary: '供应商分析' })
  getSupplierAnalysis(@Query() query: DateRangeDto): Promise<SupplierAnalysisItem[]> {
    return this.reportService.getSupplierAnalysis(query);
  }

  @Get('customer')
  @ApiOperation({ summary: '客户分析' })
  getCustomerAnalysis(@Query() query: DateRangeDto): Promise<CustomerAnalysisItem[]> {
    return this.reportService.getCustomerAnalysis(query);
  }
}