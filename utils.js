const mailgun = require("mailgun-js");
const apiKey = "key-8a4180fb3084e2636f4391915dc2ecdd";
const DOMAIN = 'sandbox92ca7d2554944d7c865bed9a2ed02a7a.mailgun.org';
const mg = mailgun({apiKey: apiKey, domain: DOMAIN});


const sendEmail = ({text, subject}) => {
    const data = {
        from: 'St-option <me@samples.mailgun.org>',
        to: 'saoraghav@gmail.com, saoraghavendra@gmail.com, rishabdev919@gmail.com',
        subject: subject || 'Algo Trading Update',
        text
    };
    mg.messages().send(data, function (error, body) {
        // if (error) {
        //     console.log(err)
        // }
        // console.log(body);
    });
}

const getStrikeForOption = ({currentPrice, optionType}) => {
    const modifier  = optionType === "CE" ? - 10 : 60;
    const price = parseInt((currentPrice + modifier )/50)*50
    return price
}

module.exports = {
    getStrikeForOption,
    sendEmail,
}

