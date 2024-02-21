import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { StaffsService } from './staffs.service';

import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';
import 'multer';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) { }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'csv' }),
      ],
    }),
  ) file: Express.Multer.File) {
    return this.staffsService.create(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(id);
  }
}
