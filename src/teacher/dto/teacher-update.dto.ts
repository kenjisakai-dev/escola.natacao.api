import { PartialType } from '@nestjs/mapped-types';
import { TeacherDTO } from './teacher.dto';

export class TeacherUpdateDTO extends PartialType(TeacherDTO) {}
