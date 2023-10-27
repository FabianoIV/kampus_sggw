namespace KampusSggwBackend.Controllers.Lecturers.Parameters;

public class UpdateLecturerParam
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string Surname { get; set; }
    public string AcademicDegree { get; set; }
    public string Email { get; set; }
}
