//We store very important and sensitive data in our servers envirenment variable as it is safer. Becuase even if somebdy views our code, he won't be able to get the sensitive info
if(process.env.NODE_ENV == 'production')
    module.exports = require("./prod");
else
    module.exports = require("./dev");