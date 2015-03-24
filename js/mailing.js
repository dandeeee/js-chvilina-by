var EMAIL_TO = "info@hvilina.by"
var SITE_NAME = "hvilina.by"
var MAIL_SUBJECT = "Предзаказ часов Hvilina"
var PROVIDER = 'https://mandrillapp.com/api/1.0/messages/send.json'
var TOKEN = 'q5m-17tGhHoYATouRzxK6A'

function gatherUserData() {
    var frm = document.preorder_form;
    var name, phone, mail, location, type;
    if(frm!=null){
        name = frm.elements['user_name'].value;
        phone = frm.elements['user_phone'].value;
        mail = frm.elements['user_mail'].value;
        location = frm.elements['user_location'].value;
        type = frm.elements['user_type'].value;
    }

    return { "name" : name, "phone" : phone, "mail" : mail, "location" : location, "type" : type }
}

function userDataToString(data){
    var str = "";

    if(data.name!="") str += "Имя: " + data.name + "<br>";
    if(data.phone!="") str += "Тел: " + data.phone + "<br>";
    if(data.mail!="") str += "E-mail: " + data.mail + "<br>";
    if(data.location!="") str += "Город: " + data.location+ "<br>";
    if(data.type!="") str += "Вид: " + data.type+ "<br>";

    return str;
}


function processData() {
    var userData = gatherUserData();
    sendOrderMail(userDataToString(userData) + "<hr>", EMAIL_TO, userData);

    if(userData.mail!="")
        sendConfirmationMailToUser(userData, userDataToString(userData), userData.mail);
}

function sendOrderMail(content, mailTo, userData) {
    sendMail(content, mailTo, userData, sendOrderCallBack);
}

function sendConfirmationMailToUser(userData, content, mailTo) {
    var str = "Здравствуйте, " + userData.name + "!<br><br>" + "Вы только что сделали следующую заявку на сайте " + SITE_NAME + "<br><br>";
    str +=  content ;
    str += "<br>" + "Пожалуйста, дождитесь когда мы свяжемся с вами для её подтверждения.";
    str += "<br><br>" + "С уважением, <br>Hvilina.by<br>";
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
    var str = "<h1>Дзякуй!</h1><h3>";
    if(data.mail!=""){
        str += 'Мы адаслалi копiю лiста на ваш яшчык <span style="color: #0e48f5;"><u> ' + data.mail + '</u></span>. ';
    }
    str += "Калiласка, пачакайце, калi менеджэр з вамi звяжацца.</h3>";
    $("#order_summary").css("display","block");
    $("#order_summary").html(str);

}