import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import {
  equalTo,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  update,
} from "firebase/database";
import { db } from "../config/firebase.js";
import nodemailer from "nodemailer";
import admin from "firebase-admin";

// Intialize the firebase-admin project/account

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports

  host: "server15.hndservers.net",
  auth: {
    user: "zain@link2avicenna.com",
    pass: "Avicenna7860#",
  },
  secure: true,
});

export const deleteUserController = async (req, res, next) => {
  try {
    if (req?.body?.id) {
      const uid = req?.body?.id;
      getAuth()
        .deleteUser(uid)
        .then(() => {
          remove(ref(db, `Users/${uid}`)).then(() => {
            console.log("Successfully deleted user");
            res?.status(200).send({
              success: true,
              message: "user deleted successfuly",
            });
          });
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
        });
    } else {
      res?.status(400).send({
        success: false,
        message: "user id is required",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error,
    });
  }
};

export const adminAccessController = (req, res) => {
  try {
    const userEmail = req.body.email;
    const parentId = req.body.parentId;
    const companyName = req.body.companyName;
    if (userEmail && parentId) {
      const starCountRef = query(
        ref(db, "/Users"),
        orderByChild("parentID"),
        equalTo(parentId)
      );
      onValue(starCountRef, async (snapshot) => {
        const data = await snapshot.val();
        if (data) {
          let userToBeModified = Object.values(data)?.find((elm) => {
            return elm?.email === userEmail;
          });

          if (userToBeModified) {
            admin
              .auth()
              .generatePasswordResetLink(userEmail)
              .then((link) => {
                update(ref(db, `Users/${userToBeModified?.id}`), {
                  isAdmin: true,
                }).then(() => {
                  const mailOptions = {
                    from: "zain@link2avicenna.com",
                    //   from: 'hasnain.avicennaenterprise@gmail.com',
                    to: userEmail,
                    subject: `${companyName} added you as an Admin`,
                    html: `<b>Hey there! </b><br>You are invited by ${companyName} on Connex platform please click link bellow to add your password so that you can login as an Admin to connex app </b> ${link}<br/>`,
                    //  `Your password reset link is: ${link}`,
                    //   html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
                  };

                  transporter.sendMail(mailOptions, function (err, info) {
                    if (err)
                      return res
                        .status(500)
                        .json({ status: false, message: err });
                    else
                      return res.status(200).json({
                        status: false,
                        message: "Access has been sent to email",
                      });
                  });
                });
              })
              .catch((error) => {
                console.log(error);
                res?.status(400).send({
                  success: false,
                  message:
                    "User not found corresponding to this email in your company1",
                });
              });
          } else {
            res?.status(400).send({
              success: false,
              message:
                "User not found corresponding to this email in your company2",
            });
          }
        } else {
          res?.status(400).send({
            success: false,
            message:
              "User not found corresponding to this email in your company3",
          });
        }
      });
    } else {
      res?.status(400).send({
        success: false,
        message: "email is required",
      });
    }
  } catch (error) {
    res?.status(400).send({
      success: false,
      message: `error ${error}`,
    });
  }
};
