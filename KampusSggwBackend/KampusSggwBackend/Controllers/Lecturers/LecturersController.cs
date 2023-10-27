namespace KampusSggwBackend.Controllers.Lecturers;

using KampusSggwBackend.Controllers.Lecturers.Parameters;
using KampusSggwBackend.Domain.Schedule;
using KampusSggwBackend.Infrastructure.ScheduleService.Repositories.Lecturers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LecturersController : ControllerBase
{
    // Services
    private readonly ILecturersRepository lecturersRepository;

    // Constructor
    public LecturersController(
        ILecturersRepository lecturersRepository)
    {
        this.lecturersRepository = lecturersRepository;
    }

    // Methods
    [HttpGet]
    public ActionResult GetAll()
    {
        var lecturers = lecturersRepository.GetAll();

        return Ok(lecturers);
    }

    [HttpGet("{lecturerId}")]
    public ActionResult Get([FromRoute] Guid lecturerId)
    {
        var lecturer = lecturersRepository.Get(lecturerId);

        return Ok(lecturer);
    }

    [HttpPost]
    public ActionResult Create([FromBody] CreateLecturerParam param)
    {
        var newLecturer = new Lecturer()
        {
            FirstName = param.FirstName,
            Surname = param.Surname,
            Email = param.Email,
            AcademicDegree = param.AcademicDegree,
        };

        lecturersRepository.Create(newLecturer);

        return Ok();
    }

    [HttpPut]
    public ActionResult Update([FromBody] UpdateLecturerParam param)
    {
        var lecturer = lecturersRepository.Get(param.Id);

        if (lecturer == null)
        {
            return NotFound();
        }

        lecturer.FirstName = param.FirstName;
        lecturer.Surname = param.Surname;
        lecturer.Email = param.Email;
        lecturer.AcademicDegree = param.AcademicDegree;

        lecturersRepository.Update(lecturer);

        return Ok();
    }


    [HttpDelete("{lecturerId}")]
    public ActionResult Delete([FromRoute] Guid lecturerId)
    {
        lecturersRepository.Delete(lecturerId);
        return Ok();
    }
}
