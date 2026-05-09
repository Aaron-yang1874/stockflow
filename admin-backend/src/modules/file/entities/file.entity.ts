import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sys_file')
export class File extends BaseEntity {
  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  @ApiProperty({ description: '文件名称' })
  fileName: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '原始文件名', nullable: true })
  originalName?: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  @ApiProperty({ description: '文件路径' })
  filePath: string;

  @Column({ name: 'file_url', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: '文件访问URL', nullable: true })
  fileUrl?: string;

  @Column({ name: 'file_size', type: 'bigint' })
  @ApiProperty({ description: '文件大小(字节)' })
  fileSize: number;

  @Column({ name: 'file_type', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '文件类型(MIME)', nullable: true })
  fileType?: string;

  @Column({ name: 'extension', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: '文件扩展名', nullable: true })
  extension?: string;

  @Column({ name: 'upload_by', type: 'uuid', nullable: true })
  @ApiProperty({ description: '上传者ID', nullable: true })
  uploadBy?: string;

  @Column({ name: 'upload_name', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: '上传者姓名', nullable: true })
  uploadName?: string;
}
