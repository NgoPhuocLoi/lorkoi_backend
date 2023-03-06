const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Project";
const COLLECTION_NAME = "projects";

const projectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    pinnedPosition: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, projectSchema);
