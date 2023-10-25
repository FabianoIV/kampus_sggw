namespace KampusSggwBackend.Services.RequestingUser;

using KampusSggwBackend.Domain.RequestingUser;
using KampusSggwBackend.Domain.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using System.Threading.Tasks;

public class RequestingUserService : IRequestingUserService
{
    // Services
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly UserManager<UserAccount> userManager;

    // Constructor
    public RequestingUserService(
        IHttpContextAccessor httpContextAccessor, 
        UserManager<UserAccount> userManager)
    {
        this.httpContextAccessor = httpContextAccessor;
        this.userManager = userManager;
    }

    // Methods
    public async Task<RequestingUser> GetRequestingUser()
    {
        var claimsPrincipal = httpContextAccessor.HttpContext.User ?? throw new Exception("The request is anonymous!");

        var idClaim = claimsPrincipal.FindFirst(JwtRegisteredClaimNames.NameId)
                      ?? claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)
                      ?? throw new Exception("ID claim not found!");

        var user = await userManager.FindByIdAsync(idClaim.Value);

        if (user == null)
        {
            throw new Exception("User not found!");
        }

        var requestingUser = new RequestingUser
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Language = user.Language,
            DeviceToken = user.DeviceToken,
            IsEmailConfirmed = user.EmailConfirmed,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            IsDeleted = false,
        };

        return requestingUser;
    }
}