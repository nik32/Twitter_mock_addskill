//We store very important and sensitive data in our servers envirenment variable as it is safer. Becuase even if somebdy views our code, he won't be able to get the sensitive info
module.exports = {
    mongoURL : process.env.mongoURL,
    jwt_secret_key: process.env.jwt_secret_key
}
