const { Project, Section, Task, SubTask } = require("../models");
const ApiError = require("../utils/apiError");

class ProjectService {
  static async create({ name, color, owner }) {
    const project = await Project.create({
      name,
      color,
      owner,
      members: [owner],
    });

    return {
      project,
    };
  }

  static async getAll(owner) {
    const projects = await Project.find({ owner }).lean();
    return {
      projects,
    };
  }

  static async getOne(owner, projectId) {
    const project = await Project.findOne({ owner, _id: projectId }).lean();
    if (!project)
      throw new ApiError(404, [
        {
          msg: "Project not found!",
        },
      ]);

    const sectionsOfProject = await Section.find({ project: projectId }).lean();
    for (let section of sectionsOfProject) {
      const tasksOfSection = await Task.find({ section: section._id })
        .populate("section")
        .sort("-position")
        .lean();
      section.tasks = tasksOfSection;
    }
    project.sections = sectionsOfProject;
    return {
      project,
    };
  }

  static async getPinnedProjects(owner) {
    const projects = await Project.find({ owner, pinned: true });
    return { projects };
  }

  static async update(projectId, newProjectInfo) {
    const { pinned } = newProjectInfo;
    const currentProject = await Project.findById(projectId).lean();
    if (pinned !== undefined && pinned !== currentProject.pinned) {
      const pinnedProjects = await Project.find({
        owner: currentProject.owner,
        pinned: true,
        _id: { $ne: projectId },
      }).lean();
      if (pinned) {
        newProjectInfo.pinnedPosition =
          pinnedProjects.length > 0 ? pinnedProjects.length : 0;
      } else {
        for (let key in pinnedProjects) {
          const item = pinnedProjects[key];
          await Project.findByIdAndUpdate(item._id, {
            $set: { pinnedPosition: key },
          });
        }
      }
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: newProjectInfo,
      },
      { new: true }
    );
    return { project };
  }

  static async delete(projectId) {
    const sectionsOfProject = await Section.find({ project: projectId }).lean();
    for (let section of sectionsOfProject) {
      const tasksOfSection = await Task.find({ section: section._id });
      for (let task in tasksOfSection) {
        await SubTask.deleteMany({ task: task._id });
      }
      await Task.deleteMany({ section: section._id });
    }
    await Section.deleteMany({ project: projectId });

    const currentProject = await Project.findById(projectId).lean();

    if (currentProject.pinned) {
      const pinnedProjects = await Project.find({
        owner: currentProject.owner,
        pinned: true,
        _id: { $ne: projectId },
      })
        .lean()
        .sort("pinnedPosition");

      for (let key in pinnedProjects) {
        const item = pinnedProjects[key];
        await Project.findByIdAndUpdate(item._id, {
          $set: { pinnedPosition: key },
        });
      }
    }

    await Project.findByIdAndDelete(projectId);
  }

  static async updatePinnedPosition(projects) {
    for (let key in projects) {
      const item = projects[key];
      await Project.findByIdAndUpdate(item._id, {
        $set: { pinnedPosition: key },
      });
    }
  }
}

module.exports = ProjectService;
