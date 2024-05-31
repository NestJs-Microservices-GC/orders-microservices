import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto/index';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({ data: createOrderDto });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { limit, page, status } = orderPaginationDto;
    const totalOrders = await this.order.count({
      where: {
        status,
      },
    });

    return {
      data: await this.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          status,
        },
      }),
      meta: {
        total: totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
    });
    if (!order)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with ${id} not found`,
      });
    return order;
  }

  async changeOrderStatus(changerOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changerOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) return order;
    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
