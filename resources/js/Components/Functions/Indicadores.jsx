import axios from 'axios';

export function ajaxGetIndicadores() {

    return axios.post('/ajax-get-indicadores', {} )
        .then(res => {
            let r = res.data;
            return r;
        });
}
