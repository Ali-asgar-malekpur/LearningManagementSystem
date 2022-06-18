const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Task = mongoose.model("Task", taskSchema);

let tasks = [];

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const defaultCourses = [
  {
    title: "Java Programming Concepts under 1 Video",
    description:
      "This is a complete Introduction course for beginners who want to explore and get started with Java Programming  languages. This course teaches the fundamentals thoroughly.",
    link: "https://youtube.com/embed/UmnCZ7-9yDY" ,
  },
  {
    title: "A complete Python Tutorial in One Shot ",
    description:
      "This is an entire python tutorial within just 1.5 hours to get started with Python Programming by Apna College",
    link: "https://youtube.com/embed/vLqTf2b6GZw",
  },
  {
    title: "FigJam Team rituals for better design jams",
    description:
      "Join to hear from the team at Coda and learn about their regular “design jams.” In this talk, Helena, Alicia, and Steve will share stories of using jams for everything from team building, to brainstorming without restraints, and even gathering input from the full company.",
    link: "https://youtube.com/embed/ARA7bc2zrgw",
  },
  {
    title: "C Language Tutorial for Beginners (with Notes & Practice Questions)",
    description:
      "Watch entire C programming video offered by Apna College free of cost available on Youtube. This Course requires no pre-requisites on Programming earlier.",
    link: "https://youtube.com/embed/irqbmMNs2Bo",
  },
  {
    title: "HTML & CSS Crash Course Tutorial #1 - Introduction",
    description:
      "Hey gang & welcome to your very first HTML & CSS tutorial. Throughout this crash course series I'll take you from total beginner to create great-looking sites with HTML & CSS. In this video, we'll cover what HTML & CSS are, as well as setting up our dev environment. ",
    link: "https://youtube.com/embed/hu-q2zYwEYs",
  },
  {
    title: "Make a Wordle Clone with React #1 - Introduction & Setup",
    description:
      "Hey gang, in this series you'll learn how to make a Wordle clone using React. The pre-requisites of this course requires react.js to b learned.",
    link: "https://youtube.com/embed/ZSWl5UwhHcs",
  },
];

const Course = mongoose.model("Course", courseSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  imgURL: String,
  name: {
    first: String,
    last: String,
  },
  tasks: [taskSchema],
  courses: {
    type: [courseSchema],
    default: [...defaultCourses],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
