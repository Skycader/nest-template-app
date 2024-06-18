import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [AuthModule],
  controllers: [FilesController],
})
export class FilesModule { }
