import { PartialType } from '@nestjs/mapped-types';
import { ClassDTO } from './class.dto';

export class ClassUpdateDTO extends PartialType(ClassDTO) {}
