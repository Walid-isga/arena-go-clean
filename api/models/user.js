import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // uniquement pour les utilisateurs email/mdp
  },
  city: { type: String, default: "" },
  phone: { type: String, default: "" },
  otp: {
    type: String, // code de vérification temporaire
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    unique: false,
    sparse: true, // important : autorise null + unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  picture: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  soccerGames: { type: Number, default: 0 },
  basketballGames: { type: Number, default: 0 },
  tennisGames: { type: Number, default: 0 },
  rugbyGames: { type: Number, default: 0 },
});

//UserSchema.pre("save", async function (next) {
  //if (!this.isModified("password") || !this.password) return next();
  //this.password = await bcrypt.hash(this.password, 10);
  //next();
//});

// Vérifie le mot de passe en le comparant avec le haché
UserSchema.methods.comparePassword = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.password);
};

export default mongoose.model("User", UserSchema);
