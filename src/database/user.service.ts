import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma, Notification, Monitor } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(params: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: params,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async notifications(
    params: Prisma.UserWhereUniqueInput,
  ): Promise<Notification[]> {
    return this.prisma.user
      .findUnique({
        where: params,
      })
      .notifications();
  }

  async monitors(params: Prisma.UserWhereUniqueInput): Promise<Monitor[]> {
    return this.prisma.user
      .findUnique({
        where: params,
      })
      .monitors();
  }

  async trackedMonitors(
    params: Prisma.UserWhereUniqueInput,
  ): Promise<Monitor[]> {
    const monitors: Monitor[] = [];
    monitors.push(...(await this.monitors(params)));
    const user = await this.prisma.user.findUnique({
      where: params,
      include: {
        follows: {
          include: {
            unfollowMonitors: true,
          },
        },
      },
    });
    const follows = user.follows;
    for (const follow of follows) {
      monitors.push(
        ...(await this.monitors({ id: follow.followedId })).filter((monitor) =>
          follow.unfollowMonitors.find(
            (unfollow) => unfollow.monitorId !== monitor.id,
          ),
        ),
      );
    }
    return monitors;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async addFollow(params: {
    follower: Prisma.UserWhereUniqueInput;
    followed: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    const { follower, followed } = params;
    return this.prisma.user.update({
      where: follower,
      data: {
        follows: {
          create: [
            {
              followedId: followed.id,
            },
          ],
        },
      },
    });
  }

  async removeFollow(params: {
    follower: Prisma.UserWhereUniqueInput;
    followed: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    const { follower, followed } = params;
    return this.prisma.user.update({
      where: follower,
      data: {
        follows: {
          delete: {
            id: {
              followedId: followed.id,
              followerId: follower.id,
            },
          },
        },
      },
    });
  }

  async trackMonitor(params: {
    user: Prisma.UserWhereUniqueInput;
    monitor: Prisma.MonitorWhereUniqueInput;
  }): Promise<User> {
    const { user, monitor } = params;
    return this.prisma.user.update({
      where: user,
      data: {
        monitors: {
          connect: {
            id: monitor.id,
          },
        },
      },
    });
  }

  async untrackMonitor(params: {
    user: Prisma.UserWhereUniqueInput;
    monitor: Prisma.MonitorWhereUniqueInput;
  }): Promise<User> {
    const { user, monitor } = params;
    return this.prisma.user.update({
      where: user,
      data: {
        monitors: {
          disconnect: {
            id: monitor.id,
          },
        },
      },
    });
  }
}
