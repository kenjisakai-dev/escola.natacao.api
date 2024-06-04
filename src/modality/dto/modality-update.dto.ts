import { PartialType } from '@nestjs/mapped-types';
import { ModalityDTO } from './modality.dto';

export class ModalityUpdateDTO extends PartialType(ModalityDTO) {}
