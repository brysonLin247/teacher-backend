import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cosOpt } from 'config';
import { Repository } from 'typeorm';
import { Research } from '../research/entities/research.entity';
import { staticBaseUrl } from './constants';
import { CreateUploadDto } from './dto/create-upload.dto';
import { GetUploadDto } from './dto/get-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { Upload } from './entities/upload.entity';
// tslint:disable-next-line:no-var-requires
const COS = require('cos-nodejs-sdk-v5');
import { promisify } from 'util';
import { Readable } from 'stream';
// tslint:disable-next-line:no-var-requires
const sendToWormhole = require('stream-wormhole');
// tslint:disable-next-line:no-var-requires
const { v1: uuidv1 } = require('uuid');

interface UpLoadImageInterface {
  stream: ReadableStream;
  base64: any;
  path: string;
}

interface UpdateImageInterface {
  originName: string;
  stream: ReadableStream;
  base64: any;
  path: string;
}

@Injectable()
export class UploadService {
  public cos: any;
  private urlPirx: string;
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @InjectRepository(Research)
    private readonly researchRepository: Repository<Research>,
  ) { 
    const cos = new COS({
      SecretId: cosOpt.SecretId,
      SecretKey: cosOpt.SecretKey,
    });

    // 改成promise
    cos.pPutObject = promisify(cos.putObject);
    cos.pDeleteObject = promisify(cos.deleteObject);

    // 拼接cos对象的链接前缀，以供后面删除
    // 拼接结果如 'https://chengdu-1**237**847.cos.ap-chengdu.myqcloud.com/',
    this.urlPirx = `https://${cosOpt.Bucket}.cos.${cosOpt.Region}.mycloud.com/`;

    this.cos = cos;
  }

   /**
   * 上传图片
   * @param Body
   * @param Key
   */
    async upLoadImage({ stream, base64, path }: Partial<UpLoadImageInterface>) {
      if (!stream) {
        try {
          stream = await this.base2Stream(base64);
        } catch (e) {
          throw new InternalServerErrorException('图片转换为流出现异常', e);
        }
      }
      const uuid = uuidv1();
      const name = `documents/${path}${uuid}.png`;
      try {
        const result = await this.cos.pPutObject({
          Bucket: cosOpt.Bucket,
          Region: cosOpt.Region,
          Key: name,
          Body: stream,
        });
        if (result && result.Location) {
          result.Location = 'https://' + result.Location;
        }
        return result.Location;
      } catch (e) {
        throw new InternalServerErrorException('图片上传cos出现错误', e);
      }
    }
  
    /**
     * 删除图片
     * @param name
     */
    async deleteImage(name) {
      let result;
      name = name.replace(this.urlPirx, '');
      try {
        result = await this.cos.pDeleteObject({
          Bucket: cosOpt.Bucket,
          Region: cosOpt.Region,
          Key: name,
        });
      } catch (e) {
        throw new InternalServerErrorException('删除图片出现错误', e);
      }
      return result;
    }
  
    /**
     * 更新图片，删除旧的上传新的
     */
    async updateImage(params: Partial<UpdateImageInterface>) {
      const { originName, stream, base64, path } = params;
      const mName = originName.replace(
        `https://${cosOpt.Bucket}.cos.${cosOpt.Region}.myqcloud.com/`,
        '',
      );
      if(mName.length!== 0){
        await this.deleteImage(mName);
      }
      const result = await this.upLoadImage({ stream, base64, path });
      return result;
    }
  
    /**
     * base64转流
     * @param base64
     */
    async base2Stream(base64: any) {
      let stream;
      // 删除前缀
      // console.log(base64);
      // base64 = JSON.stringify(base64).replace(/^data:image\/\w+;base64,/, '');
      try {
        const imgBuffer = Buffer.from(base64, 'base64');
        stream = new Readable();
        stream.push(imgBuffer);
        stream.push(null);
        return stream;
      } catch (e) {
        if (stream) {
          await sendToWormhole(stream);
        }
        throw new InternalServerErrorException(e.toString());
      }
    }

  async judgeType(createUploadDto: CreateUploadDto) {
    const { type, researchId } = createUploadDto;
    if (type == 1) {
      const result = await this.researchRepository.findOne(researchId);
      return result.researchId;
    }
    return;
  }

  async create(createUploadDto: CreateUploadDto, file: Express.Multer.File) {
    const { filename, size, path, mimetype, encoding } = file;
    const { type } = createUploadDto;
    const forigenId = await this.judgeType(createUploadDto);
    const newFile = this.uploadRepository.create();
    newFile.foreignId = forigenId;
    newFile.type = type;
    newFile.fileName = filename;
    newFile.fileSize = size;
    newFile.fileUrl = path;
    newFile.fileType = mimetype;
    newFile.encoding = encoding;
    await this.uploadRepository.save(newFile);

    return {
      file: staticBaseUrl + file.originalname
    }
  }

  async createFileData(forigenId, type, file: Express.Multer.File) {
    const { filename, size, path, mimetype, encoding } = file;

    const newFile = this.uploadRepository.create();
    newFile.foreignId = forigenId;
    newFile.type = type;
    newFile.fileName = filename;
    newFile.fileSize = size;
    newFile.fileUrl = path;
    newFile.fileType = mimetype;
    newFile.encoding = encoding;
    await this.uploadRepository.save(newFile);
  }

  async uploadFiles(createUploadDto: CreateUploadDto, files: Array<Express.Multer.File>) {
    const { type } = createUploadDto;
    const forigenId = await this.judgeType(createUploadDto);
    (files || []).map(async (file: Express.Multer.File) => {
      return await this.createFileData(forigenId, type, file);
    })

    return {
      files: files.map((f) => staticBaseUrl + f.originalname),
    };
  }

  async findById(getUploadDto: GetUploadDto) {
    const { id, type } = getUploadDto;
    return await this.uploadRepository
      .createQueryBuilder('upload')
      .where('upload.foreignId = :id', { id })
      .andWhere('upload.type = :type', { type })
      .getManyAndCount();
  }

  async editById(updateUploadDto: UpdateUploadDto, files: Array<Express.Multer.File>) {
    const { id, type } = updateUploadDto;
    const research = await this.researchRepository.findOne({researchId:id});
    if(research.review === 1) return;
    let fileData = await this.uploadRepository
      .createQueryBuilder('upload')
      .where('upload.foreignId = :id', { id })
      .andWhere('upload.type = :type', { type })
      .getMany();
    await this.uploadRepository.remove(fileData);

    (files || []).map(async (file: Express.Multer.File) => {
      return await this.createFileData(id, type, file);
    })

    return await this.uploadRepository
      .createQueryBuilder('upload')
      .where('upload.foreignId = :id', { id })
      .andWhere('upload.type = :type', { type })
      .getMany();
  }
}


