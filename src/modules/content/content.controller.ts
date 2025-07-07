import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentType, User } from '@prisma/client';
import { Request } from 'express';
import { Language } from 'src/common/constants/languages';
import { ContentService } from './content.service';
import { AddToUserListDto } from './dto/add-to-user-list.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('explore')
  explore() {
    return this.contentService.explore();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/list')
  userlist(@Req() req: Request) {
    return this.contentService.userList(req.user as User);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/list')
  addToUserList(@Req() req: Request, @Body() dto: AddToUserListDto) {
    return this.contentService.addToUserList(req.user as User, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('user/list/:id')
  removeFromUserList(@Req() req: Request, @Param('id') id: string) {
    return this.contentService.removeFromUserList(req.user as User, id);
  }

  @Get('/:contentType/:id')
  getContentDetails(
    @Param('contentType', new ParseEnumPipe(ContentType))
    contentType: ContentType,
    @Param('id') id: string,
    @Query(
      'language',
      new ParseEnumPipe(Language, {
        optional: true,
      }),
    )
    language: Language,
  ) {
    return this.contentService.getContentDetails(contentType, id, language);
  }
}
