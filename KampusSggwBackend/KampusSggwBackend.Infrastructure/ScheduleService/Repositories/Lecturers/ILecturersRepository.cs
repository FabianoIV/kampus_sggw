namespace KampusSggwBackend.Infrastructure.ScheduleService.Repositories.Lecturers;

using KampusSggwBackend.Domain.Schedule;
using System;

public interface ILecturersRepository
{
    List<Lecturer> GetAll();
    Lecturer Get(Guid id);
    void Create(Lecturer lecturer);
    void Update(Lecturer lecturer);
    void Delete(Guid id);
}
