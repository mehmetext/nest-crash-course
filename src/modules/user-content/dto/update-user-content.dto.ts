import { PartialType } from '@nestjs/mapped-types';
import { CreateUserContentDto } from './create-user-content.dto';

export class UpdateUserContentDto extends PartialType(CreateUserContentDto) {}
