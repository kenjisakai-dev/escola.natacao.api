import { PartialType } from '@nestjs/mapped-types';
import { RegistrationDTO } from './registration.dto';

export class RegistrationUpdateDTO extends PartialType(RegistrationDTO) {}
