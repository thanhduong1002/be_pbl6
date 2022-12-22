const express = require("express");
const nodemailer = require("nodemailer");
var cors = require("cors");
require("./db/moogoose");
const User = require("./models/users");
const Supplies = require("./models/supplies");
const Products = require("./models/products");
const Carts = require("./models/carts");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors()); // Use this after the variable declaration
app.use(express.json());

app.post("/signup", async (req, res) => {
  const test = new User(req.body);
  test.codeOTP = Math.floor(Math.random() * (9999 - 1000) + 1000);
  let array = await User.find({});
  test.iduser = array.length + 1;
  test
    .save()
    .then(() => {
      res.send(test);
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      res.send(e);
    });
});

app.post("/signupoauth", async (req, res) => {
  const { name, email } = req.body;
  const test = new User();
  let check = await User.findOne({email : email});
  if(check !== null){
    if(check.password == null) res.send('Oke');
    else res.send('Email is exist');
  }
  else{
    let array = await User.find({});
    test.email = email;
    test.name = name;
    test.iduser = array.length + 1;
    test
      .save()
      .then(() => {
        res.send(test);
        res.status(200);
      })
      .catch((e) => {
        res.status(400);
        res.send(e);
      });
  }

});

app.post("/insert", async (req, res) => {
  const test = new Supplies(req.body);
  test
    .save()
    .then(() => {
      res.send(test);
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      res.send(e);
    });
});

app.post("/insertProduct", async (req, res) => {
  const test = new Products(req.body);
  test.star = ((Math.random() * (50 - 35) + 35) / 10).toFixed(1);
  test.sold = ((Math.random() * (33 - 10) + 10) / 10).toFixed(1);
  test
    .save()
    .then(() => {
      res.send(test);
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      res.send(e);
    });
});

app.post("/insertCart", async (req, res) => {
  const test = new Carts(req.body);
  test.sum = test.price * test.amount;
  test
    .save()
    .then(() => {
      res.send(test);
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      res.send(e);
    });
});

app.post("/getallCarts", async (req, res) => {
  let status = 500,
    response = {};
  const { iduser } = req.body;
  const carts = await Carts.find({ iduser: iduser });
  if (carts === null) return res.status(400);
  response.status = 200;
  response.message = carts;
  response.internal_message = `success with ${iduser}`;

  return res.status(response.status).json(response);
});

app.get("/getallProducts", async (req, res) => {
  let status = 500,
    response = {};
  const {} = req.body;
  const products = await Products.find({});
  response.status = 200;
  response.message = products;
  response.internal_message = `success with getall`;

  return res.status(response.status).json(response);
});

app.post("/getall", async (req, res) => {
  let status = 500,
    response = {};
  const { iduser } = req.body;
  const supplies = await Supplies.find({ iduser });
  response.status = 200;
  response.message = supplies;
  response.internal_message = `success with ${iduser}`;

  return res.status(response.status).json(response);
});

app.post("/getProduct", async (req, res) => {
  let status = 500,
    response = {};
  const { iduser, name, price, amount, color, size } = req.body;
  let check = new Carts();
  check = await Carts.findOne({ iduser: iduser, name: name, price:price, amount:amount, color:color, size:size });

  // const filter = { iduser: iduser, name: name, _id: check._id };

  // const updateDoc = {
  //   $set: {
  //     name: name,
  //     price: price,
  //     amount: amount,
  //     color: color,
  //     size: size,
  //     sum: amount * price,
  //   },
  // };
  // const result = await Carts.updateOne(filter, updateDoc);
  response.status = 200;
  response.message = check;
  response.internal_message = "success";

  return res.status(response.status).json(response);
});

app.post("/update", async (req, res) => {
  let status = 500,
    response = {};
  const { _id ,iduser, name, price, amount, color, size } = req.body;

  const filter = { iduser: iduser, name: name, _id: _id };

  const updateDoc = {
    $set: {
      name: name,
      price: price,
      amount: amount,
      color: color,
      size: size,
      sum: amount * price,
    },
  };
  const result = await Carts.updateOne(filter, updateDoc);
  response.status = 200;
  response.message = "Update Successful";
  response.internal_message = "success";

  return res.status(response.status).json(response);
});
app.post("/delete", async (req, res) => {
  let status = 500,
    response = {};
  const { iduser, name, price, amount, color, size } = req.body;

  const result = await Carts.deleteOne({ iduser: iduser, name: name, price : price, amount : amount, color:color, size:size });
  response.status = 200;
  response.message = "delete successful";
  response.internal_message = `delete successful`;

  return res.status(response.status).json(response);
});

app.post("/login", async (req, res) => {
  let status = 500,
    response = {};
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
    // const resetOTP = Math.floor(Math.random() * (9999 - 1000) + 1000);
    // // create a filter for a movie to update
    // const filter = { email: email };
    // // create a document that sets the plot of the movie
    // const updateDoc = {
    //   $set: {
    //     codeOTP: `${resetOTP}`,
    //   },
    // };
    // const result = await User.updateOne(filter, updateDoc);
    if (!user) {
      status = 401; /// 401 Unauthorized
      throw new Error("Email or password is incorrect!!");
    }
    /// nếu có email cần check xem password có match đúng với db không?
    const isMatch = (await password) === user.password;
    if (!isMatch) {
      /// nếu password không chính xác thì trả ra lỗi
      status = 401; /// 401 Unauthorized
      throw new Error("Email or password is incorrect!!");
    }

    /// khúc này nếu bạn kỹ tính hãy tạo 1 phương thức chung để format dữ liệu
    /// còn mình làm nhanh thì trả ra dữ liệu luôn
    response.status = 200;
    response.message = "Login successful";
    response.internal_message = `${user.name}`;
    return res.status(response.status).json(response);
  } catch (error) {
    let err = { error: "error", message: error.message };
    response.status = status || 500;
    response.message = error.message;
    response.internal_message = error.message;
    response.errors = [err];

    return res.status(response.status).json(response);
  }
});

//khoi tao 1 api co phuong thuc post de nhan email nguoi dung va gui mail den dia chi email cua nguoi dung cung cap
app.post("/sendMail", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
  const randomPass = Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
  // create a filter for a movie to update
  const filter = { email: email };
  // create a document that sets the plot of the movie
  const updateDoc = {
    $set: {
      password: `${randomPass}`,
    },
  };
  const result = await User.updateOne(filter, updateDoc);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thanhduong10022001@gmail.com", // generated ethereal user
      pass: "fdoksxyjumlyhtla", // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail(
    {
      from: "thanhduong10022001@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: "Reset password", // Subject line
      text: "Current password", // plain text body
      html: `<b>New your account 's password is ${randomPass}</b>`, // html body
    },
    (err) => {
      if (err) {
        return res.json({
          message: "Error",
          err,
        });
      }
      return res.json({
        status: 200,
        message: `Email has been sent successfully to ${email}`,
      });
    }
  );
});

app.post("/sendOTP", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thanhduong10022001@gmail.com", // generated ethereal user
      pass: "fdoksxyjumlyhtla", // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail(
    {
      from: "thanhduong10022001@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: "OTP code", // Subject line
      text: "OTP code", // plain text body
      html: `<b>Your OTP code is ${user.codeOTP}</b>`, // html body
    },
    (err) => {
      if (err) {
        return res.json({
          message: "Error",
          err,
        });
      }
      return res.json({
        status: 200,
        message: `Email has been sent successfully to ${email}`,
      });
    }
  );
});

app.post("/resetOTP", async (req, res) => {
  response = {};
  const { email } = req.body;
  const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
  // create reusable transporter object using the default SMTP transport
  const resetOTP = Math.floor(Math.random() * (9999 - 1000) + 1000);
  // create a filter for a movie to update
  const filter = { email: email };
  // create a document that sets the plot of the movie
  const updateDoc = {
    $set: {
      codeOTP: `${resetOTP}`,
    },
  };
  const result = await User.updateOne(filter, updateDoc);
  response.status = 200;
  response.message = "Reset successful";
  return res.status(response.status).json(response);
});

app.post("/checkOTP", async (req, res) => {
  let status = 500,
    response = {};
  const { email, codeOTP } = req.body;
  const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
  const isMatch = (await codeOTP) === user.codeOTP;
  if (!isMatch) {
    /// nếu password không chính xác thì trả ra lỗi
    response.status = 401; /// 401 Unauthorized
    response.message = "Login Failed";
    response.internal_message = "Login Failed";
    return res.status(response.status).json(response);
  }
  /// khúc này nếu bạn kỹ tính hãy tạo 1 phương thức chung để format dữ liệu
  /// còn mình làm nhanh thì trả ra dữ liệu luôn
  response.status = 200;
  response.message = "Login successful";
  response.internal_message = "Login successful";

  return res.status(response.status).json(response);
});

app.post("/updateProfile", async (req, res) => {
  let status = 500,
    response = {};
  const { email, name, linkAvt } = req.body;
  const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
  // create a filter for a movie to update
  const filter = { email: email };
  // create a document that sets the plot of the movie
  const updateDoc = {
    $set: {
      linkAvt: `${linkAvt}`,
      name: `${name}`,
    },
  };
  const result = await User.updateOne(filter, updateDoc);
  response.status = 200;
  response.message = `${name}`;
  response.internal_message = `${linkAvt}`;

  return res.status(response.status).json(response);
});
app.post("/updatePassword", async (req, res) => {
  let status = 500,
    response = {};
  const { email, oldPass, newPass } = req.body;
  const user = await User.findOne({ email }); /// vì email duy nhất nên findOne
  const isMatch = (await oldPass) === user.password;
  if (!isMatch) {
    /// nếu password không chính xác thì trả ra lỗi
    response.status = 401; /// 401 Unauthorized
    response.message = "Old Password is wrong";
    response.internal_message = "Update Failed";
    return res.status(response.status).json(response);
  }
  // create a filter for a movie to update
  const filter = { email: email };
  // create a document that sets the plot of the movie
  const updateDoc = {
    $set: {
      password: `${newPass}`,
    },
  };
  const result = await User.updateOne(filter, updateDoc);
  response.status = 200;
  response.message = `Password is updated`;
  response.internal_message = `Password is updated`;

  return res.status(response.status).json(response);
});
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
