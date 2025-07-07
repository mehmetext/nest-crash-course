import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
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
import { UpdateUserListDto } from './dto/update-user-list.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('explore')
  explore() {
    return this.contentService.explore();
  }

  @Get('user/list')
  userlist(@Req() req: Request) {
    return this.contentService.userList(req.user as User);
  }

  @Post('user/list')
  addToUserList(@Req() req: Request, @Body() dto: AddToUserListDto) {
    return this.contentService.addToUserList(req.user as User, dto);
  }

  @Delete('user/list/:id')
  removeFromUserList(@Req() req: Request, @Param('id') id: string) {
    return this.contentService.removeFromUserList(req.user as User, id);
  }

  @Patch('user/list/:id')
  updateUserList(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateUserListDto,
  ) {
    return this.contentService.updateUserList(req.user as User, id, dto);
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

  @Get('recommendations')
  getRecommendations(@Req() req: Request) {
    return this.contentService.getRecommendations(req.user as User);
  }
}
