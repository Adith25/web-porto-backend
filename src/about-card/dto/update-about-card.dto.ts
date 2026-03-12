import { PartialType } from '@nestjs/mapped-types';
import { CreateAboutCardDto } from './create-about-card.dto';

export class UpdateAboutCardDto extends PartialType(CreateAboutCardDto) {}
