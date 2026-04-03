import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantsRepository: Repository<Variant>,
  ) {}

  generateCombinationKey(dto: CreateVariantDto): string {
    const parts = [dto.color, dto.size, dto.material].filter((p): p is string => Boolean(p));
    return parts.map((p) => p.toLowerCase().replace(/\s+/g, '-')).join('-') || 'default';
  }

  async createForProduct(productId: string, dto: CreateVariantDto): Promise<Variant> {
    const combinationKey = this.generateCombinationKey(dto);

    const existing = await this.variantsRepository.findOne({
      where: { productId, combinationKey },
    });

    if (existing) {
      throw new ConflictException(
        `Variant combination "${combinationKey}" already exists for this product`,
      );
    }

    const variant = this.variantsRepository.create({
      ...dto,
      productId,
      combinationKey,
    });

    return this.variantsRepository.save(variant);
  }

  async findAllForProduct(productId: string): Promise<Variant[]> {
    return this.variantsRepository.find({ where: { productId } });
  }

  async findOne(id: string): Promise<Variant> {
    const variant = await this.variantsRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }
    return variant;
  }

  async update(id: string, productId: string, dto: UpdateVariantDto): Promise<Variant> {
    const variant = await this.variantsRepository.findOne({ where: { id, productId } });
    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }

    const mergedDto: CreateVariantDto = {
      color: dto.color ?? variant.color,
      size: dto.size ?? variant.size,
      material: dto.material ?? variant.material,
      price: dto.price ?? variant.price,
      stock: dto.stock ?? variant.stock,
    };

    const newCombinationKey = this.generateCombinationKey(mergedDto);

    if (newCombinationKey !== variant.combinationKey) {
      const existing = await this.variantsRepository.findOne({
        where: { productId, combinationKey: newCombinationKey },
      });
      if (existing) {
        throw new ConflictException(
          `Variant combination "${newCombinationKey}" already exists for this product`,
        );
      }
    }

    Object.assign(variant, dto, { combinationKey: newCombinationKey });
    return this.variantsRepository.save(variant);
  }

  async remove(id: string, productId: string): Promise<void> {
    const variant = await this.variantsRepository.findOne({ where: { id, productId } });
    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }
    await this.variantsRepository.remove(variant);
  }
}
