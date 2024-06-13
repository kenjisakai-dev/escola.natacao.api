import axios from 'axios';
import { IAddress } from '../student/interface/adress.interface';

interface IAddresRes {
    uf?: string;
    localidade?: string;
    bairro?: string;
    logradouro?: string;
    erro?: boolean;
}

export async function getAddressByCEP(cep: string): Promise<IAddress> {
    const { uf, localidade, bairro, logradouro, erro }: IAddresRes = await axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.data);

    const address: IAddress = {
        estado: uf,
        cidade: localidade,
        bairro: bairro,
        rua: logradouro,
        erro: erro,
    };

    return address;
}
