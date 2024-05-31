import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from '../interfaces/order.enum';

export class ChangeOrderStatusDto {
  @IsUUID()
  id: string;

  @IsEnum(OrderStatusList, {
    message: `Valids status are ${OrderStatusList}`,
  })
  status: OrderStatus;
}
