import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { SalesOrder, SalesOrderStatus, SalesPaymentStatus } from './entities/sales-order.entity';
import { SalesOrderItem } from './entities/sales-order-item.entity';
import { CreateSalesOrderDto, UpdateSalesOrderDto, QuerySalesOrderDto } from './dto/sales-order.dto';

const STATUS_FLOW: Record<SalesOrderStatus, SalesOrderStatus[]> = {
  [SalesOrderStatus.DRAFT]: [SalesOrderStatus.CONFIRMED, SalesOrderStatus.CANCELLED],
  [SalesOrderStatus.CONFIRMED]: [SalesOrderStatus.SHIPPED, SalesOrderStatus.CANCELLED],
  [SalesOrderStatus.SHIPPED]: [SalesOrderStatus.DELIVERED],
  [SalesOrderStatus.DELIVERED]: [],
  [SalesOrderStatus.CANCELLED]: [],
};

@Injectable()
export class SalesOrderService {
  constructor(
    @InjectRepository(SalesOrder)
    private orderRepo: Repository<SalesOrder>,
    @InjectRepository(SalesOrderItem)
    private itemRepo: Repository<SalesOrderItem>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateSalesOrderDto): Promise<SalesOrder> {
    return this.dataSource.transaction(async (manager) => {
      const orderNo = `SO${Date.now()}`;
      const order = new SalesOrder();
      order.orderNo = orderNo;
      order.customerId = dto.customerId;
      order.status = SalesOrderStatus.DRAFT;
      order.paymentStatus = SalesPaymentStatus.UNPAID;
      order.deliveryDate = dto.deliveryDate ? new Date(dto.deliveryDate) : null as any;
      order.remark = dto.remark || '';
      order.operatedBy = 'system';
      order.totalAmount = 0;
      order.taxAmount = 0;
      order.discountAmount = 0;
      order.finalAmount = 0;

      const savedOrder = await manager.save(order);

      let totalAmount = 0;
      let taxAmount = 0;

      const items = dto.items.map((itemDto) => {
        const amount = Number(itemDto.quantity) * Number(itemDto.unitPrice);
        const tax = amount * (Number(itemDto.taxRate || 0) / 100);
        totalAmount += amount;
        taxAmount += tax;

        const itemEntity = new SalesOrderItem();
        itemEntity.orderId = savedOrder.id;
        itemEntity.productId = itemDto.productId;
        itemEntity.quantity = itemDto.quantity;
        itemEntity.shippedQty = 0;
        itemEntity.unitPrice = itemDto.unitPrice;
        itemEntity.taxRate = itemDto.taxRate || 0;
        itemEntity.amount = amount + tax;
        return itemEntity;
      });

      await manager.save(items);

      savedOrder.totalAmount = Number(totalAmount.toFixed(2));
      savedOrder.taxAmount = Number(taxAmount.toFixed(2));
      savedOrder.finalAmount = Number((totalAmount + taxAmount).toFixed(2));

      return manager.save(savedOrder);
    });
  }

  async findAll(query: QuerySalesOrderDto) {
    const { page = 1, pageSize = 10, keyword, status, paymentStatus } = query;
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (keyword) where.orderNo = Like(`%${keyword}%`);

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      relations: ['customer', 'items'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { list, total, page, pageSize };
  }

  async findOne(id: string): Promise<SalesOrder> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });
    if (!order) {
      throw new NotFoundException(`销售订单 ${id} 不存在`);
    }
    return order;
  }

  async update(id: string, dto: UpdateSalesOrderDto): Promise<SalesOrder> {
    const order = await this.findOne(id);

    if (dto.status && dto.status !== order.status) {
      const allowedTransitions = STATUS_FLOW[order.status];
      if (!allowedTransitions.includes(dto.status)) {
        throw new BadRequestException(
          `不允许从 ${order.status} 状态流转到 ${dto.status}`,
        );
      }
      order.status = dto.status;
    }

    if (dto.paymentStatus) {
      order.paymentStatus = dto.paymentStatus;
    }
    if (dto.remark !== undefined) {
      order.remark = dto.remark;
    }

    return this.orderRepo.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (
      order.status === SalesOrderStatus.CONFIRMED ||
      order.status === SalesOrderStatus.SHIPPED
    ) {
      throw new BadRequestException('已确认或已发货的订单不能删除');
    }
    await this.itemRepo.delete({ orderId: id });
    await this.orderRepo.remove(order);
  }
}
