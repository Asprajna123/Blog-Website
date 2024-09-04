const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/auth");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["NORMAL", "ADMIN"],
      default: "NORMAL",
    },
    profilePhotoURL: {
      type: String,
      default: "/images/default.png",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const createHashed = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = createHashed;

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("incorrect  password");

    const salt = user.salt;
    const hashedPassword = user.password;

    const createHashofGivenPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (createHashofGivenPassword !== hashedPassword)
      throw new Error("incorrect  password");

    const token = createToken(user);
    return token;
  }
);

const User = model("user", userSchema);

module.exports = User;
