const SectionService = require("../services/section.service");

class SectionController {
  static async create(req, res) {
    const data = await SectionService.create({
      projectId: req.params.projectId,
      title: req.body.title,
    });

    res.status(200).json({ data });
  }

  static async update(req, res) {
    const data = await SectionService.update(req.params.sectionId, req.body);
    res.status.json({ data });
  }

  static async delete(req, res) {
    await SectionService.delete(req.params.sectionId);
    res.status.json({ msg: "Section is deleted!" });
  }
}

module.exports = SectionController;
