import nodemailer from "nodemailer";

// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_USERNAME=topdevking@gmail.com
// SMTP_PASSWORD=zplquowotzoazpdg
var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "topdevking@gmail.com",
    pass: "zplquowotzoazpdg"
  }
});

var subject = "Received New Interpreter Data";
var phone = "1111111111";
var name = "test";
var email = "test email";
var language = "en";
var experience = "none";
var body = `<!doctypehtml><meta content="width=device-width,initial-scale=1"name=viewport><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><title>Interpreter Data</title><style>img{border:none;-ms-interpolation-mode:bicubic;max-width:100%}body{background-color:#f6f6f6;font-family:sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%}table td{font-family:sans-serif;font-size:14px;vertical-align:top}.body{background-color:#f6f6f6;width:100%}.container{display:block;margin:0 auto!important;max-width:580px;padding:10px;width:580px}.content{box-sizing:border-box;display:block;margin:0 auto;max-width:580px;padding:10px}.main{background:#fff;border-radius:3px;width:100%}.wrapper{box-sizing:border-box;padding:20px}.content-block{padding-bottom:10px;padding-top:10px}.footer{clear:both;margin-top:10px;text-align:center;width:100%}.footer a,.footer p,.footer span,.footer td{color:#999;font-size:12px;text-align:center}h1,h2,h3,h4{color:#000;font-family:sans-serif;font-weight:400;line-height:1.4;margin:0;margin-bottom:30px}h1{font-size:35px;font-weight:300;text-align:center;text-transform:capitalize}ol,p,ul{font-family:sans-serif;font-size:14px;font-weight:400;margin:0;margin-bottom:15px}ol li,p li,ul li{list-style-position:inside;margin-left:5px}a{color:#3498db;text-decoration:underline}.btn{box-sizing:border-box;width:100%}.btn>tbody>tr>td{padding-bottom:15px}.btn table{width:auto}.btn table td{background-color:#fff;border-radius:5px;text-align:center}.btn a{background-color:#fff;border:solid 1px #3498db;border-radius:5px;box-sizing:border-box;color:#3498db;cursor:pointer;display:inline-block;font-size:14px;font-weight:700;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize}.btn-primary table td{background-color:#3498db}.btn-primary a{background-color:#3498db;border-color:#3498db;color:#fff}.last{margin-bottom:0}.first{margin-top:0}.align-center{text-align:center}.align-right{text-align:right}.align-left{text-align:left}.clear{clear:both}.mt0{margin-top:0}.mb0{margin-bottom:0}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}hr{border:0;border-bottom:1px solid #f6f6f6;margin:20px 0}@media only screen and (max-width:620px){table.body h1{font-size:28px!important;margin-bottom:10px!important}table.body a,table.body ol,table.body p,table.body span,table.body td,table.body ul{font-size:16px!important}table.body .article,table.body .wrapper{padding:10px!important}table.body .content{padding:0!important}table.body .container{padding:0!important;width:100%!important}table.body .main{border-left-width:0!important;border-radius:0!important;border-right-width:0!important}table.body .btn table{width:100%!important}table.body .btn a{width:100%!important}table.body .img-responsive{height:auto!important;max-width:100%!important;width:auto!important}}@media all{.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.apple-link a{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}.btn-primary table td:hover{background-color:#34495e!important}.btn-primary a:hover{background-color:#34495e!important;border-color:#34495e!important}}</style><span class=preheader>Interpreter Data</span><table role=presentation border=0 cellpadding=0 cellspacing=0 class=body><tr><td> <td class=container><div class=content><table role=presentation class=main><tr><td class=wrapper><table role=presentation border=0 cellpadding=0 cellspacing=0><tr><td><p>Hi Admin,<p>You have received a new interpreter data from your website.</p><br><br><table role=presentation border=0 cellpadding=0 cellspacing=0 class="btn btn-primary"><tr><td align=left>Full Name:<td align=left>${name}<tr><td align=left>Language:<td align=left>${language}<tr><td align=left>Experience:<td align=left>${experience}<tr><td align=left>Email:<td align=left>${email}<tr><td align=left>Phone:<td align=left>${phone}</table></table></table></div><td> </table>`
var mailOptions = {
  from: `neon-languages@neon-l.com <neon-languages@neon-l.com>`,
  // to: 'd.krutiedu@gmail.com',
  to: 'neon-languages@neon-l.com',
  subject: subject,
  html: body,
};

transport.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error, 'error')
    res.send({ success: false })
  }
  else {
    console.log('success', info)
    res.send({ success: true })
  }
});