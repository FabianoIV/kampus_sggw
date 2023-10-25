namespace KampusSggwBackend.Domain.Schedule;

using System;

public class Lecturer
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }
    public string FirstName { get; set; }
    public string Surname { get; set; }
    public string AcademicDegree { get; set; }
    public string Email { get; set; }
}
