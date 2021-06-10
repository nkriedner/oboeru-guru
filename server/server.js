// ***************
// *** IMPORTS ***
// ***************

// Import express:
const express = require("express");
const app = express();
// Import compression for minimizing the size of the responses we send (should be used for any project):
const compression = require("compression");
// Import bcrypt with methods for password security:
const { hash, compare } = require("./bcrpt");
// Import crypto-random-string for generating the verification codes when resetting passwords:
const cryptRandomString = require("crypto-random-string");
// Import sendEmail function from SES for sending emails to the user:
const { sendEmail } = require("./ses");
// Import CookieSession module for setting and checking cookies:
const cookieSession = require("cookie-session");
// Import Csurf to prevent CSRF attacks:
const csurf = require("csurf");
// Import my cookieSecret from the secrets file:
let cookieSecret;
if (process.env.COOKIE_SECRET) {
    cookieSecret = process.env.COOKIE_SECRET;
} else {
    cookieSecret = require("../secrets.json").COOKIE_SECRET;
}
// Import database functions from db.js:
const {
    registerUser,
    findUser,
    getUserInfos,
    uploadImage,
    updateBio,
    updateUserPassword,
    insertCode,
    findCode,
    getMemoContent,
    updateMemoLevel,
    addMemoContent,
    addContentNames,
} = require("./db");
const { json } = require("express");
// Import the following to upload files ->
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, // files over 2mb cannot be uploaded!
    },
});
// <- end of code used for uploading files!

// *****************************
// *** ACTIVATION OF MODULES ***
// *****************************

// Activate compression module:
app.use(compression());
// Activate express.json middleware tto recognize the incoming Request Object as a JSON Object:
app.use(express.json());
// Activate cookieSession module:
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 7,
});
app.use(cookieSessionMiddleware);
// Activate Csurf and get the csrf token into a cookie:
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
// Activate the express middleware for parsing the body / urls - needed for post requests (correct ?):
app.use(
    express.urlencoded({
        extended: false,
    })
);
// Activate express.json for post requests to recognize incoming requests as json object (correct ?):
app.use(express.json());
// Activate express.static to serve static files ???
app.use(express.static(path.join(__dirname, "..", "client", "public")));

// **************
// *** ROUTES ***
// **************

// Welcome GET Route:
app.get("/welcome", (req, res) => {
    console.log("GET request for /welcome route.");
    // Check if user is logged in (if a userId is set in session cookie):
    console.log("Checking if user is logged in...");
    console.log("req.session: ", req.session);
    if (req.session.userId) {
        // If a userId is set in session cookie:
        console.log("Userid cookie is set ->");
        console.log("Redirect to / route...");
        res.redirect("/");
    } else {
        console.log("No userId cookie is set ->");
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// Registration POST Route:
app.post("/registration", (req, res) => {
    console.log("POST request on /registration route.");
    console.log("req.body: ", req.body);
    // Hash the password:
    hash(req.body.password)
        .then((hashed_password) => {
            console.log("hashed_password: ", hashed_password);
            // Insert submitted data into users table:
            console.log("Inserting data into users table...");
            registerUser(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                hashed_password
            )
                .then((result) => {
                    // Set a session cookie with the userId
                    console.log("setting a session cookie for userId");
                    req.session.userId = result.rows[0].id;
                    console.log("req.session.userId: ", req.session.userId);
                    res.json({
                        success: true,
                    });
                })
                .catch((err) => {
                    console.log("Error on /registration post route: ", err);
                    res.json({
                        error: "Error on /registration post route",
                        Error: err,
                    });
                });
        })
        .catch((err) => {
            console.log(
                "Error when hashing password in /registration route: ",
                err
            );
            res.json({
                error: "Error when hashing password in /registration route",
                Error: err,
            });
        });
});

// Login POST Route:
app.post("/login", (req, res) => {
    console.log("POST request for login route");
    console.log("req.body: ", req.body);
    // Search user in users table:
    findUser(req.body.email)
        .then((result) => {
            console.log("Searching user in database...");
            console.log("result.rows[0]: ", result.rows[0]);
            // Check password:
            compare(req.body.password, result.rows[0].password_hash)
                .then((matchCheck) => {
                    console.log("matchCheck: ", matchCheck);
                    if (matchCheck === true) {
                        // If password is true -> set session cookie for userId
                        console.log(
                            "Password is correct -> set session cookie for userId"
                        );
                        req.session.userId = result.rows[0].id;
                        res.json({
                            success: true,
                        });
                    } else {
                        res.json({
                            message: "Password is incorrect",
                        });
                    }
                })
                .catch((err) => {
                    console.log("Error when comparing passwords: ", err);
                    res.json({
                        error: "Error when comparing passwords",
                        Error: err,
                    });
                });
        })
        .catch((err) => {
            console.log("Error to find user in /login route: ", err);
            res.json({
                error: "Error to find user in /login route",
                Error: err,
            });
        });
});

// Logout GET Route:
app.get("/logout", (req, res) => {
    console.log("GET request for logout route");
    req.session.userId = null;
    console.log("Userid set to null");
    res.redirect("/welcome#/login");
});

// Upload image POST route:
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("POST request for /upload route");
    console.log("req.file: ", req.file);
    const fullUrl = s3Url + req.file.filename;
    console.log("fullUrl: ", fullUrl);
    // Upload image url to database:
    uploadImage(fullUrl, req.session.userId)
        .then((result) => {
            console.log("result.rows[0]: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("Error when uploading img url to database: ", err);
            res.json({
                error: "Error when uploading image in /uload route",
            });
        });
});

// Update bio POST route:
app.post("/update-bio", (req, res) => {
    console.log("POST request for /update-bio route");
    console.log("req.body: ", req.body);
    updateBio(req.body.bio, req.session.userId)
        .then((result) => {
            console.log("result.rows[0]: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("Error when updating bio in database: ", err);
            res.json({
                error: "Error when updating bio in database",
                Error: err,
            });
        });
});

// Reset password start POST route:
app.post("/reset-password/start", (req, res) => {
    console.log("POST request for /reset-password/start route");
    // Search user in users table:
    findUser(req.body.email)
        .then((result) => {
            console.log("Searching user in database...");
            // Check if user (email) exists in table:
            console.log("result.rows: ", result.rows);
            if (result.rows.length > 0) {
                console.log("User exists...");
                // Create the verification code:
                console.log("Creating the verification code...");
                const secretCode = cryptRandomString({
                    length: 6,
                });
                console.log("Verification Code: ", secretCode);
                // Put verification code in reset_codes table:
                console.log("Inserting code in reset_codes table...");
                insertCode(result.rows[0].email_address, secretCode)
                    .then((result) => {
                        // Send email to user:
                        console.log(
                            "Sending email with verfication code to user..."
                        );
                        console.log(
                            "result.rows[0].email: ",
                            result.rows[0].email
                        );
                        console.log(
                            "result.rows[0].code: ",
                            result.rows[0].code
                        );
                        sendEmail(
                            result.rows[0].email,
                            `This is the verification code to reset your password: ${result.rows[0].code}`,
                            `Resetting your password`
                        );
                        res.json({
                            success:
                                "Successfully sent email with reset verification code",
                        });
                    })
                    .catch((err) => {
                        console.log(
                            "Error when inserting the verification code and/or sending the email to user:",
                            err
                        );
                        res.json({
                            error: "Error when inserting code in table or when sending email",
                            Error: err,
                        });
                    });
            } else {
                console.log("This user does not exit in database");
                res.json({
                    success: false,
                    // error: "Sorry, but this user does not exist in database",
                });
            }
        })
        .catch((err) => {
            console.log(
                "Error when searching for user in user table in server:",
                err
            );
            res.json({
                error: "Error when searching for user in user table in server",
                Error: err,
            });
        });
});

// Reset password verify POST route:
app.post("/reset-password/verify", (req, res) => {
    console.log("POST request for /reset-password/verify route");
    console.log("req.body: ", req.body);
    // Search for code in reset_codes table:
    console.log("Searching for the code in database...");
    findCode(req.body.email)
        .then((result) => {
            console.log("result.rows: ", result.rows);
            // Check if code in db is equal to input of user:
            if (result.rows[0].code == req.body.code) {
                console.log("Verification code input was correct");
                hash(req.body.password).then((hashed_password) => {
                    console.log("hashed_password: ", hashed_password);
                    console.log("Updating user password...");
                    updateUserPassword(hashed_password, req.body.email)
                        .then(() => {
                            console.log("User password was updated");
                            res.json({
                                success: "User password was updated",
                            });
                        })
                        .catch((err) => {
                            console.log(
                                "Error when updating user password: ",
                                err
                            );
                            res.json({
                                Message: "Error when updating user password",
                                Error: err,
                            });
                        });
                });
            } else {
                console.log("Verifcitaion code input was not correct");
                res.json({
                    success: false,
                });
            }
        })
        .catch((err) => {
            console.log(
                "Error when searching for code in reset_codes table: ",
                err
            );
            res.json({
                Message: "Error when searching for code in reset_codes table",
                Error: err,
            });
        });
});

// User GET Route (to return logged-in user's info):
app.get("/user", (req, res) => {
    console.log("GET request to /user route");
    console.log("Getting user's infos from database...");
    getUserInfos(req.session.userId)
        .then((result) => {
            console.log("result.rows[0] from getUserInfo: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("Error when getting user's infos from database: ", err);
            res.json({
                Message: "Error when getting user's infos from database",
                Error: err,
            });
        });
});

// Get-memo-content GET route:
app.get("/get-memo-content", (req, res) => {
    console.log("GET request to /get-memo-content route");
    getMemoContent(req.session.userId)
        .then((result) => {
            console.log("Successfully received memo-content");
            // console.log("result.rows from getMemoContent():", result.rows);
            res.json({
                data: result.rows,
            });
        })
        .catch((err) => {
            console.log("Error when using getMemoContent from database: ", err);
        });
});

app.post("/update-memo-level", (req, res) => {
    console.log("POST request to /update-memo-level");
    console.log(req.body);
    updateMemoLevel(req.body["memo_id"], req.body["memo_level"])
        .then((result) => {
            console.log(
                "Memo content successfully updated on /add-memo-content route"
            );
            // console.log("result.rows from /update-memo-level: ", result.rows);
        })
        .catch((err) => {
            console.log("Error when using updateMemoLevel(): ", err);
        });
});

app.post("/add-memo-content", (req, res) => {
    console.log("POST request to /add-memo-content");
    console.log(req.body);
    addMemoContent(
        req.body["content_1"],
        req.body["content_2"],
        req.session.userId
    )
        .then((result) => {
            console.log(
                "Memo content successfully added on /add-memo-content route"
            );
            // console.log("result.rows from /add-memo-content: ", result.rows);
        })
        .catch((err) => {
            console.log("Error when using addMemoContent: ", err);
        });
});

app.post("/update-content-names", (req, res) => {
    console.log("POST request to /updata-content-names route");
    console.log(req.body);
});

// Universal GET Route:
// (do not delete or comment out this route ever!!!)
app.get("*", function (req, res) {
    console.log("GET request for universal * route");
    // Check if user is NOT logged in (if no userId in session cookie):
    console.log("Checking if user is NOT logged in...");
    // console.log("req.session: ", req.session);
    if (!req.session.userId) {
        // If NO userId is set in session cookie:
        console.log("No userId cookie is set ->");
        console.log("Redirect to /welcome route...");
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// ************************
// **** ACTIVATE SERVER ***
// ************************

app.listen(process.env.PORT || 3001, function () {
    console.log("Server listening on port 3001.");
});
