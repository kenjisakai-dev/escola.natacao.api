import axios from 'axios';

interface ICPF {
    valid: boolean;
    formatted: string;
}

export async function validateCPF(cpf: string): Promise<ICPF> {
    const res = await axios.get('https://api.invertexto.com/v1/validator', {
        params: {
            token: '7903|nYW2w0qA9qkB3EBN9o1c13oQxhO7HbV5',
            value: cpf,
            type: 'cpf',
        },
    });

    return res?.data;
}
