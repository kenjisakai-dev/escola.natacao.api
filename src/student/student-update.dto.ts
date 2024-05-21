import { PartialType } from '@nestjs/mapped-types';
import { StudentDTO } from './student.dto';

export class StudentUpdateDTO extends PartialType(StudentDTO) {}
