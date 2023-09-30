const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:"smtp.gmail.com",
                auth:{
                    user: "devhelp107@gmail.com",
                    pass: "thliqxetdhdpteoy",
                }
            })


            let info= await transporter.sendMail({
                from: 'StudyNotion || DevHelp - by Ashish',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}
module.exports = mailSender;