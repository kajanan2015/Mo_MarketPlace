import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService],
})
export class VariantsModule {}
