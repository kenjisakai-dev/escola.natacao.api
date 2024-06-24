import * as dotenv from 'dotenv';

dotenv.config({
    path: process.env.ENV === 'TEST' ? '.env.test' : '.env',
});

export default {
    database_url: process.env.DATABASE_URL,
    token_validator_cpf: process.env.TOKEN_VALIDATOR_CPF,
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT,
};
