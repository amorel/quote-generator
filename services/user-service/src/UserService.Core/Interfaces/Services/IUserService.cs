using UserService.Core.Domain.Entities;

namespace UserService.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(Guid id);
        Task<List<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
    }
}