using Asp.Versioning.ApiExplorer;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Backend.TodoApi.Swagger;

/// <summary>
/// Configures Swagger generation options for each discovered API version.
/// </summary>
/// <remarks>
/// This class implements <see cref="IConfigureOptions{TOptions}"/> so it can be
/// registered with the DI container and invoked automatically by the options system.
/// It will create a Swagger document (OpenAPI info) for every API version reported by
/// <see cref="IApiVersionDescriptionProvider"/>.
/// </remarks>
public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
{
   private readonly IApiVersionDescriptionProvider _provider;

   /// <summary>
   /// Initializes a new instance of <see cref="ConfigureSwaggerOptions"/>.
   /// </summary>
   /// <param name="provider">
   /// Provider that exposes API version descriptions discovered by the API versioning system.
   /// </param>
   public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
   {
      _provider = provider;
   }

   /// <summary>
   /// Configures the <see cref="SwaggerGenOptions"/> by registering a Swagger document
   /// for each API version.
   /// </summary>
   /// <param name="options">The Swagger generation options to configure.</param>
   /// <remarks>
   /// Each document is named using the version group's name (for example "v1") and is
   /// populated with a minimal <see cref="Microsoft.OpenApi.Models.OpenApiInfo"/> including
   /// a Title and the Version. Additional metadata (contact, license, descriptions, security)
   /// can be added here if needed.
   ///
   /// Note: <see cref="IApiVersionDescriptionProvider.ApiVersionDescriptions"/> can also
   /// indicate deprecated versions via <c>IsDeprecated</c> if you want to reflect that
   /// in the generated OpenAPI metadata.
   /// </remarks>
   public void Configure(SwaggerGenOptions options)
   {
      // Create one Swagger/OpenAPI document per discovered API version.
      foreach (var desc in _provider.ApiVersionDescriptions)
      {
         options.SwaggerDoc(
             desc.GroupName,
             new Microsoft.OpenApi.Models.OpenApiInfo
             {
                Title = "Todo API",
                Version = desc.GroupName
             });
      }
   }
}
