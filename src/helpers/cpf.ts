import axios from 'axios';
import { token_validator_cpf } from '../config/environment';

interface ICPF {
    valid: boolean;
    formatted: string;
}

export async function validateCPF(cpf: string): Promise<ICPF> {
    const res = await axios.get('https://api.invertexto.com/v1/validator', {
        params: {
            token: token_validator_cpf,
            value: cpf,
            type: 'cpf',
        },
    });

    return res?.data;
}
