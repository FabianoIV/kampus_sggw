namespace KampusSggwBackend.Controllers.Account;

using KampusSggwBackend.Controllers.Account.Parameters;
using KampusSggwBackend.Controllers.Account.Results;
using KampusSggwBackend.Domain.Exceptions;
using KampusSggwBackend.Domain.User;
using KampusSggwBackend.Infrastructure.SendGridEmailService;
using KampusSggwBackend.Infrastructure.UserService;
using KampusSggwBackend.Infrastructure.UserService.Repositories.PasswordResetRequests;
using KampusSggwBackend.Infrastructure.UserService.Repositories.UserEmailChanges;
using KampusSggwBackend.Services.RequestingUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    // Services
    private readonly UserManager<UserAccount> userManager;
    private readonly IEmailService emailService;
    private readonly IRequestingUserService requestingUserService;
    private readonly IVerificationCodeFactoryService verificationCodeFactoryService;

    // Repositories
    private readonly IPasswordResetRequestsRepository passwordResetRequestsRepository;
    private readonly IUserEmailChangesRepository userEmailChangesRepository;

    // Constructor
    public AccountController(
        UserManager<UserAccount> _userManager,
        IEmailService emailService,
        IPasswordResetRequestsRepository passwordResetRequestsRepository,
        IRequestingUserService requestingUserService,
        IUserEmailChangesRepository userEmailChangesRepository,
        IVerificationCodeFactoryService verificationCodeFactoryService)
    {
        this.userManager = _userManager;
        this.emailService = emailService;
        this.verificationCodeFactoryService = verificationCodeFactoryService;
        this.passwordResetRequestsRepository = passwordResetRequestsRepository;
        this.requestingUserService = requestingUserService;
        this.userEmailChangesRepository = userEmailChangesRepository;
    }

    // Methods
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserAccountResult>> GetAccount()
    {
        var user = await requestingUserService.GetRequestingUser();

        var result = new UserAccountResult()
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            IsEmailConfirmed = user.IsEmailConfirmed,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            IsDeleted = user.IsDeleted,
        };

        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> CreateAccount([FromBody] CreateAccountParam param)
    {
        var user = new UserAccount()
        {
            Email = param.Email,
            UserName = param.Email,
            Language = UserLanguage.Polish,
            LastActiveAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            DeviceToken = "",
        };

        var result = await userManager.CreateAsync(user, param.Password);

        if (!result.Succeeded)
        {
            throw new AppException($"Code: {result.Errors.First().Code},\nDescription: {result.Errors.First().Description}");
        }

        var verificationCode = await verificationCodeFactoryService.CreateVerificationCode(user.Id);

        await emailService.SendEmailConfirmationForNewAccount(user.Email, verificationCode.Value);

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("create-test-account")]
    public async Task<ActionResult> CreateTestAccount([FromBody] CreateTestAccountParam param)
    {
        if (param.SuperPassword != "0d2f3476-5c21-4a49-82e4-480f590ed298")
        {
            return Forbid();
        }

        var user = new UserAccount()
        {
            Email = param.Email,
            UserName = param.Email,
            Language = UserLanguage.Polish,
            LastActiveAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var result = await userManager.CreateAsync(user, param.Password);

        if (!result.Succeeded)
        {
            throw new AppException($"Code: {result.Errors.First().Code},\nDescription: {result.Errors.First().Description}");
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        await userManager.ConfirmEmailAsync(user, token);

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("confirm")]
    public async Task<ActionResult> ConfirmAccount([FromBody] ConfirmAccountParam param)
    {
        var user = userManager.Users.FirstOrDefault(u => u.Email == param.Email);

        if (user == null)
        {
            return NotFound("User not found");
        }

        var verificationCode = await verificationCodeFactoryService.GetLastUserVerificationCode(user.Id);

        if (verificationCode == null)
        {
            return NotFound("Account is already confirmed"); 
        }

        if (verificationCode.Value != param.VerificationCode)
        {
            return BadRequest("Confirmation code is invalid");
        }

        if (verificationCode!.ActiveUntil < DateTimeOffset.Now)
        {
            return BadRequest("Confirmation code has expired");
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        await userManager.ConfirmEmailAsync(user, token);

        await verificationCodeFactoryService.RemoveVerificationCode(verificationCode);

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordParam param)
    {
        var user = userManager.Users.Where(u => u.Email == param.Email).FirstOrDefault();

        if (user == null)
        {
            return NotFound("User not found");
        }

        var passwordResetRequest = passwordResetRequestsRepository.Get(param.VerificationCode);

        if (passwordResetRequest == null)
        {
            passwordResetRequestsRepository.LogInvalidPasswordResetRequestForUser(user.Id);
            return BadRequest("Confirmation code is invalid.");
        }

        if (passwordResetRequest.InvalidAttempts > 2)
        {
            return BadRequest("Confirmation code has expired.");
        }

        if (passwordResetRequest.ActiveUntil < DateTimeOffset.UtcNow)
        {
            return BadRequest("Confirmation code has expired.");
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, token, param.NewPassword);

        if (!result.Succeeded)
        {
            var error = result.Errors.First();
            return BadRequest($"ResetPasswordError: Code {error.Code}, Description: {error.Description}");
        }

        passwordResetRequestsRepository.DeleteForUser(user.Id);

        return Ok();
    }

    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromQuery] ChangePasswordParam param)
    {
        var requestingUser = await requestingUserService.GetRequestingUser();
        var user = await userManager.FindByIdAsync(requestingUser.Id.ToString());

        var result = await userManager.ChangePasswordAsync(user, param.CurrentPassword, param.NewPassword);

        if (!result.Succeeded)
        {
            var error = result.Errors.First();
            return BadRequest($"ResetPasswordError: Code {error.Code}, Description: {error.Description}");
        }

        return Ok();
    }

    //[HttpPost("change-email")]
    //public async Task<ActionResult> ChangeEmail([FromQuery] ChangeEmailParam param)
    //{
    //    var requestingUser = await requestingUserService.GetRequestingUser();
    //    var user = await userManager.FindByIdAsync(requestingUser.Id.ToString());

    //    var isEmailTaken = await userManager.Users
    //        .Where(u => u.Email == param.NewUserEmail)
    //        .AnyAsync();

    //    if (isEmailTaken)
    //    {
    //        return BadRequest("The email is already in use.");
    //    }

    //    var emailChange = userEmailChangesRepository.Get(user.Id);

    //    if (emailChange == null)
    //    {
    //        emailChange = new UserEmailChange() { Id = Guid.NewGuid(), UserId = user.Id };
    //        userEmailChangesRepository.Create(emailChange);
    //    }

    //    emailChange.NewEmail = param.NewUserEmail;
    //    emailChange.VerificationCode = await userManager.GenerateChangeEmailTokenAsync(user, param.NewUserEmail);
    //    emailChange.ExpiresAt = DateTimeOffset.UtcNow.AddHours(2);

    //    userEmailChangesRepository.Update(emailChange);

    //    var newEmailLink = $"{Request.Scheme}://{Request.Host}/Account/ConfirmEmailChange" +
    //       $"?userAccountId={emailChange.UserId}" +
    //       $"&verificationCode={HttpUtility.UrlEncode(emailChange.VerificationCode)}";

    //    await emailService.SendNewEmailConfirmationMessage(param.NewUserEmail, newEmailLink);

    //    return Ok();
    //}

    [AllowAnonymous]
    [HttpPost("resend-confirmation-code")]
    public async Task<ActionResult> ResendConfirmationCode([FromBody] ResendConfirmationCodeParam param)
    {
        var user = userManager.Users.FirstOrDefault(u => u.Email == param.Email);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        var verificationCode = await verificationCodeFactoryService.CreateVerificationCode(user.Id);

        await emailService.SendEmailConfirmationForNewAccount(user.Email, verificationCode.Value);
        return Ok();
    }

    [HttpDelete("delete-account")]
    public async Task<ActionResult> DeleteAccount()
    {
        var requestingUser = await requestingUserService.GetRequestingUser();

        var user = await userManager.Users
            .Where(u => u.Id == requestingUser.Id)
            .FirstOrDefaultAsync();

        if (user != null)
        {
            await userManager.DeleteAsync(user);
        }

        await emailService.SendEmailAfterAccountDelete(requestingUser.Email);
        
        return Ok();
    }
}
