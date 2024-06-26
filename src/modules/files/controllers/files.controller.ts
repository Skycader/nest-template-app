import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto-js';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { mkdir, readdir, rm, writeFile } from 'fs/promises';
import * as md5 from 'md5';
import { join } from 'path';
import { secret } from 'src/config/jwt.config';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/modules/auth/entities/user.entity';
import { IsModeratorGuard } from 'src/modules/auth/guards/is-moderator.guard';
import { UserRolesEnum } from 'src/modules/auth/models/roles.enum';
@Controller('files')
export class FilesController {
  @Post('upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @GetUser() user: UserEntity,
    @UploadedFile()
    file: /* new ParseFilePipe({
         validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
       }), */
      Express.Multer.File,
  ) {
    if (file.originalname.includes(':'))
      throw new BadRequestException('File cannot have : inside its name.');
    const formName = (file: any, email: any) => {
      return (
        './upload/' +
        email +
        '/' +
        Buffer.from(file.originalname, 'latin1').toString('utf8') +
        ':' +
        md5(file.buffer)
      );
    };
    //writeFileSync('./upload/' + file.originalname, file.buffer);
    //
    /*
    try {
      const ex = util.promisify(exec);
      const { stdout, stderr } = await ex(`mkdir upload/` + user.username);
    } catch (e) {} */

    if (!existsSync(join(process.cwd(), 'upload'))) {
      mkdir(join(process.cwd(), 'upload'));
    }

    if (!existsSync(join(process.cwd(), 'upload', user.username))) {
      mkdir(join(process.cwd(), 'upload', user.username));
    }

    const files = await readdir(join(process.cwd(), 'upload', user.username));

    if (files.length > 99) {
      throw new ForbiddenException('User has maximal files count (100)');
    }

    //await writeFile(formName(file, user.username), file.buffer)
    //writeFile(formName(file, user.username), file.buffer).then(res => { console.log("WRITING COMPLETE") })
    if (file.size > 200000000)
      throw new ForbiddenException('File size too large (>20mb)');
    await writeFile(formName(file, user.username), file.buffer);

    /*let stream = createWriteStream(formName(file, user.username));
    stream.write(file.buffer);
    stream.end();
    console.log('FINISHED'); */
    return { ok: true };
  }

  @Post('upload-by-moderator/:username')
  @UseGuards(AuthGuard(), IsModeratorGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileByModerator(
    @Param('username') username: any,
    @UploadedFile()
    file: /* new ParseFilePipe({
         validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
       }), */
      Express.Multer.File,
  ) {
    if (file.originalname.includes(':'))
      throw new BadRequestException('File cannot have : inside its name.');
    const formName = (file: any, email: any) => {
      return (
        './upload/' +
        email +
        '/' +
        Buffer.from(file.originalname, 'latin1').toString('utf8') +
        ':' +
        md5(file.buffer)
      );
    };
    //writeFileSync('./upload/' + file.originalname, file.buffer);
    //
    /*
    try {
      const ex = util.promisify(exec);
      const { stdout, stderr } = await ex(`mkdir upload/` + user.username);
    } catch (e) {} */
    if (!existsSync(join(process.cwd(), 'upload'))) {
      mkdir(join(process.cwd(), 'upload'));
    }
    if (!existsSync(join(process.cwd(), 'upload', username))) {
      mkdir(join(process.cwd(), 'upload', username));
    }

    const files = await readdir(join(process.cwd(), 'upload', username));

    if (files.length > 99) {
      throw new ForbiddenException('User has maximal files count (100)');
    }

    //await writeFile(formName(file, user.username), file.buffer)
    //writeFile(formName(file, user.username), file.buffer).then(res => { console.log("WRITING COMPLETE") })
    if (file.size > 200000000)
      throw new ForbiddenException('File size too large (>20mb)');
    await writeFile(formName(file, username), file.buffer);

    /*let stream = createWriteStream(formName(file, user.username));
    stream.write(file.buffer);
    stream.end();
    console.log('FINISHED'); */
    return { ok: true };
  }

  async prekol() {
    return new Promise((res, rej) => {
      setInterval(() => {
        res(0);
      }, 60000);
    });
  }

  @Get('download-link/:username/:filename')
  @UseGuards(AuthGuard())
  async getDownloadLink(
    @GetUser() user: UserEntity,
    @Param('username') username: string,
    @Param('filename') filename: string,
  ) {
    if (user.role !== UserRolesEnum.Moderator && user.username !== username) {
      throw new BadRequestException('UnauthorizedException');
    }
    let obj = {
      owner: username,
      filename: filename,
      exp: Date.now() + 300000,
    };
    let encrypted = crypto.AES.encrypt(JSON.stringify(obj), secret).toString();
    return {
      response: Buffer.from(encrypted).toString('base64'),
    };
  }

  @Get('download-file/:encrypted')
  async downloadFile(
    @Param('encrypted') encrypted: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    let text = Buffer.from(encrypted, 'base64').toString('utf8');
    let bytes = crypto.AES.decrypt(text, secret);
    let json = bytes.toString(crypto.enc.Utf8);
    let obj = JSON.parse(json);
    if (obj.exp > Date.now()) {
      res.set({
        'Content-Disposition': `attachment; filename="${encodeURI(
          obj.filename.split(':')[0],
        )}"`,
      });

      let j = join(process.cwd(), 'upload', obj.owner, obj.filename);
      const file = createReadStream(j);
      if (file) {
        return new StreamableFile(file);
      } else {
        throw new NotFoundException('404');
      }
    } else {
      throw new NotFoundException('404');
    }
  }
  @Get('list')
  @UseGuards(AuthGuard())
  async getFileList(@GetUser() user: UserEntity) {
    if (!existsSync(join(process.cwd(), 'upload'))) {
      mkdir(join(process.cwd(), 'upload'));
    }
    const files = await readdir(join(process.cwd(), 'upload', user.username));
    return files;
  }

  @Get('list-by-moderator/:username')
  @UseGuards(AuthGuard(), IsModeratorGuard)
  async getFileListByModerator(@Param('username') username: string) {
    try {
      if (!existsSync(join(process.cwd(), 'upload'))) {
        mkdir(join(process.cwd(), 'upload'));
      }
      const files = await readdir(join(process.cwd(), 'upload', username));
      return files;
    } catch (e) {
      return [];
    }
  }

  @Delete(':filename/:username')
  @UseGuards(AuthGuard(), IsModeratorGuard)
  async deleteFileByModerator(
    @Param('username') username: string,
    @Param('filename') filename: string,
  ) {
    if (existsSync(join(process.cwd(), 'upload', username, filename))) {
      rm(join(process.cwd(), 'upload', username, filename));
      return { ok: true };
    } else {
      return { ok: false };
    }
  }

  @Delete(':filename')
  @UseGuards(AuthGuard())
  async deleteFile(
    @GetUser() user: UserEntity,
    @Param('filename') filename: string,
  ) {
    if (existsSync(join(process.cwd(), 'upload', user.username, filename))) {
      rm(join(process.cwd(), 'upload', user.username, filename));
      return { ok: true };
    } else {
      return { ok: false };
    }

    /* const ex = util.promisify(exec);
     console.log(`rm ./upload/` + user.username + '/' + filename);
     try {
       const { stdout, stderr } = await ex(
         `rm ./upload/` + user.username + '/*' + filename.split(':')[1],
       );
     } catch (e) {
       throw new NotFoundException(404);
     }
     return 'OK'; */
  }
  /*
    @Get('download/:filename')
    @UseGuards(AuthGuard())
    getFile(@GetUser() user: User, @Res({ passthrough: true }) res: Response, @Param('filename') filename: string): StreamableFile {
      res.set({
        'Content-Disposition': `attachment; filename="${filename.split(":")[1]}"`,
      });
  
      const file = createReadStream(join(process.cwd(), 'upload', user.username, filename));
      if (file) {
        return new StreamableFile(file);
      } else {
        throw new NotFoundException('404');
      }
  
    }
    */
}
