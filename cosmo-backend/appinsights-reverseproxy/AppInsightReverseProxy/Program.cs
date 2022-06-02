using System.Collections;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("* Environment:");
foreach (DictionaryEntry v in Environment.GetEnvironmentVariables())
{
    Console.WriteLine($"{v.Key}={v.Value}");
}
Console.WriteLine("--------------");

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Services.AddApplicationInsightsTelemetry();

var app = builder.Build();

app.MapPost("/log", (ILogger<Program> logger, LogInput input) =>
{
    Enum.TryParse<LogLevel>(input.Level, true, out LogLevel level);
    logger.Log(level, input.Message);
    return Results.NoContent();
});
app.MapReverseProxy();
app.UseCors();
app.Run();

public class LogInput
{
    public string Level { get; set; } = "Information";
    public string? Message { get; set; }
}