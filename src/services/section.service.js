const Section = require("../models/section.model");
const Task = require("../models/task.model");
const SubTask = require("../models/subtask.model");

class SectionService {
  static async create({ projectId, title }) {
    const section = await Section.create({
      project: projectId,
      title,
    });

    section._doc.tasks = [];
    return { section };
  }

  static async update(sectionId, newSectionInfo) {
    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        $set: newSectionInfo,
      },
      { new: true }
    );

    section._doc.tasks = [];

    return { section };
  }

  static async delete(sectionId) {
    const tasksOfSection = await Task.find({ section: sectionId }).lean();
    for (let task in tasksOfSection) {
      await SubTask.deleteMany({ task: task._id });
    }
    await Task.deleteMany({ section: sectionId });
    await Section.findByIdAndDelete(sectionId);
  }
}

module.exports = SectionService;
