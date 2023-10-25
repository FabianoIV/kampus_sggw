namespace KampusSggwBackend.Controllers.Account.Results;

public class UserAccountResult
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public bool IsEmailConfirmed { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
