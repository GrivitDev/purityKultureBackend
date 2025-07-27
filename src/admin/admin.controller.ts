import { Controller, Post, Body, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController implements OnModuleInit {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.service.validateLogin(body);
  }

  async onModuleInit() {
    await this.service.seedAdmin(); // Seed on app startup
  }
}
