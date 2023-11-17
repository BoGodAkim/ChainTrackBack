import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Monitor } from '@prisma/client';

@Injectable()
export class MonitorService {
  constructor(private prisma: PrismaService) {}

  async monitor(
    params: Prisma.MonitorWhereUniqueInput,
  ): Promise<Monitor | null> {
    return this.prisma.monitor.findUnique({
      where: params,
    });
  }

  async monitors(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MonitorWhereUniqueInput;
    where?: Prisma.MonitorWhereInput;
    orderBy?: Prisma.MonitorOrderByWithRelationInput;
  }): Promise<Monitor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.monitor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createMonitor(data: Prisma.MonitorCreateInput): Promise<Monitor> {
    return this.prisma.monitor.create({
      data,
    });
  }

  async deleteMonitor(
    params: Prisma.MonitorWhereUniqueInput,
  ): Promise<Monitor> {
    return this.prisma.monitor.delete({
      where: params,
    });
  }

  async updateMonitor(params: {
    where: Prisma.MonitorWhereUniqueInput;
    data: Prisma.MonitorUpdateInput;
  }): Promise<Monitor> {
    const { where, data } = params;
    return this.prisma.monitor.update({
      data,
      where,
    });
  }
}
