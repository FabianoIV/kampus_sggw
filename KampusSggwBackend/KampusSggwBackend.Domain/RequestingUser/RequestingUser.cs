namespace KampusSggwBackend.Domain.RequestingUser;

using KampusSggwBackend.Domain.User;
using System;

/// <summary> Class represent a user which is requesting for any not anonymous api method. </summary>
public class RequestingUser
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public UserLanguage Language { get; set; }
    public string DeviceToken { get; set; }
    public bool IsEmailConfirmed { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
