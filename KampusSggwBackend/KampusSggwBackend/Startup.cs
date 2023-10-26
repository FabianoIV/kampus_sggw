namespace KampusSggwBackend;

using KampusSggwBackend.Infrastructure.UserService;
using KampusSggwBackend.Data;
using KampusSggwBackend.Configuration;
using KampusSggwBackend.Infrastructure.SendGridEmailService;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using KampusSggwBackend.Infrastructure.ScheduleService;
using Microsoft.AspNetCore.SpaServices.AngularCli;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();

        var connectionString = Configuration.GetConnectionString("Database");
        services.AddRelationalDb(connectionString);
        services.AddAppAuth(Configuration);

        services.AddAnnWebApi();

        services.AddAppSwagger();

        services.AddEndpointsApiExplorer();

        services.AddUsersRepository();
        
        services.AddSendGridEmailService(Configuration);

        services.AddScheduleService();

        //services.AddFirebase(Configuration);

        //services.AddBackgroundJobsService(Configuration.GetConnectionString("MainSqlServer"));
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(cfg => cfg.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
        app.UseHttpsRedirection();

        app.UseStaticFiles();
        app.UseRouting();

        app.UseAppSwagger();
        app.UseAnnWebApi();

        app.InitializeDatabase();

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "ClientApp";

            if (env.IsDevelopment())
            {
                spa.UseAngularCliServer(npmScript: "start");
            }
        });
    }
}
