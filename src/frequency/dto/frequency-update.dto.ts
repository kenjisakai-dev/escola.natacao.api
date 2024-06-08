import { PartialType } from '@nestjs/mapped-types';
import { FrequencyDTO } from './frequency.dto';

export class FrequencyUpdateDTO extends PartialType(FrequencyDTO) {}
