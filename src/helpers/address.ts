import axios from 'axios';

interface IAddress {
    cep?: string;
    uf?: string;
    localidade?: string;
    bairro?: string;
    logradouro?: string;
    erro?: boolean;
}

export async function getAddressByCEP(cep: string): Promise<IAddress> {
    const address = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    return address?.data;
}
