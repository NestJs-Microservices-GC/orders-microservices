import { OrderStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { OrderStatusList } from '../interfaces/order.enum';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;
  @IsNumber()
  @IsPositive()
  totalItems: number;
  //cuando migras se crea el cliente y el cliente
  //tiene todo el tipado extricto de como se maneja la base de datos.
  @IsEnum(OrderStatusList, {
    message: `Possible status values are ${OrderStatusList}`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
