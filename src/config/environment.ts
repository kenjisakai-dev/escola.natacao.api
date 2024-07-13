import * as dotenv from 'dotenv';

dotenv.config({
    path: loadEnvironment(),
});

function loadEnvironment() {
    const env = process.env.ENV;

    switch (env) {
        case 'TEST':
            return '.env.test';
        case 'PRD':
            return '.env';
        default:
            return '.env.dev';
    }
}

export default {
    database_url: process.env.DATABASE_URL,
    token_validator_cpf: process.env.TOKEN_VALIDATOR_CPF,
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT,
};
