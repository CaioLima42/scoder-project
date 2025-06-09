// src/guards/api-key.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API key is missing');
    }

    const user =
      (await this.prisma.doctor.findFirst({ where: { apikey: apiKey } })) ??
      (await this.prisma.patient.findFirst({ where: { apikey: apiKey } }));

    if (!user) {
      throw new UnauthorizedException('Invalid API key');
    }

    request['user'] = user;

    return true;
  }
}
