import { Injectable } from '@nestjs/common';
import { Order as IOrder } from '../models';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '../../database/entities/order.entity';

@Injectable()
export class OrderService {
  private orders: Record<string, IOrder> = {};

  constructor (
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findById (orderId: string): Promise<IOrder> {
    return await this.orderRepository.findOne(orderId);
  }

  async create (data: any): Promise<IOrder> {
    const order = this.orderRepository.create({
      user: {
        id: data.userId,
      },
      cart: {
        id: data.cartId,
      },
      payment: data.payment,
      delivery: data.delivery,
      comments: data.comments,
      status: OrderStatus.OPEN,
      total: data.total,
    });

    return await this.orderRepository.save(order);
  }

  async update (orderId, data): Promise<IOrder> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orderRepository.merge(order, data)
    return await this.orderRepository.save(order)
  }
}
