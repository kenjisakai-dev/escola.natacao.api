import * as dotenv from 'dotenv';

dotenv.config({
    path: process.env.ENV === 'TEST' ? '.env.test' : '.env',
});

export const { token_validator_cpf } = process.env;
