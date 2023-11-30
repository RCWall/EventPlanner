

using Application.Activities;
using Application.Core;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    
    //this class is used to clean up the Program.cs file by moving the services to this class
    public static class ApplicationServiceExtensions
    {
        /// <summary>
        /// Extension method for IServiceCollection to centralize the configuration of application services.
        /// This method organizes the addition of various services to the IServiceCollection, which were previously located in Program.cs. 
        /// It includes configuration for Swagger/OpenAPI, database context, CORS policies, MediatR, and AutoMapper.
        /// </summary>
        /// <param name="services">The IServiceCollection to which services are added.</param>
        /// <param name="config">Configuration properties, used here to set up the database connection.</param>
        /// <returns>The IServiceCollection with configured services, enabling fluent configuration.</returns>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration config)
           {
                    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
                    services.AddEndpointsApiExplorer();
                    services.AddSwaggerGen();

                    // Registers 'DataContext' with Entity Framework Core to manage database operations, using SQLite as the database provider.
                    // Retrieves the SQLite database connection string from application configuration under 'DefaultConnection'.
                    services.AddDbContext<DataContext>(opt =>
                    {
                    opt.UseSqlite(config.GetConnectionString("DefaultConnection"));  
                    });

                    services.AddCors(opt => {
                    opt.AddPolicy("CorsPolicy", policy =>
                    {
                        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://evp-99-88-77.azurewebsites.net");
                    });
                    });

                    // Registers MediatR services in the application's service collection.
                    // MediatR is a mediator library that helps in implementing the mediator pattern, enabling objects to communicate indirectly through a mediator.
                    // This is particularly useful for creating clean, loosely-coupled architectures, such as in CQRS (Command Query Responsibility Segregation) patterns.
                    // The 'AddMediatR' extension method scans and registers all MediatR handlers, requests, and notifications from the specified assembly.
                    // 'cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly)' specifies the assembly containing the MediatR handlers. 
                    // In this case, it's the assembly where 'List.Handler' is located, ensuring that all MediatR handlers in this assembly are discovered and registered.
                    // This enables the application to use MediatR for handling requests and notifications following the defined handlers in the specified assembly.
                    services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
                    
                    services.AddAutoMapper(typeof(MappingProfiles).Assembly);
                    services.AddFluentValidationAutoValidation();
                    services.AddValidatorsFromAssemblyContaining<Create>();

                    return services;
           }
    }
}