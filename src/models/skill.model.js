const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name not provided."],
    unique: [true, "Skill with this name already exists."],
    trim: true,
  },
  description: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
      },
      review: {
        type: String,
      },
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
