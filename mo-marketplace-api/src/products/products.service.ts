import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { VariantsService } from '../variants/variants.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly variantsService: VariantsService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const { variants, ...productData } = dto;
    const product = this.productsRepository.create(productData);
    const saved = await this.productsRepository.save(product);

    if (variants && variants.length > 0) {
      for (const variantDto of variants) {
        await this.variantsService.createForProduct(saved.id, variantDto);
      }
    }

    return this.productsRepository.findOne({
      where: { id: saved.id },
      relations: ['variants'],
    }) as Promise<Product>;
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['variants'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['variants'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { variants, ...productData } = dto;
    Object.assign(product, productData);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
