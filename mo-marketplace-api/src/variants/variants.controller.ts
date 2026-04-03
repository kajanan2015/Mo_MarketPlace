import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('variants')
@Controller('products/:productId/variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all variants for a product' })
  @ApiResponse({ status: 200, description: 'Returns list of variants' })
  findAll(@Param('productId') productId: string) {
    return this.variantsService.findAllForProduct(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a variant to a product' })
  @ApiResponse({ status: 201, description: 'Variant created' })
  @ApiResponse({ status: 409, description: 'Duplicate variant combination' })
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateVariantDto,
  ) {
    return this.variantsService.createForProduct(productId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a variant' })
  @ApiResponse({ status: 200, description: 'Variant updated' })
  update(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.variantsService.update(id, productId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiResponse({ status: 204, description: 'Variant deleted' })
  remove(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.variantsService.remove(id, productId);
  }
}
