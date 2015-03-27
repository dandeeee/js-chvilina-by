var EMAIL_TO = "info@hvilina.by"
var SITE_NAME = "hvilina.by"
var MAIL_SUBJECT = "Hvilina order"
var PROVIDER = 'https://mandrillapp.com/api/1.0/messages/send.json'
var TOKEN = 'q5m-17tGhHoYATouRzxK6A'

function gatherUserData() {
    var frm = document.preorder_form;
    var user_name, user_phone, user_mail, user_location, user_text,user_choise_male, user_choise_female, user_choise_vershnik;
    if(frm!=null){
        user_name = frm.elements['user_name'].value;
        user_phone = frm.elements['user_phone'].value;
        user_mail = frm.elements['user_mail'].value;
        user_location = frm.elements['user_location'].value;
        user_text = frm.elements['user_text'].value;
        user_choise_male = (frm.elements['user_choise_male'].checked == true ) ? "Так / Yes" : "Не / No";
        user_choise_female = (frm.elements['user_choise_female'].checked == true ) ? "Так / Yes" : "Не / No";
        user_choise_vershnik = (frm.elements['user_choise_vershnik'].checked == true ) ? "Так / Yes" : "Не / No";
    }

    return { "user_name" : user_name, "user_phone" : user_phone, "user_mail" : user_mail, "user_location" : user_location, "user_text" : user_text,
        "user_choise_male" : user_choise_male, "user_choise_female" : user_choise_female, "user_choise_vershnik" : user_choise_vershnik};
}

function userDataToString(data){
    var str = "";

    if(data.user_name!="") str += "Iмя / name: " + data.user_name + "<br>";
    if(data.user_phone!="") str += "Tэлефон / phone: " + data.user_phone + "<br>";
    if(data.user_mail!="") str += "E-mail: " + data.user_mail + "<br>";
    if(data.user_location!="") str += "Горад / city: " + data.user_location+ "<br>";
    if(data.user_text!="") str += "Тэкст / text: " + data.user_text+ "<br>";
    if(data.user_choise_male!="") str += "Повязь часу для пана / Poviaź Času male: " + data.user_choise_male+ "<br>";
    if(data.user_choise_female!="") str += "Повязь часу для панi / Poviaź Času female: " + data.user_choise_female+ "<br>";
    if(data.user_choise_vershnik!="") str += "ВЕРШНIK 1588 / Vieršnik 1588: " + data.user_choise_vershnik+ "<br>";

    return str;
}


function processData() {
    var userData = gatherUserData();
    sendOrderMail(userDataToString(userData) + "<hr>", EMAIL_TO, userData);

    if(userData.mail!="")
        sendConfirmationMailToUser(userData, userDataToString(userData), userData.user_mail);
}

function sendOrderMail(content, mailTo, userData) {
    sendMail(content, mailTo, userData, sendOrderCallBack);
}

function sendConfirmationMailToUser(userData, content, mailTo) {
    var str = "Добры дзень, " + userData.user_name + "!<br><br>" + " Вы толькi што пакiнулi заяўку на сайце " + SITE_NAME + "<br><br>";
    str +=  content ;
    str += "<br>" + "Калi ласка, пачакайце, пакуль менеджэр з вамi звяжацца.";
    str += "<br><br>" + "З павагай, <br>" +SITE_NAME+ "<br>";
    sendMail(str, mailTo, userData);
}

function sendMail(content, mailTo, data, callBack) {
    $.ajax({
        type: "POST",
        url: PROVIDER,
        data: {
            'key': TOKEN,
            'message': {
                'from_email': EMAIL_TO,
                'to': [
                    {
                        'email': mailTo,
                        'name': 'hvilina',
                        'type': 'to'
                    }
                ],
                'autotext': 'true',
                'subject': MAIL_SUBJECT,
                'html': content
            }
        }
    }).done(function (response) {
//        console.log(response.toString()); // if you're into that sorta thing
        if(callBack!=null)
            callBack(data);
    });
}

function sendOrderCallBack(data){
    $.mobile.navigate("#thank-you");
}