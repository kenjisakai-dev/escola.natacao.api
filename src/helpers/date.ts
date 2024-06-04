import * as moment from 'moment';

export function formatDate(date: string) {
    return new Date(moment(date).format('YYYY-MM-DD hh:mm:ss'));
}
