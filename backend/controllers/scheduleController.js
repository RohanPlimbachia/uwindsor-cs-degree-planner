const { suggest } = require('../services/scheduler');

exports.suggestSchedule = async (req, res) => {
  try {
    const { programYear, courseLoad, completedCourses, semester } = req.body;

    if (!programYear || !courseLoad || !Array.isArray(completedCourses)) {
      return res.status(400).json({
        message: 'programYear (number), courseLoad ("full"|"part"), and completedCourses (array) are required',
      });
    }

    const targetSemester = semester || process.env.CURRENT_SEMESTER;
    if (!targetSemester) {
      return res.status(400).json({
        message: 'Provide semester in request body or set CURRENT_SEMESTER in .env',
      });
    }

    const result = await suggest({
      programYear: parseInt(programYear, 10),
      courseLoad,
      completedCourses,
      semester: targetSemester,
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
