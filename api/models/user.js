import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String, // Store the Google ID here
    unique: true,
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
  soccerGames:{
    type: Number,
    default: 0,
  },
  basketballGames:{
    type: Number,
    default: 0,
  },
  tennisGames:{
    type: Number,
    default: 0,
  },
  rugbyGames:{
    type: Number,
    default: 0,
  },
});
UserSchema.statics.findOrCreate = async function (profile) {
  const user = await this.findOne({ googleId: profile.id });

  if (user) {
    return user;
  }

  const newUser = new this({
    googleId: profile.id,
    username: profile.displayName,
    email: profile.emails[0].value,
    picture: profile.photos[0].value,
    // Add other fields as needed
  });

  await newUser.save();
  return newUser;
};

export default mongoose.model("User", UserSchema);
