using UserService.Shared.Events;

public interface IEventHandler
{
    Task HandleAsync(EventMessage eventMessage);
}