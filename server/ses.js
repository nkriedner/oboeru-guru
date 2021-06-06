const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

// console.log(secrets.AWS_KEY, secrets.AWS_SECRET);

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

module.exports.sendEmail = function (recipient, message, subject) {
    // console.log(recipient, message, subject);
    return ses
        .sendEmail({
            Source: "Nils Kriedner <dirt.preface@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("Sending the email worked!"))
        .catch((err) =>
            console.log("Error when trying to send the email: ", err)
        );
};
