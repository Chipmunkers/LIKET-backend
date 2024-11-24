import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TosService } from './tos.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetTosAllResponseDto } from './dto/response/get-tos-all-response.dto';
import { GetTosResponseDto } from './dto/response/get-tos-response.dto';
import { CreateTosDto } from './dto/request/create-tos.dto';
import { UpdateTosDto } from './dto/request/update-tos.dto';

@Controller('tos')
export class TosController {
  constructor(private readonly tosService: TosService) {}

  /**
   * 약관 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  @LoginAuth()
  async getTosAll(): Promise<GetTosAllResponseDto> {
    return await this.tosService.getTosAll();
  }

  /**
   * 약관 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  @LoginAuth()
  async getTosByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<GetTosResponseDto> {
    const tos = await this.tosService.getTosByIdx(idx);

    return { tos };
  }

  /**
   * 약관 생성하기
   */
  @Post('/')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  @LoginAuth()
  async createTos(@Body() createDto: CreateTosDto): Promise<GetTosResponseDto> {
    const tos = await this.tosService.createTos(createDto);

    return { tos };
  }

  /**
   * 약관 수정하기
   */
  @Put('/:idx')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  @LoginAuth()
  async updateTosByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() updateDto: UpdateTosDto,
  ): Promise<void> {
    await this.tosService.getTosByIdx(idx);

    await this.tosService.updateTosByIdx(idx, updateDto);

    return;
  }

  /**
   * 약관 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  @LoginAuth()
  async deleteTosByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.tosService.getTosByIdx(idx);

    await this.tosService.deleteTosByIdx(idx);

    return;
  }
}
