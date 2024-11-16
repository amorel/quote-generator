using Microsoft.AspNetCore.Mvc;
using UserService.Core.Interfaces.Services;
using UserService.Core.Domain.Entities;
using Prometheus;
using UserService.Core.Metrics;

namespace UserService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAll()
        {
            using (UserMetrics.UserOperationDuration.NewTimer())
            {
                var users = await _userService.GetAllUsersAsync();
                UserMetrics.ActiveUsersGauge.Set(users.Count);
                return Ok(users);
            }
        }

        [HttpPost]
        public async Task<ActionResult<User>> Create(User user)
        {
            using (UserMetrics.UserOperationDuration.NewTimer())
            {
                try
                {
                    var created = await _userService.CreateUserAsync(user);
                    UserMetrics.UsersCreatedTotal.Inc();
                    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
                }
                catch (Exception)
                {
                    // Gérer l'erreur...
                    throw;
                }
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, User user)
        {
            if (id != user.Id) return BadRequest();
            await _userService.UpdateUserAsync(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}