import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

@ApiTags('文件管理')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  @ApiOperation({ summary: '获取文件列表' })
  findAll(): Promise<File[]> {
    return this.fileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个文件' })
  findOne(@Param('id') id: string): Promise<File> {
    return this.fileService.findOne(id);
  }

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // 额外的文件类型验证
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型');
    }

    return this.fileService.create({
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  remove(@Param('id') id: string): Promise<void> {
    return this.fileService.remove(id);
  }
}
