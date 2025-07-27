import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private model: Model<AdminDocument>) {}

  async validateLogin({ email, password }: LoginDto) {
    const admin = await this.model.findOne({ email });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return { message: 'Access granted' }; // No token/session — keep it minimal
  }

  async seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) return;

    const existing = await this.model.findOne({ email });
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      await this.model.create({ email, password: hashed });
    }
  }
}
