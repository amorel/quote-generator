using UserService.Core.Domain.Entities;
using UserService.Core.Interfaces.Repositories;
using UserService.Core.Interfaces.Services;

namespace UserService.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> GetUserByIdAsync(string id)  // Changé de Guid à string
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            return await _userRepository.CreateAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteUserAsync(string id)  // Changé de Guid à string
        {
            await _userRepository.DeleteAsync(id);
        }
    }
}