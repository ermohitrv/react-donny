/**
 * Created by wujianbo on 15/12/8.
 */
const d = {
    _NOT_numbers: /\D+/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
    idCard: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
    required: /\S+/,
    minlength (length, value){
        if(length === void(0)){
            throw 'ERROR: It is not a valid length, checkout your minlength settings.';
        }
        else {
            if(value.length < length){
                return false;
            }
            else {
                //Do Nothing
            }
        }
        return true;
    },
    maxlength (length, value){
        if(length === void(0)){
            throw 'ERROR: It is not a valid length, checkout your maxlength settings.';
        }
        else {
            if(value.length > length){
                return false;
            }
            else {
                //Do Nothing
            }
        }
        return true
    }
};
d.minLength = d.minlength;
d.maxLength = d.maxlength;

export default d;