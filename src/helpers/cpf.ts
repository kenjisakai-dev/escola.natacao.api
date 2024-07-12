import axios from 'axios';
import config from '../config/environment';

interface ICPF {
    valid: boolean;
}

export async function validateCPF(cpf: string): Promise<ICPF> {
    const res = await axios
        .get('https://api.invertexto.com/v1/validator', {
            params: {
                token: config.token_validator_cpf,
                value: cpf,
                type: 'cpf',
            },
        })
        .then((res) => res.data);

    return res;
}
