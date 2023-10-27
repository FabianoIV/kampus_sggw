namespace KampusSggwBackend.Infrastructure.ScheduleService.Repositories.Lecturers;

using KampusSggwBackend.Data;
using KampusSggwBackend.Domain.Schedule;

public class LecturersRepository : ILecturersRepository
{
    // Services
    private readonly DataContext dbContext;

    // Constructor
    public LecturersRepository(DataContext dbContext)
    {
        this.dbContext = dbContext;
    }

    // Methods
    public List<Lecturer> GetAll()
    {
        return dbContext.Lecturers.ToList();
    }

    public Lecturer Get(Guid id)
    {
        return dbContext.Lecturers.FirstOrDefault(l => l.Id == id);
    }

    public void Create(Lecturer lecturer)
    {
        lecturer.Created = DateTime.UtcNow;
        lecturer.Updated = DateTime.UtcNow;

        dbContext.Lecturers.Add(lecturer);
        dbContext.SaveChanges();
    }

    public void Update(Lecturer lecturer)
    {
        lecturer.Updated = DateTime.UtcNow;

        dbContext.Lecturers.Update(lecturer);
        dbContext.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var entity = dbContext.Lecturers.FirstOrDefault(l => l.Id == id);
        dbContext.Lecturers.Remove(entity);
        dbContext.SaveChanges();
    }
}
